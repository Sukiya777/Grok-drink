import { type ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "ghost" | "outline" | "quiet";
type Size = "sm" | "md" | "icon" | "pill";

const BASE =
  "inline-flex items-center justify-center gap-2 font-medium transition-[opacity,transform,background-color,color,border-color] duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 disabled:pointer-events-none disabled:opacity-40 active:not-disabled:scale-[0.96]";

const VARIANTS: Record<Variant, string> = {
  primary: "bg-accent text-accent-fg hover:opacity-90",
  ghost: "bg-transparent text-fg hover:bg-elevated",
  outline: "border border-line bg-transparent text-fg hover:bg-elevated",
  quiet: "bg-transparent text-muted hover:text-fg hover:bg-elevated",
};

const SIZES: Record<Size, string> = {
  sm: "h-9 rounded-sm px-3 text-sm",
  md: "h-11 rounded-md px-4 text-sm",
  icon: "size-11 rounded-md",
  pill: "h-9 rounded-full px-4 text-sm",
};

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant = "primary", size = "md", type = "button", ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      className={cn(BASE, VARIANTS[variant], SIZES[size], className)}
      {...props}
    />
  );
});
