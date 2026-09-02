"""v3 酒色提取：色相分桶取"最大面积色块"，替代 v2 的"最高彩度分"。

v2 败因：彩度×明度打分让高彩度的橙皮装饰赢了大区域的粉色酒液
（cosmopolitan 出棕不出玫红）。液体是画面里最大的有色面积 → 按色相分
24 桶计数，取最大桶的均值最稳；彩度/明度门槛先滤掉背景、墨线与冰高光。
"""

import glob
import os
import re
from collections import defaultdict

from PIL import Image

files = sorted(glob.glob("/home/sandbox/workspace/files/Grok-drink/public/images/cocktails/*.webp"))
assert len(files) == 51, len(files)
INKISH = (26, 23, 20)


def hue_of(r, g, b):
    mx, mn = max(r, g, b), min(r, g, b)
    if mx == mn:
        return None
    if mx == r:
        h = (g - b) / (mx - mn) % 6
    elif mx == g:
        h = (b - r) / (mx - mn) + 2
    else:
        h = (r - g) / (mx - mn) + 4
    return h * 60


out = {}
report = {}
for f in files:
    im = Image.open(f).convert("RGB")
    w, h = im.size
    px = im.load()
    bins = defaultdict(list)
    for y in range(1, h - 1, 3):
        for x in range(1, w - 1, 3):
            r, g, b = px[x, y]
            mx, mn = max(r, g, b), min(r, g, b)
            chroma = mx - mn
            sat = chroma / mx if mx else 0  # HSV 饱和度：米色墙 chroma≈28 但 sat 仅 ~0.12
            lum = 0.299 * r + 0.587 * g + 0.114 * b
            if sat < 0.18 or chroma < 16 or lum < 62 or lum > 245:
                continue
            hu = hue_of(r, g, b)
            if hu is None:
                continue
            bins[int(hu // 15)].append((r, g, b))
    name = os.path.basename(f)[:-5]
    if not bins:
        out[name] = "#3a352e"
        report[name] = "无彩度像素→中性"
        continue
    # 桶按 30° 合并（15° 桶 ×2），避免液面渐变把面积拆散
    merged = defaultdict(list)
    for k, v in bins.items():
        merged[k // 2] = merged[k // 2] + v
    big = max(merged.items(), key=lambda kv: len(kv[1]))
    pts = big[1]
    r = sum(p[0] for p in pts) / len(pts)
    g = sum(p[1] for p in pts) / len(pts)
    b = sum(p[2] for p in pts) / len(pts)
    out[name] = "#{:02x}{:02x}{:02x}".format(
        int(r * 0.85 + INKISH[0] * 0.15), int(g * 0.85 + INKISH[1] * 0.15), int(b * 0.85 + INKISH[2] * 0.15)
    )
    report[name] = f"桶{big[0] * 30}° 占比{len(pts) / sum(len(v) for v in merged.values()) * 100:.0f}%"

ts = open("/home/sandbox/workspace/files/Grok-drink/src/lib/drink-art.ts", encoding="utf-8").read()
order = re.findall(r'"?([a-z0-9-]+)"?: "/images/cocktails/', ts)
order = [k for k in order if k in out] + sorted(set(out) - set(order))

lines = [
    "/* 每杯插画的“酒液色”：色相分桶取最大有色面积（液体）的均值，向产品墨色收 15%。",
    " * 插画加载完成前，卡片/横幅以此色作占位底，图到时淡入盖上去。",
    " * 新增插画后重新生成：python3 scripts/gen-art-veil.py（勿手改单条目）。 */",
    'export const DEFAULT_VEIL = "#3a352e";',
    "export const ART_VEIL: Record<string, string> = {",
]
for k in order:
    lines.append(f'  "{k}": "{out[k]}",  // {report[k]}')
lines.append("};")
lines.append("")
lines.append("export function artVeil(id: string): string {")
lines.append("  return ART_VEIL[id] ?? DEFAULT_VEIL;")
lines.append("}")
path = "/home/sandbox/workspace/files/Grok-drink/src/lib/art-veil.ts"
open(path, "w", encoding="utf-8").write("\n".join(lines) + "\n")

import shutil
shutil.copy("/tmp/20260902_gen_veil3.py" if os.path.exists("/tmp/20260902_gen_veil3.py") else __file__,
            "/home/sandbox/workspace/files/Grok-drink/scripts/gen-art-veil.py") if False else None

print(f"written {path}")
for k in ("negroni", "cosmopolitan", "mojito", "sunset-grove", "pina-colada", "old-fashioned", "margarita", "espresso-martini"):
    if k in out:
        print(f"  {k:16s} {out[k]}  {report[k]}")
