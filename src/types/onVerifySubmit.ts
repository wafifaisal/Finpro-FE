import { toast } from "react-toastify";
import { VerifyTenantFormValues } from "./verifyTenant";

interface RouterType {
  push: (url: string) => void;
}

interface OnVerifySubmitProps {
  values: VerifyTenantFormValues;
  token?: string;
  base_url?: string;
  router: RouterType;
  setIsSubmitting: (value: boolean) => void;
}

export async function onVerifySubmit({
  values,
  token,
  base_url,
  router,
  setIsSubmitting,
}: OnVerifySubmitProps): Promise<void> {
  if (!token) {
    toast.error("Invalid verification token.");
    router.push("/");
    return;
  }

  const { name, password, confirmPassword, no_handphone } = values;

  try {
    const res = await fetch(`${base_url}/auth/verify-tenant/${token}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        password,
        confirmPassword,
        no_handphone,
      }),
    });

    if (!res.ok) {
      const errorResponse = await res.json();
      throw new Error(errorResponse.message || "Verification failed");
    }

    const result = await res.json();
    toast.success(result.message || "Account successfully verified!");
    setTimeout(() => {
      router.push("/auth/tenant/login");
    }, 3000);
  } catch (error: unknown) {
    let errorMessage = "Terjadi kesalahan";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    toast.error(errorMessage);
  } finally {
    setIsSubmitting(false);
  }
}
