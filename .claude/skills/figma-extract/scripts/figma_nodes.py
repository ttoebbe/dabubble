"""Traversal and formatting helpers for a cached Figma file (GET /v1/files/<key>)."""


def walk(node, page="", path=(), hidden=False):
    """Yield (node, page name, ancestors, hidden) for `node` and all descendants."""
    hidden = hidden or node.get("visible") is False
    yield node, page, path, hidden
    page = node["name"] if node["type"] == "CANVAS" else page
    for child in node.get("children", []):
        yield from walk(child, page, path + (node,), hidden)


def hex_color(color):
    """Return '#RRGGBB' for a Figma RGBA dict."""
    return "#" + "".join(f"{round(color.get(c, 0) * 255):02X}" for c in "rgb")


def alpha_suffix(alpha):
    """Return ' @NN %' for partial opacity, '' when opaque."""
    return f" @{round(alpha * 100)} %" if alpha < 0.995 else ""


def paint_label(paint):
    """Describe a paint as hex value, gradient stops or image reference."""
    kind = paint.get("type", "")
    if kind == "SOLID":
        alpha = paint.get("opacity", 1) * paint["color"].get("a", 1)
        return hex_color(paint["color"]) + alpha_suffix(alpha)
    if kind.startswith("GRADIENT"):
        stops = " → ".join(hex_color(s["color"]) for s in paint.get("gradientStops", []))
        return f"{kind}({stops})"
    return f"IMAGE({paint.get('imageRef')})" if kind == "IMAGE" else kind


def visible(items):
    """Drop paints or effects that Figma marks invisible."""
    return [item for item in items or [] if item.get("visible", True)]


def effect_label(effect):
    """Describe an effect as 'TYPE x y blur spread #HEX @NN %'."""
    if "color" not in effect:
        return f"{effect['type']} {effect.get('radius', 0):g}"
    offset, color = effect.get("offset", {}), effect["color"]
    return (f"{effect['type']} {offset.get('x', 0):g} {offset.get('y', 0):g} "
            f"{effect.get('radius', 0):g} {effect.get('spread', 0):g} "
            f"{hex_color(color)}{alpha_suffix(color.get('a', 1))}")


def size_of(node):
    """Return the bounding box as (width, height) in whole px."""
    box = node.get("absoluteBoundingBox") or {}
    return round(box.get("width") or 0), round(box.get("height") or 0)


def size_label(node):
    """Return 'W x H'."""
    return "{} x {}".format(*size_of(node))


def auto_layout(node):
    """Return (direction, gap, padding T/R/B/L) of an auto-layout node."""
    mode = {"HORIZONTAL": "H", "VERTICAL": "V"}.get(node.get("layoutMode"), "-")
    gap = f"{node['itemSpacing']:g}" if mode != "-" and node.get("itemSpacing") else "-"
    pads = [node.get(f"padding{side}", 0) for side in ("Top", "Right", "Bottom", "Left")]
    return mode, gap, "/".join(f"{p:g}" for p in pads) if any(pads) else "-"


def radius_label(node):
    """Return the corner radius, per corner (TL/TR/BR/BL) when asymmetric."""
    corners = node.get("rectangleCornerRadii")
    if corners and len(set(corners)) > 1:
        return "/".join(f"{c:g}" for c in corners)
    return f"{node['cornerRadius']:g}" if node.get("cornerRadius") else "-"


def first_paint(node, key):
    """Return the label of the first visible fill or stroke, or '-'."""
    paints = visible(node.get(key))
    if not paints:
        return "-"
    label = paint_label(paints[0])
    return f"{label} {node.get('strokeWeight', 1):g}px" if key == "strokes" else label


def type_label(style):
    """Describe a TypeStyle as 'Family size/weight'."""
    return (f"{style.get('fontFamily', '?')} "
            f"{style.get('fontSize', 0):g}/{style.get('fontWeight', 0):g}")


def first_text_style(node):
    """Return the type label of the first TEXT node below `node`, or '-'."""
    for child, *_ in walk(node):
        if child["type"] == "TEXT":
            return type_label(child.get("style", {}))
    return "-"


def code(value):
    """Wrap a value in backticks."""
    return f"`{value}`"


def id_list(ids, limit=5):
    """Backticked node IDs, own nodes before instance sublayers ('I…'), capped at `limit`."""
    ordered = sorted(ids, key=lambda node_id: node_id.startswith("I"))
    shown = ", ".join(code(node_id) for node_id in ordered[:limit])
    return shown + (f" (+{len(ordered) - limit} more)" if len(ordered) > limit else "")


def table(headers, rows):
    """Render rows as a Markdown table, escaping pipes and line breaks."""
    def cell(value):
        return str(value).replace("|", "\\|").replace("\n", " ")
    lines = ["| " + " | ".join(headers) + " |", "|" + "---|" * len(headers)]
    return "\n".join(lines + ["| " + " | ".join(cell(v) for v in row) + " |" for row in rows])
