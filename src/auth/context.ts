import { createContext } from "react";
import type { Role } from "@/dtos/user";

export interface AuthState {
  userId: string;
  username: string;
  role: Role;
}

export interface AuthContextValue {
  user: AuthState | null;
  login: (token: string, persist?: boolean) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);
