"use client";
import TenantProfile from "@/components/main/property-tenant/TenantProfile";
import withGuard from "@/hoc/pageGuard";
import { useEffect } from "react";

function TenantProperty() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div>
      <TenantProfile />
    </div>
  );
}

export default withGuard(TenantProperty, {
  requiredRole: "tenant",
  redirectTo: "/not-authorized",
});
