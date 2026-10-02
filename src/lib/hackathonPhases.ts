import type { BigEvent } from "@/dtos/hackathon";
import { formatDateTime, formatDateTimeRange, formatRelative, isFuture } from "./datetime";

export type PhaseState = "open" | "upcoming" | "closed" | "unscheduled";

export interface Phase {
  key: "registration" | "cases" | "submissions";
  label: string;
  description: string;
  start: string | null;
  end: string | null;
  state: PhaseState;
}

// The open flags come from the server and are the source of truth; the browser clock is
// only used to tell "not yet" apart from "already over" for display.
function phaseState(open: boolean, start: string | null): PhaseState {
  if (open) return "open";
  if (start === null) return "unscheduled";
  return isFuture(start) ? "upcoming" : "closed";
}

export function eventPhases(event: BigEvent): Phase[] {
  return [
    {
      key: "registration",
      label: "Registration",
      description: "Sign up your team",
      start: event.registrationOpensAt,
      end: event.registrationClosesAt,
      state: phaseState(event.registrationOpen, event.registrationOpensAt),
    },
    {
      key: "cases",
      label: "Case selection",
      description: "Pick the case your team will solve",
      start: event.caseSelectionOpensAt,
      end: event.submissionsCloseAt,
      state: phaseState(event.caseSelectionOpen, event.caseSelectionOpensAt),
    },
    {
      key: "submissions",
      label: "Submissions",
      description: "Upload your final solution",
      start: event.submissionsOpenAt,
      end: event.submissionsCloseAt,
      state: phaseState(event.submissionsOpen, event.submissionsOpenAt),
    },
  ];
}

export function phaseWindow({ start, end }: Pick<Phase, "start" | "end">): string {
  if (start && end) return formatDateTimeRange(start, end);
  if (start) return `From ${formatDateTime(start)}`;
  return "Dates to be announced";
}

export function phaseCountdown({ state, start, end }: Phase): string | null {
  if (state === "open" && end) return `Closes ${formatRelative(end)}`;
  if (state === "upcoming" && start) return `Opens ${formatRelative(start)}`;
  return null;
}

export function teamSizeLabel({ minTeamSize, maxTeamSize }: Pick<BigEvent, "minTeamSize" | "maxTeamSize">): string {
  return minTeamSize === maxTeamSize
    ? `${minTeamSize} people per team`
    : `${minTeamSize}–${maxTeamSize} people per team`;
}
