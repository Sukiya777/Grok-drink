import { ChevronRight } from "lucide-react";
import { CATEGORY_BY_ID, GLASS_LABEL, METHOD_LABEL, type Cocktail } from "@/lib/cocktails";
import { cn } from "@/lib/utils";
import { GlassMark } from "@/components/glass-mark";

type Props = {
  cocktails: Cocktail[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  favorites: string[];
  compact?: boolean;
};

export function CocktailList({
  cocktails,
  selectedId,
  onSelect,
  favorites,
  compact,
}: Props) {
  if (cocktails.length === 0) {
    return (
      <div className="px-6 py-16 text-center">
        <p className="font-display text-xl text-fg">没有找到这杯酒</p>
        <p className="mt-2 text-sm text-muted">换个关键词，或回到大类再看一遍酒单。</p>
      </div>
    );
  }

  return (
    <ol
      className={cn(
        "grid gap-3 p-4 md:p-5",
        compact ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2",
      )}
    >
      {cocktails.map((c, i) => {
        const selected = c.id === selectedId;
        const saved = favorites.includes(c.id);
        return (
          <li key={c.id} className="menu-enter">
            <button
              type="button"
              onClick={() => onSelect(c.id)}
              data-selected={selected ? "true" : undefined}
              className={cn(
                "cocktail-plate pressable flex min-h-28 w-full items-stretch gap-4 rounded-xl p-4 text-left",
                selected ? "text-fg" : "text-fg",
              )}
            >
              <span className="flex w-10 shrink-0 flex-col items-center justify-center gap-2">
                <span className="font-display text-xs tabular-nums text-subtle">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <GlassMark glass={c.glass} className="h-10 w-8 text-accent" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-start justify-between gap-2">
                  <span className="font-display text-lg leading-snug md:text-xl">
                    {c.name}
                  </span>
                  <ChevronRight
                    className="plate-go mt-1 size-4 shrink-0 text-muted"
                    strokeWidth={1.75}
                  />
                </span>
                <span className="mt-0.5 block text-xs tracking-wide text-muted">
                  {c.nameEn}
                </span>
                <span className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-subtle">
                  <span>{c.base}</span>
                  <span aria-hidden="true">·</span>
                  <span>{METHOD_LABEL[c.method]}</span>
                  <span aria-hidden="true">·</span>
                  <span>{GLASS_LABEL[c.glass]}</span>
                  <span aria-hidden="true">·</span>
                  <span className="tabular-nums">{c.minutes} 分钟</span>
                  {saved ? (
                    <>
                      <span aria-hidden="true">·</span>
                      <span className="text-fg">已收藏</span>
                    </>
                  ) : null}
                </span>
              </span>
            </button>
          </li>
        );
      })}
    </ol>
  );
}

export function CategoryIntro({
  title,
  en,
  blurb,
}: {
  title: string;
  en: string;
  blurb: string;
}) {
  return (
    <header className="px-4 pb-1 pt-5 md:px-6">
      <p className="text-xs tracking-mark text-subtle uppercase">{en}</p>
      <h2 className="mt-1 font-display text-3xl leading-tight text-fg md:text-4xl">
        {title}
      </h2>
      <p className="mt-2 max-w-prose text-sm leading-normal text-muted">{blurb}</p>
    </header>
  );
}

export function categoryCopy(
  id: "all" | "fav" | keyof typeof CATEGORY_BY_ID,
  favCount: number,
) {
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
  const cat = CATEGORY_BY_ID[id];
  return { title: cat.name, en: cat.nameEn, blurb: cat.blurb };
}
