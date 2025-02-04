"use client";

import { useState } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { FaTimes } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Image from "next/image";
import { motion } from "framer-motion";
import SocialLogin from "@/components/main/register/socialLogin";
import Link from "next/link";
import Navbar from "@/components/main/navbar/Navbar";

const LoginSchema = Yup.object().shape({
  data: Yup.string().required("Username atau Email harus diisi"),
  password: Yup.string().required("Password harus diisi"),
});

interface FormValues {
  data: string;
  password: string;
}

export default function LoginUser() {
  const [isLoading, setIsLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const base_url = process.env.NEXT_PUBLIC_BASE_URL_BE;

  const handleSubmit = async (values: FormValues) => {
    setIsLoading(true);
    setAlertMessage(null);

    try {
      const res = await fetch(`${base_url}/auth/login`, {
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
      console.error("Error fetching properties:", error);

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
    <>
      <Navbar />
      <div className="min-h-screen bg-white text-black flex items-center justify-center pb-20 pt-0 md:pt-32 md:pb-7 relative">
        <ToastContainer />

        <div
          className="absolute inset-0 bg-cover bg-center z-0"
          style={{
            backgroundImage: "url('/background.jpg')",
            filter: "brightness(0.9)",
          }}
        ></div>

        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="relative z-10 w-full sm:w-[90%] lg:w-[90%] h-auto flex flex-col lg:flex-row items-center justify-between p-6 sm:p-10 bg-white shadow-2xl rounded-3xl border border-red-500 "
        >
          <div className="text-center lg:text-left max-w-lg flex flex-col items-center lg:items-start">
            <h1 className="text-4xl sm:text-5xl font-bold text-red-600 mb-4">
              Temukan Hunian Impian Anda
            </h1>
            <Image
              width={200}
              height={200}
              src="/nginepin-logo.png"
              alt="Logo Nginepin"
              className="mt-2"
            />
            <p className="text-gray-700 text-sm sm:text-base mt-4">
              Jelajahi pilihan properti terbaik untuk disewa dengan harga
              bersaing!
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="w-full sm:w-[90%] lg:w-[50%] bg-white/70 shadow-lg p-6 sm:p-8 md:p-12 border border-gray-300 backdrop-blur-lg rounded-xl"
          >
            <h1 className="text-3xl font-bold text-red-600 mb-2">Login</h1>
            <p className="text-sm text-gray-500 mb-6">
              Selamat datang kembali!
            </p>

            {alertMessage && (
              <div className="flex items-center bg-red-500 text-white px-4 py-3 rounded-lg shadow-md space-x-3 mb-4">
                <FaTimes className="text-xl" />
                <span>{alertMessage}</span>
              </div>
            )}

            <Formik
              initialValues={{ data: "", password: "" }}
              validationSchema={LoginSchema}
              onSubmit={handleSubmit}
            >
              {() => (
                <Form className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-1 ">
                      Username / Email
                    </label>
                    <Field
                      name="data"
                      type="text"
                      placeholder="Masukkan username atau email"
                      className="w-full p-3 rounded-lg border border-gray-300 outline-none truncate"
                    />
                    <ErrorMessage
                      name="data"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Password
                    </label>
                    <Field
                      name="password"
                      type="password"
                      placeholder="Masukkan password"
                      className="w-full p-3 rounded-lg border border-gray-300 outline-none truncate"
                    />
                    <ErrorMessage
                      name="password"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>
                  <Link
                    href="/auth/user/login/forgot-password"
                    className="text-sm text-indigo-400 hover:underline"
                  >
                    Lupa password?
                  </Link>
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-red-600 to-red-400 py-3 rounded-lg text-white font-bold hover:opacity-90 transition-transform transform hover:scale-105"
                  >
                    {isLoading ? "Loading..." : "Login"}
                  </button>
                </Form>
              )}
            </Formik>

            <div className="flex items-center my-6">
              <div className="flex-grow border-t border-gray-300"></div>
              <span className="mx-4 text-gray-400">Atau</span>
              <div className="flex-grow border-t border-gray-300"></div>
            </div>

            <SocialLogin />

            <div className="text-center text-sm mt-6">
              Belum punya akun?{" "}
              <Link href="/auth/user/register" className="text-red-500">
                Daftar
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </>
  );
}
