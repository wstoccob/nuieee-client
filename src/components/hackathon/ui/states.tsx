import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Button } from "./Button";
import { Spinner } from "./Spinner";
import { AlertIcon } from "./icons";

export function PageLoader({ label = "Loading…" }: { label?: string }) {
  return (
    <div role="status" className="flex flex-col items-center justify-center gap-3 py-24 text-sm text-zinc-400">
      <Spinner className="size-6 text-hk-accent-fg" />
      {label}
    </div>
  );
}

interface EmptyStateProps {
  icon?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center rounded-2xl border border-dashed border-white/10 px-6 py-10 text-center",
        className
      )}
    >
      {icon && (
        <span className="mb-4 grid size-11 place-items-center rounded-full bg-white/[0.05] text-zinc-400 [&>svg]:size-5">
          {icon}
        </span>
      )}
      <p className="text-base font-semibold text-white">{title}</p>
      {description && <div className="mt-1.5 max-w-md text-sm leading-relaxed text-zinc-400">{description}</div>}
      {action && <div className="mt-5 flex flex-wrap justify-center gap-2">{action}</div>}
    </div>
  );
}

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  retrying?: boolean;
}

export function ErrorState({ title = "Something went wrong", message, onRetry, retrying }: ErrorStateProps) {
  return (
    <div role="alert" className="flex flex-col items-center rounded-2xl border border-red-400/20 bg-red-500/[0.06] px-6 py-10 text-center">
      <span className="mb-4 grid size-11 place-items-center rounded-full bg-red-500/10 text-red-300">
        <AlertIcon className="size-5" />
      </span>
      <p className="text-base font-semibold text-white">{title}</p>
      <p className="mt-1.5 max-w-md text-sm text-zinc-400">{message}</p>
      {onRetry && (
        <Button variant="secondary" size="sm" className="mt-5" onClick={onRetry} loading={retrying}>
          Try again
        </Button>
      )}
    </div>
  );
}
