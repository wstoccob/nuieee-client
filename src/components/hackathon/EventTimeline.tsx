import { cn } from "@/lib/utils";
import { localTimeZone } from "@/lib/datetime";
import { eventPhases, phaseCountdown, phaseWindow, type Phase, type PhaseState } from "@/lib/hackathonPhases";
import type { BigEvent } from "@/dtos/hackathon";
import { Badge, type BadgeTone } from "./ui/Badge";
import { CheckIcon } from "./ui/icons";

const STATE_BADGE: Record<Exclude<PhaseState, "open">, { tone: BadgeTone; label: string }> = {
  upcoming: { tone: "neutral", label: "Upcoming" },
  closed: { tone: "neutral", label: "Closed" },
};

function Marker({ state }: { state: PhaseState }) {
  if (state === "closed") {
    return (
      <span className="relative z-10 grid size-6 shrink-0 place-items-center rounded-full bg-zinc-800 text-zinc-400 ring-4 ring-black">
        <CheckIcon className="size-3.5" />
      </span>
    );
  }
  if (state === "open") {
    return (
      <span className="relative z-10 grid size-6 shrink-0 place-items-center rounded-full bg-hk-accent/25 ring-4 ring-black">
        <span className="size-2.5 animate-pulse rounded-full bg-hk-accent-fg" />
      </span>
    );
  }
  return (
    <span className="relative z-10 size-6 shrink-0 rounded-full border-2 border-white/15 bg-black ring-4 ring-black" />
  );
}

function PhaseItem({ phase, last }: { phase: Phase; last: boolean }) {
  const badge = phase.state === "open" ? { tone: "blue" as const, label: phase.openLabel } : STATE_BADGE[phase.state];
  const countdown = phaseCountdown(phase);
  return (
    <li className="relative flex gap-4 pb-7 last:pb-0 sm:flex-col sm:gap-4 sm:pb-0">
      {!last && (
        <span
          aria-hidden="true"
          className="absolute top-6 bottom-0 left-[11px] w-px bg-white/10 sm:top-[11px] sm:right-[-1.5rem] sm:bottom-auto sm:left-6 sm:h-px sm:w-auto"
        />
      )}
      <Marker state={phase.state} />
      <div className="min-w-0 space-y-1.5">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className={cn("text-sm font-semibold", phase.state === "open" ? "text-white" : "text-zinc-200")}>
            {phase.label}
          </h3>
          <Badge tone={badge.tone}>{badge.label}</Badge>
        </div>
        <p className="text-sm text-zinc-400">{phase.description}</p>
        <p className="text-sm text-zinc-300">{phaseWindow(phase)}</p>
        {countdown && <p className="text-xs font-medium text-hk-accent-fg">{countdown}</p>}
      </div>
    </li>
  );
}

export function EventTimeline({ event }: { event: BigEvent }) {
  const phases = eventPhases(event);
  return (
    <div>
      <ol className="grid sm:grid-cols-2 sm:gap-6">
        {phases.map((phase, index) => (
          <PhaseItem key={phase.key} phase={phase} last={index === phases.length - 1} />
        ))}
      </ol>
      <p className="mt-6 text-xs text-zinc-500">Times are shown in your local time zone ({localTimeZone()}).</p>
    </div>
  );
}
