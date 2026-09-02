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

// 杯体几何（viewBox 200×240）：老式岩石杯，直壁厚底
const CUP_TOP = 52;
const CUP_BOTTOM = 186;
const CUP_L = 58;
const CUP_R = 142;
const BASE_T = 20; // 厚底，液体不侵入

function fillShift(level: number) {
  // 液位 0..1 → 液体整体向下平移的量（px, viewBox 单位）：
  // 用 transform 而不是动 y/height —— SVG 几何属性的 CSS transition
  // 在旧版 Safari 不生效，transform 是最稳的那条路。
  return (CUP_BOTTOM - BASE_T - CUP_TOP) * (1 - Math.min(1, Math.max(0, level)));
}

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
            <rect x={CUP_L + 5} y={CUP_TOP} width={CUP_R - CUP_L - 10} height={CUP_BOTTOM - CUP_TOP - BASE_T} rx={6} />
          </clipPath>
          <linearGradient id="pour-liquid" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#d29c89" /> {/* 落日椰林：液面偏亮的橘粉 */}
            <stop offset="1" stopColor="#975137" /> {/* 尼格罗尼：杯底沉琥珀 */}
          </linearGradient>
        </defs>
        {/* 外层负责裁剪（不位移），内层负责位移——
            若把 transform 放在带 clipPath 的 g 上，裁剪区会跟着液面一起沉出去 */}
        <g clipPath="url(#cup-bowl)">
          <g
            style={{
              transform: `translateY(${shift}px)`,
              transition: "transform 260ms var(--ease-smooth-out)",
            }}
          >
            <rect
              x={CUP_L}
              y={CUP_TOP}
              width={CUP_R - CUP_L}
              height={CUP_BOTTOM - BASE_T - CUP_TOP}
              fill="url(#pour-liquid)"
              opacity="0.85"
            />
            {/* 弯月面：更亮的一条液面高光 */}
            <rect x={CUP_L} y={CUP_TOP} width={CUP_R - CUP_L} height={3} fill="#e8ddd0" opacity="0.9" />
          </g>
        </g>
        {/* 杯体线条 */}
        <g fill="none" stroke="#e8ddd0" strokeWidth="2.5" strokeLinecap="round">
          <path d={`M ${CUP_L - 3} ${CUP_TOP} L ${CUP_L + 3} ${CUP_BOTTOM - BASE_T} Q ${CUP_L + 4} ${CUP_BOTTOM - 4} ${CUP_L + 14} ${CUP_BOTTOM - 4} L ${CUP_R - 14} ${CUP_BOTTOM - 4} Q ${CUP_R - 4} ${CUP_BOTTOM - 4} ${CUP_R - 3} ${CUP_BOTTOM - BASE_T} L ${CUP_R + 3} ${CUP_TOP}`} opacity="0.9" />
          <path d={`M ${CUP_L - 3} ${CUP_TOP} L ${CUP_R + 3} ${CUP_TOP}`} opacity="0.9" />
          <path d={`M ${CUP_L + 8} ${CUP_BOTTOM} L ${CUP_R - 8} ${CUP_BOTTOM}`} opacity="0.5" />
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
