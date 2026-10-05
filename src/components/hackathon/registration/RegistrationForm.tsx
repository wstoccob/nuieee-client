import { useEffect, useMemo, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { errorMessage } from "@/api/client";
import { TURNSTILE_SITE_KEY } from "@/config/hackathon";
import { useRegisterTeam } from "@/hooks/useHackathons";
import type { BigEvent, Member } from "@/dtos/hackathon";
import { Alert } from "../ui/Alert";
import { Button } from "../ui/Button";
import { Card, CardHeader } from "../ui/Card";
import { Checkbox, Field, FieldError, Input } from "../ui/form";
import { PlusIcon } from "../ui/icons";
import { Turnstile } from "../Turnstile";
import { MemberFields } from "./MemberFields";
import { clearDraft, loadDraft, saveDraft } from "./draft";
import { emptyMember, emptyRegistration, registrationSchema, toRegistration, type RegistrationValues } from "./schema";

export interface Registered {
  teamName: string;
  members: Member[];
}

interface RegistrationFormProps {
  event: BigEvent;
  onRegistered: (registered: Registered) => void;
}

export function RegistrationForm({ event, onRegistered }: RegistrationFormProps) {
  const { slug, minTeamSize, maxTeamSize } = event;
  const schema = useMemo(() => registrationSchema(minTeamSize, maxTeamSize), [minTeamSize, maxTeamSize]);
  const registerTeam = useRegisterTeam(slug);
  const [serverError, setServerError] = useState<string | null>(null);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [turnstileReset, setTurnstileReset] = useState(0);

  const form = useForm<RegistrationValues>({
    resolver: zodResolver(schema),
    defaultValues: loadDraft(slug, minTeamSize, maxTeamSize) ?? emptyRegistration(minTeamSize),
    mode: "onTouched",
  });
  const { register, control, formState, getValues, setValue, watch, handleSubmit } = form;
  const { errors, isSubmitting, submitCount } = formState;
  const { fields, append, remove } = useFieldArray({ control, name: "members" });
  const captainKey = watch("captainKey");

  useEffect(() => {
    const subscription = watch((values) => saveDraft(slug, values as Partial<RegistrationValues>));
    return () => subscription.unsubscribe();
  }, [watch, slug]);

  const removeMember = (index: number) => {
    const removedKey = getValues(`members.${index}.key`);
    remove(index);
    if (removedKey === getValues("captainKey")) {
      setValue("captainKey", getValues("members.0.key"), { shouldValidate: submitCount > 0 });
    }
  };

  const onSubmit = async (values: RegistrationValues) => {
    setServerError(null);
    try {
      const registration = toRegistration(values, turnstileToken);
      await registerTeam.mutateAsync(registration);
      clearDraft(slug);
      onRegistered({ teamName: registration.teamName, members: registration.members });
    } catch (error) {
      const message = errorMessage(error, "Registration failed. Please check your connection and try again.");
      setServerError(message);
      toast.error(message);
      if (TURNSTILE_SITE_KEY) {
        setTurnstileToken(null);
        setTurnstileReset((count) => count + 1);
      }
    }
  };

  const needsVerification = Boolean(TURNSTILE_SITE_KEY) && !turnstileToken;
  const hasErrors = Object.keys(errors).length > 0;
  const membersError = errors.members?.root?.message ?? errors.members?.message;

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      <Card>
        <CardHeader title="Team" description="Pick a name that's easy to recognise. It has to be unique for this event." />
        <Field label="Team name" error={errors.teamName?.message}>
          {(control) => <Input {...control} autoComplete="off" placeholder="e.g. Signal Boost" {...register("teamName")} />}
        </Field>
      </Card>

      <div className="space-y-1 pt-3">
        <h2 className="text-lg font-semibold text-white">Members</h2>
        <p className="text-sm text-zinc-400">
          {minTeamSize === maxTeamSize
            ? `Teams have exactly ${minTeamSize} members.`
            : `Teams have ${minTeamSize} to ${maxTeamSize} members.`}{" "}
          Mark one of them as the captain. The captain is who we contact first.
        </p>
      </div>

      {fields.map((field, index) => (
        <MemberFields
          key={field.id}
          index={index}
          memberKey={field.key}
          isCaptain={field.key === captainKey}
          canRemove={fields.length > minTeamSize}
          register={register}
          errors={errors}
          onRemove={() => removeMember(index)}
        />
      ))}
      <FieldError message={membersError ?? errors.captainKey?.message} />

      {fields.length < maxTeamSize && (
        <button
          type="button"
          onClick={() => append(emptyMember(), { shouldFocus: true })}
          className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl border border-dashed border-white/15 px-4 py-4 text-sm font-medium text-zinc-300 transition-colors outline-none hover:border-white/30 hover:bg-white/[0.03] hover:text-white focus-visible:ring-2 focus-visible:ring-hk-accent-fg/70"
        >
          <PlusIcon />
          Add a member
          <span className="text-zinc-500">
            ({fields.length} of {maxTeamSize})
          </span>
        </button>
      )}

      <Card className="mt-8">
        <CardHeader title="Consent" />
        <Checkbox
          label="I agree that the personal data above is used to organise the hackathon."
          description="NU IEEE Student Branch uses it to run the event and contact your team about it. Make sure every member listed is aware of this."
          error={errors.consent?.message}
          {...register("consent")}
        />
      </Card>

      {/* Honeypot for bots: off-screen rather than display:none, so naive form fillers still see it. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <input tabIndex={-1} autoComplete="off" {...register("website")} />
      </div>

      <div className="space-y-4">
        {TURNSTILE_SITE_KEY && (
          <Turnstile siteKey={TURNSTILE_SITE_KEY} resetKey={turnstileReset} onToken={setTurnstileToken} />
        )}
        {submitCount > 0 && hasErrors && (
          <Alert tone="error" title="Some fields need attention">
            Check the highlighted fields above.
          </Alert>
        )}
        {serverError && (
          <Alert tone="error" title="We couldn't register your team">
            {serverError} Your answers are still here.
          </Alert>
        )}
        <Button type="submit" size="lg" className="w-full sm:w-auto" loading={isSubmitting} disabled={needsVerification}>
          {isSubmitting ? "Registering…" : "Register team"}
        </Button>
        {needsVerification && <p className="text-xs text-zinc-500">Running a quick anti-spam check…</p>}
      </div>
    </form>
  );
}
