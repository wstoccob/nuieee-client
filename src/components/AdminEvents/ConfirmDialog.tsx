import { Button } from "@/components/ui/button";

interface Props {
  open: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  busy?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export const ConfirmDialog = ({
  open,
  title,
  message,
  confirmLabel,
  busy,
  onCancel,
  onConfirm,
}: Props) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-black border-2 border-ieee-blue rounded-lg shadow-2xl w-full max-w-md p-8">
        <h2 className="text-2xl font-bold text-ieee-blue mb-4 uppercase">{title}</h2>
        <p className="text-white text-lg mb-8">{message}</p>
        <div className="flex justify-end gap-4">
          <Button
            variant="outline"
            onClick={onCancel}
            disabled={busy}
            className="border-white text-black"
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            disabled={busy}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
};
