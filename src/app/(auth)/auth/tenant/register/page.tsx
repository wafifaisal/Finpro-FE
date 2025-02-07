"use client";

import React, { useState } from "react";
import { Mail, Building2, Wallet, Users, ArrowRight } from "lucide-react";
import SocialLoginTenant from "@/components/main/register/socialLoginTenant";
import axios from "axios";
import Image from "next/image";
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email("Email tidak valid")
    .required("Email wajib diisi")
    .matches(
      /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
      "Format email tidak valid"
    ),
});

const TenantRegisterForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const base_url_be = process.env.NEXT_PUBLIC_BASE_URL_BE;

  const handleSubmit = async (
    values: { email: string },
    { setSubmitting, resetForm }: FormikHelpers<{ email: string }>
  ) => {
    setIsLoading(true);
    try {
      const response = await axios.post(`${base_url_be}/auth/tenant-register`, {
        email: values.email,
      });
      Swal.fire({
        title: "Success!",
        text: response.data.message,
        icon: "success",
        confirmButtonText: "OK",
      });
      resetForm();
    } catch (error: unknown) {
      let message = "Terjadi kesalahan";
      if (axios.isAxiosError(error)) {
        message = error.response?.data?.message || message;
      }
      Swal.fire({
        title: "Error!",
        text: message,
        icon: "error",
        confirmButtonText: "OK",
      });
    } finally {
      setIsLoading(false);
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white pt-5 md:pt-24">
      <div className="absolute top-0 md:top-24 left-0 right-0 h-64 bg-gradient-to-b from-red-50 to-white overflow-hidden">
        <svg
          className="absolute top-0 left-0 w-full h-64"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
        >
          <path
            fill="rgba(239, 68, 68, 0.1)"
            d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,112C960,128,1056,160,1152,160C1248,160,1344,128,1392,112L1440,96L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
          ></path>
        </svg>
      </div>

      <div className="container mx-auto px-4 py-12 relative">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12">
            <Image
              src="/nginepin-logo.png"
              alt="Logo"
              width={120}
              height={120}
              className="mx-auto mb-6"
            />
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              Bergabung sebagai Pemilik Properti
            </h1>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Kelola properti Anda dengan lebih efisien dan dapatkan akses ke
              jaringan penyewa berkualitas
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Left Side - Features */}
            <div className="space-y-6">
              {/* Feature Cards */}
              <div className="grid gap-6">
                <div className="group bg-white p-6 rounded-2xl border border-gray-100 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                  <div className="flex items-start space-x-4">
                    <div className="bg-red-100 p-3 rounded-xl group-hover:bg-red-600 transition-colors">
                      <Building2 className="h-6 w-6 text-red-600 group-hover:text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2 text-gray-800">
                        Dashboard Properti Premium
                      </h3>
                      <p className="text-gray-600">
                        Kelola semua properti dalam satu tampilan dengan fitur
                        analitik lengkap
                      </p>
                    </div>
                  </div>
                </div>

                <div className="group bg-white p-6 rounded-2xl border border-gray-100 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                  <div className="flex items-start space-x-4">
                    <div className="bg-red-100 p-3 rounded-xl group-hover:bg-red-600 transition-colors">
                      <Wallet className="h-6 w-6 text-red-600 group-hover:text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2 text-gray-800">
                        Pembayaran Terintegrasi
                      </h3>
                      <p className="text-gray-600">
                        Sistem pembayaran otomatis dan laporan keuangan
                        real-time
                      </p>
                    </div>
                  </div>
                </div>

                <div className="group bg-white p-6 rounded-2xl border border-gray-100 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                  <div className="flex items-start space-x-4">
                    <div className="bg-red-100 p-3 rounded-xl group-hover:bg-red-600 transition-colors">
                      <Users className="h-6 w-6 text-red-600 group-hover:text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2 text-gray-800">
                        Manajemen Penyewa
                      </h3>
                      <p className="text-gray-600">
                        Kelola penyewa dengan mudah dan akses ke database
                        penyewa terverifikasi
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Statistics */}
              <div className="grid grid-cols-3 gap-6 mt-8">
                <div className="text-center p-4 bg-red-50 rounded-xl">
                  <div className="text-2xl font-bold text-red-600">500+</div>
                  <div className="text-sm text-gray-600">Properti Aktif</div>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-xl">
                  <div className="text-2xl font-bold text-red-600">1000+</div>
                  <div className="text-sm text-gray-600">Pemilik Properti</div>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-xl">
                  <div className="text-2xl font-bold text-red-600">98%</div>
                  <div className="text-sm text-gray-600">Tingkat Kepuasan</div>
                </div>
              </div>
            </div>

            {/* Right Side - Registration Form */}
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
              <div className="max-w-md mx-auto">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                  Mulai Perjalanan Anda
                </h2>

                <Formik
                  initialValues={{ email: "" }}
                  validationSchema={validationSchema}
                  onSubmit={handleSubmit}
                >
                  {({ isSubmitting }) => (
                    <Form className="space-y-6">
                      <div className="relative">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email Bisnis
                        </label>
                        <Field
                          type="email"
                          name="email"
                          placeholder="nama@perusahaan.com"
                          className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all outline-none"
                        />
                        <ErrorMessage
                          name="email"
                          component="div"
                          className="text-red-500 text-sm mt-1"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting || isLoading}
                        className="w-full flex items-center justify-center py-3 px-4 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold transition-all duration-300 transform hover:translate-y-[-2px] focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isLoading || isSubmitting ? (
                          <span className="flex items-center">
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
                            Processing...
                          </span>
                        ) : (
                          <>
                            <Mail className="mr-2 h-5 w-5" />
                            Daftar dengan Email
                            <ArrowRight className="ml-2 h-5 w-5" />
                          </>
                        )}
                      </button>
                    </Form>
                  )}
                </Formik>

                <div className="relative mt-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">
                      Atau daftar dengan
                    </span>
                  </div>
                </div>

                <SocialLoginTenant />

                <div className="mt-8 text-center">
                  <p className="text-sm text-gray-600 mb-4">
                    Dengan mendaftar, Anda menyetujui
                  </p>
                  <div className="space-x-2 text-sm">
                    <a
                      href="#"
                      className="text-red-600 hover:text-red-700 font-medium hover:underline"
                    >
                      Syarat dan Ketentuan
                    </a>
                    <span className="text-gray-500">dan</span>
                    <a
                      href="#"
                      className="text-red-600 hover:text-red-700 font-medium hover:underline"
                    >
                      Kebijakan Privasi
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TenantRegisterForm;
