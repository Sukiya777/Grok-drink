import { useEffect, useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import {
  CATEGORY_BY_ID,
  COCKTAIL_BY_ID,
  cocktailsIn,
  searchCocktails,
  todaysCocktail,
} from "@/lib/cocktails";
import { readFavorites, writeFavorites } from "@/lib/favorites";
import { CategoryRail, type RailId } from "@/components/category-rail";
import {
  CategoryIntro,
  CocktailList,
  categoryCopy,
} from "@/components/cocktail-list";
import { RecipePanel } from "@/components/recipe-panel";
import { cn } from "@/lib/utils";

export function AppShell() {
  const [rail, setRail] = useState<RailId>("whiskey");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [favorites, setFavorites] = useState<string[]>([]);
  const featured = useMemo(() => todaysCocktail(), []);

  useEffect(() => {
    setFavorites(readFavorites());
  }, []);

  const pool = useMemo(() => {
    const base = cocktailsIn(rail);
    if (rail === "fav") return base.filter((c) => favorites.includes(c.id));
    return base;
  }, [rail, favorites]);

  const list = useMemo(() => searchCocktails(query, pool), [query, pool]);
  const selected = selectedId ? (COCKTAIL_BY_ID[selectedId] ?? null) : null;
  const intro = categoryCopy(rail, favorites.length);

  function selectRail(id: RailId) {
    setRail(id);
    setSelectedId(null);
    setQuery("");
  }

  function toggleSave(id: string) {
    setFavorites((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      writeFavorites(next);
      return next;
    });
  }

  return (
    <div className="app-shell flex h-dvh flex-col overflow-hidden bg-bg text-fg md:flex-row">
      <aside
        className={cn(
          "border-b border-line md:flex md:w-rail md:shrink-0 md:flex-col md:border-b-0 md:border-r",
          selected && "hidden md:flex",
        )}
      >
        <div className="flex items-center justify-between px-4 py-4 md:px-5">
          <div>
            <p className="font-display text-2xl leading-none tracking-tight">夜酌</p>
            <p className="mt-1 text-xs tracking-mark text-subtle">NIGHT POUR</p>
          </div>
        </div>
        <CategoryRail active={rail} onSelect={selectRail} favCount={favorites.length} />
      </aside>

      <div className="flex min-h-0 min-w-0 flex-1">
        <section
          className={cn(
            "flex min-h-0 min-w-0 flex-1 flex-col",
            selected && "hidden lg:flex",
          )}
        >
          <div className="border-b border-line px-4 py-3 md:px-6">
            <label className="search-field flex h-11 items-center gap-2 rounded-md bg-elevated px-3">
              <Search className="size-4 shrink-0 text-subtle" strokeWidth={1.75} />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="搜酒名或材料"
                className="h-full w-full bg-transparent text-sm text-fg placeholder:text-subtle focus:outline-none"
              />
              {query ? (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="text-subtle hover:text-fg"
                  aria-label="清除搜索"
                >
                  <X className="size-4" />
                </button>
              ) : null}
            </label>
          </div>

          {rail === "all" && !query ? (
            <button
              type="button"
              onClick={() => {
                setRail(featured.category);
                setSelectedId(featured.id);
              }}
              className="pressable cocktail-plate mx-4 mt-3 flex items-center justify-between gap-4 rounded-xl p-4 text-left md:mx-5"
            >
              <span>
                <span className="text-xs tracking-mark text-subtle">今日特调</span>
                <span className="mt-1 block font-display text-xl text-fg">
                  {featured.name}
                </span>
                <span className="text-xs text-muted">{featured.nameEn}</span>
              </span>
              <span className="text-xs text-subtle">
                {CATEGORY_BY_ID[featured.category].name}
              </span>
            </button>
          ) : null}

          <div className="min-h-0 flex-1 overflow-y-auto">
            <CategoryIntro title={intro.title} en={intro.en} blurb={intro.blurb} />
            <CocktailList
              key={rail + query}
              cocktails={list}
              selectedId={selectedId}
              onSelect={setSelectedId}
              favorites={favorites}
              compact={Boolean(selected)}
            />
          </div>
        </section>

        {selected ? (
          <section className="flex min-h-0 w-full min-w-0 flex-col border-line lg:w-recipe lg:shrink-0 lg:border-l">
            <RecipePanel
              key={selected.id}
              cocktail={selected}
              saved={favorites.includes(selected.id)}
              onToggleSave={() => toggleSave(selected.id)}
              onClose={() => setSelectedId(null)}
            />
          </section>
        ) : (
          <aside className="hidden w-recipe shrink-0 flex-col justify-center border-l border-line px-8 lg:flex">
            <p className="text-xs tracking-mark text-subtle">HOW TO</p>
            <p className="mt-3 font-display text-2xl leading-snug text-fg">
              点开一杯，看材料与步骤
            </p>
            <p className="mt-3 text-sm leading-normal text-muted">
              左侧是基酒大类。中间是这一类下的酒。配方只保留杯具、份量与手法。
            </p>
          </aside>
        )}
      </div>
    </div>
  );
}
