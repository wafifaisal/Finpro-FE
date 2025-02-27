"use client";
import React, { useState } from "react";
import { Mail, ArrowRight } from "lucide-react";
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik";
import axios from "axios";
import Swal from "sweetalert2";
import SocialLoginTenant from "@/components/main/register/socialLoginTenant";
import emailSchema from "@/types/EmailSchema";

interface FormValues {
  email: string;
}

const RegistrationForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const base_url_be = process.env.NEXT_PUBLIC_BASE_URL_BE;

  const handleSubmit = async (
    values: FormValues,
    { setSubmitting, resetForm }: FormikHelpers<FormValues>
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
    <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
      <div className="max-w-md mx-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Mulai Perjalanan Anda
        </h2>

        <Formik
          initialValues={{ email: "" }}
          validationSchema={emailSchema}
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
          <p className="text-center text-sm text-gray-600 mt-8">
            Dengan membuat akun, Anda menyetujui ketentuan kami{" "}
            <span className="font-medium text-[#FF385C] hover:text-[#FF385C]/80">
              Ketentuan Layanan{" "}
            </span>
            dan{" "}
            <span className="font-medium text-[#FF385C] hover:text-[#FF385C]/80">
              Kebijakan Privasi{" "}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegistrationForm;
