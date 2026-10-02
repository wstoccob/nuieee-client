import { useMemo } from "react";
import { useLocation } from "react-router-dom";
import { readHashToken, savedTeamToken } from "@/lib/teamToken";

// The token lives in the URL fragment so it never reaches server logs or Referer headers.
// Storage is only re-read when the hash changes, so forgetting a rejected token keeps the
// "link no longer valid" message on screen instead of flipping to "no link".
export function useTeamToken(): string | null {
  const { hash } = useLocation();
  return useMemo(() => readHashToken(hash) ?? savedTeamToken(), [hash]);
}
