import { Suspense, lazy, useCallback, useRef, useState, type ComponentType } from "react";
import ieeeIcon from "@/assets/icons/ieee_icon.svg";
import { cn } from "@/lib/utils";
import type { EmblemCanvasProps } from "./EmblemCanvas";

// three.js is large, so it loads after the page; if it cannot load, the flat emblem remains.
const EmblemCanvas = lazy<ComponentType<EmblemCanvasProps>>(() =>
  import("./EmblemCanvas").catch(() => ({ default: () => null }))
);

/**
 * The hero's 3D emblem. Renders a square box in the layout where the emblem sits, plus a canvas
 * that fills the nearest positioned ancestor, so the scene can spill past the box.
 */
export function IeeeEmblem({ className }: { className?: string }) {
  const anchorRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const markReady = useCallback(() => setReady(true), []);

  return (
    <>
      <div
        ref={anchorRef}
        className={cn(
          "relative grid aspect-square touch-pan-y place-items-center",
          ready && "cursor-grab active:cursor-grabbing",
          className
        )}
      >
        <div aria-hidden="true" className="absolute inset-[15%] -z-10 rounded-full bg-hk-accent/40 blur-3xl" />
        <img
          src={ieeeIcon}
          alt="IEEE emblem"
          width={54}
          height={55}
          draggable={false}
          className={cn(
            "size-1/2 transition-opacity duration-300 motion-reduce:transition-none",
            ready && "opacity-0"
          )}
        />
      </div>
      <Suspense fallback={null}>
        <EmblemCanvas anchorRef={anchorRef} onReady={markReady} />
      </Suspense>
    </>
  );
}
