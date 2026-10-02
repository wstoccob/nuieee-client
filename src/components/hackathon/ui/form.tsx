import { useId, type ComponentProps, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { controlStyles } from "./styles";
import { AlertIcon, ChevronDownIcon } from "./icons";

export interface ControlProps {
  id: string;
  "aria-invalid"?: boolean;
  "aria-describedby"?: string;
}

interface FieldProps {
  label: ReactNode;
  hint?: ReactNode;
  error?: string;
  optional?: boolean;
  className?: string;
  children: (control: ControlProps) => ReactNode;
}

export function FieldError({ id, message }: { id?: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="flex items-start gap-1.5 text-sm text-red-300">
      <AlertIcon className="mt-0.5 size-3.5" />
      {message}
    </p>
  );
}

export function Field({ label, hint, error, optional, className, children }: FieldProps) {
  const id = useId();
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;
  const describedBy = [hint ? hintId : null, error ? errorId : null].filter(Boolean).join(" ");

  return (
    <div className={cn("space-y-1.5", className)}>
      <label htmlFor={id} className="flex items-baseline justify-between gap-2 text-sm font-medium text-zinc-200">
        <span>{label}</span>
        {optional && <span className="text-xs font-normal text-zinc-500">Optional</span>}
      </label>
      {children({
        id,
        "aria-invalid": error ? true : undefined,
        "aria-describedby": describedBy || undefined,
      })}
      {hint && (
        <p id={hintId} className="text-xs leading-relaxed text-zinc-500">
          {hint}
        </p>
      )}
      <FieldError id={errorId} message={error} />
    </div>
  );
}

export function Input({ className, ...props }: ComponentProps<"input">) {
  return <input className={cn(controlStyles, "h-11", className)} {...props} />;
}

export function Textarea({ className, ...props }: ComponentProps<"textarea">) {
  return <textarea className={cn(controlStyles, "min-h-28 py-2.5 leading-relaxed", className)} {...props} />;
}

export function Select({ className, children, ...props }: ComponentProps<"select">) {
  return (
    <div className="relative">
      <select
        className={cn(controlStyles, "h-11 cursor-pointer appearance-none pr-10 [&>option]:bg-zinc-900", className)}
        {...props}
      >
        {children}
      </select>
      <ChevronDownIcon className="pointer-events-none absolute top-1/2 right-3.5 -translate-y-1/2 text-zinc-500" />
    </div>
  );
}

type CheckboxProps = Omit<ComponentProps<"input">, "type"> & {
  label: ReactNode;
  description?: ReactNode;
  error?: string;
};

export function Checkbox({ label, description, error, className, ...props }: CheckboxProps) {
  const id = useId();
  const errorId = `${id}-error`;
  return (
    <div className={cn("space-y-1.5", className)}>
      <label htmlFor={id} className="flex cursor-pointer items-start gap-3">
        <input
          id={id}
          type="checkbox"
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          className="mt-0.5 size-5 shrink-0 cursor-pointer rounded accent-hk-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hk-accent-fg"
          {...props}
        />
        <span className="text-sm leading-relaxed">
          <span className="font-medium text-zinc-100">{label}</span>
          {description && <span className="mt-0.5 block text-zinc-400">{description}</span>}
        </span>
      </label>
      <FieldError id={errorId} message={error} />
    </div>
  );
}
