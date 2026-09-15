import {
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

/**
 * AuthContext — simple role-based authentication for the admin area.
 *
 * Credentials: admin@nonprofit.org / admin123 (admin role only).
 * The session is persisted to localStorage so a refresh keeps the user logged in.
 * In production this would be replaced by Internet Identity / backend auth.
 */

export interface AuthUser {
  email: string;
  name: string;
  role: "admin";
}

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => { ok: boolean; error?: string };
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const SESSION_KEY = "khw.auth.session";

const VALID_EMAIL = "admin@nonprofit.org";
const VALID_PASSWORD = "admin123";

function loadSession(): AuthUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(SESSION_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as AuthUser;
      if (parsed && parsed.role === "admin") return parsed;
    }
  } catch {
    // Ignore corrupt session.
  }
  return null;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(loadSession);

  useEffect(() => {
    if (user) {
      window.localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    } else {
      window.localStorage.removeItem(SESSION_KEY);
    }
  }, [user]);

  const login = useCallback(
    (email: string, password: string): { ok: boolean; error?: string } => {
      const normalized = email.trim().toLowerCase();
      if (normalized !== VALID_EMAIL || password !== VALID_PASSWORD) {
        return { ok: false, error: "Invalid email or password." };
      }
      setUser({ email: VALID_EMAIL, name: "KHW-India Admin", role: "admin" });
      return { ok: true };
    },
    [],
  );

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: user !== null,
      login,
      logout,
    }),
    [user, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
