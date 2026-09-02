/* 每杯插画的“酒液色”：色相分桶取最大有色面积（液体）的均值，向产品墨色收 15%。
 * 插画加载完成前，卡片/横幅以此色作占位底，图到时淡入盖上去。
 * 新增插画后重新生成：python3 scripts/gen-art-veil.py（勿手改单条目）。 */
export const DEFAULT_VEIL = "#3a352e";
export const ART_VEIL: Record<string, string> = {
  "old-fashioned": "#825433",  // 桶0° 占比60%
  "negroni": "#975036",  // 桶0° 占比86%
  "cosmopolitan": "#ba988b",  // 桶0° 占比80%
  "mojito": "#71795e",  // 桶60° 占比67%
  "manhattan": "#774248",  // 桶330° 占比91%
  "whiskey-sour": "#bb9050",  // 桶30° 占比89%
  "sazerac": "#8a704a",  // 桶30° 占比62%
  "penicillin": "#c3a256",  // 桶30° 占比85%
  "boulevardier": "#af513f",  // 桶0° 占比84%
  "new-york-sour": "#c09e6d",  // 桶30° 占比71%
  "vieux-carre": "#975e48",  // 桶0° 占比99%
  "white-russian": "#b69f82",  // 桶30° 占比87%
  "martini": "#a99b6b",  // 桶30° 占比95%
  "gin-tonic": "#72745b",  // 桶60° 占比49%
  "tom-collins": "#afa781",  // 桶30° 占比93%
  "aviation": "#8285a1",  // 桶210° 占比51%
  "french-75": "#b1a27f",  // 桶30° 占比98%
  "last-word": "#a2a67b",  // 桶60° 占比85%
  "bees-knees": "#ac9a6b",  // 桶30° 占比98%
  "sunset-grove": "#d29c89",  // 桶0° 占比98%
  "mint-julep": "#a49e82",  // 桶30° 占比83%
  "moscow-mule": "#af9570",  // 桶30° 占比73%
  "espresso-martini": "#b1997a",  // 桶30° 占比68%
  "bloody-mary": "#923d2e",  // 桶0° 占比74%
  "vodka-martini": "#7c8361",  // 桶60° 占比92%
  "cuba-libre": "#734f3a",  // 桶0° 占比62%
  "daiquiri": "#82896e",  // 桶60° 占比89%
  "pina-colada": "#b8ac93",  // 桶30° 占比46%
  "mai-tai": "#b09662",  // 桶30° 占比94%
  "dark-n-stormy": "#b7976b",  // 桶30° 占比60%
  "margarita": "#b3b88d",  // 桶60° 占比62%
  "tommys-margarita": "#acb085",  // 桶60° 占比97%
  "paloma": "#cc8a7c",  // 桶0° 占比98%
  "tequila-sunrise": "#d4a44e",  // 桶30° 占比71%
  "hemingway": "#cea399",  // 桶0° 占比83%
  "ranch-water": "#858b6c",  // 桶60° 占比49%
  "el-diablo": "#986456",  // 桶0° 占比60%
  "aperol-spritz": "#c87b45",  // 桶0° 占比65%
  "americano": "#b66858",  // 桶0° 占比61%
  "sbagliato": "#c3684b",  // 桶0° 占比93%
  "amaretto-sour": "#c49b6b",  // 桶30° 占比50%
  "sidecar": "#c59d69",  // 桶30° 占比59%
  "brandy-alexander": "#b4a48c",  // 桶30° 占比98%
  "pisco-sour": "#ccbe8c",  // 桶30° 占比90%
  "between-the-sheets": "#c8a97b",  // 桶30° 占比89%
  "kir-royale": "#5c4252",  // 桶300° 占比67%
  "virgin-mojito": "#637459",  // 桶90° 占比95%
  "shirley-temple": "#ba998c",  // 桶0° 占比47%
  "citrus-highball": "#caac86",  // 桶30° 占比76%
  "cucumber-tonic": "#607458",  // 桶90° 占比46%
  "coconut-cooler": "#d2c596",  // 桶30° 占比82%
};

export function artVeil(id: string): string {
  return ART_VEIL[id] ?? DEFAULT_VEIL;
}
