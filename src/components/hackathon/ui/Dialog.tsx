import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { Button } from "./Button";
import { Field, Input } from "./form";

interface DialogProps {
  open: boolean;
  title: ReactNode;
  description?: ReactNode;
  dismissible?: boolean;
  onClose: () => void;
  children?: ReactNode;
  footer?: ReactNode;
}

/** A modal on top of the native <dialog>, which gives focus trapping, Esc and inert background for free. */
export function Dialog({ open, title, description, dismissible = true, onClose, children, footer }: DialogProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      onCancel={(event) => {
        event.preventDefault();
        if (dismissible) onClose();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget && dismissible) onClose();
      }}
      className="m-auto w-[calc(100%-2rem)] max-w-md rounded-2xl border border-white/10 bg-zinc-950 p-0 text-zinc-300 shadow-2xl shadow-black backdrop:bg-black/70 backdrop:backdrop-blur-sm"
    >
      {open && (
        <div className="p-5 sm:p-6">
          <h2 id={titleId} className="text-lg font-semibold text-white">
            {title}
          </h2>
          {description && <div className="mt-2 text-sm leading-relaxed text-zinc-400">{description}</div>}
          {children && <div className="mt-5">{children}</div>}
          {footer && <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">{footer}</div>}
        </div>
      )}
    </dialog>
  );
}

interface ConfirmDialogProps {
  open: boolean;
  title: ReactNode;
  description: ReactNode;
  confirmLabel: string;
  busy?: boolean;
  /** When set, the user has to type this exact text before confirming. */
  confirmText?: string;
  onConfirm: () => void;
  onClose: () => void;
}

type ConfirmBodyProps = Pick<ConfirmDialogProps, "confirmLabel" | "busy" | "confirmText" | "onConfirm" | "onClose">;

// Lives inside the dialog so it remounts, and forgets what was typed, every time the dialog opens.
function ConfirmBody({ confirmLabel, busy, confirmText, onConfirm, onClose }: ConfirmBodyProps) {
  const [typed, setTyped] = useState("");
  const matches = !confirmText || typed.trim() === confirmText.trim();

  return (
    <>
      {confirmText && (
        <Field
          label={
            <>
              Type <span className="font-semibold text-white">{confirmText}</span> to confirm
            </>
          }
        >
          {(control) => (
            <Input
              {...control}
              value={typed}
              autoComplete="off"
              onChange={(event) => setTyped(event.target.value)}
            />
          )}
        </Field>
      )}
      <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <Button variant="secondary" onClick={onClose} disabled={busy}>
          Cancel
        </Button>
        <Button variant="danger" onClick={onConfirm} loading={busy} disabled={!matches}>
          {confirmLabel}
        </Button>
      </div>
    </>
  );
}

export function ConfirmDialog({ open, title, description, busy, onClose, ...body }: ConfirmDialogProps) {
  return (
    <Dialog open={open} title={title} description={description} dismissible={!busy} onClose={onClose}>
      <ConfirmBody busy={busy} onClose={onClose} {...body} />
    </Dialog>
  );
}
