"use client";

import React, { useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import { SessionContext } from "@/context/sessionProvider";
import Loading from "@/app/loading";

interface GuardOptions {
  requiredRole?: "user" | "tenant";
  redirectTo?: string;
  routeRedirects?: {
    [route: string]: string;
  };
}

export default function withGuard<P extends object>(
  Component: React.ComponentType<P>,
  options: GuardOptions = {}
) {
  const { requiredRole, redirectTo = "/login", routeRedirects = {} } = options;

  return function GuardedComponent(props: P) {
    const { isAuth, loading, type } = useContext(SessionContext) || {};
    const router = useRouter();

    useEffect(() => {
      if (!loading) {
        const currentRoute = window.location.pathname;

        if (!isAuth) {
          console.warn("User is not authenticated. Redirecting to login.");
          router.replace(routeRedirects[currentRoute] || redirectTo);
        } else if (requiredRole && type !== requiredRole) {
          const redirectPath =
            routeRedirects[currentRoute] || "/not-authorized";
          console.warn(`Role mismatch: required ${requiredRole}, got ${type}`);
          router.replace(redirectPath);
        }
      }
    }, [isAuth, loading, type, router]);

    if (loading) {
      return <Loading />;
    }

    if (!isAuth || (requiredRole && type !== requiredRole)) {
      return null;
    }

    return <Component {...props} />;
  };
}
