"use client";

import { useState } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import Navbar from "@/components/main/navbar/Navbar";
import SocialLoginTenant from "@/components/main/register/socialLoginTenant";
import { Building2, Eye, EyeOff, Key, Lock, Mail } from "lucide-react";

const LoginSchema = Yup.object().shape({
  data: Yup.string().required("Username atau Email harus diisi"),
  password: Yup.string()
    .min(8, "Kata sandi baru minimal 8 karakter")
    .required("Password harus diisi"),
});

interface FormValues {
  data: string;
  password: string;
}

export default function TenantLogin() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const base_url = process.env.NEXT_PUBLIC_BASE_URL_BE;

  const handleSubmit = async (values: FormValues) => {
    setIsLoading(true);

    try {
      const res = await fetch(`${base_url}/auth/tenant-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Login gagal!");

      localStorage.setItem("token", result.token);
      toast.success("Login berhasil!", {
        position: "bottom-right",
        autoClose: 3000,
      });
      setTimeout(() => window.location.assign("/"), 1000);
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
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />
      <ToastContainer />
      <div className="container mx-auto px-4 pt-0 md:pt-28 pb-12 ">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-white rounded-2xl shadow-xl overflow-hidden"
          >
            <div className="bg-gradient-to-br from-red-600 to-red-800 p-8 lg:p-12 text-white relative overflow-hidden">
              <div className="relative z-10">
                <div className="mb-8 ">
                  <Image
                    width={800}
                    height={800}
                    src="/nginepin-logo.png"
                    alt="Logo Nginepin"
                    className="w-32 mb-6 bg-white bg-opacity-20 px-5 rounded-full bg-blur-sm"
                  />
                  <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                    Portal Pemilik Properti
                  </h2>
                  <p className="text-red-100 mb-6">
                    Kelola properti Anda dengan lebih efisien dan profesional
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="bg-red-500/20 p-2 rounded-lg">
                      <Building2 className="w-6 h-6" />
                    </div>
                    <p>Kelola multiple properti dalam satu dashboard</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="bg-red-500/20 p-2 rounded-lg">
                      <Mail className="w-6 h-6" />
                    </div>
                    <p>Terima permintaan sewa secara real-time</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="bg-red-500/20 p-2 rounded-lg">
                      <Key className="w-6 h-6" />
                    </div>
                    <p>Akses laporan keuangan dan analitik properti</p>
                  </div>
                </div>
              </div>

              {/* Background Pattern */}
              <div className="absolute top-0 right-0 w-full h-full opacity-10">
                <div className="absolute transform rotate-45 -right-32 -top-32 w-96 h-96 border-8 border-red-400 rounded-full"></div>
                <div className="absolute transform rotate-45 -right-48 -bottom-48 w-96 h-96 border-8 border-red-400 rounded-full"></div>
              </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="p-8 lg:p-12">
              <div className="max-w-md mx-auto">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  Selamat Datang Kembali
                </h3>
                <p className="text-gray-600 mb-8">
                  Masuk ke dashboard properti Anda
                </p>

                <Formik
                  initialValues={{ data: "", password: "" }}
                  validationSchema={LoginSchema}
                  onSubmit={handleSubmit}
                >
                  {() => (
                    <Form className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Username / Email
                        </label>
                        <Field
                          name="data"
                          type="text"
                          placeholder="Masukkan username atau email"
                          className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all outline-none"
                        />
                        <ErrorMessage
                          name="data"
                          component="div"
                          className="text-red-500 text-sm mt-1"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
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
                        </div>
                        <ErrorMessage
                          name="password"
                          component="div"
                          className="text-red-500 text-sm mt-1"
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <Link
                          href="/auth/tenant/login/forgot-password"
                          className="text-sm text-red-600 hover:text-red-700"
                        >
                          Lupa password?
                        </Link>
                      </div>

                      <button
                        type="submit"
                        className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-semibold transition-all transform hover:translate-y-[-1px] focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <span className="flex items-center justify-center">
                            <svg
                              className="animate-spin h-5 w-5 mr-3"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                                fill="none"
                              />
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              />
                            </svg>
                            Loading...
                          </span>
                        ) : (
                          "Masuk"
                        )}
                      </button>
                    </Form>
                  )}
                </Formik>

                <div className="mt-6">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-gray-500">
                        Atau masuk dengan
                      </span>
                    </div>
                  </div>

                  <div className="mt-6">
                    <SocialLoginTenant />
                  </div>
                </div>

                <p className="mt-8 text-center text-sm text-gray-600">
                  Belum punya akun?{" "}
                  <Link
                    href="/auth/tenant/register"
                    className="font-medium text-red-600 hover:text-red-700"
                  >
                    Daftar sebagai Pemilik Properti
                  </Link>
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
