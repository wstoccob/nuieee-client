const PREFIX = "hackathon-team-token:";

export function teamLink(token: string): string {
  return `${window.location.origin}/hackathon/team#${token}`;
}

export function readHashToken(hash: string = window.location.hash): string | null {
  const raw = hash.replace(/^#/, "").trim();
  if (!raw) return null;
  try {
    return decodeURIComponent(raw);
  } catch {
    return raw;
  }
}

export function saveTeamToken(slug: string, token: string): void {
  try {
    localStorage.setItem(PREFIX + slug, token);
  } catch {
    // Storage can be unavailable (private mode); the link itself still works.
  }
}

export function savedTeamToken(slug?: string): string | null {
  try {
    if (slug) return localStorage.getItem(PREFIX + slug);
    for (let i = 0; i < localStorage.length; i += 1) {
      const key = localStorage.key(i);
      if (key?.startsWith(PREFIX)) return localStorage.getItem(key);
    }
  } catch {
    return null;
  }
  return null;
}

export function forgetTeamToken(token: string): void {
  try {
    const stale: string[] = [];
    for (let i = 0; i < localStorage.length; i += 1) {
      const key = localStorage.key(i);
      if (key?.startsWith(PREFIX) && localStorage.getItem(key) === token) stale.push(key);
    }
    stale.forEach((key) => localStorage.removeItem(key));
  } catch {
    // Nothing to clean up when storage is unavailable.
  }
}

// Keep "@" readable: some desktop mail clients do not decode it in the recipient list.
const encodeAddress = (email: string) => encodeURIComponent(email).replace(/%40/g, "@");

export function teamLinkMailto(link: string, eventTitle: string, emails: string[]): string {
  const subject = `Your team link for ${eventTitle}`;
  const body = [
    `Here is our team link for ${eventTitle}:`,
    "",
    link,
    "",
    "Keep it private: anyone with this link can change our case and submission.",
  ].join("\r\n");
  const to = emails.map(encodeAddress).join(",");
  return `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
