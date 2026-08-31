/** 极简 toast：无依赖发布/订阅，Toaster 组件订阅，任意处 showToast()。 */

export type ToastItem = { id: number; text: string };

let seq = 0;
let items: ToastItem[] = [];
const listeners = new Set<(next: ToastItem[]) => void>();

function emit() {
  for (const fn of listeners) fn([...items]);
}

/** 弹一条底部小纸条，默认 1.8 秒后自动消失；最多同屏 3 条。 */
export function showToast(text: string, ms = 1800) {
  const item: ToastItem = { id: ++seq, text };
  items = [...items.slice(-2), item];
  emit();
  window.setTimeout(() => {
    items = items.filter((t) => t.id !== item.id);
    emit();
  }, ms);
}

export function subscribeToasts(fn: (next: ToastItem[]) => void): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}
