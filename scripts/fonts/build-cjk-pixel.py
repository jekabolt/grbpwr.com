#!/usr/bin/env python3
"""Build the CJK companion of Feature Mono from Fusion Pixel Font (OFL 1.1).

Feature Mono covers Latin/Cyrillic only; /ja, /zh and /ko fell back to the
system font. This script takes the 12px monospaced Fusion Pixel builds
(ja / zh_hans / ko regional glyph variants) and refits them to Feature Mono's
grid:

  * unitsPerEm stays 1200 (one pixel = 100 units), so at the storefront's
    12px base size every font pixel lands on exactly one CSS pixel;
  * a full-width glyph advances 1440/1200 em = 1.2em = two Feature Mono cells
    (0.6em each), a half-width one advances one cell; the original pixel cell
    is centred in the new advance;
  * vertical metrics are Feature Mono's (0.8 / -0.2 em), so CJK lines are not
    taller than Latin ones;
  * only CJK/kana/hangul/fullwidth codepoints are kept — Latin, Cyrillic and
    shared punctuation always render in Feature Mono.

Each regional font is split into unicode-range slices (the first one holds
every character of messages/<locale>.json, so UI chrome is one request), and
the matching @font-face CSS is written to src/fonts/cjk-pixel.css.

Usage:
  pip install fonttools brotli
  # unzip fusion-pixel-font-12px-monospaced-ttf-v<ver>.zip somewhere
  python3 scripts/fonts/build-cjk-pixel.py <unzipped-dir>
"""

import json
import shutil
import sys
from pathlib import Path

from fontTools import subset
from fontTools.ttLib import TTFont

ROOT = Path(__file__).resolve().parents[2]
OUT_DIR = ROOT / "public" / "fonts" / "cjk"
CSS_OUT = ROOT / "src" / "fonts" / "cjk-pixel.css"
FEATURE_MONO = ROOT / "src" / "fonts" / "FeatureMono-Regular.ttf"

# locale -> (Fusion build suffix, CSS family)
LOCALES = {
    "ja": ("ja", "GRBPWR Pixel JA"),
    "zh": ("zh_hans", "GRBPWR Pixel ZH"),
    "ko": ("ko", "GRBPWR Pixel KO"),
}

SLICE_SIZE = 400

COMMON_RANGES = [
    (0x3000, 0x303F),  # CJK symbols & punctuation
    (0x3200, 0x33FF),  # enclosed CJK, CJK compatibility
    (0xFE30, 0xFE4F),  # CJK compatibility forms
    (0xFF00, 0xFFEF),  # half/fullwidth forms
]
LOCALE_RANGES = {
    "ja": [(0x3040, 0x30FF), (0x31F0, 0x31FF)],
    "zh": [(0x3100, 0x312F)],  # bopomofo
    "ko": [(0x1100, 0x11FF), (0x3130, 0x318F), (0xAC00, 0xD7A3)],
}


def legacy_charset(codec):
    """Every double-byte character of a legacy national encoding."""
    out = set()
    for hi in range(0x81, 0xFF):
        for lo in range(0x40, 0xFF):
            try:
                s = bytes([hi, lo]).decode(codec)
            except UnicodeDecodeError:
                continue
            if len(s) == 1:
                out.add(ord(s))
    return out


def ideographs(cps):
    return {c for c in cps if 0x3400 <= c <= 0x9FFF or 0xF900 <= c <= 0xFAFF}


def wanted_codepoints(locale):
    cps = set()
    for lo, hi in COMMON_RANGES + LOCALE_RANGES[locale]:
        cps.update(range(lo, hi + 1))
    if locale == "ja":
        cps |= ideographs(legacy_charset("shift_jis"))  # JIS X 0208 kanji
    elif locale == "zh":
        cps |= ideographs(legacy_charset("gb2312"))  # GB2312 hanzi
    return cps


def message_codepoints(locale):
    text = (ROOT / "messages" / f"{locale}.json").read_text(encoding="utf-8")
    json.loads(text)  # fail loudly on a broken dictionary
    return {ord(c) for c in text}


