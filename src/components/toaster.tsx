import { useEffect, useState } from "react";
import { subscribeToasts, type ToastItem } from "@/lib/toast";

/** 挂在 AppShell 末尾：底部居中的小纸条队列。 */
export function Toaster() {
  const [items, setItems] = useState<ToastItem[]>([]);

  useEffect(() => subscribeToasts(setItems), []);

  if (items.length === 0) return null;
  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 bottom-6 z-50 flex flex-col items-center gap-2 px-4 md:bottom-8"
    >
      {items.map((t) => (
        <p key={t.id} className="toast-in max-w-full truncate rounded-full bg-elevated/95 px-4 py-2 text-xs text-fg shadow-[var(--shadow-lift)] backdrop-blur">
          {t.text}
        </p>
      ))}
    </div>
  );
}
