import { Heart } from "lucide-react";
import { CATEGORIES, COCKTAILS, type CategoryId } from "@/lib/cocktails";
import { cn } from "@/lib/utils";

export type RailId = CategoryId | "all" | "fav";

type Props = {
  active: RailId;
  onSelect: (id: RailId) => void;
  favCount: number;
};

export function CategoryRail({ active, onSelect, favCount }: Props) {
  return (
    <nav
      aria-label="酒的大类"
      className="flex flex-nowrap gap-2 overflow-x-auto px-4 py-3 [scrollbar-width:none] md:flex-col md:gap-1 md:overflow-y-auto md:px-3 md:py-4 [&::-webkit-scrollbar]:hidden"
    >
      <RailButton
        active={active === "all"}
        onClick={() => onSelect("all")}
        mark="全"
        name="全部"
        nameEn="All"
        count={COCKTAILS.length}
      />
      {CATEGORIES.map((cat) => (
        <RailButton
          key={cat.id}
          active={active === cat.id}
          onClick={() => onSelect(cat.id)}
          mark={cat.mark}
          name={cat.name}
          nameEn={cat.nameEn}
          count={COCKTAILS.filter((c) => c.category === cat.id).length}
        />
      ))}
      <RailButton
        active={active === "fav"}
        onClick={() => onSelect("fav")}
        mark=""
        name="收藏"
        nameEn="Saved"
        count={favCount}
        icon
      />
    </nav>
  );
}

function RailButton({
  active,
  onClick,
  mark,
  name,
  nameEn,
  count,
  icon,
}: {
  active: boolean;
  onClick: () => void;
  mark: string;
  name: string;
  nameEn: string;
  count: number;
  icon?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      data-active={active ? "true" : undefined}
      className={cn(
        "rail-btn flex min-h-11 shrink-0 items-center gap-3 rounded-md px-3 py-2 text-left",
        "max-md:h-10 max-md:min-h-10 max-md:rounded-full max-md:px-4 max-md:before:hidden",
        active
          ? "bg-elevated text-fg max-md:bg-accent max-md:text-accent-fg"
          : "text-muted hover:bg-elevated/70 hover:text-fg",
      )}
    >
      <span
        className={cn(
          "rail-mark flex size-8 items-center justify-center rounded-sm font-display text-sm max-md:hidden",
          active ? "bg-accent text-accent-fg" : "bg-bg text-muted shadow-[var(--shadow-border)]",
        )}
      >
        {icon ? <Heart className="size-3.5" strokeWidth={1.75} /> : mark}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-medium leading-snug">{name}</span>
        <span className="hidden text-xs text-subtle md:block">{nameEn}</span>
      </span>
      <span className="hidden tabular-nums text-xs text-subtle md:inline">{count}</span>
    </button>
  );
}
