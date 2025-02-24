"use client";
import TenantProfile from "@/components/main/property-tenant/TenantProfile";
import { useEffect } from "react";

export default function TenantProperty() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div>
      <TenantProfile />
    </div>
  );
}
