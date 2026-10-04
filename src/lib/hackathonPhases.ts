import type { BigEvent } from "@/dtos/hackathon";
import { formatDateTimeRange, formatRelative, isFuture } from "./datetime";

export type PhaseState = "open" | "upcoming" | "closed";

export interface Phase {
  key: "registration" | "event";
  label: string;
  description: string;
  start: string;
  end: string;
  state: PhaseState;
  openLabel: string;
  startVerb: string;
  endVerb: string;
}

function stateFromClock(start: string, end: string): PhaseState {
  if (isFuture(start)) return "upcoming";
  return isFuture(end) ? "open" : "closed";
}

export function eventPhases(event: BigEvent): Phase[] {
  return [
    {
      key: "registration",
      label: "Registration",
      description: "Sign up your team on this page",
      start: event.registrationOpensAt,
      end: event.registrationClosesAt,
      // The server's flag is the source of truth for registration; the browser clock only
      // tells "not yet" apart from "already over".
      state: event.registrationOpen ? "open" : isFuture(event.registrationOpensAt) ? "upcoming" : "closed",
      openLabel: "Open now",
      startVerb: "Opens",
      endVerb: "Closes",
    },
    {
      key: "event",
      label: event.kind === "hackathon" ? "Hackathon" : "Conference",
      description: "Cases and submission details come from the organisers by email",
      start: event.startsAt,
      end: event.endsAt,
      state: stateFromClock(event.startsAt, event.endsAt),
      openLabel: "Happening now",
      startVerb: "Starts",
      endVerb: "Ends",
    },
  ];
}

export function phaseWindow({ start, end }: Pick<Phase, "start" | "end">): string {
  return formatDateTimeRange(start, end);
}

export function phaseCountdown({ state, start, end, startVerb, endVerb }: Phase): string | null {
  if (state === "open") return `${endVerb} ${formatRelative(end)}`;
  if (state === "upcoming") return `${startVerb} ${formatRelative(start)}`;
  return null;
}

export function teamSizeLabel({ minTeamSize, maxTeamSize }: Pick<BigEvent, "minTeamSize" | "maxTeamSize">): string {
  return minTeamSize === maxTeamSize
    ? `${minTeamSize} people per team`
    : `${minTeamSize}–${maxTeamSize} people per team`;
}
