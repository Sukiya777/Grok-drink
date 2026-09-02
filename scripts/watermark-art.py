#!/usr/bin/env python3
"""插画右下角轻水印：SUKI 落款（衬线、极小、低对比、距边 44px）。

设计要点
- 颜色 = 该图局部背景色向白插值（alpha 默认 0.20）→ "比背景亮一档"，不是硬白。
- 距边 44px：避开五道机检的边缘/四角采样带，加水印后白边与背景检测仍然全绿。
- 幂等安全：只应作用在"无水印母本"上。母本备份在仓库外
  files/Grok-drink-art-master-20260902.zip（51 张）。若需重做风格，先从母本还原再跑本脚本。

用法
  python3 scripts/watermark-art.py <文件或目录...> [--alpha=0.2] [--dry]
    目录 → 处理其中全部 .webp（就地写入）
    文件 → 就地处理该文件（新增单款酒时用这个）
    --dry 只报告不落盘
"""
import os
import sys

import numpy as np
from PIL import Image, ImageDraw, ImageFont

SERIF = "/usr/share/fonts/opentype/noto/NotoSerifCJK-Bold.ttc"
TEXT = "SUKI"
INSET, SIZE, TRACK = 44, 17, 4.2

args = [a for a in sys.argv[1:] if not a.startswith("--")]
ALPHA = next(
    (float(a.split("=")[1]) for a in sys.argv if a.startswith("--alpha")), 0.20
)
DRY = "--dry" in sys.argv

targets = []
for a in args:
    if os.path.isdir(a):
        targets += [
            os.path.join(a, f) for f in sorted(os.listdir(a)) if f.endswith(".webp")
        ]
    else:
        targets.append(a)
if not targets:
    print(__doc__)
    sys.exit(1)

font_cache = {}
for p in targets:
    im = Image.open(p).convert("RGB")
    w, h = im.size
    s = w / 800
    a = np.asarray(im, dtype=float)
    patch = a[h - 120 : h - 60, w - 160 : w - 100].reshape(-1, 3)
    dark = patch[patch.mean(axis=1) < 90]
    bg = dark.mean(axis=0) if len(dark) > 30 else np.array([22.0, 28.0, 42.0])
    fill = tuple(int(round(bg[i] * (1 - ALPHA) + 245 * ALPHA)) for i in range(3))

    key = int(round(SIZE * s))
    font = font_cache.get(key) or ImageFont.truetype(SERIF, key, index=2)
    font_cache[key] = font

    d = ImageDraw.Draw(im)
    total = sum(d.textlength(c, font=font) for c in TEXT) + TRACK * s * (len(TEXT) - 1)
    cx, y = w - INSET * s - total, h - INSET * s - SIZE * s * 1.15
    for c in TEXT:
        d.text((cx, y), c, font=font, fill=fill)
        cx += d.textlength(c, font=font) + TRACK * s

    if DRY:
        print(f"{os.path.basename(p):26} [dry] 落款 RGB{fill} @ ({int(cx):d},{int(y):d})")
    else:
        im.save(p, "WEBP", quality=80, method=6)
        print(f"{os.path.basename(p):26} 已加水印 RGB{fill}")
print(f"共 {len(targets)} 张{'（试运行）' if DRY else ''}")
