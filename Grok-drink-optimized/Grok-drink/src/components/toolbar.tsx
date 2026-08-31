import { type RefObject } from "react";
import { Search, X } from "lucide-react";
import { SORT_LABEL, type SortId } from "@/lib/cocktails";
import { cn } from "@/lib/utils";

type Props = {
  rail: string;
  query: string;
  onQuery: (q: string) => void;
  sort: SortId;
  onSort: (s: SortId) => void;
  maxMissing: number;
  onMaxMissing: (n: number) => void;
  searchRef: RefObject<HTMLInputElement | null>;
  stockCount: number;
  onFocusList: () => void;
};

const SORTS: SortId[] = ["menu", "abv-desc", "abv-asc", "sweet-desc", "time-asc"];

export function Toolbar({
  rail,
  query,
  onQuery,
  sort,
  onSort,
  maxMissing,
  onMaxMissing,
  searchRef,
  stockCount,
  onFocusList,
}: Props) {
  return (
    <div className="border-b border-line px-4 py-3 md:px-6">
      <label className="search-field flex h-11 items-center gap-2 rounded-md bg-elevated px-3">
        <Search className="size-4 shrink-0 text-subtle" strokeWidth={1.75} />
        <input
          ref={searchRef}
          value={query}
          onChange={(e) => onQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault();
              onFocusList();
            }
          }}
          placeholder="搜酒名或材料"
          aria-label="搜酒名或材料"
          className="h-full w-full bg-transparent text-sm text-fg placeholder:text-subtle focus:outline-none"
        />
        {query ? (
          <button
            type="button"
            onClick={() => {
              onQuery("");
              searchRef.current?.focus();
            }}
            className="text-subtle hover:text-fg"
            aria-label="清除搜索"
          >
            <X className="size-4" />
          </button>
        ) : (
          <kbd className="kbd hidden md:inline">/</kbd>
        )}
      </label>

      <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-2">
        <div
          role="group"
          aria-label="排序"
          className="flex items-center gap-1 text-xs text-subtle"
        >
          <span className="tracking-mark">排序</span>
          {SORTS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => onSort(s)}
              aria-pressed={sort === s}
              className={cn(
                "pressable rounded-full px-2.5 py-1",
                sort === s
                  ? "bg-accent text-accent-fg"
                  : "bg-elevated text-muted hover:text-fg",
              )}
            >
              {SORT_LABEL[s]}
            </button>
          ))}
        </div>

        {rail === "bar" ? (
          <div
            role="group"
            aria-label="最多还缺几样"
            className="flex items-center gap-1 text-xs text-subtle"
          >
            <span className="tracking-mark">最多缺</span>
            {[0, 1, 2, 3].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => onMaxMissing(n)}
                aria-pressed={maxMissing === n}
                className={cn(
                  "pressable size-7 rounded-full tabular-nums",
                  maxMissing === n
                    ? "bg-accent text-accent-fg"
                    : "bg-elevated text-muted hover:text-fg",
                )}
              >
                {n}
              </button>
            ))}
            {stockCount === 0 ? (
              <span className="text-subtle">还没勾材料</span>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}
