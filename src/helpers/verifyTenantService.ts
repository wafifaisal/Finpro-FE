import { VerifyTenantFormValues } from "@/types/verifyTenant";

export async function verifyTenantAPI(
  base_url: string,
  token: string,
  values: VerifyTenantFormValues
) {
  const res = await fetch(`${base_url}/auth/verify-tenant/${token}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(values),
  });

  if (!res.ok) {
    const errorResponse = await res.json();
    throw new Error(errorResponse.message || "Verification failed");
  }

  return await res.json();
}
