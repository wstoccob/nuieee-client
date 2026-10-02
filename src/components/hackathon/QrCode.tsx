import { useEffect, useState } from "react";
import { Spinner } from "./ui/Spinner";

async function renderQr(value: string): Promise<string> {
  // Loaded on demand so the QR encoder stays out of every other page's bundle.
  const module = await import("qrcode");
  const qr = module.default ?? module;
  return qr.toDataURL(value, { margin: 1, width: 480, errorCorrectionLevel: "M" });
}

export function QrCode({ value, label }: { value: string; label: string }) {
  const [rendered, setRendered] = useState<{ value: string; src: string | null } | null>(null);

  useEffect(() => {
    let cancelled = false;
    renderQr(value)
      .then((src) => !cancelled && setRendered({ value, src }))
      .catch(() => !cancelled && setRendered({ value, src: null }));
    return () => {
      cancelled = true;
    };
  }, [value]);

  const current = rendered?.value === value ? rendered : null;

  return (
    <div className="grid size-48 place-items-center rounded-2xl bg-white p-2.5">
      {current?.src ? (
        <img src={current.src} alt={label} className="size-full [image-rendering:pixelated]" />
      ) : current ? (
        <p className="px-3 text-center text-xs text-zinc-600">Couldn't draw the QR code. Use the link instead.</p>
      ) : (
        <Spinner className="size-6 text-zinc-500" />
      )}
    </div>
  );
}
