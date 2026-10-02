import { useId, useState, type DragEvent, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { UploadIcon } from "./icons";

interface DropzoneProps {
  accept: string;
  title: ReactNode;
  hint?: ReactNode;
  disabled?: boolean;
  onFile: (file: File) => void;
}

export function Dropzone({ accept, title, hint, disabled, onFile }: DropzoneProps) {
  const id = useId();
  const [dragging, setDragging] = useState(false);

  const onDragOver = (event: DragEvent) => {
    event.preventDefault();
    if (!disabled) setDragging(true);
  };

  const onDrop = (event: DragEvent) => {
    event.preventDefault();
    setDragging(false);
    const file = event.dataTransfer.files[0];
    if (file && !disabled) onFile(file);
  };

  return (
    <label
      htmlFor={id}
      onDragOver={onDragOver}
      onDragLeave={() => setDragging(false)}
      onDrop={onDrop}
      className={cn(
        "flex cursor-pointer flex-col items-center gap-2 rounded-2xl border border-dashed px-6 py-8 text-center transition-colors",
        "has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-hk-accent-fg/70 has-[:focus-visible]:ring-offset-2 has-[:focus-visible]:ring-offset-black",
        dragging
          ? "border-hk-accent-fg bg-hk-accent/10"
          : "border-white/15 bg-white/[0.02] hover:border-white/25 hover:bg-white/[0.04]",
        disabled && "pointer-events-none cursor-not-allowed opacity-50"
      )}
    >
      <input
        id={id}
        type="file"
        accept={accept}
        disabled={disabled}
        className="sr-only"
        onChange={(event) => {
          const file = event.target.files?.[0];
          event.target.value = "";
          if (file) onFile(file);
        }}
      />
      <span className="pointer-events-none grid size-11 place-items-center rounded-full bg-hk-accent/15 text-hk-accent-fg">
        <UploadIcon className="size-5" />
      </span>
      <span className="pointer-events-none text-sm font-medium text-white">{title}</span>
      {hint && <span className="pointer-events-none text-xs text-zinc-500">{hint}</span>}
    </label>
  );
}
