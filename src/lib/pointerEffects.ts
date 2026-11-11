import type { PointerEvent } from "react";

const MAX_TILT_DEGREES = 6;

/**
 * Publishes the mouse position over an element as CSS variables, for the `spotlight`
 * and `tilt` classes. Touch and pen are ignored: there is no hover to follow.
 */
export function trackPointer(event: PointerEvent<HTMLElement>) {
  if (event.pointerType !== "mouse") return;
  const element = event.currentTarget;
  const box = element.getBoundingClientRect();
  const x = event.clientX - box.left;
  const y = event.clientY - box.top;

  element.style.setProperty("--pointer-x", `${x}px`);
  element.style.setProperty("--pointer-y", `${y}px`);
  element.style.setProperty("--tilt-x", `${(0.5 - y / box.height) * 2 * MAX_TILT_DEGREES}deg`);
  element.style.setProperty("--tilt-y", `${(x / box.width - 0.5) * 2 * MAX_TILT_DEGREES}deg`);
}

export function releasePointer(event: PointerEvent<HTMLElement>) {
  event.currentTarget.style.removeProperty("--tilt-x");
  event.currentTarget.style.removeProperty("--tilt-y");
}
