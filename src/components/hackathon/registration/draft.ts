import type { RegistrationValues } from "./schema";

// Phones often reload a backgrounded tab while someone switches apps to look up a
// teammate's email, so the half-filled form is kept for the rest of the session.
const draftKey = (slug: string) => `hackathon-registration-draft:${slug}`;

export function loadDraft(slug: string, minMembers: number, maxMembers: number): RegistrationValues | null {
  try {
    const raw = sessionStorage.getItem(draftKey(slug));
    if (!raw) return null;
    const draft = JSON.parse(raw) as RegistrationValues;
    const count = Array.isArray(draft.members) ? draft.members.length : 0;
    if (count < minMembers || count > maxMembers) return null;
    return { ...draft, website: "" };
  } catch {
    return null;
  }
}

export function saveDraft(slug: string, values: Partial<RegistrationValues>): void {
  try {
    sessionStorage.setItem(draftKey(slug), JSON.stringify({ ...values, website: "" }));
  } catch {
    // Storage full or disabled: the form still works, it just won't survive a reload.
  }
}

export function clearDraft(slug: string): void {
  try {
    sessionStorage.removeItem(draftKey(slug));
  } catch {
    // Nothing to clear.
  }
}
