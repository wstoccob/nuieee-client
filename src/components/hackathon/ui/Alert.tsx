import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { AlertIcon, CheckIcon, InfoIcon } from "./icons";

type AlertTone = "info" | "warning" | "error" | "success";

const TONES: Record<AlertTone, { box: string; icon: ReactNode }> = {
  info: { box: "border-hk-accent-fg/25 bg-hk-accent/10 text-sky-100", icon: <InfoIcon className="size-5 text-hk-accent-fg" /> },
  warning: { box: "border-amber-400/30 bg-amber-500/10 text-amber-100", icon: <AlertIcon className="size-5 text-amber-300" /> },
  error: { box: "border-red-400/30 bg-red-500/10 text-red-100", icon: <AlertIcon className="size-5 text-red-300" /> },
  success: { box: "border-emerald-400/30 bg-emerald-500/10 text-emerald-100", icon: <CheckIcon className="size-5 text-emerald-300" /> },
};

interface AlertProps {
  tone?: AlertTone;
  title?: ReactNode;
  children?: ReactNode;
  className?: string;
}

export function Alert({ tone = "info", title, children, className }: AlertProps) {
  const { box, icon } = TONES[tone];
  return (
    <div
      role={tone === "error" ? "alert" : undefined}
      className={cn("flex gap-3 rounded-xl border p-4 text-sm leading-relaxed", box, className)}
    >
      <span className="mt-px">{icon}</span>
      <div className="min-w-0 space-y-1">
        {title && <p className="font-semibold">{title}</p>}
        {children && <div className="opacity-90">{children}</div>}
      </div>
    </div>
  );
}
