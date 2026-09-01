import { useEffect, useState } from "react";
import { X } from "lucide-react";
import {
  closeArtLightbox,
  subscribeArt,
  type ArtView,
} from "@/lib/art-view";

export function ArtLightbox() {
  const [view, setView] = useState<ArtView | null>(null);

  useEffect(() => subscribeArt(setView), []);

  useEffect(() => {
    if (!view) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeArtLightbox();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [view]);

  if (!view) return null;

  return (
    <div
      key={view.id}
      role="dialog"
      aria-label={`${view.caption} 成品大图`}
      onClick={closeArtLightbox}
      className="lightbox-in fixed inset-0 z-60 flex touch-none flex-col items-center justify-center bg-bg/95 p-6 backdrop-blur-sm"
    >
      <button
        type="button"
        onClick={closeArtLightbox}
        aria-label="关闭大图"
        className="absolute top-4 right-4 rounded-full border border-line bg-surface/80 p-2 text-muted transition-colors hover:text-fg"
      >
        <X className="size-5" />
      </button>
      <img
        src={view.src}
        alt={view.caption}
        className="max-h-[72vh] max-w-[86vw] rounded-xl object-contain ring-1 ring-line"
      />
      <p className="mt-4 text-sm text-muted">
        {view.caption} · 成品示意，点任意处关闭
      </p>
    </div>
  );
}
