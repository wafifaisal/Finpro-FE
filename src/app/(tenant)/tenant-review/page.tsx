"use client";
import withGuard from "@/hoc/pageGuard";

function TenantReviewPage() {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl font-bold">Tenant Review Page</h1>
      <p className="text-lg text-gray-500">This is a tenant review page.</p>
    </div>
  );
}

export default withGuard(TenantReviewPage, {
  requiredRole: "tenant",
  redirectTo: "/not-authorized",
});
