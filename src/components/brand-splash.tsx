import { useEffect, useState, type CSSProperties } from "react";
import { BRAND_STROKES, type Stroke } from "@/lib/brand-strokes";

/**
 * 开屏运笔动画：深墨底上「夜酌」按笔顺逐笔写出（stroke-dashoffset，
 * 时序按弧长分配、纯 CSS 驱动），写毕与正式版衬线字交叉替换，
 * 副标与落款依次淡入，整层淡出后卸载。
 * 每会话首开展示一次；点按任意处跳过；prefers-reduced-motion 直接不播。
 */

/** 运笔速度（路径单位/毫秒），两字共用，同一支"笔"。
 * 时长主要由弧长决定，这样点（短）与撇捺（长）才有书法的呼吸感；
 * 若把 MIN_STROKE 调得接近平均笔长，所有笔会被拉成等长，运笔味就没了。 */
const SPEED = 5.5;
/** 笔与笔的起笔间隔 */
const GAP = 40;
/** 最短单笔时长，仅防极短点笔一闪而过 */
const MIN_STROKE = 60;
/** 夜→酌 之间的换气停顿 */
const CHAR_GAP = 100;
/** 收笔到换正式字 */
const SETTLE = 260;
/** 正式字淡入时长 */
const FADE = 300;
/** 副标 / 落款 的错峰 */
const STAGGER = 180;
/** 落款出现到开始退场 的停留 */
const HOLD = 420;
/** 整层淡出时长 */
const OUT_MS = 380;

function timeline(strokes: { d: string; len: number }[]) {
  let t = 0;
  return strokes.map((s) => {
    const dur = Math.max(MIN_STROKE, s.len / SPEED);
    const delay = t;
    t = delay + dur + GAP;
    return { ...s, dur, delay };
  });
}

const YE = timeline(BRAND_STROKES["夜"].strokes);
const NIGHT_END = YE[YE.length - 1].delay + YE[YE.length - 1].dur + GAP;
const ZHUO_START = NIGHT_END + CHAR_GAP;
const ZH = timeline(BRAND_STROKES["酌"].strokes);
const WRITE_END = ZHUO_START + ZH[ZH.length - 1].delay + ZH[ZH.length - 1].dur + GAP;

const T_SWAP = WRITE_END + SETTLE;
const T_SUB = T_SWAP + STAGGER;
const T_MARK = T_SUB + STAGGER;
const T_OUT = T_MARK + HOLD;

const INK = "#e8ddd0"; // 与 --color-accent 同值：全站同一支墨

function BrushChar({
  char,
  data,
  start,
  swap,
}: {
  char: string;
  data: { viewBox: string; sw: number; strokes: Stroke[] };
  start: number;
  swap: boolean;
}) {
  const tl = timeline(data.strokes);
  return (
    <div className="relative h-[104px] w-[104px] shrink-0">
      <svg
        viewBox={data.viewBox}
        className="absolute inset-0 h-full w-full"
        aria-hidden="true"
        style={{ opacity: swap ? 0 : 1, transition: `opacity ${FADE}ms ease` }}
      >
        {tl.map((s, i) => (
          <path
            key={i}
            d={s.d}
            fill="none"
            stroke={INK}
            strokeWidth={data.sw}
            strokeLinecap="round"
            className="splash-stroke"
            style={
              {
                strokeDasharray: s.len,
                strokeDashoffset: s.len,
                "--dur": `${Math.round(s.dur)}ms`,
                animationDelay: `${Math.round(start + s.delay)}ms`,
              } as CSSProperties
            }
          />
        ))}
      </svg>
      <span
        className="font-display absolute inset-0 flex items-center justify-center text-[86px] leading-[104px]"
        style={{ opacity: swap ? 1 : 0, transition: `opacity ${FADE}ms ease` }}
      >
        {char}
      </span>
    </div>
  );
}

function splashDisabled(): boolean {
  try {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return true;
    return sessionStorage.getItem("np-splash-shown") === "1";
  } catch {
    return true; // 隐私模式等取不到时宁可不打扰
  }
}

export function BrandSplash() {
  const [enabled] = useState(splashDisabled);
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    if (enabled) return;
    try {
      sessionStorage.setItem("np-splash-shown", "1");
    } catch {
      /* 存不了就不去管，本次照样播 */
    }
    const timers = [
      setTimeout(() => setPhase(1), T_SWAP),
      setTimeout(() => setPhase(2), T_SUB),
      setTimeout(() => setPhase(3), T_MARK),
      setTimeout(() => setPhase(4), T_OUT),
      setTimeout(() => setPhase(5), T_OUT + OUT_MS),
    ];
    return () => timers.forEach(clearTimeout);
  }, [enabled]);

  if (enabled || phase >= 5) return null;

  const fade = (at: number): CSSProperties => ({
    opacity: phase >= at ? 1 : 0,
    transform: phase >= at ? "none" : "translateY(4px)",
    transition: "opacity 300ms var(--ease-smooth-out), transform 300ms var(--ease-smooth-out)",
  });

  return (
    <div
      role="presentation"
      onClick={() => setPhase(5)}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-bg"
      style={{
        opacity: phase >= 4 ? 0 : 1,
        transition: `opacity ${OUT_MS}ms ease`,
      }}
    >
      <div className="flex items-center gap-3 text-fg">
        <BrushChar char="夜" data={BRAND_STROKES["夜"]} start={0} swap={phase >= 1} />
        <BrushChar char="酌" data={BRAND_STROKES["酌"]} start={ZHUO_START} swap={phase >= 1} />
      </div>
      <div className="mt-3 flex flex-col items-center">
        <p className="text-xs leading-[20px] tracking-mark text-subtle" style={fade(2)}>
          NIGHT POUR
        </p>
        <p
          className="text-[10px] uppercase leading-[18px] tracking-[0.22em] text-subtle"
          style={fade(3)}
        >
          Crafted by Suki
        </p>
      </div>
    </div>
  );
}
