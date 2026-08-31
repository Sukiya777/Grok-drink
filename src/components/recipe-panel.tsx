import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Check, Copy, Heart, Link2, Minus, Plus } from "lucide-react";
import {
  GLASS_LABEL,
  METHOD_LABEL,
  SWEET_LABEL,
  abvLabel,
  categoryColor,
  formatQty,
  normalizeIngredient,
  type Cocktail,
  type Measure,
} from "@/lib/cocktails";
import { Button } from "@/components/ui/button";
import { GlassMark } from "@/components/glass-mark";
import { haptic } from "@/lib/haptics";
import { showToast } from "@/lib/toast";
import { cn } from "@/lib/utils";

type Props = {
  cocktail: Cocktail;
  saved: boolean;
  /** 吧台模式下的缺口；undefined 表示未启用吧台模式 */
  missing?: string[];
  servings: number;
  measure: Measure;
  onServings: (n: number) => void;
  onMeasure: (m: Measure) => void;
  onToggleSave: () => void;
  onClose: () => void;
};

export function RecipePanel({
  cocktail,
  saved,
  missing,
  servings,
  measure,
  onServings,
  onMeasure,
  onToggleSave,
  onClose,
}: Props) {
  const [copied, setCopied] = useState<"recipe" | "link" | null>(null);
  const [done, setDone] = useState<boolean[]>([]);
  const [pour, setPour] = useState(false);
  const pourTimer = useRef<number | undefined>(undefined);
  const tint = categoryColor(cocktail.category);
  const missingSet = new Set((missing ?? []).map(normalizeIngredient));
  const doneCount = done.filter(Boolean).length;
  const stepTotal = cocktail.steps.length;
  const progress = stepTotal > 0 ? doneCount / stepTotal : 0;

  useEffect(() => {
    setDone([]);
    setCopied(null);
    setPour(false);
  }, [cocktail.id]);

  useEffect(() => () => window.clearTimeout(pourTimer.current), []);

  useEffect(() => {
    if (!copied) return;
    const t = window.setTimeout(() => setCopied(null), 1600);
    return () => window.clearTimeout(t);
  }, [copied]);

  function flash(kind: "recipe" | "link") {
    setCopied(kind);
    haptic(14);
    showToast(kind === "recipe" ? "配方已复制，发给朋友吧" : "链接已复制");
  }

  function copyText(text: string, kind: "recipe" | "link") {
    // 非安全上下文（file:// 或 http 内网）下 clipboard API 不可用，退回 execCommand
    if (navigator.clipboard?.writeText) {
      void navigator.clipboard.writeText(text).then(
        () => flash(kind),
        () => fallbackCopy(text, kind),
      );
      return;
    }
    fallbackCopy(text, kind);
  }

  function fallbackCopy(text: string, kind: "recipe" | "link") {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("aria-hidden", "true");
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    try {
      const worked = document.execCommand("copy");
      if (worked) {
        flash(kind);
      } else {
        throw new Error("execCommand returned false");
      }
    } catch {
      // 连兜底都失败：把手动复制的入口给出来，并明确告知，避免"点了没反应"
      showToast("自动复制失败，已弹出内容请长按选中");
      haptic([20, 40, 20]);
      window.prompt("复制以下内容：", text);
    } finally {
      ta.remove();
    }
  }

  function copyRecipe() {
    const lines = [
      `${cocktail.name} / ${cocktail.nameEn}`,
      `${METHOD_LABEL[cocktail.method]} · ${GLASS_LABEL[cocktail.glass]} · ${cocktail.ice} · 约 ${cocktail.abv}%vol`,
      "",
      servings > 1 ? `所需材料（${servings} 杯）` : "所需材料",
      ...cocktail.ingredients.map(
        (ing) =>
          `- ${ing.name}${ing.optional ? "（可选）" : ""}  ${formatQty(ing, servings, measure)}`,
      ),
      "",
      "调酒步骤",
      ...cocktail.steps.map((s, i) => `${i + 1}. ${s}`),
      "",
      `装饰：${cocktail.garnish}`,
      cocktail.note,
    ];
    copyText(lines.join("\n"), "recipe");
  }

  function copyLink() {
    const url = `${window.location.origin}${window.location.pathname}#/${encodeURIComponent(cocktail.category)}/${encodeURIComponent(cocktail.id)}`;
    copyText(url, "link");
  }

  const allReady = missing ? missing.length === 0 : null;

  return (
    <article
      className="recipe-in flex h-full min-h-0 flex-col bg-surface"
      id={`recipe-${cocktail.id}`}
    >
      <header className="relative flex items-center justify-between gap-2 border-b border-line px-3 py-2">
        {doneCount > 0 ? (
          <span
            aria-hidden="true"
            className="absolute bottom-0 left-0 h-px bg-ok transition-[width] duration-300 ease-out"
            style={{ width: `${Math.round(progress * 100)}%` }}
          />
        ) : null}
        <Button variant="quiet" size="icon" onClick={onClose} aria-label="返回酒单">
          <ArrowLeft className="size-5" strokeWidth={1.75} />
        </Button>
        <p className="min-w-0 truncate text-center font-display text-base text-fg">
          {cocktail.name}
        </p>
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
            onClick={copyLink}
            aria-label="复制这杯酒的链接"
          >
            {copied === "link" ? (
              <Check className="size-5" strokeWidth={1.75} />
            ) : (
              <Link2 className="size-5" strokeWidth={1.75} />
            )}
          </Button>
          <Button variant="quiet" size="icon" onClick={copyRecipe} aria-label="复制配方">
            {copied === "recipe" ? (
              <Check className="size-5" strokeWidth={1.75} />
            ) : (
              <Copy className="size-5" strokeWidth={1.75} />
            )}
          </Button>
        </div>
      </header>

      <div
        id="recipe-scroll"
        className="min-h-0 flex-1 overflow-y-auto px-5 pt-6 pb-safe md:px-8"
      >
        <div className="recipe-chunk flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-xs tracking-mark text-subtle uppercase">
              {cocktail.nameEn}
            </p>
            <h2 className="mt-1 font-display text-3xl leading-tight text-fg md:text-4xl">
              {cocktail.name}
            </h2>
            <p className="mt-2 text-sm text-muted">
              {cocktail.base} · {cocktail.level} · {cocktail.minutes} 分钟
            </p>
            {allReady === true ? (
              <p className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-ok/15 px-2.5 py-1 text-xs text-ok">
                <Check className="size-3.5" strokeWidth={2.5} />
                吧台材料齐了
              </p>
            ) : null}
          </div>
          <GlassMark
            glass={cocktail.glass}
            liquid={tint}
            className={cn("mt-1 h-16 w-12 shrink-0", pour && "glass-pour")}
          />
        </div>

        <dl className="recipe-chunk mt-6 grid grid-cols-3 gap-px overflow-hidden rounded-lg bg-line shadow-[var(--shadow-border)]">
          <Spec label="杯具" value={GLASS_LABEL[cocktail.glass]} />
          <Spec label="手法" value={METHOD_LABEL[cocktail.method]} />
          <Spec label="冰块" value={cocktail.ice} />
        </dl>
        <dl className="recipe-chunk mt-3 grid grid-cols-3 gap-px overflow-hidden rounded-lg bg-line shadow-[var(--shadow-border)]">
          <Spec label="度数" value={`${abvLabel(cocktail.abv)} ${cocktail.abv}%`} />
          <Spec label="甜度" value={`${SWEET_LABEL[cocktail.sweet]} ${cocktail.sweet}/5`} />
          <Spec label="装饰" value={cocktail.garnish} />
        </dl>

        <div className="recipe-chunk mt-8 flex flex-wrap items-center justify-between gap-3">
          <h3 className="font-display text-lg text-fg">所需材料</h3>
          <div className="flex items-center gap-2">
            <div
              role="group"
              aria-label="计量单位"
              className="flex overflow-hidden rounded-full bg-elevated text-xs shadow-[var(--shadow-border)]"
            >
              {(["metric", "imperial"] as Measure[]).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => onMeasure(m)}
                  aria-pressed={measure === m}
                  className={cn(
                    "px-2.5 py-1.5 tabular-nums",
                    measure === m ? "bg-accent text-accent-fg" : "text-muted hover:text-fg",
                  )}
                >
                  {m === "metric" ? "ml" : "oz"}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-subtle">份量</span>
              <Button
                variant="outline"
                size="icon"
                className="size-8"
                onClick={() => onServings(Math.max(1, servings - 1))}
                aria-label="减少份量"
                disabled={servings <= 1}
              >
                <Minus className="size-4" />
              </Button>
              <span
                key={servings}
                className="qty-pop w-6 text-center font-display tabular-nums text-fg"
              >
                {servings}
              </span>
              <Button
                variant="outline"
                size="icon"
                className="size-8"
                onClick={() => onServings(Math.min(6, servings + 1))}
                aria-label="增加份量"
                disabled={servings >= 6}
              >
                <Plus className="size-4" />
              </Button>
            </div>
          </div>
        </div>

        <ul className="recipe-chunk mt-3">
          {cocktail.ingredients.map((ing) => {
            const lacking = missingSet.has(normalizeIngredient(ing.name));
            return (
              <li key={ing.name} className="flex items-baseline gap-3 py-2.5">
                <span className={cn("text-sm", lacking ? "text-subtle" : "text-fg")}>
                  {ing.name}
                  {ing.optional ? (
                    <span className="ml-2 text-xs text-subtle">可选</span>
                  ) : null}
                  {lacking ? <span className="ml-2 text-xs text-muted">缺</span> : null}
                </span>
                <span className="min-w-4 flex-1 border-b border-dotted border-line" />
                <span
                  key={formatQty(ing, servings, measure)}
                  className={cn(
                    "qty-pop shrink-0 font-display tabular-nums text-sm",
                    lacking ? "text-subtle line-through decoration-line" : "text-muted",
                  )}
                >
                  {formatQty(ing, servings, measure)}
                </span>
              </li>
            );
          })}
        </ul>

        <div className="recipe-chunk mt-8 flex items-baseline justify-between">
          <h3 className="font-display text-lg text-fg">调酒步骤</h3>
          {done.filter(Boolean).length > 0 ? (
            <button
              type="button"
              onClick={() => {
                setDone([]);
                setPour(false);
              }}
              className="text-xs text-subtle hover:text-fg"
            >
              重置进度
            </button>
          ) : null}
        </div>
        <ol className="recipe-chunk relative mt-4 ml-3 border-l border-line pl-6">
          {cocktail.steps.map((step, i) => {
            const isDone = Boolean(done[i]);
            return (
              <li key={step} className="relative pb-5 last:pb-0">
                <button
                  type="button"
                  onClick={() =>
                    setDone((prev) => {
                      const next = [...prev];
                      next[i] = !next[i];
                      const count = next.filter(Boolean).length;
                      if (next[i]) {
                        haptic(10);
                        if (count === cocktail.steps.length) {
                          // 全部完成：倒酒动画 + 轻震两下 + 小纸条
                          setPour(false);
                          window.clearTimeout(pourTimer.current);
                          requestAnimationFrame(() => setPour(true));
                          pourTimer.current = window.setTimeout(() => setPour(false), 1000);
                          haptic([16, 60, 24]);
                          showToast(`🍸 ${cocktail.name}，这杯成了`);
                        }
                      }
                      return next;
                    })
                  }
                  aria-pressed={isDone}
                  aria-label={`标记第 ${i + 1} 步${isDone ? "未完成" : "已完成"}`}
                  className={cn(
                    "absolute -left-9 top-0 flex size-6 items-center justify-center rounded-full font-display text-xs tabular-nums shadow-[var(--shadow-border)] transition-colors",
                    isDone ? "bg-ok text-accent-fg" : "bg-elevated text-muted hover:text-fg",
                  )}
                >
                  {isDone ? <Check className="size-3.5" strokeWidth={3} /> : String(i + 1).padStart(2, "0")}
                </button>
                <p
                  className={cn(
                    "text-sm leading-normal",
                    isDone ? "text-subtle line-through decoration-line" : "text-fg",
                  )}
                >
                  {step}
                </p>
              </li>
            );
          })}
        </ol>

        <aside className="recipe-chunk mt-8 rounded-xl bg-elevated px-4 py-4 shadow-[var(--shadow-border)]">
          <p className="text-xs tracking-mark text-subtle">调酒师备忘</p>
          <p className="mt-2 font-display text-sm leading-normal text-muted">
            {cocktail.note}
          </p>
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
