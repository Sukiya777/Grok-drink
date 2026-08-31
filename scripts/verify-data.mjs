// 酒谱数据自检：改完 src/lib/cocktails.ts 后跑一下，防止字段漏填、别名写错、换算退化。
// 用法：node --experimental-strip-types scripts/verify-data.mjs
import {
  CATEGORIES,
  COCKTAILS,
  INGREDIENT_ALIAS,
  PANTRY_OPTIONS,
  matchByPantry,
  normalizeIngredient,
  sortCocktails,
  toImperial,
} from "../src/lib/cocktails.ts";

let fail = 0;
const ok = (cond, msg) => {
  if (!cond) {
    fail++;
    console.log("  FAIL", msg);
  }
};

// 1. 每杯酒的必填字段与取值范围
for (const c of COCKTAILS) {
  ok(typeof c.abv === "number" && c.abv >= 0 && c.abv <= 45, `${c.id} abv 越界: ${c.abv}`);
  ok(c.sweet >= 1 && c.sweet <= 5, `${c.id} sweet 越界: ${c.sweet}`);
  ok(CATEGORIES.some((k) => k.id === c.category), `${c.id} 未知大类 ${c.category}`);
  ok(c.ingredients.length > 0 && c.steps.length > 0, `${c.id} 缺材料或步骤`);
  if (c.category === "na") ok(c.abv === 0, `${c.id} 标无酒精却有 ${c.abv}%`);
}

// 2. id 唯一
const ids = COCKTAILS.map((c) => c.id);
ok(new Set(ids).size === ids.length, "存在重复 id");

// 3. 别名表两侧都必须是归一后的形式（防止手滑写成 "金酒 " 这种带空格的键）
for (const [from, to] of Object.entries(INGREDIENT_ALIAS)) {
  ok(normalizeIngredient(from) === to, `别名表不自洽: ${from} -> ${to}`);
}
// 循环别名检测
for (const [from, to] of Object.entries(INGREDIENT_ALIAS)) {
  ok(!(to in INGREDIENT_ALIAS), `别名链过长: ${from} -> ${to} -> ${INGREDIENT_ALIAS[to]}`);
}

// 4. 苦艾酒(absinthe) 与 味美辛(vermouth) 绝不能合并
ok(
  normalizeIngredient("苦艾酒") !== normalizeIngredient("干苦艾酒"),
  "absinthe 与 dry vermouth 被错误合并",
);

// 5. 盎司换算：常见刻度必须落在 ¼ 上，且不能出现 NaN
const expect = { 7.5: "¼ oz", 15: "½ oz", 22.5: "¾ oz", 30: "1 oz", 45: "1½ oz", 60: "2 oz" };
for (const [ml, want] of Object.entries(expect)) {
  ok(toImperial(Number(ml)) === want, `${ml}ml 应为 ${want}，实际 ${toImperial(Number(ml))}`);
}
for (const ml of [1, 2.5, 5, 7.5, 10, 100, 240]) {
  ok(!/NaN|undefined|^\s/.test(toImperial(ml)), `换算退化: ${ml}ml -> ${toImperial(ml)}`);
}

// 6. 吧台匹配：经典组合应零缺口
const gt = matchByPantry(["金酒", "汤力水"]).find((m) => m.cocktail.id === "gin-tonic");
ok(gt && gt.missing.length === 0, "金酒+汤力水 应能调金汤力");
const neg = matchByPantry(["金酒", "汤力水"]).find((m) => m.cocktail.id === "negroni");
ok(neg.missing.length === 2, `内格罗尼应缺 2 样，实际 ${neg.missing.length}`);
// 苦精不进缺口：勾选其余材料后，古典鸡尾酒应“现在就能调”
const of = matchByPantry(["波本威士忌", "糖浆（1:1）"]).find((m) => m.cocktail.id === "old-fashioned");
ok(of && of.missing.length === 0, `古典鸡尾酒不应因苦精计缺，实际缺 ${of?.missing.join("、") || 0} 样`);

// 7. 库存清单里不该混进调料/装饰
for (const bad of ["盐", "伍斯特酱", "塔巴斯科", "安格斯特拉苦精"]) {
  ok(!PANTRY_OPTIONS.includes(bad), `PANTRY_OPTIONS 仍含 ${bad}`);
}

// 8. 排序单调
const byAbv = sortCocktails(COCKTAILS, "abv-desc");
ok(byAbv[0].abv >= byAbv.at(-1).abv, "度数排序失效");

console.log(`酒谱 ${COCKTAILS.length} 杯 · 可勾选材料 ${PANTRY_OPTIONS.length} 种`);
console.log(fail === 0 ? "数据自检通过 ✓" : `数据自检 ${fail} 条失败 ✗`);
process.exit(fail ? 1 : 0);
