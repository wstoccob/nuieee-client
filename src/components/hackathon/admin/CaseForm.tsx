import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { errorMessage } from "@/api/client";
import type { Case, CaseWrite } from "@/dtos/hackathon";
import { Alert } from "../ui/Alert";
import { Button } from "../ui/Button";
import { Field, Input, Textarea } from "../ui/form";

const caseSchema = z.object({
  company: z.string().trim().min(1, "Required").max(255, "Keep it under 255 characters"),
  title: z.string().trim().min(1, "Required").max(255, "Keep it under 255 characters"),
  description: z.string().max(10_000, "Keep it under 10,000 characters"),
  sortOrder: z.string().refine((value) => /^-?\d+$/.test(value.trim()), "Enter a whole number"),
});

type CaseValues = z.infer<typeof caseSchema>;

interface CaseFormProps {
  initial?: Case;
  defaultSortOrder: number;
  submitLabel: string;
  onSubmit: (payload: CaseWrite) => Promise<unknown>;
  onCancel: () => void;
}

export function CaseForm({ initial, defaultSortOrder, submitLabel, onSubmit, onCancel }: CaseFormProps) {
  const [serverError, setServerError] = useState<string | null>(null);
  const { register, handleSubmit, formState } = useForm<CaseValues>({
    resolver: zodResolver(caseSchema),
    defaultValues: {
      company: initial?.company ?? "",
      title: initial?.title ?? "",
      description: initial?.description ?? "",
      sortOrder: String(initial?.sortOrder ?? defaultSortOrder),
    },
  });
  const { errors, isSubmitting } = formState;

  const submit = async (values: CaseValues) => {
    setServerError(null);
    try {
      await onSubmit({
        company: values.company.trim(),
        title: values.title.trim(),
        description: values.description,
        sortOrder: Number(values.sortOrder),
      });
    } catch (error) {
      setServerError(errorMessage(error, "Couldn't save the case. Please try again."));
    }
  };

  return (
    <form onSubmit={handleSubmit(submit)} noValidate className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-[1fr_1fr_8rem]">
        <Field label="Company" error={errors.company?.message}>
          {(control) => <Input {...control} autoFocus placeholder="Kaspi.kz" {...register("company")} />}
        </Field>
        <Field label="Title" error={errors.title?.message}>
          {(control) => <Input {...control} placeholder="Fraud detection in payments" {...register("title")} />}
        </Field>
        <Field label="Order" hint="Lower comes first" error={errors.sortOrder?.message}>
          {(control) => <Input {...control} type="number" inputMode="numeric" {...register("sortOrder")} />}
        </Field>
      </div>
      <Field label="Description" optional error={errors.description?.message}>
        {(control) => <Textarea {...control} rows={5} {...register("description")} />}
      </Field>
      {serverError && <Alert tone="error">{serverError}</Alert>}
      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <Button variant="ghost" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" loading={isSubmitting}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
