#!/usr/bin/env python3
"""Turn a cached Figma file into Markdown tables for the design spec.

Usage:
    python analyze_cache.py <cache-dir> [--out <dir>]

Input:  <cache-dir>/file.json          (GET /v1/files/<key>)
        <cache-dir>/image-fills.json   (GET /v1/files/<key>/images, optional)
Output: overview.md, colors.md, typography.md, effects.md, grids.md, radii.md,
        frames.md, components.md, notes.md, exports.json in <cache-dir>/analysis/

Works offline. Values are reported as found: nothing is merged or resolved.
Counts include nodes inside hidden frames; invisible paints and effects are skipped.
"""

import argparse
import json
import re
import sys
from collections import Counter, defaultdict
from pathlib import Path

sys.dont_write_bytecode = True
sys.path.insert(0, str(Path(__file__).resolve().parent))

from figma_exports import build_exports, top_level_frames  # noqa: E402
from figma_nodes import (  # noqa: E402
    auto_layout, code, effect_label, first_paint, first_text_style, id_list, paint_label,
    radius_label, size_label, size_of, table, type_label, visible, walk, hex_color, alpha_suffix)

NAME_PATTERN = re.compile(
    r"\b(note|notes|nota|hinweis|how to|guideline|annotation|anleitung)\b", re.I)
TEXT_PATTERN = re.compile(r"^\s*(note|nota|hinweis)\b|\bbreakpoint|\bguideline", re.I)
SCREEN_TYPES = {"FRAME", "COMPONENT", "INSTANCE", "COMPONENT_SET"}
HELPER_NOTE = "only on COMPONENT_SET frames (Figma helper, not UI)"
VARIANT_HEADERS = ["Variant", "Node ID", "Size", "AL", "Gap", "Padding T/R/B/L", "Radius",
                   "Fill", "Stroke", "Effect", "Text style"]
FRAME_HEADERS = ["Node ID", "Frame", "Type", "Page", "Section", "W x H", "AL", "Gap",
                 "Padding T/R/B/L", "Fill", "Visible"]


def record_solid(entry, role, node):
    """Add one occurrence of a solid color to its counter entry."""
    entry[role] += 1
    entry["types"].add(node["type"])
    bucket = entry["instance_ids" if node["id"].startswith("I") else "ids"]
    if len(bucket) < 3:
        bucket.append(node["id"])


def collect_paints(nodes):
    """Count solid colors and style-bound paints per role (fill/stroke)."""
    solids = defaultdict(lambda: {"fill": 0, "stroke": 0, "types": set(), "ids": [],
                                  "instance_ids": []})
    styled = defaultdict(Counter)
    for node, *_ in nodes:
        for role, key in (("fill", "fills"), ("stroke", "strokes")):
            style_id = (node.get("styles") or {}).get(role)
            for paint in visible(node.get(key)):
                label = paint_label(paint)
                if style_id:
                    styled[(style_id, label)][role] += 1
                if paint.get("type") == "SOLID":
                    record_solid(solids[label], role, node)
    return solids, styled


def report_colors(nodes, styles):
    """Color styles with their actual values, then every solid color in use."""
    solids, styled = collect_paints(nodes)
    style_rows = sorted(
        (styles.get(sid, {}).get("name", "?"), code(sid), code(label), c["fill"], c["stroke"],
         "yes" if styles.get(sid, {}).get("remote") else "no")
        for (sid, label), c in styled.items())
    ranked = sorted(solids.items(), key=lambda item: -(item[1]["fill"] + item[1]["stroke"]))
    solid_rows = [(code(label), e["fill"], e["stroke"],
                   HELPER_NOTE if e["types"] == {"COMPONENT_SET"} else "",
                   id_list(e["ids"] + e["instance_ids"], 3)) for label, e in ranked]
    return "\n\n".join([
        "# Colors", "## Color styles (style name and actual value)",
        table(["Style name", "Style ID", "Actual value", "Fills", "Strokes", "Remote"], style_rows),
        f"## Solid colors in use ({len(solid_rows)})",
        table(["Value", "Fills", "Strokes", "Note", "Sample nodes"], solid_rows)])


def text_variants(node):
    """Return the base TypeStyle plus every character override merged onto it."""
    base = node.get("style", {})
    overrides = (node.get("styleOverrideTable") or {}).values()
    return [base] + [{**base, **override} for override in overrides]


