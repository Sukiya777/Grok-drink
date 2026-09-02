import { useEffect, useRef, useState } from "react";
import { DRINK_ART } from "@/lib/drink-art";

/**
 * 开屏「倒酒」：岩石杯线条，杯中液位 = 51 张插画的真实预加载进度。
 * 用户看到的等待是诚实的——酒涨得越实说明缓存得越多；网络快则一秒满杯，
 * 慢也有 2.6s 封顶自动退场，绝不卡人。满杯后液面轻晃一下，整层淡出。
 * 每会话只播一次；点按任意处跳过；prefers-reduced-motion 不播。
 *
 * 沿革：最初做的是"笔顺运笔写夜酌"，但骨架(细线)与成品(衬线)书体方言不通、
 * 墨量差 13 倍，交叉淡入形同换字，视觉割裂，故整体退役换成与本品类同语言的倒酒。
 */

const ARTS = Object.values(DRINK_ART);
/** 封顶时长：到点无论倒到哪都退场（SW 已缓存时进度会瞬间拉满，更早走） */
const MAX_MS = 2600;
/** 满杯后的庆祝停留 */
const HOLD_MS = 420;
const OUT_MS = 380;

// 杯体几何（viewBox 200×240）：老式岩石杯——口沿宽、杯底窄，厚底。
// 单一事实来源：杯壁线条、液体裁剪区、液面高光全部由这几个常量推导，
// 免得再出现"壁是梯形、液体是长方形"这种两套几何各画各的。
const RIM_Y = 52; // 口沿
const FOOT_Y = 170; // 杯内底（厚底的上表面），液体涨到这里为满杯
const RIM_L = 52;
const RIM_R = 148;
const FOOT_L = 70; // 收窄 18：梯形要一眼能看出来（64 时低液位切片几乎等宽，被判"长方形"）
const FOOT_R = 130;
const BASE_T = 16; // 厚底厚度
const WALL = 3; // 液体相对杯壁内缩
const TOP_Y = RIM_Y + 14; // 八分满：液面停在杯口线下方，留出"没漫出来"的呼吸

/** 液体可升降的总行程 */
const TRAVEL = FOOT_Y - TOP_Y;

function fillShift(level: number) {
  // 液位 0..1 → 液体整体向下平移的量（viewBox 单位）：
  // 用 transform 而不是动 y/height —— SVG 几何属性的 CSS transition
  // 在旧版 Safari 不生效，transform 是最稳的那条路。
  return TRAVEL * (1 - Math.min(1, Math.max(0, level)));
}

/** 杯壁中心线（左右各一条，从口沿斜到内底） */
const WALL_L = `M ${RIM_L} ${RIM_Y} L ${FOOT_L} ${FOOT_Y}`;
const WALL_R = `M ${RIM_R} ${RIM_Y} L ${FOOT_R} ${FOOT_Y}`;

/**
 * 杯内液体区 = 沿杯壁水平内缩 WALL 的梯形（底部两个小圆角）。
 * 关键：左右边界用"同一根杯壁线 + 固定水平偏移"按 y 插值出来，而不是各写各的端点——
 * 这样任何高度处液体都严格贴着杯壁（若两端点独立给，斜率会和杯壁不平行，
 * 顶部/底部内缩不一，高液位时液面就会压到杯壁线上）。
 */
const LX = (y: number) => RIM_L + WALL + ((y - RIM_Y) / (FOOT_Y - RIM_Y)) * (FOOT_L - RIM_L);
const RX = (y: number) => RIM_R - WALL + ((y - RIM_Y) / (FOOT_Y - RIM_Y)) * (FOOT_R - RIM_R);
const n = (v: number) => Math.round(v * 100) / 100;
const CORNER = 6; // 杯内底圆角

const BOWL = [
  `M ${n(LX(TOP_Y))} ${TOP_Y}`,
  `L ${n(LX(FOOT_Y - CORNER))} ${FOOT_Y - CORNER}`,
  `Q ${n(LX(FOOT_Y))} ${FOOT_Y} ${n(LX(FOOT_Y) + CORNER)} ${FOOT_Y}`,
  `L ${n(RX(FOOT_Y) - CORNER)} ${FOOT_Y}`,
  `Q ${n(RX(FOOT_Y))} ${FOOT_Y} ${n(RX(FOOT_Y - CORNER))} ${FOOT_Y - CORNER}`,
  `L ${n(RX(TOP_Y))} ${TOP_Y}`,
  "Z",
].join(" ");

