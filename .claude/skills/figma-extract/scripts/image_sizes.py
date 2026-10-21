#!/usr/bin/env python3
"""Print format and pixel size of downloaded raster images.

Usage:
    python image_sizes.py <file-or-folder> [...]

Figma's original image URLs carry no file extension: the detected format tells
which extension to give the file. Compare the pixel size with the display size in
exports.json (image_fills) to spot originals that are smaller than displayed.
Supports PNG, JPEG, GIF and WebP; SVG is reported as vector.
"""

import struct
import sys
from pathlib import Path

JPEG_SOF = {0xC0, 0xC1, 0xC2, 0xC3, 0xC5, 0xC6, 0xC7, 0xC9, 0xCA, 0xCB, 0xCD, 0xCE, 0xCF}
JPEG_NO_LENGTH = set(range(0xD0, 0xDA)) | {0x01}


def jpeg_size(data):
    """Return (width, height) from the first JPEG start-of-frame segment."""
    pos = 2
    while pos + 9 < len(data):
        if data[pos] != 0xFF or data[pos + 1] == 0xFF:
            pos += 1
            continue
        marker = data[pos + 1]
        if marker in JPEG_SOF:
            height, width = struct.unpack(">HH", data[pos + 5:pos + 9])
            return width, height
        step = 0 if marker in JPEG_NO_LENGTH else struct.unpack(">H", data[pos + 2:pos + 4])[0]
        pos += 2 + step
    return None, None


def webp_size(data):
    """Return (width, height) of a WebP image from its VP8X, VP8L or VP8 chunk."""
    chunk = data[12:16]
    if chunk == b"VP8X":
        return 1 + int.from_bytes(data[24:27], "little"), 1 + int.from_bytes(data[27:30], "little")
    if chunk == b"VP8L":
        bits = int.from_bytes(data[21:25], "little")
        return 1 + (bits & 0x3FFF), 1 + ((bits >> 14) & 0x3FFF)
    if chunk == b"VP8 ":
        width, height = struct.unpack("<HH", data[26:30])
        return width & 0x3FFF, height & 0x3FFF
    return None, None


def describe(path):
    """Return (format, width, height) for one file; sizes are None when unknown."""
    data = path.read_bytes()
    if data[:8] == b"\x89PNG\r\n\x1a\n":
        return ("png", *struct.unpack(">II", data[16:24]))
    if data[:3] == b"\xff\xd8\xff":
        return ("jpg", *jpeg_size(data))
    if data[:6] in (b"GIF87a", b"GIF89a"):
        return ("gif", *struct.unpack("<HH", data[6:10]))
    if data[:4] == b"RIFF" and data[8:12] == b"WEBP":
        return ("webp", *webp_size(data))
    if b"<svg" in data[:2048].lower():
        return ("svg", None, None)
    return ("unknown", None, None)


def files_in(arguments):
    """Expand folder arguments into the files they contain."""
    for argument in map(Path, arguments):
        if not argument.exists():
            print(f"{argument}\tmissing\t-", file=sys.stderr)
            continue
        yield from (sorted(p for p in argument.rglob("*") if p.is_file())
                    if argument.is_dir() else [argument])


def main():
    """Print one tab-separated line per file: path, format, width x height."""
    if len(sys.argv) < 2:
        sys.exit(__doc__)
    for path in files_in(sys.argv[1:]):
        kind, width, height = describe(path)
        size = f"{width} x {height}" if width else "-"
        print(f"{path}\t{kind}\t{size}")


if __name__ == "__main__":
    main()
