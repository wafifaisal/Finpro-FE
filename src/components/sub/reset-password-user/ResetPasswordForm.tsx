"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Formik, Form } from "formik";
import { toast } from "react-toastify";
import Link from "next/link";
import { Shield } from "lucide-react";
import ResetPasswordSchema from "@/types/ResetPasswordSchema";
import { resetPasswordApi } from "@/hooks/AuthServices";
import PasswordInput from "./PasswordInput";

export default function ResetPasswordForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [storedToken, setStoredToken] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState({
    new: false,
    confirm: false,
  });
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
          onClose: () => router.push("/auth/user/login"),
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
      await resetPasswordApi(
        storedToken,
        values.newPassword,
        values.confirmPassword
      );
      toast.success("Reset kata sandi berhasil! Mengalihkan ke login...", {
        position: "top-right",
        autoClose: 3000,
        onClose: () => {
          localStorage.removeItem("resetToken");
          router.push("/auth/user/login");
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
      <div className="relative w-full max-w-[440px] p-8 lg:p-12">
        <div className="absolute -top-6 -left-6 w-24 h-24 bg-rose-100 rounded-full blur-2xl opacity-60" />
        <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-rose-200 rounded-full blur-2xl opacity-40" />
        <div className="relative bg-white rounded-3xl p-8 shadow-xl border border-rose-100">
          <div className="flex justify-center mb-6">
            <div className="p-3 bg-rose-50 rounded-2xl">
              <Shield className="w-8 h-8 text-rose-500" />
            </div>
          </div>

          <h1 className="text-3xl font-bold mb-2 text-gray-900 text-center">
            Buat Password Baru
          </h1>
          <p className="text-gray-500 text-center mb-8">
            Pastikan aman dan mudah diingat
          </p>

          <Formik
            initialValues={{ newPassword: "", confirmPassword: "" }}
            validationSchema={ResetPasswordSchema}
            onSubmit={handleResetPassword}
          >
            {({ isSubmitting }) => (
              <Form className="space-y-6">
                <PasswordInput
                  name="newPassword"
                  label="Password Baru"
                  placeholder="Enter new password"
                  show={showPassword.new}
                  toggleShow={() =>
                    setShowPassword((prev) => ({ ...prev, new: !prev.new }))
                  }
                />
                <PasswordInput
                  name="confirmPassword"
                  label="Konfirmasi Kata Sandi"
                  placeholder="Confirm new password"
                  show={showPassword.confirm}
                  toggleShow={() =>
                    setShowPassword((prev) => ({
                      ...prev,
                      confirm: !prev.confirm,
                    }))
                  }
                />

                <button
                  type="submit"
                  disabled={isSubmitting || isLoading}
                  className={`w-full py-3 rounded-xl text-white font-medium transition-all ${
                    isSubmitting || isLoading
                      ? "bg-rose-300 cursor-not-allowed"
                      : "bg-rose-500 hover:bg-rose-600 active:scale-[0.98] shadow-lg shadow-rose-500/25 hover:shadow-rose-500/35"
                  }`}
                >
                  {isSubmitting || isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Mengatur Ulang Kata Sandi...
                    </span>
                  ) : (
                    "Setel Ulang Kata Sandi"
                  )}
                </button>
              </Form>
            )}
          </Formik>

          <p className="mt-8 text-center text-sm text-gray-500">
            Ingat password anda?{" "}
            <Link
              href="/auth/user/login"
              className="text-rose-500 hover:text-rose-600 font-medium"
            >
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