def text_key(style):
    """Return the comparable values of a TypeStyle."""
    line_height = round(style.get("lineHeightPx", 0), 2)
    return (style.get("fontFamily"), style.get("fontSize"), style.get("fontWeight"),
            line_height, style.get("letterSpacing", 0))


def collect_typography(nodes, styles):
    """Count text styles, fonts per text node and font sizes."""
    found = {"styles": Counter(), "weights": defaultdict(Counter), "nodes": Counter(),
             "sizes": Counter()}
    for node, *_ in (entry for entry in nodes if entry[0]["type"] == "TEXT"):
        variants = text_variants(node)
        pairs = {(v.get("fontFamily"), v.get("fontWeight")) for v in variants}
        for family, weight in pairs:
            found["weights"][family][weight] += 1
        found["nodes"].update({family for family, _ in pairs})
        found["sizes"].update({v.get("fontSize") for v in variants if v.get("fontSize")})
        style_id = (node.get("styles") or {}).get("text")
        if style_id:
            found["styles"][(styles.get(style_id, {}).get("name", "?"), text_key(variants[0]))] += 1
    return found


def report_typography(nodes, styles):
    """Text styles, fonts actually used (the shopping list) and font sizes."""
    found = collect_typography(nodes, styles)
    style_rows = [(name, family, f"{size:g} px", weight, f"{lh:g} px", f"{ls:g}", count)
                  for (name, (family, size, weight, lh, ls)), count in sorted(
                      found["styles"].items(), key=lambda item: (item[0][0], item[0][1][1] or 0))]
    font_rows = [(family, ", ".join(f"{w:g} ({c})" for w, c in found["weights"][family].most_common()),
                  count) for family, count in found["nodes"].most_common()]
    sizes = ", ".join(f"{s:g} ({c})" for s, c in sorted(found["sizes"].items()))
    return "\n\n".join([
        "# Typography", "## Text styles",
        table(["Style name", "Family", "Size", "Weight", "Line height", "Letter spacing",
               "Occurrences"], style_rows),
        "## Fonts actually in use (all text nodes, incl. character overrides)",
        table(["Family", "Weights (text nodes)", "Text nodes"], font_rows),
        "## Font sizes in use (px, text nodes)", sizes])


def report_effects(nodes, styles):
    """Every visible effect with the style name it is bound to."""
    counts = Counter()
    for node, *_ in nodes:
        style_id = (node.get("styles") or {}).get("effect")
        name = styles.get(style_id, {}).get("name", "-") if style_id else "-"
        for effect in visible(node.get("effects")):
            counts[(effect_label(effect), name)] += 1
    rows = [(code(label), name, n) for (label, name), n in counts.most_common()]
    return "\n\n".join(["# Effects", "Format: TYPE x y blur spread color.",
                        table(["Effect", "Style name", "Occurrences"], rows)])


def grid_label(grid):
    """Describe a layout grid with all of its parameters."""
    keys = ("pattern", "count", "sectionSize", "gutterSize", "offset", "alignment", "visible")
    parts = [f"{key}={grid[key]}" for key in keys if key in grid]
    color = grid.get("color")
    if color:
        parts.append(f"color={hex_color(color)}{alpha_suffix(color.get('a', 1))}")
    return " ".join(parts)


def report_grids(nodes):
    """Layout grids and the nodes they are applied to."""
    usage = defaultdict(list)
    for node, *_ in nodes:
        for grid in node.get("layoutGrids") or []:
            usage[grid_label(grid)].append(node)
    rows = [(code(label), len(hits),
             ", ".join(f"{w} px ({n})" for w, n in Counter(size_of(h)[0] for h in hits).most_common()),
             id_list([h["id"] for h in hits])) for label, hits in usage.items()]
    body = table(["Grid", "Nodes", "Node widths", "Nodes"], rows) if rows else "No layout grids."
    return "\n\n".join(["# Layout grids", body])


