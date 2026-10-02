import { useRef, useState, type ReactNode } from "react";
import { useForm, type FieldPath } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { errorMessage } from "@/api/client";
import { KIND_OPTIONS, STATUS_OPTIONS } from "@/config/hackathon";
import { localTimeZone } from "@/lib/datetime";
import type { BigEventAdmin, BigEventWrite } from "@/dtos/hackathon";
import { Alert } from "../ui/Alert";
import { Button } from "../ui/Button";
import { Card, CardHeader } from "../ui/Card";
import { Checkbox, Field, Input, Select, Textarea } from "../ui/form";
import { CalendarIcon, FileIcon, UsersIcon } from "../ui/icons";
import {
  DEFAULT_SETTINGS,
  settingsFromEvent,
  settingsSchema,
  settingsToWrite,
  slugify,
  type SettingsValues,
} from "./settingsSchema";

interface EventSettingsFormProps {
  initial?: BigEventAdmin;
  submitLabel: string;
  onSubmit: (payload: BigEventWrite) => Promise<BigEventAdmin>;
}

interface DateFieldProps {
  name: FieldPath<SettingsValues>;
  label: string;
  hint?: ReactNode;
  optional?: boolean;
}

export function EventSettingsForm({ initial, submitLabel, onSubmit }: EventSettingsFormProps) {
  const [serverError, setServerError] = useState<string | null>(null);
  const slugEdited = useRef(Boolean(initial));
  const form = useForm<SettingsValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: initial ? settingsFromEvent(initial) : DEFAULT_SETTINGS,
    mode: "onTouched",
  });
  const { register, handleSubmit, setValue, reset, formState } = form;
  const { errors, isSubmitting, isDirty } = formState;

  const submit = async (values: SettingsValues) => {
    setServerError(null);
    try {
      const saved = await onSubmit(settingsToWrite(values));
      reset(settingsFromEvent(saved));
      toast.success("Saved");
    } catch (error) {
      const message = errorMessage(error, "Couldn't save. Check the fields and try again.");
      setServerError(message);
      toast.error(message);
    }
  };

  // Called as a function, not rendered as <DateField>, so inputs keep focus across re-renders.
  const dateField = ({ name, label, hint, optional }: DateFieldProps) => (
    <Field label={label} hint={hint} optional={optional} error={errors[name]?.message}>
      {(control) => <Input {...control} type="datetime-local" {...register(name)} />}
    </Field>
  );

  return (
    <form onSubmit={handleSubmit(submit)} noValidate className="space-y-5">
      <Card>
        <CardHeader icon={<FileIcon />} title="Basics" />
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Title" className="sm:col-span-2" error={errors.title?.message}>
            {(control) => (
              <Input
                {...control}
                placeholder="NU IEEE Hackathon 2026"
                {...register("title", {
                  onChange: (event) => {
                    if (!slugEdited.current) setValue("slug", slugify(event.target.value), { shouldDirty: true });
                  },
                })}
              />
            )}
          </Field>
          <Field
            label="Slug"
            className="sm:col-span-2"
            hint="Used in the public link: /hackathon/your-slug. Changing it breaks links you already shared."
            error={errors.slug?.message}
          >
            {(control) => (
              <Input
                {...control}
                spellCheck={false}
                autoCapitalize="none"
                className="font-mono"
                {...register("slug", {
                  onChange: (event) => {
                    slugEdited.current = event.target.value !== "";
                  },
                })}
              />
            )}
          </Field>
          <Field label="Kind" error={errors.kind?.message}>
            {(control) => (
              <Select {...control} {...register("kind")}>
                {KIND_OPTIONS.map(({ value, label }) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </Select>
            )}
          </Field>
          <Field label="Status" hint="Only published events are visible to the public." error={errors.status?.message}>
            {(control) => (
              <Select {...control} {...register("status")}>
                {STATUS_OPTIONS.map(({ value, label }) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </Select>
            )}
          </Field>
          <Checkbox
            className="sm:col-span-2"
            label="Featured"
            description="The featured event is the one /hackathon opens. Featuring this one un-features the current one."
            {...register("isFeatured")}
          />
          <Field label="Description" optional className="sm:col-span-2" error={errors.description?.message}>
            {(control) => <Textarea {...control} rows={6} {...register("description")} />}
          </Field>
          <Field label="Hero image URL" optional className="sm:col-span-2" error={errors.heroImageUrl?.message}>
            {(control) => <Input {...control} type="url" inputMode="url" placeholder="https://…" {...register("heroImageUrl")} />}
          </Field>
        </div>
      </Card>

      <Card>
        <CardHeader
          icon={<CalendarIcon />}
          title="Dates"
          description={`Enter times in your local time zone (${localTimeZone()}). They are stored in UTC.`}
        />
        <div className="grid gap-4 sm:grid-cols-2">
          {dateField({ name: "startsAt", label: "Event starts" })}
          {dateField({ name: "endsAt", label: "Event ends" })}
          {dateField({ name: "registrationOpensAt", label: "Registration opens" })}
          {dateField({ name: "registrationClosesAt", label: "Registration closes" })}
          {dateField({ name: "caseSelectionOpensAt", label: "Cases revealed and selection opens", optional: true, hint: "Selection stays open until submissions close." })}
          <div className="hidden sm:block" />
          {dateField({ name: "submissionsOpenAt", label: "Submissions open", optional: true })}
          {dateField({ name: "submissionsCloseAt", label: "Submissions close", optional: true })}
        </div>
      </Card>

      <Card>
        <CardHeader icon={<UsersIcon />} title="Teams" />
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Minimum team size" error={errors.minTeamSize?.message}>
            {(control) => <Input {...control} type="number" inputMode="numeric" min={1} max={20} {...register("minTeamSize")} />}
          </Field>
          <Field label="Maximum team size" error={errors.maxTeamSize?.message}>
            {(control) => <Input {...control} type="number" inputMode="numeric" min={1} max={20} {...register("maxTeamSize")} />}
          </Field>
          <Field label="Team limit" optional hint="Leave empty for no limit." error={errors.capacity?.message}>
            {(control) => <Input {...control} type="number" inputMode="numeric" min={1} {...register("capacity")} />}
          </Field>
        </div>
      </Card>

      {serverError && (
        <Alert tone="error" title="Couldn't save">
          {serverError}
        </Alert>
      )}
      <div className="flex flex-col-reverse items-stretch gap-3 sm:flex-row sm:items-center sm:justify-end">
        {initial && isDirty && <span className="text-center text-sm text-amber-300 sm:text-left">Unsaved changes</span>}
        <Button type="submit" size="lg" loading={isSubmitting} disabled={Boolean(initial) && !isDirty}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
