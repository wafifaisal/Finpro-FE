"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import {
  User,
  Lock,
  Phone,
  CheckCircle,
  Loader2,
  EyeOff,
  Eye,
} from "lucide-react";
import "react-toastify/dist/ReactToastify.css";
import { Formik, Field, Form } from "formik";
import * as Yup from "yup";

// Definisikan interface untuk nilai form verifikasi
interface VerifyTenantFormValues {
  name: string;
  password: string;
  confirmPassword: string;
  no_handphone: string;
}

export default function VerifyPage({
  params,
}: {
  params?: { token?: string };
}) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const base_url = process.env.NEXT_PUBLIC_BASE_URL_BE;

  const validationSchema = Yup.object({
    name: Yup.string().required("Nama diperlukan"),
    password: Yup.string()
      .min(8, "Kata sandi harus minimal 8 karakter")
      .required("Kata sandi diperlukan"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password")], "Kata sandi harus cocok")
      .required("Konfirmasi Kata Sandi diperlukan"),
    no_handphone: Yup.string()
      .matches(/^\+?\d{10,15}$/, "Nomor telepon tidak valid")
      .required("Nomor telepon diperlukan"),
  });

  // Fungsi onVerify dengan tipe parameter yang sudah didefinisikan
  const onVerify = async (values: VerifyTenantFormValues): Promise<void> => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    if (!params?.token) {
      toast.error("Invalid verification token.");
      router.push("/");
      return;
    }

    const { name, password, confirmPassword, no_handphone } = values;

    try {
      const res = await fetch(
        `${base_url}/auth/verify-tenant/${params.token}`,
        {
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
        }
      );

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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <ToastContainer />

      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 right-0 h-64 overflow-hidden">
        <div className="absolute inset-0 bg-red-600 opacity-5">
          <svg className="absolute bottom-0" viewBox="0 0 1440 320">
            <path
              fill="currentColor"
              d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,112C960,128,1056,160,1152,160C1248,160,1344,128,1392,112L1440,96L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
            ></path>
          </svg>
        </div>
      </div>

      <div className="max-w-md mx-auto relative">
        {/* Verification Progress */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
            <CheckCircle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">
            Verifikasi Akun Tenant
          </h2>
          <p className="mt-2 text-gray-600">
            Lengkapi profil Anda untuk mengaktifkan akun Anda
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <Formik<VerifyTenantFormValues>
            initialValues={{
              name: "",
              password: "",
              confirmPassword: "",
              no_handphone: "",
            }}
            validationSchema={validationSchema}
            onSubmit={onVerify}
          >
            {({ values, handleChange, handleBlur, errors, touched }) => (
              <Form className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nama Bisnis
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-gray-400" />
                      </div>
                      <Field
                        type="text"
                        name="name"
                        value={values.name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 outline-none"
                        placeholder="Choose your name"
                      />
                      {touched.name && errors.name && (
                        <div className="text-sm text-red-500">
                          {errors.name}
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400" />
                      </div>
                      <Field
                        type={showPassword ? "text" : "password"}
                        name="password"
                        className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 outline-none"
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-3 flex items-center"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                      {touched.password && errors.password && (
                        <div className="text-sm text-red-500">
                          {errors.password}
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400" />
                      </div>
                      <Field
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 outline-none"
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-3 flex items-center"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                      {touched.confirmPassword && errors.confirmPassword && (
                        <div className="text-sm text-red-500">
                          {errors.confirmPassword}
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Phone className="h-5 w-5 text-gray-400" />
                      </div>
                      <Field
                        type="text"
                        name="no_handphone"
                        value={values.no_handphone}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 outline-none"
                        placeholder="Enter your phone number"
                      />
                      {touched.no_handphone && errors.no_handphone && (
                        <div className="text-sm text-red-500">
                          {errors.no_handphone}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="group relative w-full flex justify-center py-3 px-4 border border-transparent rounded-xl text-white bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200 transform hover:-translate-y-0.5"
                >
                  {isSubmitting ? (
                    <span className="flex items-center">
                      <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
                      Verifying...
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <CheckCircle className="mr-2 h-5 w-5" />
                      Complete Verification
                    </span>
                  )}
                </button>
              </Form>
            )}
          </Formik>
        </div>

        {/* Security Notice */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p className="flex items-center justify-center">
            <Lock className="h-4 w-4 mr-1" />
            Your information is securely encrypted
          </p>
        </div>
      </div>
    </div>
  );
}
