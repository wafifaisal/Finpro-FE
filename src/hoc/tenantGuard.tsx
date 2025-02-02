"use client";

import { useSession } from "@/context/useSessionHook";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function tenantGuard<P extends Record<string, unknown>>(
  Component: React.ComponentType<P>
) {
  const ComponentWithTenantGuard = (props: P) => {
    const { type, loading } = useSession();
    const router = useRouter();

    useEffect(() => {
      if (!loading) {
        if (type !== "tenant") {
          router.replace("/not-authorized");
        }
      }
    }, [type, loading, router]);

    if (loading) {
      return (
        <div className="flex justify-center items-center min-h-screen bg-gray-900 text-white">
          <h1 className="text-3xl font-bold">Checking Authorization...</h1>
        </div>
      );
    }

    if (type === "tenant") {
      return <Component {...props} />;
    }

    return null;
  };

  return ComponentWithTenantGuard;
}
