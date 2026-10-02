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
  caseSelectionOpensAt: string | null;
  submissionsOpenAt: string | null;
  submissionsCloseAt: string | null;
  registrationOpen: boolean;
  casesVisible: boolean;
  caseSelectionOpen: boolean;
  submissionsOpen: boolean;
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
  caseSelectionOpensAt: string | null;
  submissionsOpenAt: string | null;
  submissionsCloseAt: string | null;
}

export interface Case {
  id: string;
  company: string;
  title: string;
  description: string;
  sortOrder: number;
  attachmentFilename: string | null;
  attachmentSizeBytes: number | null;
  hasAttachment: boolean;
}

export interface CaseWrite {
  company: string;
  title: string;
  description: string;
  sortOrder: number;
}

export interface Member {
  fullName: string;
  email: string;
  nuId: string | null;
  yearOfStudy: YearOfStudy;
  major: string;
  isCaptain: boolean;
}

export interface Submission {
  originalFilename: string;
  contentType: string;
  sizeBytes: number;
  submittedAt: string;
}

export interface TeamDashboard {
  id: string;
  name: string;
  createdAt: string;
  members: Member[];
  event: BigEvent;
  case: Case | null;
  cases: Case[];
  submission: Submission | null;
  submissionMaxBytes: number;
}

export interface AdminTeam {
  id: string;
  name: string;
  createdAt: string;
  members: Member[];
  case: Case | null;
  submission: (Submission & { id: string }) | null;
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
  accessToken: string;
}

export interface PostUploadTarget {
  url: string;
  fields: Record<string, string>;
  objectKey: string;
  maxBytes: number;
}

export interface UploadRequest {
  filename: string;
  sizeBytes: number;
}

export interface UploadConfirm {
  objectKey: string;
  filename: string;
}

export interface DownloadLink {
  url: string;
}
