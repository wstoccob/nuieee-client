import type { FieldErrors, UseFormRegister } from "react-hook-form";
import { YEAR_OF_STUDY_OPTIONS } from "@/config/hackathon";
import { cn } from "@/lib/utils";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { Field, Input, Select } from "../ui/form";
import { TrashIcon } from "../ui/icons";
import type { RegistrationValues } from "./schema";

interface MemberFieldsProps {
  index: number;
  memberKey: string;
  isCaptain: boolean;
  canRemove: boolean;
  register: UseFormRegister<RegistrationValues>;
  errors: FieldErrors<RegistrationValues>;
  onRemove: () => void;
}

export function MemberFields({ index, memberKey, isCaptain, canRemove, register, errors, onRemove }: MemberFieldsProps) {
  const memberErrors = errors.members?.[index];
  const path = `members.${index}` as const;
  const headingId = `member-${memberKey}-heading`;
  // Browsers can autofill the first block for the person filling in the form; the rest are teammates.
  const fill = (token: string) => (index === 0 ? token : "off");

  return (
    <section
      aria-labelledby={headingId}
      className={cn(
        "rounded-2xl border p-4 transition-colors sm:p-6",
        isCaptain ? "border-hk-accent-fg/30 bg-hk-accent/[0.06]" : "border-white/10 bg-white/[0.03]"
      )}
    >
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="grid size-7 place-items-center rounded-full bg-white/[0.08] text-xs font-semibold text-zinc-200">
            {index + 1}
          </span>
          <h3 id={headingId} className="text-base font-semibold text-white">
            {isCaptain ? "Team captain" : `Member ${index + 1}`}
          </h3>
          {isCaptain && <Badge tone="blue">Captain</Badge>}
        </div>
        <div className="flex items-center gap-1">
          <label className="inline-flex h-9 cursor-pointer items-center gap-2 rounded-lg px-2.5 text-sm text-zinc-300 hover:bg-white/[0.05] has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-hk-accent-fg/70">
            <input
              type="radio"
              value={memberKey}
              className="size-4 cursor-pointer accent-hk-accent outline-none"
              {...register("captainKey")}
            />
            Captain
          </label>
          {canRemove && (
            <Button variant="dangerGhost" size="sm" onClick={onRemove} aria-label={`Remove member ${index + 1}`}>
              <TrashIcon />
              <span className="hidden sm:inline">Remove</span>
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Full name" error={memberErrors?.fullName?.message}>
          {(control) => (
            <Input {...control} autoComplete={fill("name")} placeholder="Aruzhan Sarsenova" {...register(`${path}.fullName`)} />
          )}
        </Field>
        <Field label="Email" error={memberErrors?.email?.message}>
          {(control) => (
            <Input
              {...control}
              type="email"
              inputMode="email"
              autoCapitalize="none"
              spellCheck={false}
              autoComplete={fill("email")}
              placeholder="name@nu.edu.kz"
              {...register(`${path}.email`)}
            />
          )}
        </Field>
        <Field
          label="NU ID"
          optional
          hint="Not an NU student? Leave this blank."
          error={memberErrors?.nuId?.message}
        >
          {(control) => <Input {...control} autoComplete="off" placeholder="e.g. 202312345" {...register(`${path}.nuId`)} />}
        </Field>
        <Field label="Year of study" error={memberErrors?.yearOfStudy?.message}>
          {(control) => (
            <Select {...control} {...register(`${path}.yearOfStudy`)}>
              <option value="" disabled>
                Select year
              </option>
              {YEAR_OF_STUDY_OPTIONS.map(({ value, label }) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </Select>
          )}
        </Field>
        <Field label="Major" className="sm:col-span-2" error={memberErrors?.major?.message}>
          {(control) => <Input {...control} autoComplete="off" placeholder="Computer Science" {...register(`${path}.major`)} />}
        </Field>
      </div>
    </section>
  );
}
