"use client";

import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";
import Image from "next/image";

const ForgotPasswordSchema = Yup.object().shape({
  email: Yup.string()
    .email("Alamat email tidak valid")
    .required("Email wajib diisi"),
});

export default function ForgotPassword() {
  const [isLoading, setIsLoading] = useState(false);

  const handleForgotPassword = async (values: { email: string }) => {
    setIsLoading(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL_BE}/auth/tenant/forgot-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        }
      );

      const result = await res.json();
      if (!res.ok)
        throw new Error(result.message || "Gagal mengirim tautan reset!");

      toast.success("Tautan reset kata sandi telah dikirim ke email Anda!", {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Terjadi kesalahan saat mengirim tautan reset.";
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <ToastContainer />

      <div className="bg-white rounded-2xl p-8 lg:p-12 shadow-lg w-full max-w-[400px]">
        <div className="flex justify-center mb-6">
          <Image
            src="/logo.png"
            alt="Logo Nginepin"
            width={800}
            height={800}
            className="w-8 h-8"
          />
        </div>

        <h1 className="text-3xl font-bold mb-4 text-gray-900 text-center">
          Atur Ulang Kata Sandi Anda
        </h1>
        <p className="text-gray-600 text-center mb-8">
          Masukkan email Anda dan kami akan mengirimkan tautan reset
        </p>

        <Formik
          initialValues={{ email: "" }}
          validationSchema={ForgotPasswordSchema}
          onSubmit={handleForgotPassword}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-6">
              {/* Input Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <Field
                  name="email"
                  type="email"
                  placeholder="Masukkan email Anda"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-colors"
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-rose-500 text-sm mt-1"
                />
              </div>

              {/* Tombol Kirim */}
              <button
                type="submit"
                disabled={isSubmitting || isLoading}
                className={`w-full py-3 rounded-lg text-white font-medium transition-all ${
                  isSubmitting || isLoading
                    ? "bg-rose-300 cursor-not-allowed"
                    : "bg-rose-500 hover:bg-rose-600 active:scale-[0.98]"
                }`}
              >
                {isSubmitting || isLoading
                  ? "Mengirim..."
                  : "Kirim tautan reset"}
              </button>
            </Form>
          )}
        </Formik>

        <p className="mt-8 text-center text-sm text-gray-600">
          Sudah ingat kata sandi Anda?{" "}
          <Link
            href="/auth/tenant/login"
            className="text-rose-500 hover:text-rose-600 font-medium"
          >
            Masuk
          </Link>
        </p>
      </div>
    </div>
  );
}
