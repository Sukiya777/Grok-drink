import type { MouseEvent } from "react";

/** 成品插画放大层的极简 pub/sub（与 toast.ts 同思路，不引状态库）。 */
export type ArtView = { src: string; caption: string; id: number };

let seq = 0;
let current: ArtView | null = null;
const listeners = new Set<(v: ArtView | null) => void>();

export function emitArt() {
  for (const fn of listeners) fn(current);
}

export function openArtLightbox(src: string, caption: string) {
  current = { src, caption, id: ++seq };
  emitArt();
}

export function closeArtLightbox() {
  current = null;
  emitArt();
}

/** 阻止冒泡并打开放大层——卡片里的 <img> 用它避免连带触发进详情。 */
export function artZoomHandler(src: string, caption: string) {
  return (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    openArtLightbox(src, caption);
  };
}

export function subscribeArt(fn: (v: ArtView | null) => void): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}
