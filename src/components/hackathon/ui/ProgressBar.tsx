import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number;
  label: string;
  indeterminate?: boolean;
  className?: string;
}

export function ProgressBar({ value, label, indeterminate, className }: ProgressBarProps) {
  const percent = Math.round(Math.min(Math.max(value, 0), 1) * 100);
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={indeterminate ? undefined : percent}
      className={cn("h-2 w-full overflow-hidden rounded-full bg-white/[0.08]", className)}
    >
      <div
        className={cn(
          "h-full rounded-full bg-hk-accent-fg transition-[width] duration-200",
          indeterminate && "w-1/3 animate-pulse"
        )}
        style={indeterminate ? undefined : { width: `${percent}%` }}
      />
    </div>
  );
}
