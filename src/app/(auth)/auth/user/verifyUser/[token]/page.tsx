"use client";

import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as Yup from "yup";

interface VerifyFormValues {
  username: string;
  password: string;
  confirmPassword: string;
  no_handphone: string;
}

const validationSchema = Yup.object({
  username: Yup.string().required("Nama pengguna diperlukan"),
  password: Yup.string()
    .min(8, "Kata sandi harus minimal 8 karakter ")
    .required("Kata sandi diperlukan"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Kata sandi harus cocok")
    .required("Konfirmasi Kata Sandi diperlukan"),
  no_handphone: Yup.string()
    .matches(/^\d+$/, "Nomor telepon harus berupa angka")
    .required("Nomor telepon diperlukan"),
});

export default function VerifyPage({
  params,
}: {
  params?: { token?: string };
}) {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const base_url = process.env.NEXT_PUBLIC_BASE_URL_BE;

  const onVerify = async (
    values: VerifyFormValues,
    { setSubmitting }: FormikHelpers<VerifyFormValues>
  ) => {
    if (!params?.token) {
      toast.error("Token verifikasi tidak valid.");
      router.push("/");
      return;
    }

    try {
      const res = await fetch(`${base_url}/auth/verifyUser/${params.token}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!res.ok) {
        const errorResponse = await res.json();
        throw new Error(errorResponse.message || "Verifikasi gagal");
      }

      const result = await res.json();
      toast.success(result.message || "Akun berhasil diverifikasi!");
      setTimeout(() => {
        router.push("/auth/user/login");
      }, 3000);
    } catch (error: unknown) {
      let errorMessage = "Terjadi kesalahan";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      toast.error(errorMessage, {
        position: "bottom-right",
        autoClose: 5000,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white pt-20">
      <ToastContainer />
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg border-2 border-red-500">
        <h1 className="text-3xl font-semibold text-center text-red-600">
          Verifikasi Akun Anda
        </h1>
        <Formik<VerifyFormValues>
          initialValues={{
            username: "",
            password: "",
            confirmPassword: "",
            no_handphone: "",
          }}
          validationSchema={validationSchema}
          onSubmit={onVerify}
        >
          {({ isSubmitting }) => (
            <Form className="mt-4">
              <div className="mb-4">
                <label className="block mb-2 text-sm font-medium text-red-500">
                  Username
                </label>
                <Field
                  type="text"
                  name="username"
                  className="w-full px-3 py-2 border border-red-500 rounded focus:outline-none focus:ring focus:ring-red-200"
                />
                <ErrorMessage
                  name="username"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <div className="mb-4">
                <label className="block mb-2 text-sm font-medium text-red-500">
                  Password
                </label>
                <div className="relative">
                  <Field
                    name="password"
                    type={showPassword ? "text" : "password"}
                    className="w-full px-3 py-2 border border-red-500 rounded focus:outline-none focus:ring focus:ring-red-200"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff /> : <Eye />}
                  </button>
                </div>
                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <div className="mb-4">
                <label className="block mb-2 text-sm font-medium text-red-500">
                  Confirm Password
                </label>
                <div className="relative">
                  <Field
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    className="w-full px-3 py-2 border border-red-500 rounded focus:outline-none focus:ring focus:ring-red-200"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff /> : <Eye />}
                  </button>
                </div>
                <ErrorMessage
                  name="confirmPassword"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <div className="mb-4">
                <label className="block mb-2 text-sm font-medium text-red-500">
                  Nomor telepon
                </label>
                <Field
                  type="text"
                  name="no_handphone"
                  className="w-full px-3 py-2 border border-red-500 rounded focus:outline-none focus:ring focus:ring-red-200"
                />
                <ErrorMessage
                  name="no_handphone"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full px-3 py-2 text-white bg-red-500 rounded-lg hover:bg-red-600 focus:outline-none focus:ring focus:ring-red-200 ${
                  isSubmitting ? "opacity-50" : ""
                }`}
              >
                {isSubmitting ? "Memverifikasi..." : "Verifikasi Akun"}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
