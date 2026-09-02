"""生成 PWA 图标：与 favicon.svg 同一枚马天尼杯（夜酌既有品牌形），
输出 512/192/maskable/apple-touch 四件套到 public/icons/。
maskable 版把内容缩到中心 60%（安全区 80% 内再留余量），防止各启动器裁切。
"""

from PIL import Image, ImageDraw

BG = (12, 11, 10)
FG = (242, 235, 227)


def make(size, scale=1.0, radius=None):
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    r = radius if radius is not None else size * 7 / 32
    d.rounded_rectangle([0, 0, size - 1, size - 1], radius=int(r), fill=BG)
    k = size / 32 * scale
    ox = oy = (size - 32 * k) / 2

    def P(x, y):
        return (ox + x * k, oy + y * k)

    # 杯碗：M5 7h22L18.6 17.5h-5.2L5 7z
    d.polygon([P(5, 7), P(27, 7), P(18.6, 17.5), P(13.4, 17.5)], fill=FG)
    # 杯梗：rect 14.2,16.8 3.6x7.4
    d.rectangle([P(14.2, 16.8), P(17.8, 24.2)], fill=FG)
    # 底座：M9.5 24h13l1.6 3.2H7.9z
    d.polygon([P(9.5, 24), P(22.5, 24), P(24.1, 27.2), P(7.9, 27.2)], fill=FG)
    return img


import os

import os
BASE = os.path.join(os.path.dirname(__file__), "..", "public", "icons")
os.makedirs(BASE, exist_ok=True)
base = BASE
make(512).save(f"{base}/icon-512.png")
make(192).save(f"{base}/icon-192.png")
make(512, scale=0.62, radius=0).convert("RGB").save(f"{base}/icon-maskable-512.png")
make(180).convert("RGB").save(f"{base}/apple-touch-icon.png")
for f in sorted(os.listdir(base)):
    im = Image.open(f"{base}/{f}")
    print(f, im.size, os.path.getsize(f"{base}/{f}") // 1024, "KB")
