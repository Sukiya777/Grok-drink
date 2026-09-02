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
  // 金酒系（已集齐 8/8）
  martini: "/images/cocktails/martini.webp",
  "gin-tonic": "/images/cocktails/gin-tonic.webp",
  "tom-collins": "/images/cocktails/tom-collins.webp",
  aviation: "/images/cocktails/aviation.webp",
  "french-75": "/images/cocktails/french-75.webp",
  "last-word": "/images/cocktails/last-word.webp",
  "bees-knees": "/images/cocktails/bees-knees.webp",
  "mint-julep": "/images/cocktails/mint-julep.webp",
  // 伏特加系（已集齐）
  "moscow-mule": "/images/cocktails/moscow-mule.webp",
  "espresso-martini": "/images/cocktails/espresso-martini.webp",
  "bloody-mary": "/images/cocktails/bloody-mary.webp",
  "vodka-martini": "/images/cocktails/vodka-martini.webp",
  // 朗姆系
  "cuba-libre": "/images/cocktails/cuba-libre.webp",
  daiquiri: "/images/cocktails/daiquiri.webp",
  "pina-colada": "/images/cocktails/pina-colada.webp",
  "mai-tai": "/images/cocktails/mai-tai.webp",
  "dark-n-stormy": "/images/cocktails/dark-n-stormy.webp",
  // 特基拉系
  margarita: "/images/cocktails/margarita.webp",
  "tommys-margarita": "/images/cocktails/tommys-margarita.webp",
  paloma: "/images/cocktails/paloma.webp",
  "tequila-sunrise": "/images/cocktails/tequila-sunrise.webp",
  hemingway: "/images/cocktails/hemingway.webp",
  "ranch-water": "/images/cocktails/ranch-water.webp",
  "el-diablo": "/images/cocktails/el-diablo.webp",
  // 利口与开胃
  "aperol-spritz": "/images/cocktails/aperol-spritz.webp",
  americano: "/images/cocktails/americano.webp",
  sbagliato: "/images/cocktails/sbagliato.webp",
  "amaretto-sour": "/images/cocktails/amaretto-sour.webp",
  // 干邑 / 白兰地系
  sidecar: "/images/cocktails/sidecar.webp",
  "brandy-alexander": "/images/cocktails/brandy-alexander.webp",
  "pisco-sour": "/images/cocktails/pisco-sour.webp",
  "between-the-sheets": "/images/cocktails/between-the-sheets.webp",
  "kir-royale": "/images/cocktails/kir-royale.webp",
  // 无酒精系
  "virgin-mojito": "/images/cocktails/virgin-mojito.webp",
  "shirley-temple": "/images/cocktails/shirley-temple.webp",
  "citrus-highball": "/images/cocktails/citrus-highball.webp",
  "cucumber-tonic": "/images/cocktails/cucumber-tonic.webp",
  "coconut-cooler": "/images/cocktails/coconut-cooler.webp",
};

export function drinkArt(id: string): string | undefined {
  return DRINK_ART[id];
}
