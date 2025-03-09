"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ResetPasswordForm from "@/components/main/reset-password/ResetPasswordForm";

export default function ResetPassword() {
  const [isLoading, setIsLoading] = useState(false);
  const [storedToken, setStoredToken] = useState<string | null>(null);
  const router = useRouter();
  const params = useParams();

  const token = Array.isArray(params?.token)
    ? decodeURIComponent(params.token[0])
    : decodeURIComponent(params.token || "");

  useEffect(() => {
    if (token) {
      localStorage.setItem("resetToken", token);
      setStoredToken(token);
    } else {
      const savedToken = localStorage.getItem("resetToken");
      if (savedToken) {
        setStoredToken(savedToken);
      } else {
        toast.error("Tidak ditemukan token reset. Mengalihkan ke login...", {
          position: "top-right",
          autoClose: 3000,
          onClose: () => router.push("/auth/tenant/login"),
        });
      }
    }
  }, [token, router]);

  const handleResetPassword = async (values: {
    newPassword: string;
    confirmPassword: string;
  }) => {
    setIsLoading(true);

    if (!storedToken) {
      toast.error(
        "Tidak ada token reset yang valid. Silakan coba reset kata sandi Anda lagi.",
        {
          position: "top-right",
          autoClose: 3000,
        }
      );
      setIsLoading(false);
      return;
    }

    try {
      const decodedToken = decodeURIComponent(storedToken);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL_BE}/auth/tenant/reset-password/${params.token}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token: decodedToken,
            newPassword: values.newPassword,
            confirmPassword: values.confirmPassword,
          }),
        }
      );

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Password reset failed!");

      toast.success("Reset kata sandi berhasil! Mengalihkan ke login...", {
        position: "top-right",
        autoClose: 3000,
        onClose: () => {
          localStorage.removeItem("resetToken");
          router.push("/auth/tenant/login");
        },
      });
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Terjadi kesalahan.";
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 to-white">
      <ToastContainer />
      <div className="relative w-full max-w-[440px] p-8 lg:p-12">
        <div className="absolute -top-6 -left-6 w-24 h-24 bg-rose-100 rounded-full blur-2xl opacity-60" />
        <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-rose-200 rounded-full blur-2xl opacity-40" />
        <div className="relative bg-white rounded-3xl p-8 shadow-xl border border-rose-100">
          <ResetPasswordForm
            onSubmit={handleResetPassword}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
}
