import {
  useCallback,
  useDeferredValue,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Sparkles, Wine } from "lucide-react";
import {
  CATEGORY_BY_ID,
  COCKTAIL_BY_ID,
  cocktailsIn,
  matchByPantry,
  searchCocktails,
  sortCocktails,
  todaysCocktail,
  type CategoryId,
  type Cocktail,
  type SortId,
} from "@/lib/cocktails";
import {
  readBarStock,
  readFavorites,
  readPreferences,
  writeBarStock,
  writeFavorites,
  writePreferences,
} from "@/lib/favorites";
import { CategoryRail, type RailId } from "@/components/category-rail";
import { CategoryIntro, CocktailList } from "@/components/cocktail-list";
import { categoryCopy } from "@/lib/category-copy";
import { PantryPanel } from "@/components/pantry-panel";
import { RecipePanel } from "@/components/recipe-panel";
import { Toaster } from "@/components/toaster";
import { ArtLightbox } from "@/components/art-lightbox";
import { haptic } from "@/lib/haptics";
import { Toolbar } from "@/components/toolbar";
import { cn } from "@/lib/utils";

/** 侧栏 → 大类；`bar` 是“按我家材料筛酒”。 */
const RAIL_TO_CATEGORY = (rail: RailId): CategoryId | "all" | "fav" =>
  rail === "all" || rail === "fav" ? rail : (rail as CategoryId);

/**
 * 分享/刷新后恢复视图：`#/<大类>/<酒>`，例如 `#/gin/negroni`。
 * 只写 hash，不用路由库——纯静态站部署时不需要额外配置。
 */
