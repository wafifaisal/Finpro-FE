"use client";
import React from "react";
import { Mail } from "lucide-react";
import axios from "axios";
import { useFormik } from "formik";
import Swal from "sweetalert2";
import SocialLogin from "./socialLogin";
import MarqueeColumn from "./MarqueeColumn";
import { duplicatedImages } from "@/constants/RegisterImage";
import emailSchema from "@/types/EmailSchema";

const RegisterForm: React.FC = () => {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const base_url_be = process.env.NEXT_PUBLIC_BASE_URL_BE;

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: emailSchema,
    onSubmit: async (values) => {
      setIsLoading(true);
      try {
        const response = await axios.post(`${base_url_be}/auth/register`, {
          email: values.email,
        });

        Swal.fire({
          title: "Berhasil",
          text: response.data.message,
          icon: "success",
          confirmButtonColor: "#FF385C",
        });
      } catch {
        Swal.fire({
          title: "Error",
          text: "Email sudah terdaftar",
          icon: "error",
          confirmButtonColor: "#FF385C",
        });
      } finally {
        setIsLoading(false);
      }
    },
  });

  return (
    <div className="flex h-screen bg-white">
      <div className="relative w-1/2 hidden md:block bg-gray-50">
        <div className="absolute inset-0 z-10 flex items-center justify-center">
          <div className="bg-black bg-opacity-65 p-8 rounded-3xl shadow-lg max-w-lg mx-4">
            <div className="text-center">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-[#FF385C] to-[#FF385C]/70 bg-clip-text text-transparent mb-4">
                Bergabung Dengan Nginepin
              </h1>
              <p className="text-white text-xl font-light">
                Bergabunglah dengan ribuan orang yang menemukan properti impian
                mereka dengan harga yang tak terkalahkan
              </p>
            </div>
          </div>
        </div>

        <div className="flex h-full overflow-hidden bg-gray-100">
          <MarqueeColumn direction="up" offset={0} images={duplicatedImages} />
          <MarqueeColumn
            direction="down"
            offset={-33}
            images={duplicatedImages}
          />
          <MarqueeColumn
            direction="up"
            offset={-66}
            images={duplicatedImages}
          />
        </div>
      </div>

      <div className="w-full md:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-semibold text-gray-900">Buat Akun</h2>
            <p className="mt-3 text-gray-600">
              Mulailah perjalanan Anda untuk menemukan properti yang sempurna
              untuk liburanmu
            </p>
          </div>

          <form onSubmit={formik.handleSubmit} className="mt-8 space-y-6">
            <div className="rounded-xl shadow-sm -space-y-px">
              <div>
                <input
                  type="email"
                  name="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="Masukkan email"
                  className="appearance-none rounded-xl relative block w-full px-4 py-4 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#FF385C] focus:border-transparent input"
                />
              </div>
            </div>

            {formik.touched.email && formik.errors.email && (
              <p className="text-[#FF385C] text-sm mt-2">
                {formik.errors.email}
              </p>
            )}

            <button
              type="submit"
              className="group relative w-full flex justify-center py-4 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-[#FF385C] hover:bg-[#FF385C]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF385C]"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Processing...
                </div>
              ) : (
                <div className="flex items-center">
                  <Mail className="mr-2 h-4 w-4" />
                  Lanjutkan dengan Email
                </div>
              )}
            </button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">
                or continue with
              </span>
            </div>
          </div>

          <div className="flex justify-center">
            <SocialLogin />
          </div>

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

export default RegisterForm;
