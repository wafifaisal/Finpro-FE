"use client";

import {
  createContext,
  ReactNode,
  useEffect,
  useState,
  useCallback,
} from "react";
import {
  SessionContext as ISessionContext,
  UserType,
  IUser,
  ITenant,
} from "@/types/property";

export const SessionContext = createContext<ISessionContext | undefined>(
  undefined
);

export const SessionProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isAuth, setIsAuth] = useState(false);
  const [type, setType] = useState<UserType | null>(null);
  const [user, setUser] = useState<IUser | null>(null);
  const [tenant, setTenant] = useState<ITenant | null>(null);
  const [loading, setLoading] = useState(true);

  const base_url = process.env.NEXT_PUBLIC_BASE_URL_BE;

  const resetSession = useCallback(() => {
    setIsAuth(false);
    setType(null);
    setUser(null);
    setTenant(null);
  }, []);

  const checkSession = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found");
      }

      const tokenPayload = JSON.parse(atob(token.split(".")[1]));
      if (tokenPayload.exp * 1000 < Date.now()) {
        throw new Error("Token expired");
      }

      const res = await fetch(`${base_url}/auth/session`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error("Failed to fetch session");
      }

      const result = await res.json();

      if (result.type === "tenant") {
        setTenant(result);
        setType("tenant");
        setUser(null);
      } else if (result.type === "user") {
        setUser(result);
        setType("user");
        setTenant(null);
      } else {
        throw new Error("Invalid session type");
      }

      setIsAuth(true);
    } catch (error) {
      console.error("Session check failed:", error);
      resetSession();
    } finally {
      setLoading(false);
    }
  }, [base_url, resetSession]);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    resetSession();
    window.location.href = "/";
  }, [resetSession]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      checkSession();
    } else {
      setLoading(false);
    }
  }, [checkSession]);

  return (
    <SessionContext.Provider
      value={{
        isAuth,
        type,
        user,
        tenant,
        checkSession,
        logout,
        loading,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
};
