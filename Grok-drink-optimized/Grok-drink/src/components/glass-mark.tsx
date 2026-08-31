import { useId } from "react";
import type { Glass } from "@/lib/cocktails";
import { cn } from "@/lib/utils";

type Props = {
  glass: Glass;
  className?: string;
  /** 酒液颜色；省略时沿用 currentColor */
  liquid?: string;
  /** 液面起点（viewBox 单位，越小越满），默认 10 */
  level?: number;
};

export function GlassMark({ glass, className, liquid, level = 10 }: Props) {
  const raw = useId().replace(/:/g, "");
  const clip = `bowl-${raw}`;
  const bowl = bowlPath(glass);

  return (
    <svg
      viewBox="0 0 32 40"
      className={cn("text-fg", className)}
      fill="none"
      aria-hidden="true"
    >
      <defs>
        <clipPath id={clip}>
          <path d={bowl} />
        </clipPath>
      </defs>
      <g clipPath={`url(#${clip})`}>
        <rect
          className="glass-liquid-fill"
          x="0"
          y={level}
          width="32"
          height={40 - level}
          fill={liquid ?? "currentColor"}
          opacity="0.32"
        />
      </g>
      {stroke(glass)}
    </svg>
  );
}

function bowlPath(glass: Glass): string {
  switch (glass) {
    case "coupe":
      return "M4 8h24L18 20h-4L4 8Z";
    case "martini":
      return "M4 6h24L16 20 4 6Z";
    case "nick":
      return "M6 8c0-2 2-3 4-3h12c2 0 4 1 4 3L18 20h-4L6 8Z";
    case "flute":
      return "M12 4h8l-2 16h-4L12 4Z";
    case "wine":
      return "M8 4h16c0 8-4 14-8 14S8 12 8 4Z";
    case "highball":
    case "collins":
      return "M8 4h16v28H8V4Z";
    case "hurricane":
      return "M10 4h12l-1 8 3 10-2 12H10l-2-12 3-10-1-8Z";
    case "mug":
      return "M6 8h16v24H6V8Z";
    case "julep":
      return "M8 10c0-2 2-6 8-6s8 4 8 6v22H8V10Z";
    case "rocks":
    default:
      return "M7 8h18l-2 24H9L7 8Z";
  }
}

function stroke(glass: Glass) {
  const s = {
    stroke: "currentColor",
    strokeWidth: 1.4,
    strokeLinejoin: "round" as const,
    strokeLinecap: "round" as const,
  };
  switch (glass) {
    case "coupe":
      return (
        <>
          <path d="M4 8h24L18 20h-4L4 8Z" {...s} />
          <path d="M16 20v12" {...s} />
          <path d="M10 34h12" {...s} />
        </>
      );
    case "martini":
      return (
        <>
          <path d="M4 6h24L16 20 4 6Z" {...s} />
          <path d="M16 20v12" {...s} />
          <path d="M10 34h12" {...s} />
        </>
      );
    case "nick":
      return (
        <>
          <path d="M6 8c0-2 2-3 4-3h12c2 0 4 1 4 3L18 20h-4L6 8Z" {...s} />
          <path d="M16 20v12" {...s} />
          <path d="M10 34h12" {...s} />
        </>
      );
    case "flute":
      return (
        <>
          <path d="M12 4h8l-2 16h-4L12 4Z" {...s} />
          <path d="M16 20v12" {...s} />
          <path d="M11 34h10" {...s} />
        </>
      );
    case "wine":
      return (
        <>
          <path d="M8 4h16c0 8-4 14-8 14S8 12 8 4Z" {...s} />
          <path d="M16 18v14" {...s} />
          <path d="M10 34h12" {...s} />
        </>
      );
    case "highball":
    case "collins":
      return (
        <>
          <path d="M8 4h16v28H8V4Z" {...s} />
          <path d="M8 24h16" {...s} opacity={0.4} />
        </>
      );
    case "hurricane":
      return <path d="M10 4h12l-1 8 3 10-2 12H10l-2-12 3-10-1-8Z" {...s} />;
    case "mug":
      return (
        <>
          <path d="M6 8h16v24H6V8Z" {...s} />
          <path d="M22 12h4c2 0 4 2 4 6s-2 6-4 6h-4" {...s} />
        </>
      );
    case "julep":
      return <path d="M8 10c0-2 2-6 8-6s8 4 8 6v22H8V10Z" {...s} />;
    case "rocks":
    default:
      return (
        <>
          <path d="M7 8h18l-2 24H9L7 8Z" {...s} />
          <path d="M9 22h14" {...s} opacity={0.4} />
        </>
      );
  }
}
