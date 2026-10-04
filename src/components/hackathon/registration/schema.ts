import { z } from "zod";
import type { Member, TeamRegistration, YearOfStudy } from "@/dtos/hackathon";
import { YEAR_OF_STUDY_OPTIONS } from "@/config/hackathon";

// Same shape the API accepts, so the browser and the server reject the same input.
const EMAIL_PATTERN = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
const YEARS = YEAR_OF_STUDY_OPTIONS.map((option) => option.value as string);

const memberSchema = z.object({
  key: z.string(),
  fullName: z.string().trim().min(2, "Enter the full name").max(255, "Keep it under 255 characters"),
  email: z
    .string()
    .trim()
    .min(1, "Enter an email address")
    .max(255, "Keep it under 255 characters")
    .regex(EMAIL_PATTERN, "Enter a valid email address"),
  nuId: z.string().trim().max(32, "An NU ID is at most 32 characters"),
  yearOfStudy: z.string().refine((value) => YEARS.includes(value), "Choose a year of study"),
  major: z.string().trim().min(1, "Enter the major").max(255, "Keep it under 255 characters"),
});

export function registrationSchema(minMembers: number, maxMembers: number) {
  return z
    .object({
      teamName: z
        .string()
        .trim()
        .min(2, "The team name needs at least 2 characters")
        .max(100, "Keep the team name under 100 characters"),
      members: z
        .array(memberSchema)
        .min(minMembers, `A team needs at least ${minMembers} members`)
        .max(maxMembers, `A team can have at most ${maxMembers} members`),
      captainKey: z.string(),
      consent: z.boolean().refine((value) => value, "You need to agree before registering"),
      website: z.string(),
    })
    .superRefine((values, ctx) => {
      if (!values.members.some((member) => member.key === values.captainKey)) {
        ctx.addIssue({ code: "custom", path: ["captainKey"], message: "Choose a team captain" });
      }
      const seen = new Set<string>();
      values.members.forEach((member, index) => {
        const email = member.email.trim().toLowerCase();
        if (seen.has(email)) {
          ctx.addIssue({
            code: "custom",
            path: ["members", index, "email"],
            message: "Each member needs their own email address",
          });
        }
        seen.add(email);
      });
    });
}

export type RegistrationValues = z.infer<ReturnType<typeof registrationSchema>>;
export type MemberValues = RegistrationValues["members"][number];

const newKey = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;

export function emptyMember(): MemberValues {
  return { key: newKey(), fullName: "", email: "", nuId: "", yearOfStudy: "", major: "" };
}

export function emptyRegistration(minMembers: number): RegistrationValues {
  const members = Array.from({ length: Math.max(minMembers, 1) }, emptyMember);
  return { teamName: "", members, captainKey: members[0].key, consent: false, website: "" };
}

function toMember(member: MemberValues, captainKey: string): Member {
  return {
    fullName: member.fullName.trim(),
    email: member.email.trim(),
    nuId: member.nuId.trim() || null,
    yearOfStudy: member.yearOfStudy as YearOfStudy,
    major: member.major.trim(),
    isCaptain: member.key === captainKey,
  };
}

export function toRegistration(values: RegistrationValues, turnstileToken: string | null): TeamRegistration {
  return {
    teamName: values.teamName.trim(),
    consent: true,
    members: values.members.map((member) => toMember(member, values.captainKey)),
    turnstileToken,
    website: values.website,
  };
}
