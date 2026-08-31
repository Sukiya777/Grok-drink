import { useEffect, useState } from "react";
import { ArrowLeft, Check, Copy, Heart, Minus, Plus } from "lucide-react";
import {
  formatQty,
  GLASS_LABEL,
  METHOD_LABEL,
  type Cocktail,
} from "@/lib/cocktails";
import { Button } from "@/components/ui/button";
import { GlassMark } from "@/components/glass-mark";
import { cn } from "@/lib/utils";

type Props = {
  cocktail: Cocktail;
  saved: boolean;
  onToggleSave: () => void;
  onClose: () => void;
};

export function RecipePanel({ cocktail, saved, onToggleSave, onClose }: Props) {
  const [servings, setServings] = useState(1);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setServings(1);
    setCopied(false);
  }, [cocktail.id]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  function copyRecipe() {
    const lines = [
      `${cocktail.name} / ${cocktail.nameEn}`,
      `${METHOD_LABEL[cocktail.method]} · ${GLASS_LABEL[cocktail.glass]} · ${cocktail.ice}`,
      "",
      "所需材料",
      ...cocktail.ingredients.map(
        (ing) =>
          `${ing.name}${ing.optional ? "（可选）" : ""}  ${formatQty(ing, servings)}`,
      ),
      "",
      "调酒步骤",
      ...cocktail.steps.map((s, i) => `${i + 1}. ${s}`),
      "",
      cocktail.note,
    ];
    void navigator.clipboard.writeText(lines.join("\n")).then(() => {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    });
  }

  return (
    <article className="recipe-in flex h-full min-h-0 flex-col bg-surface">
      <header className="flex items-center justify-between gap-2 border-b border-line px-3 py-2">
        <Button variant="quiet" size="icon" onClick={onClose} aria-label="返回酒单">
          <ArrowLeft className="size-5" strokeWidth={1.75} />
        </Button>
        <div className="flex items-center gap-1">
          <Button
            variant="quiet"
            size="icon"
            onClick={onToggleSave}
            aria-label={saved ? "取消收藏" : "加入收藏"}
            aria-pressed={saved}
          >
            <Heart
              className={cn("size-5", saved && "heart-pop fill-fg text-fg")}
              strokeWidth={1.75}
            />
          </Button>
          <Button
            variant="quiet"
            size="icon"
            onClick={copyRecipe}
            aria-label="复制配方"
          >
            {copied ? (
              <Check className="size-5" strokeWidth={1.75} />
            ) : (
              <Copy className="size-5" strokeWidth={1.75} />
            )}
          </Button>
        </div>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto px-5 py-6 pb-16 md:px-8">
        <div className="recipe-chunk flex items-start justify-between gap-4">
          <div>
            <p className="text-xs tracking-mark text-subtle uppercase">
              {cocktail.nameEn}
            </p>
            <h2 className="mt-1 font-display text-3xl leading-tight text-fg md:text-4xl">
              {cocktail.name}
            </h2>
            <p className="mt-2 text-sm text-muted">
              {cocktail.base} · {cocktail.level} · {cocktail.minutes} 分钟
            </p>
          </div>
          <GlassMark glass={cocktail.glass} className="mt-1 h-16 w-12 shrink-0 text-accent" />
        </div>

        <dl className="recipe-chunk mt-6 grid grid-cols-3 gap-px overflow-hidden rounded-lg bg-line shadow-[var(--shadow-border)]">
          <Spec label="杯具" value={GLASS_LABEL[cocktail.glass]} />
          <Spec label="手法" value={METHOD_LABEL[cocktail.method]} />
          <Spec label="冰块" value={cocktail.ice} />
        </dl>
        <p className="recipe-chunk mt-3 text-sm text-muted">装饰：{cocktail.garnish}</p>

        <div className="recipe-chunk mt-8 flex items-center justify-between">
          <h3 className="font-display text-lg text-fg">所需材料</h3>
          <div className="flex items-center gap-2">
            <span className="text-xs text-subtle">份量</span>
            <Button
              variant="outline"
              size="icon"
              className="size-9"
              onClick={() => setServings((n) => Math.max(1, n - 1))}
              aria-label="减少份量"
              disabled={servings <= 1}
            >
              <Minus className="size-4" />
            </Button>
            <span
              key={servings}
              className="qty-pop w-8 text-center font-display tabular-nums text-fg"
            >
              {servings}
            </span>
            <Button
              variant="outline"
              size="icon"
              className="size-9"
              onClick={() => setServings((n) => Math.min(4, n + 1))}
              aria-label="增加份量"
              disabled={servings >= 4}
            >
              <Plus className="size-4" />
            </Button>
          </div>
        </div>

        <ul className="recipe-chunk mt-3">
          {cocktail.ingredients.map((ing) => (
            <li key={ing.name} className="flex items-baseline gap-3 py-2.5">
              <span className="text-sm text-fg">
                {ing.name}
                {ing.optional ? (
                  <span className="ml-2 text-xs text-subtle">可选</span>
                ) : null}
              </span>
              <span className="min-w-4 flex-1 border-b border-dotted border-line" />
              <span
                key={formatQty(ing, servings)}
                className="qty-pop shrink-0 font-display tabular-nums text-sm text-muted"
              >
                {formatQty(ing, servings)}
              </span>
            </li>
          ))}
        </ul>

        <h3 className="recipe-chunk mt-8 font-display text-lg text-fg">调酒步骤</h3>
        <ol className="recipe-chunk relative mt-4 ml-3 border-l border-line pl-6">
          {cocktail.steps.map((step, i) => (
            <li key={step} className="relative pb-5 last:pb-0">
              <span className="absolute -left-9 top-0 flex size-6 items-center justify-center rounded-full bg-elevated font-display text-xs tabular-nums text-muted shadow-[var(--shadow-border)]">
                {String(i + 1).padStart(2, "0")}
              </span>
              <p className="text-sm leading-normal text-fg">{step}</p>
            </li>
          ))}
        </ol>

        <aside className="recipe-chunk mt-8 rounded-xl bg-elevated px-4 py-4 shadow-[var(--shadow-border)]">
          <p className="text-xs tracking-mark text-subtle">调酒师备忘</p>
          <p className="mt-2 font-display text-sm leading-normal text-muted">{cocktail.note}</p>
        </aside>
      </div>
    </article>
  );
}

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-surface px-3 py-3">
      <dt className="text-xs text-subtle">{label}</dt>
      <dd className="mt-1 text-sm text-fg">{value}</dd>
    </div>
  );
}
