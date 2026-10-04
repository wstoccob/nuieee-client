import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Card({ className, ...props }: ComponentProps<"section">) {
  return (
    <section
      className={cn("rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:p-6", className)}
      {...props}
    />
  );
}

interface CardHeaderProps {
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  icon?: ReactNode;
  id?: string;
}

export function CardHeader({ title, description, action, icon, id }: CardHeaderProps) {
  return (
    <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
      <div className="flex min-w-0 items-start gap-3">
        {icon && (
          <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-lg bg-hk-accent/15 text-hk-accent-fg">
            {icon}
          </span>
        )}
        <div className="min-w-0">
          <h2 id={id} className="text-base font-semibold text-white sm:text-lg">
            {title}
          </h2>
          {description && <p className="mt-1 text-sm text-zinc-400">{description}</p>}
        </div>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
