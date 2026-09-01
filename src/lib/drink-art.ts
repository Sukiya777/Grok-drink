/**
 * 酒款插画映射：cocktail.id → /public 下的图片路径。
 * 只登记已生成插画的酒款；没登记的卡片自动回退到线条杯型图（GlassMark）。
 * 图片统一为 800×800 WebP（约 20~50 KB），列表用小方图，详情页当横幅。
 * 补新图两步：webp 放进 public/images/cocktails/，这里加一行。
 * （保持完整字面量路径，便于单文件预览脚本内联，勿改成模板拼接。）
 */
export const DRINK_ART: Record<string, string> = {
  // 首批试点
  "old-fashioned": "/images/cocktails/old-fashioned.webp",
  negroni: "/images/cocktails/negroni.webp",
  cosmopolitan: "/images/cocktails/cosmopolitan.webp",
  mojito: "/images/cocktails/mojito.webp",
  // 威士忌系
  manhattan: "/images/cocktails/manhattan.webp",
  "whiskey-sour": "/images/cocktails/whiskey-sour.webp",
  sazerac: "/images/cocktails/sazerac.webp",
  penicillin: "/images/cocktails/penicillin.webp",
  boulevardier: "/images/cocktails/boulevardier.webp",
  "new-york-sour": "/images/cocktails/new-york-sour.webp",
  "vieux-carre": "/images/cocktails/vieux-carre.webp",
  "white-russian": "/images/cocktails/white-russian.webp",
  // 金酒 / 方杯系
  "tom-collins": "/images/cocktails/tom-collins.webp",
  "mint-julep": "/images/cocktails/mint-julep.webp",
  // 伏特加系
  "moscow-mule": "/images/cocktails/moscow-mule.webp",
  // 朗姆系
  "cuba-libre": "/images/cocktails/cuba-libre.webp",
  // 特基拉系
  margarita: "/images/cocktails/margarita.webp",
  "tommys-margarita": "/images/cocktails/tommys-margarita.webp",
  paloma: "/images/cocktails/paloma.webp",
  "tequila-sunrise": "/images/cocktails/tequila-sunrise.webp",
  hemingway: "/images/cocktails/hemingway.webp",
  // 利口与开胃
  "aperol-spritz": "/images/cocktails/aperol-spritz.webp",
  americano: "/images/cocktails/americano.webp",
  sbagliato: "/images/cocktails/sbagliato.webp",
  "amaretto-sour": "/images/cocktails/amaretto-sour.webp",
};

export function drinkArt(id: string): string | undefined {
  return DRINK_ART[id];
}