export function BrandSplash() {
  const [enabled] = useState(() => {
    try {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return true;
      return sessionStorage.getItem("np-splash-shown") === "1";
    } catch {
      return true; // 环境取不到能力时，宁可不打扰
    }
  });
  const [level, setLevel] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const [gone, setGone] = useState(false);
  const doneRef = useRef(false);

  useEffect(() => {
    if (enabled) return;
    try {
      sessionStorage.setItem("np-splash-shown", "1");
    } catch {
      /* 存不了就算了，本次照播 */
    }

    let loaded = 0;
    // 双阈值进度：60% 权重给"首屏级"的前 12 张，40% 给全量——
    // 前几张到位时酒已大半场，避免"一直不见涨、最后猛满杯"的观感。
    const FIRST = ARTS.slice(0, 12);
    const rest = ARTS.slice(12);
    let firstDone = 0;
    const tick = () => {
      loaded += 1;
      const fp = Math.min(1, firstDone / FIRST.length);
      const ap = loaded / ARTS.length;
      setLevel(Math.min(1, fp * 0.6 + ap * 0.4));
    };
    for (const src of FIRST) {
      const im = new Image();
      im.onload = () => {
        firstDone += 1;
        tick();
      };
      im.onerror = tick;
      im.src = src;
    }
    for (const src of rest) {
      const im = new Image();
      im.onload = tick;
      im.onerror = tick;
      im.src = src;
    }

    const finish = () => {
      if (doneRef.current) return;
      doneRef.current = true;
      setLevel(1);
      setLeaving(true);
      setTimeout(() => setGone(true), OUT_MS);
    };
    const cap = setTimeout(finish, MAX_MS);
    // 进度满杯后也走（给庆祝停留留时间）
    const watch = setInterval(() => {
      if (loaded >= ARTS.length) {
        clearInterval(watch);
        setTimeout(finish, HOLD_MS);
      }
    }, 80);
    return () => {
      clearTimeout(cap);
      clearInterval(watch);
    };
  }, [enabled]);

  if (enabled || gone) return null;

  const shift = fillShift(level);
  return (
    <div
      role="presentation"
      onClick={() => {
        if (!doneRef.current) {
          doneRef.current = true;
          setLevel(1);
          setLeaving(true);
          setTimeout(() => setGone(true), OUT_MS);
        }
      }}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-bg"
      data-splash="pour"
      style={{
        opacity: leaving ? 0 : 1,
        transition: `opacity ${OUT_MS}ms ease`,
      }}
    >
      <svg viewBox="0 0 200 240" className="h-44 w-40" aria-hidden="true">
        <defs>
          <clipPath id="cup-bowl">
            <path d={BOWL} />
          </clipPath>
          <linearGradient id="pour-liquid" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#d29c89" /> {/* 落日椰林：液面偏亮的橘粉 */}
            <stop offset="1" stopColor="#975137" /> {/* 尼格罗尼：杯底沉琥珀 */}
          </linearGradient>
        </defs>
        {/* 外层负责裁剪（不位移），内层负责位移——
            若把 transform 放在带 clipPath 的 g 上，裁剪区会跟着液面一起沉出去。
            内层画一张足够大的液体+一条液面高光，靠梯形裁剪自然获得"上宽下窄"。 */}
        <g clipPath="url(#cup-bowl)">
          <g
            style={{
              transform: `translateY(${shift}px)`,
              transition: "transform 260ms var(--ease-smooth-out)",
            }}
          >
            <rect
              x={RIM_L - 20}
              y={TOP_Y}
              width={RIM_R - RIM_L + 40}
              height={TRAVEL + BASE_T + 40}
              fill="url(#pour-liquid)"
              opacity="0.85"
            />
            {/* 弯月面：更亮的一条液面高光（宽度由裁剪区决定，涨到哪就有多宽） */}
            <rect
              x={RIM_L - 20}
              y={TOP_Y}
              width={RIM_R - RIM_L + 40}
              height={3}
              fill="#e8ddd0"
              opacity="0.9"
            />
          </g>
        </g>
        {/* 杯体线条：口沿 + 两条斜壁 + 厚底 */}
        <g fill="none" stroke="#e8ddd0" strokeWidth="2.5" strokeLinecap="round">
          <path d={`M ${RIM_L} ${RIM_Y} L ${RIM_R} ${RIM_Y}`} opacity="0.9" />
          <path d={WALL_L} opacity="0.9" />
          <path d={WALL_R} opacity="0.9" />
          <path d={`M ${FOOT_L - 2} ${FOOT_Y + BASE_T} L ${FOOT_R + 2} ${FOOT_Y + BASE_T}`} opacity="0.9" />
          <path
            d={`M ${FOOT_L + 2} ${FOOT_Y} L ${FOOT_R - 2} ${FOOT_Y}`}
            opacity="0.45"
            strokeWidth="2"
          />
        </g>
      </svg>
      <div className="mt-5 flex flex-col items-center">
        <p className="font-display text-2xl leading-[36px] tracking-tight text-fg">夜酌</p>
        <p className="text-xs leading-[20px] tracking-mark text-subtle">NIGHT POUR</p>
        <p className="text-[10px] uppercase leading-[18px] tracking-[0.22em] text-subtle">
          Crafted by Suki
        </p>
      </div>
    </div>
  );
}
