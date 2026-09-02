import { useState } from "react";
import { artVeil } from "@/lib/art-veil";
import { cn } from "@/lib/utils";

/**
 * 插画渐进显影：容器底色 = 这杯酒的"酒液色"（data-veil 供测试断言），
 * 图片加载完成后淡入盖上去。加载中的占位是一块酒色而不是黑底——
 * "黑暗中先看见酒的颜色，再看清杯子"。
 * 注意：淡入的 opacity 只能加在 img 上；若加在自带 bg 的 img 上，
 * 占位色会跟着图一起透明掉（opacity 影响整个元素），故拆成容器+图两层。
 */
export function ArtImg({
  id,
  src,
  alt,
  title,
  className,
  imgClassName,
  priority,
  onClick,
}: {
  id: string;
  src: string;
  alt: string;
  title?: string;
  /** 容器（占位色块）的布局类 */
  className?: string;
  imgClassName?: string;
  /** 首屏可见的前几张传 true：不懒加载、请求优先级拉高 */
  priority?: boolean;
  onClick?: (e: React.MouseEvent<HTMLSpanElement>) => void;
}) {
  const [loaded, setLoaded] = useState(false);
  const veil = artVeil(id);
  return (
    <span
      data-veil={veil}
      style={{ backgroundColor: veil }}
      className={cn("relative block overflow-hidden", className)}
      onClick={onClick}
    >
      <img
        src={src}
        alt={alt}
        title={title}
        width={800}
        height={800}
        fetchPriority={priority ? "high" : undefined}
        decoding="async"
        loading={priority ? "eager" : "lazy"}
        onLoad={() => setLoaded(true)}
        onError={() => setLoaded(true)} // 图挂了也别留一块死色
        style={{
          opacity: loaded ? 1 : 0,
          transition: "opacity var(--motion-slow) var(--ease-smooth-out)",
        }}
        className={cn("block size-full object-cover", imgClassName)}
      />
    </span>
  );
}
