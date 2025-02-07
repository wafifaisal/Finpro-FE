"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Lock, Eye, EyeOff, Shield } from "lucide-react";
import Link from "next/link";

const ResetPasswordSchema = Yup.object().shape({
  newPassword: Yup.string()
    .min(8, "Kata sandi harus minimal 8 karakter")
    .required("Kata Sandi Baru diperlukan"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("newPassword"), undefined], "kata sandi harus cocok")
    .required("Konfirmasi Kata Sandi diperlukan"),
});

export default function ResetPassword() {
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
        {/* Decorative elements */}
        <div className="absolute -top-6 -left-6 w-24 h-24 bg-rose-100 rounded-full blur-2xl opacity-60" />
        <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-rose-200 rounded-full blur-2xl opacity-40" />

        {/* Main card */}
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
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password Baru
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2">
                      <Lock className="w-5 h-5 text-gray-400" />
                    </div>
                    <Field
                      name="newPassword"
                      type={showPassword.new ? "text" : "password"}
                      placeholder="Enter new password"
                      className="w-full pl-10 pr-10 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword((prev) => ({ ...prev, new: !prev.new }))
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword.new ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  <ErrorMessage
                    name="newPassword"
                    component="div"
                    className="text-rose-500 text-sm mt-1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Konfirmasi Kata Sandi
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2">
                      <Lock className="w-5 h-5 text-gray-400" />
                    </div>
                    <Field
                      name="confirmPassword"
                      type={showPassword.confirm ? "text" : "password"}
                      placeholder="Confirm new password"
                      className="w-full pl-10 pr-10 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword((prev) => ({
                          ...prev,
                          confirm: !prev.confirm,
                        }))
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword.confirm ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  <ErrorMessage
                    name="confirmPassword"
                    component="div"
                    className="text-rose-500 text-sm mt-1"
                  />
                </div>

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
                      Mengatur Ulang Kata Sandi...{" "}
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
              href="/auth/tenant/login"
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
