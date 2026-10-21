"""Collect the node lists that the later API calls work from (renders, downloads)."""

import re

from figma_nodes import size_of, visible

SHAPE_TYPES = {"VECTOR", "BOOLEAN_OPERATION", "STAR", "LINE", "ELLIPSE", "REGULAR_POLYGON"}
ASSET_TYPES = {"COMPONENT", "INSTANCE", "FRAME", "GROUP", "VECTOR", "BOOLEAN_OPERATION"}
FRAME_TYPES = {"FRAME", "INSTANCE", "COMPONENT"}
ASSET_MAX_EDGE = 512
ASSET_MIN_EDGE = 2


def section_frames(section, page):
    """Return (frame, page, section, hidden) for the frames inside a top-level section."""
    hidden = section.get("visible") is False
    return [(f, page, section["name"], hidden or f.get("visible") is False)
            for f in section.get("children", []) if f["type"] in FRAME_TYPES]


def top_level_frames(document):
    """Return (frame, page, section, hidden) for frames on a canvas or in a top-level section."""
    found = []
    for page in document.get("children", []):
        for child in page.get("children", []):
            if child["type"] == "SECTION":
                found += section_frames(child, page["name"])
            elif child["type"] in FRAME_TYPES:
                found.append((child, page["name"], "", child.get("visible") is False))
    return found


def collect_image_fills(nodes, known_refs):
    """Map each imageRef in use to its nodes and display sizes."""
    refs = {}
    for node, _, _, hidden in nodes:
        for paint in visible(node.get("fills")):
            if paint.get("type") == "IMAGE":
                refs.setdefault(paint.get("imageRef"), []).append({
                    "id": node["id"], "name": node["name"], "display": list(size_of(node)),
                    "scaleMode": paint.get("scaleMode"), "hidden": hidden})
    return [{"imageRef": ref, "original_url_known": ref in known_refs, "nodes": hits}
            for ref, hits in refs.items()]


def mark_subtrees(node, flags):
    """Post-order pass: flags[id] = (has vector shape, has text or raster image)."""
    shape = node["type"] in SHAPE_TYPES
    blocked = node["type"] == "TEXT" or any(
        p.get("type") == "IMAGE" for p in visible(node.get("fills")))
    for child in node.get("children", []):
        child_shape, child_blocked = mark_subtrees(child, flags)
        shape, blocked = shape or child_shape, blocked or child_blocked
    flags[node["id"]] = (shape, blocked)
    return shape, blocked


def is_vector_asset(node, flags):
    """True for a node of icon-to-illustration size made of vector shapes only."""
    shape, blocked = flags.get(node["id"], (False, True))
    width, height = size_of(node)
    return (node["type"] in ASSET_TYPES and shape and not blocked
            and min(width, height) >= ASSET_MIN_EDGE and max(width, height) <= ASSET_MAX_EDGE)


def asset_entry(node, page, path, hidden):
    """Describe a vector asset candidate for exports.json."""
    parent = path[-1] if path else {}
    return {"id": node["id"], "name": node["name"], "type": node["type"], "page": page,
            "size": list(size_of(node)), "hidden": hidden, "occurrences": 0,
            "component_set": parent.get("name") if parent.get("type") == "COMPONENT_SET" else None,
            "material_hint": bool(re.fullmatch(r"[a-z][a-z0-9_]*", node["name"]))}


def prefer_renderable(entry, node, hidden):
    """Switch the representative to a visible, non-instance occurrence when one turns up."""
    if hidden:
        return
    if entry["hidden"] or (entry["id"].startswith("I") and not node["id"].startswith("I")):
        entry.update(id=node["id"], hidden=False)


def collect_vector_assets(document, nodes):
    """Topmost vector-only nodes, de-duplicated by main component or by name and size."""
    flags = {}
    mark_subtrees(document, flags)
    local = {n["id"] for n, *_ in nodes if n["type"] == "COMPONENT" and is_vector_asset(n, flags)}
    found = {}
    for node, page, path, hidden in nodes:
        if not is_vector_asset(node, flags) or (path and is_vector_asset(path[-1], flags)):
            continue
        if node["type"] == "INSTANCE" and node.get("componentId") in local:
            continue
        key = node.get("componentId") or (node["name"], size_of(node), node["type"])
        entry = found.setdefault(key, asset_entry(node, page, path, hidden))
        prefer_renderable(entry, node, hidden)
        entry["occurrences"] += 1
    return list(found.values())


def build_exports(data, nodes, frames, known_refs):
    """Assemble exports.json: file metadata, pages, frames, image fills, vector assets."""
    return {
        "file": {key: data.get(key) for key in ("name", "lastModified", "version", "role")},
        "pages": [{"id": p["id"], "name": p["name"]} for p in data["document"].get("children", [])],
        "top_level_frames": [{"id": f["id"], "name": f["name"], "type": f["type"], "page": page,
                              "section": section, "size": list(size_of(f)), "hidden": hidden}
                             for f, page, section, hidden in frames],
        "image_fills": collect_image_fills(nodes, known_refs),
        "vector_assets": collect_vector_assets(data["document"], nodes),
    }