def refit(font, fm):
    """Re-centre glyphs in Feature Mono cells and copy its vertical metrics."""
    upm = font["head"].unitsPerEm
    assert upm == 1200, f"expected 12px Fusion build (upm 1200), got {upm}"
    scale = upm / fm["head"].unitsPerEm
    cell = round(fm["hmtx"][fm.getBestCmap()[ord("0")]][0] * scale)
    glyf = font["glyf"]
    hmtx = font["hmtx"]
    for name in font.getGlyphOrder():
        adv, lsb = hmtx[name]
        if adv == 0:
            continue
        cells = 2 if adv > 600 else 1
        new_adv = cells * cell
        dx = (new_adv - adv) // 2
        g = glyf[name]
        assert not g.isComposite(), f"composite glyph {name} would be shifted twice"
        if g.numberOfContours:
            g.coordinates.translate((dx, 0))
            g.recalcBounds(glyf)
            lsb = g.xMin
        hmtx[name] = (new_adv, lsb)
    for t in ("vhea", "vmtx"):
        if t in font:
            del font[t]

    asc = round(fm["hhea"].ascent * scale)
    desc = round(fm["hhea"].descent * scale)
    font["hhea"].ascent, font["hhea"].descent, font["hhea"].lineGap = asc, desc, 0
    os2, fos2 = font["OS/2"], fm["OS/2"]
    os2.sTypoAscender, os2.sTypoDescender, os2.sTypoLineGap = asc, desc, 0
    os2.usWinAscent = round(fos2.usWinAscent * scale)
    os2.usWinDescent = round(fos2.usWinDescent * scale)
    os2.xAvgCharWidth = cell * 2
    font["hhea"].advanceWidthMax = cell * 2
    return cell


def rename(font, family):
    name = font["name"]
    keep = {0, 13, 14}
    name.names = [n for n in name.names if n.nameID in keep]
    for nid, val in (
        (1, family),
        (2, "Regular"),
        (3, f"{family};Regular"),
        (4, family),
        (5, "Version 1.000; built from Fusion Pixel Font 12px monospaced"),
        (6, family.replace(" ", "") + "-Regular"),
    ):
        name.setName(val, nid, 3, 1, 0x409)


def ranges(cps):
    cps = sorted(cps)
    out, start, prev = [], cps[0], cps[0]
    for c in cps[1:]:
        if c != prev + 1:
            out.append((start, prev))
            start = c
        prev = c
    out.append((start, prev))
    return ", ".join(f"U+{a:X}" if a == b else f"U+{a:X}-{b:X}" for a, b in out)


def write_slice(src, cps, path):
    opts = subset.Options()
    opts.flavor = "woff2"
    opts.layout_features = []
    opts.hinting = False
    opts.name_IDs = ["*"]
    opts.notdef_outline = False
    opts.glyph_names = False
    font = TTFont(src)
    sub = subset.Subsetter(opts)
    sub.populate(unicodes=cps)
    sub.subset(font)
    font.flavor = "woff2"
    font.save(path)


def main():
    if len(sys.argv) != 2:
        sys.exit(__doc__)
    src_dir = Path(sys.argv[1])
    fm = TTFont(FEATURE_MONO)
    fm_cmap = set(fm.getBestCmap())

    shutil.rmtree(OUT_DIR, ignore_errors=True)
    OUT_DIR.mkdir(parents=True)
    for lic in [src_dir / "OFL.txt", *sorted((src_dir / "LICENSES").glob("*/*"))]:
        rel = lic.relative_to(src_dir)
        dst = OUT_DIR / "licenses" / rel
        dst.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy(lic, dst)

    css = [
        "/* Generated by scripts/fonts/build-cjk-pixel.py — do not edit by hand.",
        "   Glyphs: Fusion Pixel Font (c) TakWolf and contributors, SIL OFL 1.1,",
        "   see /fonts/cjk/licenses. Refitted to the Feature Mono grid. */",
        "",
    ]
    total = 0
    for locale, (suffix, family) in LOCALES.items():
        src = src_dir / f"fusion-pixel-12px-monospaced-{suffix}.ttf"
        font = TTFont(src)
        have = set(font.getBestCmap())
        cps = (wanted_codepoints(locale) | message_codepoints(locale)) & have
        cps -= fm_cmap
        cps = {c for c in cps if c > 0x2FF}  # never shadow Latin

        refit(font, fm)
        rename(font, family)
        tmp = OUT_DIR / f"_{locale}.ttf"
        font.save(tmp)

        first = sorted(cps & message_codepoints(locale))
        rest = sorted(cps - set(first))
        slices = [first] + [rest[i : i + SLICE_SIZE] for i in range(0, len(rest), SLICE_SIZE)]

        loc_dir = OUT_DIR / locale
        loc_dir.mkdir()
        size = 0
        for i, sl in enumerate(slices):
            if not sl:
                continue
            path = loc_dir / f"{i:03d}.woff2"
            write_slice(tmp, sl, path)
            size += path.stat().st_size
            css += [
                "@font-face {",
                f'  font-family: "{family}";',
                f'  src: url("/fonts/cjk/{locale}/{i:03d}.woff2") format("woff2");',
                "  font-weight: 100 900;",
                "  font-style: normal;",
                "  font-display: swap;",
                f"  unicode-range: {ranges(sl)};",
                "}",
            ]
        tmp.unlink()
        total += size
        print(f"{locale}: {len(cps)} chars, {len(slices)} slices, first {len(first)} chars, {size/1024:.0f} KiB")

    CSS_OUT.write_text("\n".join(css) + "\n", encoding="utf-8")
    print(f"total {total/1024/1024:.1f} MiB -> {OUT_DIR.relative_to(ROOT)}, css -> {CSS_OUT.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
