import { useEffect, useRef, useState } from "react";
import type { VariantProps } from "class-variance-authority";
import { toast } from "sonner";
import { copyText } from "@/lib/clipboard";
import { cn } from "@/lib/utils";
import { Button } from "./Button";
import { CheckIcon, CopyIcon } from "./icons";
import type { buttonStyles } from "./styles";

interface CopyButtonProps extends VariantProps<typeof buttonStyles> {
  text: string;
  label?: string;
  className?: string;
  onCopied?: () => void;
}

export function CopyButton({ text, label = "Copy", variant = "secondary", size, className, onCopied }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const copy = async () => {
    if (!(await copyText(text))) {
      toast.error("Couldn't copy automatically. Select the text and copy it by hand.");
      return;
    }
    setCopied(true);
    onCopied?.();
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Button variant={variant} size={size} className={className} onClick={copy}>
      {copied ? <CheckIcon className="text-emerald-300" /> : <CopyIcon />}
      <span aria-live="polite">{copied ? "Copied" : label}</span>
    </Button>
  );
}

interface CopyFieldProps {
  value: string;
  label: string;
  className?: string;
  onCopied?: () => void;
}

export function CopyField({ value, label, className, onCopied }: CopyFieldProps) {
  return (
    <div className={cn("flex flex-col gap-2 sm:flex-row sm:items-stretch", className)}>
      <output
        aria-label={label}
        className="min-w-0 flex-1 rounded-xl border border-white/10 bg-black/40 px-3.5 py-3 font-mono text-sm leading-relaxed break-all text-white select-all"
      >
        {value}
      </output>
      <CopyButton text={value} label="Copy link" variant="primary" size="lg" className="sm:h-auto" onCopied={onCopied} />
    </div>
  );
}