function parseHash(hash: string): { rail: RailId; drink: string | null } | null {
  const parts = hash.replace(/^#\/?/, "").split("/").filter(Boolean);
  if (!parts.length) return null;
  const rail = decodeURIComponent(parts[0]) as RailId;
  const known: RailId[] = [
    "all",
    "fav",
    "bar",
    ...(Object.keys(CATEGORY_BY_ID) as CategoryId[]),
  ];
  if (!known.includes(rail)) return null;
  const drink = parts[1] ? decodeURIComponent(parts[1]) : null;
  return { rail, drink: drink && COCKTAIL_BY_ID[drink] ? drink : null };
}

function buildHash(rail: RailId, drink: string | null) {
  return `#/${encodeURIComponent(rail)}${drink ? `/${encodeURIComponent(drink)}` : ""}`;
}

export function AppShell() {
  const initial = useMemo(() => parseHash(window.location.hash), []);
  const [rail, setRail] = useState<RailId>(initial?.rail ?? "whiskey");
  const [selectedId, setSelectedId] = useState<string | null>(initial?.drink ?? null);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortId>("menu");
  const [maxMissing, setMaxMissing] = useState(1);
  const [favorites, setFavorites] = useState<string[]>(() => readFavorites());
  const [barStock, setBarStock] = useState<string[]>(() => readBarStock());
  const [prefs, setPrefs] = useState(() => readPreferences());
  const searchRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const featured = useMemo(() => todaysCocktail(), []);
  const deferredQuery = useDeferredValue(query);

  // 侧栏「我的吧台」要常驻显示可调杯数，所以不限当前视图
  const matched = useMemo(() => matchByPantry(barStock), [barStock]);

  const list = useMemo(() => {
    let pool: Cocktail[];
    if (rail === "bar") {
      pool = matched
        .filter((m) => m.missing.length <= maxMissing)
        .map((m) => m.cocktail);
    } else if (rail === "fav") {
      pool = cocktailsIn("fav").filter((c) => favorites.includes(c.id));
    } else {
      pool = cocktailsIn(RAIL_TO_CATEGORY(rail));
    }
    return sortCocktails(searchCocktails(deferredQuery, pool), sort);
  }, [rail, matched, maxMissing, favorites, deferredQuery, sort]);

  /** 吧台模式下按“还缺几样”分组，供列表插小标题 */
  const missingByDrink = useMemo(() => {
    const map = new Map<string, string[]>();
    if (rail === "bar") {
      for (const m of matched) map.set(m.cocktail.id, m.missing);
    }
    return map;
  }, [rail, matched]);

  const selected = selectedId ? (COCKTAIL_BY_ID[selectedId] ?? null) : null;
  const intro = categoryCopy(rail, favorites.length);

  // 视图状态同步到地址栏，方便刷新和分享
  useEffect(() => {
    const next = buildHash(rail, selectedId);
    if (window.location.hash !== next) {
      window.history.replaceState(null, "", next);
    }
  }, [rail, selectedId]);

  useEffect(() => {
    const onHashChange = () => {
      const parsed = parseHash(window.location.hash);
      if (!parsed) return;
      setRail(parsed.rail);
      setSelectedId(parsed.drink);
    };
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  // `/` 聚焦搜索，Esc 清空或收起配方
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const typing =
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable);
      if (e.key === "/" && !typing) {
        e.preventDefault();
        searchRef.current?.focus();
      } else if (e.key === "Escape" && typing) {
        searchRef.current?.blur();
      } else if (e.key === "Escape" && !typing && selectedId) {
        setSelectedId(null);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selectedId]);

  const selectRail = useCallback((id: RailId) => {
    setRail(id);
    setSelectedId(null);
    setQuery("");
  }, []);

  const toggleSave = useCallback((id: string) => {
    haptic(12);
    setFavorites((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      writeFavorites(next);
      return next;
    });
  }, []);

  const toggleBarStock = useCallback((name: string) => {
    haptic(10);
    setBarStock((prev) => {
      const next = prev.includes(name)
        ? prev.filter((x) => x !== name)
        : [...prev, name];
      writeBarStock(next);
      return next;
    });
  }, []);

  const updatePrefs = useCallback((patch: Partial<typeof prefs>) => {
    setPrefs((prev) => {
      const next = { ...prev, ...patch };
      writePreferences(next);
      return next;
    });
  }, []);

  /** 把某个滚动容器拨回顶部；scrollTo 在个别环境缺失，未捕获会让整棵树崩溃白屏。 */
  const scrollTop = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    if (typeof el.scrollTo === "function") {
      try {
        el.scrollTo({ top: 0 });
      } catch {
        el.scrollTop = 0;
      }
    } else {
      el.scrollTop = 0;
    }
  };

  // 换酒时详情区回到顶部；切大类时酒单回到顶部
  useEffect(() => {
    scrollTop("recipe-scroll");
  }, [selectedId]);

  useEffect(() => {
    scrollTop("cocktail-scroll");
  }, [rail]);

  return (
    <div className="app-shell flex h-dvh flex-col overflow-hidden bg-bg text-fg md:flex-row">
      <button
        type="button"
        onClick={() => {
          setSelectedId(null);
          listRef.current
            ?.querySelector<HTMLButtonElement>("[data-card='true']")
            ?.focus();
        }}
        className="skip-link"
      >
        跳到酒单
      </button>

      <aside className="flex shrink-0 flex-col border-b border-line md:w-rail md:border-b-0 md:border-r">
        <div className="px-4 py-4 md:px-5">
          <p className="font-display text-2xl leading-none tracking-tight">夜酌</p>
          <p className="mt-1 text-xs tracking-mark text-subtle">NIGHT POUR</p>
        </div>
        <CategoryRail
          active={rail}
          onSelect={selectRail}
          favCount={favorites.length}
          barReady={matched.filter((m) => m.missing.length === 0).length}
        />
        <footer className="hidden px-5 py-4 text-xs leading-relaxed text-subtle md:block">
          共 {list.length} 杯 · 按 <kbd className="kbd">/</kbd> 搜索
        </footer>
      </aside>

      <div className="flex min-h-0 min-w-0 flex-1">
        <section
          id="cocktail-list"
          aria-label="酒单"
          className={cn(
            "flex min-h-0 min-w-0 flex-1 flex-col",
            selected && "hidden lg:flex",
          )}
        >
          <Toolbar
            rail={rail}
            query={query}
            onQuery={setQuery}
            sort={sort}
            onSort={setSort}
            maxMissing={maxMissing}
            onMaxMissing={setMaxMissing}
            searchRef={searchRef}
            stockCount={barStock.length}
            onFocusList={() =>
              listRef.current?.querySelector<HTMLButtonElement>("[data-card='true']")?.focus()
            }
          />

          <div
            id="cocktail-scroll"
            ref={listRef}
            className="min-h-0 flex-1 overflow-y-auto"
            onKeyDown={(e) => {
              if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
              const cards = Array.from(
                e.currentTarget.querySelectorAll<HTMLButtonElement>("[data-card='true']"),
              );
              const at = cards.indexOf(document.activeElement as HTMLButtonElement);
              if (at === -1) return;
              e.preventDefault();
              const next = cards[Math.min(cards.length - 1, Math.max(0, at + (e.key === "ArrowDown" ? 1 : -1)))];
              next?.focus();
            }}
          >
            {rail === "bar" ? (
              <PantryPanel
                stock={barStock}
                onToggle={toggleBarStock}
                onClear={() => setBarStock([])}
                readyCount={matched.filter((m) => m.missing.length === 0).length}
              />
            ) : null}
            {rail === "all" && !deferredQuery ? (
              <button
                type="button"
                onClick={() => {
                  setRail(featured.category);
                  setSelectedId(featured.id);
                }}
                className="pressable cocktail-plate mx-4 mt-3 flex w-[calc(100%-2rem)] items-center justify-between gap-4 rounded-xl p-4 text-left md:mx-5 md:w-[calc(100%-2.5rem)]"
              >
                <span>
                  <span className="flex items-center gap-1.5 text-xs tracking-mark text-subtle">
                    <Sparkles className="size-3.5" strokeWidth={1.75} />
                    今日特调
                  </span>
                  <span className="mt-1 block font-display text-xl text-fg">
                    {featured.name}
                  </span>
                  <span className="text-xs text-muted">{featured.nameEn}</span>
                </span>
                <span className="flex items-center gap-2 text-xs text-subtle">
                  <Wine className="size-3.5" strokeWidth={1.75} />
                  {CATEGORY_BY_ID[featured.category].name}
                </span>
              </button>
            ) : null}
            {rail !== "bar" ? (
              <CategoryIntro title={intro.title} en={intro.en} blurb={intro.blurb} />
            ) : null}
            <CocktailList
              cocktails={list}
              selectedId={selectedId}
              onSelect={setSelectedId}
              favorites={favorites}
              compact={Boolean(selected)}
              grouped={rail === "bar"}
              missingByDrink={missingByDrink}
              query={deferredQuery}
              onToggleSave={toggleSave}
              emptyHint={
                rail === "bar"
                  ? barStock.length === 0
                    ? "先在上方勾选家里已有的材料。"
                    : "放宽「只缺几样」，或多备一两样基酒。"
                  : rail === "fav"
                    ? "点开配方右上角的心形即可收藏。"
                    : "换个关键词，或回到大类再看一遍酒单。"
              }
            />
          </div>
        </section>

        {selected ? (
          <section
            id="recipe-panel"
            aria-label={`${selected.name} 配方`}
            className="flex min-h-0 w-full min-w-0 flex-col border-line lg:w-recipe lg:shrink-0 lg:border-l"
          >
            <RecipePanel
              key={selected.id}
              cocktail={selected}
              saved={favorites.includes(selected.id)}
              missing={missingByDrink.get(selected.id)}
              servings={prefs.servings}
              measure={prefs.measure}
              onServings={(n) => updatePrefs({ servings: n })}
              onMeasure={(m) => updatePrefs({ measure: m })}
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
              左侧是基酒大类，中间是这一类下的酒。配方只保留杯具、份量与手法。
            </p>
            <ul className="mt-5 space-y-2 text-sm text-subtle">
              <li>
                <kbd className="kbd">/</kbd> 搜酒名或材料
              </li>
              <li>
                <kbd className="kbd">↑</kbd>
                <kbd className="kbd">↓</kbd> 在酒单间移动，<kbd className="kbd">Enter</kbd> 打开
              </li>
              <li>
                <kbd className="kbd">Esc</kbd> 关闭配方
              </li>
            </ul>
          </aside>
        )}
      </div>
      <Toaster />
      <ArtLightbox />
    </div>
  );
}