def report_radii(nodes):
    """Corner radii by value and node type; asymmetric radii separately."""
    uniform, asymmetric = defaultdict(Counter), defaultdict(list)
    for node, *_ in nodes:
        label = radius_label(node)
        if "/" in label:
            asymmetric[label].append(node["id"])
        elif label != "-":
            uniform[float(label)][node["type"]] += 1
    rows = [(f"{r:g} px", sum(t.values()), ", ".join(f"{k} {v}" for k, v in t.most_common()),
             HELPER_NOTE if set(t) == {"COMPONENT_SET"} else "") for r, t in sorted(uniform.items())]
    asym_rows = [(code(label), len(ids), id_list(ids, 3)) for label, ids in asymmetric.items()]
    return "\n\n".join([
        "# Corner radii", table(["Radius", "Occurrences", "Node types", "Note"], rows),
        f"Distinct uniform radii: {len(rows)}.", "## Asymmetric radii (TL/TR/BR/BL)",
        table(["Radii", "Occurrences", "Nodes"], asym_rows) if asym_rows else "None."])


def frame_row(frame, page, section, hidden):
    """One table row with the layout values of a top-level frame."""
    mode, gap, pads = auto_layout(frame)
    return (code(frame["id"]), frame["name"], frame["type"], page, section or "-",
            size_label(frame), mode, gap, pads, first_paint(frame, "fills"),
            "no" if hidden else "yes")


def report_frames(frames):
    """Top-level frames grouped by width, the basis for the breakpoint tiers."""
    by_width = defaultdict(list)
    for entry in frames:
        by_width[size_of(entry[0])[0]].append(entry)
    widths = sorted(by_width.items(), reverse=True)
    parts = ["# Top-level frames",
             "Widths: " + ", ".join(f"{w} px ({len(entries)})" for w, entries in widths)]
    for width, entries in widths:
        parts += [f"## Width {width} px ({len(entries)} frames)",
                  table(FRAME_HEADERS, [frame_row(*entry) for entry in entries])]
    return "\n\n".join(parts)


def variant_row(variant):
    """One table row with the actual values of a component variant."""
    mode, gap, pads = auto_layout(variant)
    effects = visible(variant.get("effects"))
    return (variant["name"], code(variant["id"]), size_label(variant), mode, gap, pads,
            radius_label(variant), first_paint(variant, "fills"), first_paint(variant, "strokes"),
            effect_label(effects[0]) if effects else "-", first_text_style(variant))


def report_components(data, nodes):
    """Every COMPONENT_SET with all variants, then free-standing components."""
    sets = [(n, page) for n, page, *_ in nodes if n["type"] == "COMPONENT_SET"]
    loose = [n for n, _, path, _ in nodes
             if n["type"] == "COMPONENT" and path and path[-1]["type"] != "COMPONENT_SET"]
    parts = ["# Component inventory (generated from the cache)",
             f"Node tree: {len(sets)} COMPONENT_SETs, {len(loose)} free-standing COMPONENTs. "
             f"File header: {len(data.get('componentSets', {}))} sets, "
             f"{len(data.get('components', {}))} components (the header also counts library "
             "components used only as instances). The container size is Figma's set frame, not a "
             "measurement; the variant rows are authoritative."]
    for node, page in sorted(sets, key=lambda item: item[0]["name"].lower()):
        variants = [c for c in node.get("children", []) if c["type"] == "COMPONENT"]
        parts += [f"##### `{node['id']}` {node['name']}",
                  f"Container {size_label(node)} · page {page} · {len(variants)} variants",
                  table(VARIANT_HEADERS, [variant_row(v) for v in variants])]
    if loose:
        parts += ["## Free-standing components", table(VARIANT_HEADERS, [variant_row(c) for c in loose])]
    return "\n\n".join(parts)


def is_note(node, path):
    """True for text that looks like an instruction from the design team."""
    text = node.get("characters", "")
    names = [node["name"]] + [a["name"] for a in path if a["type"] not in ("DOCUMENT", "CANVAS")]
    if TEXT_PATTERN.search(text) or any(NAME_PATTERN.search(name) for name in names):
        return True
    outside_screens = not any(a["type"] in SCREEN_TYPES for a in path)
    large = node.get("style", {}).get("fontSize", 0) >= 60 and len(text) >= 30
    return (outside_screens and len(text) >= 20) or large


