import { ChevronRight, Heart } from "lucide-react";
import {
  GLASS_LABEL,
  METHOD_LABEL,
  abvLabel,
  categoryColor,
  type Cocktail,
} from "@/lib/cocktails";
import { cn } from "@/lib/utils";
import { GlassMark } from "@/components/glass-mark";
import { drinkArt } from "@/lib/drink-art";
import { artZoomHandler } from "@/lib/art-view";

type Props = {
  cocktails: Cocktail[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  favorites: string[];
  compact?: boolean;
  /** 吧台模式：按“还缺几样”分组，并显示缺什么 */
  grouped?: boolean;
  missingByDrink?: Map<string, string[]>;
  query?: string;
  onToggleSave?: (id: string) => void;
  emptyHint?: string;
};

export function CocktailList({
  cocktails,
  selectedId,
  onSelect,
  favorites,
  compact,
  grouped,
  missingByDrink,
  query = "",
  onToggleSave,
  emptyHint = "换个关键词，或回到大类再看一遍酒单。",
}: Props) {
  if (cocktails.length === 0) {
    return (
      <div className="px-6 py-16 text-center">
        <p className="font-display text-xl text-fg">这里还没有酒</p>
        <p className="mt-2 text-sm text-muted">{emptyHint}</p>
      </div>
    );
  }

  if (!grouped) {
    return (
      <ol
        className={cn(
          "grid gap-3 p-4 md:p-5",
          compact ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2",
        )}
      >
        {cocktails.map((c, i) => (
          <DrinkCard
            key={c.id}
            c={c}
            index={i}
            selected={c.id === selectedId}
            saved={favorites.includes(c.id)}
            onSelect={onSelect}
            onToggleSave={onToggleSave}
            query={query}
          />
        ))}
      </ol>
    );
  }

  // 吧台模式：0 样 = 现在就能调，其余按缺口分组
  const groups = new Map<number, Cocktail[]>();
  cocktails.forEach((c, i) => {
    const n = missingByDrink?.get(c.id)?.length ?? 0;
    const key = n === 0 ? 0 : n >= 4 ? 4 : n;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(c);
    void i;
  });

  return (
    <div className="pb-5">
      {[...groups.entries()]
        .sort((a, b) => a[0] - b[0])
        .map(([missing, items]) => (
          <section key={missing} aria-label={groupTitle(missing)}>
            <h3 className="sticky top-0 z-10 bg-bg/92 px-4 py-2 text-xs tracking-mark text-subtle backdrop-blur md:px-5">
              {groupTitle(missing)}
              <span className="ml-1.5 tabular-nums text-fg/70">{items.length}</span>
            </h3>
            <ol className="grid gap-3 px-4 pb-2 md:px-5">
              {items.map((c) => (
                <DrinkCard
                  key={c.id}
                  c={c}
                  selected={c.id === selectedId}
                  saved={favorites.includes(c.id)}
                  onSelect={onSelect}
                  onToggleSave={onToggleSave}
                  query={query}
                  missing={missingByDrink?.get(c.id)}
                />
              ))}
            </ol>
          </section>
        ))}
    </div>
  );
}

function groupTitle(missing: number) {
  if (missing === 0) return "现在就能调";
  if (missing >= 4) return "缺 4 样以上";
  return `只缺 ${missing} 样`;
}

function DrinkCard({
  c,
  index,
  selected,
  saved,
  onSelect,
  onToggleSave,
  query,
  missing,
}: {
  c: Cocktail;
  index?: number;
  selected: boolean;
  saved: boolean;
  onSelect: (id: string) => void;
  onToggleSave?: (id: string) => void;
  query: string;
  missing?: string[];
}) {
  const tint = categoryColor(c.category);
  return (
    <li className="menu-enter">
      <div
        className={cn(
          "cocktail-plate group relative flex min-h-28 items-stretch gap-4 rounded-xl p-4 text-left",
          selected && "text-fg",
        )}
        data-selected={selected ? "true" : undefined}
      >
        <span
          aria-hidden="true"
          className="absolute left-0 top-4 bottom-4 w-0.5 rounded-full opacity-45"
          style={{ background: tint }}
        />
        <button
          type="button"
          data-card="true"
          onClick={() => onSelect(c.id)}
          className="flex min-w-0 flex-1 items-stretch gap-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 rounded-md"
        >
          <span className="flex w-10 shrink-0 flex-col items-center justify-center gap-2">
            {index === undefined ? null : (
              <span className="font-display text-xs tabular-nums text-subtle">
                {String(index + 1).padStart(2, "0")}
              </span>
            )}
            <GlassMark glass={c.glass} className="h-10 w-8" liquid={tint} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="flex items-start justify-between gap-2">
              <span className="font-display text-lg leading-snug md:text-xl">
                <Highlight text={c.name} query={query} />
              </span>
              <ChevronRight
                className="plate-go mt-1 size-4 shrink-0 text-muted"
                strokeWidth={1.75}
              />
            </span>
            <span className="mt-0.5 block text-xs tracking-wide text-muted">
              <Highlight text={c.nameEn} query={query} />
            </span>
            <span className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-subtle">
              <span className="chip">{abvLabel(c.abv)}</span>
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
            {missing && missing.length > 0 ? (
              <span className="mt-2 block truncate text-xs text-muted">
                还缺：{missing.slice(0, 3).join("、")}
                {missing.length > 3 ? ` 等 ${missing.length} 样` : ""}
              </span>
            ) : missing ? (
              <span className="mt-2 block text-xs text-ok">材料齐了</span>
            ) : null}
          </span>
          {drinkArt(c.id) ? (
            <img
              src={drinkArt(c.id)}
              alt={`${c.name}成品插画`}
              title="点击看大图"
              loading="lazy"
              decoding="async"
              width={800}
              height={800}
              onClick={artZoomHandler(drinkArt(c.id)!, `${c.name} ${c.nameEn}`)}
              className="size-16 shrink-0 self-center cursor-zoom-in rounded-lg object-cover ring-1 ring-line transition-transform duration-200 hover:scale-[1.04] active:scale-95 md:size-20"
            />
          ) : null}
        </button>

        {onToggleSave ? (
          <button
            type="button"
            onClick={() => onToggleSave(c.id)}
            aria-pressed={saved}
            aria-label={saved ? `取消收藏 ${c.name}` : `收藏 ${c.name}`}
            title={saved ? `取消收藏 ${c.name}` : `收藏 ${c.name}`}
            className="absolute right-2.5 top-2.5 rounded-full p-1.5 text-subtle opacity-0 transition-opacity hover:text-fg focus-visible:opacity-100 group-hover:opacity-100"
          >
            <Heart className={cn("size-4", saved && "heart-pop fill-current text-fg")} />
          </button>
        ) : null}
      </div>
    </li>
  );
}

/** 搜索命中高亮：忽略大小写，按整段包含处理。 */
function Highlight({ text, query }: { text: string; query: string }) {
  const q = query.trim();
  if (!q) return <>{text}</>;
  const i = text.toLowerCase().indexOf(q.toLowerCase());
  if (i === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, i)}
      <mark className="rounded-xs bg-accent/25 px-0.5 text-fg">
        {text.slice(i, i + q.length)}
      </mark>
      {text.slice(i + q.length)}
    </>
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
