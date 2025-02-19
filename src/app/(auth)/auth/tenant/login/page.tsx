"use client";
import { useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";
import Navbar from "@/components/main/navbar/Navbar";
import SocialLoginTenant from "@/components/main/register/socialLoginTenant";
import { HeroSection } from "@/components/main/login/HeroSection";
import { LoginContainer } from "@/components/main/login/LoginContainer";
import { LoginForm } from "@/components/main/login/LoginForm";

const LoginSchema = Yup.object().shape({
  data: Yup.string().required("Username atau Email harus diisi"),
  password: Yup.string()
    .min(8, "Kata sandi baru minimal 8 karakter")
    .required("Password harus diisi"),
});

export default function TenantLogin() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const base_url = process.env.NEXT_PUBLIC_BASE_URL_BE;

  const handleSubmit = async (values: { data: string; password: string }) => {
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
      const errorMessage =
        error instanceof Error ? error.message : "Terjadi kesalahan";
      toast.error(errorMessage, { position: "bottom-right", autoClose: 5000 });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />
      <ToastContainer />
      <div className="container mx-auto px-4 pt-0 md:pt-28 pb-12">
        <div className="max-w-6xl mx-auto">
          <LoginContainer>
            <HeroSection />
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
                    <Form>
                      <LoginForm
                        isLoading={isLoading}
                        showPassword={showPassword}
                        setShowPassword={setShowPassword}
                      />
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
          </LoginContainer>
        </div>
      </div>
    </div>
  );
}
