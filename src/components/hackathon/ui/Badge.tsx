import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type BadgeTone = "neutral" | "blue" | "green" | "amber" | "red";

const TONES: Record<BadgeTone, string> = {
  neutral: "bg-white/[0.06] text-zinc-300 ring-white/10",
  blue: "bg-hk-accent/15 text-hk-accent-fg ring-hk-accent-fg/25",
  green: "bg-emerald-500/10 text-emerald-300 ring-emerald-400/25",
  amber: "bg-amber-500/10 text-amber-300 ring-amber-400/25",
  red: "bg-red-500/10 text-red-300 ring-red-400/25",
};

interface BadgeProps {
  tone?: BadgeTone;
  icon?: ReactNode;
  className?: string;
  children: ReactNode;
}

export function Badge({ tone = "neutral", icon, className, children }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset",
        TONES[tone],
        className
      )}
    >
      {icon}
      {children}
    </span>
  );
}
