import { useEffect, useRef, type RefObject } from "react";
import { mountEmblem } from "./mountEmblem";

export interface EmblemCanvasProps {
  anchorRef: RefObject<HTMLElement | null>;
  onReady: () => void;
}

export default function EmblemCanvas({ anchorRef, onReady }: EmblemCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current || !anchorRef.current) return;
    try {
      return mountEmblem(canvasRef.current, anchorRef.current, onReady);
    } catch {
      // No WebGL: the static emblem in the anchor stays visible.
      return;
    }
  }, [anchorRef, onReady]);

  // Spans the hero, edge to edge of the window, behind its content.
  return (
    <div aria-hidden="true" className="pointer-events-none absolute -top-12 bottom-0 left-1/2 -z-10 w-screen -translate-x-1/2">
      <canvas ref={canvasRef} className="block size-full" />
    </div>
  );
}
