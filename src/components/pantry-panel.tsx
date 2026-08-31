import { useMemo, useState } from "react";
import { Check, Eraser, Plus } from "lucide-react";
import { PANTRY_OPTIONS } from "@/lib/cocktails";
import { cn } from "@/lib/utils";

type Props = {
  stock: string[];
  onToggle: (name: string) => void;
  onClear: () => void;
  readyCount: number;
};

/** 常用优先：把最常出现在酒谱里的材料排在前面，其余按拼音。 */
const FREQUENT = [
  "金酒",
  "伏特加",
  "白朗姆",
  "波本威士忌",
  "黑麦威士忌",
  "银龙舌兰",
  "干邑",
  "新鲜青柠汁",
  "新鲜柠檬汁",
  "新鲜橙汁",
  "糖浆（1:1）",
  "苏打水",
  "汤力水",
  "橙皮甜酒",
  "甜苦艾酒",
  "金巴利",
  "姜汁啤酒",
  "红石榴糖浆",
  "黑醋栗利口酒",
  "蛋白",
];

export function PantryPanel({ stock, onToggle, onClear, readyCount }: Props) {
  const [filter, setFilter] = useState("");
  const set = useMemo(() => new Set(stock), [stock]);

  const shown = useMemo(() => {
    const q = filter.trim().toLowerCase();
    const rank = (name: string) => {
      const i = FREQUENT.indexOf(name);
      return i === -1 ? FREQUENT.length : i;
    };
    return [...PANTRY_OPTIONS]
      .filter((n) => !q || n.toLowerCase().includes(q))
      .sort((a, b) => {
        // 已勾选的置顶，其余按常用度再按名称
        const sa = set.has(a) ? 0 : 1;
        const sb = set.has(b) ? 0 : 1;
        if (sa !== sb) return sa - sb;
        return rank(a) - rank(b) || a.localeCompare(b, "zh-Hans-CN");
      });
  }, [filter, set]);

  return (
    <div className="border-b border-line bg-surface/60 px-4 py-4 md:px-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs tracking-mark text-subtle uppercase">My Bar</p>
          <h2 className="mt-1 font-display text-2xl leading-tight text-fg">我的吧台</h2>
          <p className="mt-1.5 max-w-prose text-sm leading-normal text-muted">
            {stock.length === 0
              ? "勾出家里已有的材料，下面会列出现在能调与只缺一点的材料。"
              : `已勾 ${stock.length} 样 · 现在就能调 ${readyCount} 杯`}
          </p>
        </div>
        {stock.length > 0 ? (
          <button
            type="button"
            onClick={onClear}
            className="pressable flex items-center gap-1.5 rounded-full bg-elevated px-3 py-1.5 text-xs text-muted hover:text-fg"
          >
            <Eraser className="size-3.5" strokeWidth={1.75} />
            清空（{stock.length}）
          </button>
        ) : null}
      </div>

      <div className="mt-3 flex items-center gap-2">
        <input
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="找材料，如 金酒 / 青柠"
          aria-label="筛选材料"
          className="search-field h-9 w-full max-w-56 rounded-md bg-elevated px-3 text-sm text-fg placeholder:text-subtle focus:outline-none md:w-56"
        />
      </div>

      <ul className="mt-3 flex flex-wrap gap-1.5">
        {shown.map((name) => {
          const on = set.has(name);
          return (
            <li key={name}>
              <button
                type="button"
                onClick={() => onToggle(name)}
                aria-pressed={on}
                className={cn(
                  "pressable flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-xs",
                  on
                    ? "border-transparent bg-accent text-accent-fg"
                    : "bg-transparent text-muted hover:bg-elevated hover:text-fg",
                )}
              >
                {on ? (
                  <Check className="check-pop size-3.5" strokeWidth={2.5} />
                ) : (
                  <Plus className="size-3.5 opacity-60" strokeWidth={2} />
                )}
                {name}
              </button>
            </li>
          );
        })}
        {shown.length === 0 ? (
          <li className="text-xs text-subtle">没有匹配的材料，换个关键词。</li>
        ) : null}
      </ul>
    </div>
  );
}
