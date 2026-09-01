/**
 * 酒款插画映射：cocktail.id → /public 下的图片路径。
 * 只登记已生成插画的酒款；没登记的卡片自动回退到线条杯型图（GlassMark）。
 * 图片统一为 480×480 WebP（约 12~16 KB），列表用小方图，详情页当横幅。
 */
export const DRINK_ART: Record<string, string> = {
  "old-fashioned": "/images/cocktails/old-fashioned.webp",
  negroni: "/images/cocktails/negroni.webp",
  cosmopolitan: "/images/cocktails/cosmopolitan.webp",
  mojito: "/images/cocktails/mojito.webp",
};

export function drinkArt(id: string): string | undefined {
  return DRINK_ART[id];
}
