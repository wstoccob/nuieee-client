import { useContext } from "react";
import { AuthContext } from "./context";
import type { Role } from "@/dtos/user";

const RANK: Record<Role, number> = { admin: 1, superadmin: 2 };

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export function roleSatisfies(actual: Role, minimum: Role): boolean {
  return RANK[actual] >= RANK[minimum];
}
