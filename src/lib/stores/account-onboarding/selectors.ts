import type { FieldValues, Path, UseFormReturn } from "react-hook-form";

/** Pushes store email into react-hook-form when the field is still empty. */
export function syncSignedInEmailToForm<T extends FieldValues & { email?: string }>(
  form: UseFormReturn<T>,
  email?: string,
) {
  if (!email) return;
  const field = "email" as Path<T>;
  const current = String(form.getValues(field) ?? "").trim();
  if (current) return;
  form.setValue(field, email as never, { shouldDirty: false });
}
