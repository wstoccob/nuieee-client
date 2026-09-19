import { useCallback, useEffect, useMemo, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { TOKEN_KEY, clearStoredToken, readStoredToken, storeToken } from "@/api/client";
import { AuthContext, type AuthState } from "./context";
import type { Role } from "@/dtos/user";

/** Claims issued by the FastAPI backend (core/security/jwt.py). */
interface AccessTokenClaims {
  sub: string;
  username: string;
  role: Role;
  exp: number;
}

function readSession(): AuthState | null {
  const token = readStoredToken();
  if (!token) return null;

  try {
    const claims = jwtDecode<AccessTokenClaims>(token);
    if (claims.exp * 1000 <= Date.now()) {
      clearStoredToken();
      return null;
    }
    return { userId: claims.sub, username: claims.username, role: claims.role };
  } catch {
    clearStoredToken();
    return null;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthState | null>(readSession);

  const login = useCallback((token: string, persist = true) => {
    storeToken(token, persist);
    setUser(readSession());
  }, []);

  const logout = useCallback(() => {
    clearStoredToken();
    setUser(null);
  }, []);

  // Another tab logging in or out must not leave this one stale.
  useEffect(() => {
    const sync = (event: StorageEvent) => {
      if (event.key === TOKEN_KEY) setUser(readSession());
    };
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);

  const value = useMemo(() => ({ user, login, logout }), [user, login, logout]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
