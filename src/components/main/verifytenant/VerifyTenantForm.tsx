"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { Formik } from "formik";
import "react-toastify/dist/ReactToastify.css";
import { verifySchema } from "@/types/VerifyTenantSchema";
import { VerifyTenantFormValues } from "@/types/verifyTenant";
import VerifyFormFields from "./VerifyTenantField";

interface VerifyFormProps {
  token: string;
  base_url: string;
}

const VerifyForm = ({ token, base_url }: VerifyFormProps) => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const onVerify = async (values: VerifyTenantFormValues): Promise<void> => {
    if (isSubmitting) return;
    setIsSubmitting(true);

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
  };

  return (
    <div>
      <ToastContainer />
      <Formik<VerifyTenantFormValues>
        initialValues={{
          name: "",
          password: "",
          confirmPassword: "",
          no_handphone: "",
        }}
        validationSchema={verifySchema}
        onSubmit={onVerify}
      >
        {(formikProps) => (
          <VerifyFormFields
            {...formikProps}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
            showConfirmPassword={showConfirmPassword}
            setShowConfirmPassword={setShowConfirmPassword}
            isSubmitting={isSubmitting}
          />
        )}
      </Formik>
    </div>
  );
};

export default VerifyForm;
