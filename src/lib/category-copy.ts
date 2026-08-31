import { CATEGORY_BY_ID, type CategoryId } from "@/lib/cocktails";

export type RailIdInput = "all" | "fav" | "bar" | CategoryId;

/** 每个视图的标题与说明文案。 */
export function categoryCopy(id: RailIdInput, favCount: number) {
  if (id === "all") {
    return {
      title: "酒单",
      en: "The List",
      blurb: "先选基酒大类，再点开一杯，看材料与步骤。",
    };
  }
  if (id === "fav") {
    return {
      title: "收藏",
      en: "Saved",
      blurb:
        favCount === 0
          ? "点开配方后可收藏，方便下次直接调。"
          : `已收 ${favCount} 杯，随时从这里打开。`,
    };
  }
  if (id === "bar") {
    return { title: "我的吧台", en: "My Bar", blurb: "按已勾选的材料筛酒。" };
  }
  const cat = CATEGORY_BY_ID[id];
  return { title: cat.name, en: cat.nameEn, blurb: cat.blurb };
}