def report_notes(nodes):
    """Candidate design-team notes, verbatim, grouped by identical text."""
    groups = defaultdict(list)
    for node, page, path, _ in nodes:
        if node["type"] == "TEXT" and node.get("characters", "").strip() and is_note(node, path):
            groups[node["characters"]].append((node, page, path))
    parts = ["# Candidate notes from the source file",
             "Heuristic selection (note-like names, keywords, canvas annotations, very large "
             "text). Check each one and copy the real notes verbatim into the spec."]
    for text, hits in groups.items():
        node, page, path = hits[0]
        where = " > ".join(a["name"] for a in path if a["type"] not in ("DOCUMENT", "CANVAS"))
        parts += [f"### {id_list([h[0]['id'] for h in hits])} | {page} | {where or 'canvas'}",
                  f"Font: {type_label(node.get('style', {}))}",
                  "\n".join("> " + line for line in text.splitlines())]
    return "\n\n".join(parts)


def overview_counts(data, nodes, exports):
    """Headline counts for the overview table."""
    types = Counter(n["type"] for n, *_ in nodes)
    style_types = Counter(s.get("styleType") for s in data.get("styles", {}).values())
    frames, fills, assets = exports["top_level_frames"], exports["image_fills"], exports["vector_assets"]
    return [
        ("Top-level frames", len(frames), f"{sum(f['hidden'] for f in frames)} hidden"),
        ("COMPONENT_SET (node tree / file header)", types["COMPONENT_SET"], len(data.get("componentSets", {}))),
        ("COMPONENT (node tree / file header)", types["COMPONENT"], len(data.get("components", {}))),
        ("TEXT nodes", types["TEXT"], ""),
        ("Styles", len(data.get("styles", {})), ", ".join(f"{k} {v}" for k, v in sorted(style_types.items()))),
        ("Nodes with bound variables", sum(1 for n, *_ in nodes if n.get("boundVariables")), ""),
        ("Image refs in use", len(fills), f"{sum(not f['original_url_known'] for f in fills)} without original URL"),
        ("Vector asset candidates", len(assets), f"{sum(a['hidden'] for a in assets)} hidden only")]


def report_overview(data, nodes, exports):
    """File metadata, pages and headline counts."""
    pages = [(code(p["id"]), p["name"], len(p.get("children", [])))
             for p in data["document"].get("children", [])]
    head = (f"`{data.get('name')}` · lastModified `{data.get('lastModified')}` · "
            f"version `{data.get('version')}` · role `{data.get('role')}`")
    return "\n\n".join(["# Overview", head, table(["Page ID", "Page", "Top-level nodes"], pages),
                        table(["Item", "Count", "Detail"], overview_counts(data, nodes, exports))])


def write_outputs(out, data, nodes, frames, exports):
    """Render every report and write it into `out`."""
    styles = data.get("styles", {})
    reports = {
        "overview.md": report_overview(data, nodes, exports),
        "colors.md": report_colors(nodes, styles), "typography.md": report_typography(nodes, styles),
        "effects.md": report_effects(nodes, styles), "grids.md": report_grids(nodes),
        "radii.md": report_radii(nodes), "frames.md": report_frames(frames),
        "components.md": report_components(data, nodes), "notes.md": report_notes(nodes),
        "exports.json": json.dumps(exports, indent=2, ensure_ascii=False)}
    out.mkdir(parents=True, exist_ok=True)
    for name, content in reports.items():
        (out / name).write_text(content + "\n", encoding="utf-8")
    print(f"Wrote {len(reports)} files to {out}")


def load_json(path):
    """Read a JSON file, or return None when it does not exist."""
    return json.loads(path.read_text(encoding="utf-8")) if path.exists() else None


def main():
    """Parse arguments, load the cache and write all reports."""
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument("cache_dir", help="folder with file.json, usually .figma-cache")
    parser.add_argument("--out", help="output folder (default: <cache_dir>/analysis)")
    args = parser.parse_args()
    sys.setrecursionlimit(20000)
    cache = Path(args.cache_dir)
    data = load_json(cache / "file.json")
    if not data or "document" not in data:
        sys.exit(f"{cache / 'file.json'} is missing or not a file response: {str(data)[:200]}")
    known_refs = set(((load_json(cache / "image-fills.json") or {}).get("meta") or {}).get("images", {}))
    nodes = list(walk(data["document"]))
    frames = top_level_frames(data["document"])
    exports = build_exports(data, nodes, frames, known_refs)
    write_outputs(Path(args.out) if args.out else cache / "analysis", data, nodes, frames, exports)


if __name__ == "__main__":
    main()
