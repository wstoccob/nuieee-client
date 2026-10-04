export type BigEventKind = "hackathon" | "conference";
export type BigEventStatus = "draft" | "published" | "archived";
export type YearOfStudy = "1" | "2" | "3" | "4" | "na";

export interface BigEvent {
  id: string;
  slug: string;
  title: string;
  kind: BigEventKind;
  description: string;
  heroImageUrl: string | null;
  startsAt: string;
  endsAt: string;
  registrationOpensAt: string;
  registrationClosesAt: string;
  capacity: number | null;
  status: BigEventStatus;
  minTeamSize: number;
  maxTeamSize: number;
  registrationOpen: boolean;
}

export interface BigEventAdmin extends BigEvent {
  isFeatured: boolean;
  teamCount: number;
}

export interface BigEventWrite {
  slug: string;
  title: string;
  kind: BigEventKind;
  description: string;
  heroImageUrl: string | null;
  startsAt: string;
  endsAt: string;
  registrationOpensAt: string;
  registrationClosesAt: string;
  capacity: number | null;
  status: BigEventStatus;
  isFeatured: boolean;
  minTeamSize: number;
  maxTeamSize: number;
}

export interface Member {
  fullName: string;
  email: string;
  nuId: string | null;
  yearOfStudy: YearOfStudy;
  major: string;
  isCaptain: boolean;
}

export interface AdminTeam {
  id: string;
  name: string;
  createdAt: string;
  members: Member[];
}

export interface TeamRegistration {
  teamName: string;
  consent: true;
  members: Member[];
  turnstileToken: string | null;
  /** Honeypot: real users always send an empty string. */
  website: string;
}

export interface RegistrationResult {
  teamId: string;
}
