"use client";
import { useRouter } from "next/navigation";
import { useState, useCallback } from "react"; // Tambahkan useCallback
import Swal from "sweetalert2";
import { Mail, CheckCircle, AlertCircle } from "lucide-react";
import { ToastContainer } from "react-toastify";

export default function VerifyEmail({
  params,
}: {
  params?: { token?: string };
}) {
  const router = useRouter();
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<
    "pending" | "success" | "error"
  >("pending");
  const base_url = process.env.NEXT_PUBLIC_BASE_URL_BE;

  const requestEmailVerification = useCallback(async () => {
    try {
      if (isVerifying) return;
      setIsVerifying(true);
      const token = localStorage.getItem("token");
      if (!token) {
        setVerificationStatus("error");
        throw new Error("No token found");
      }

      const response = await fetch(
        `${base_url}/users/resend-verification/${params?.token}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        setVerificationStatus("success");
        Swal.fire({
          title: "Success!",
          text: "Email Verification Successful!",
          icon: "success",
          confirmButtonText: "OK",
        }).then(() => {
          setTimeout(() => {
            router.push("/profile"); // Redirect setelah 3 detik
          }, 3000);
        });
      } else {
        setVerificationStatus("error");
        throw new Error("Failed to send verification email");
      }
    } catch (error) {
      console.error(error);
      setVerificationStatus("error");
      Swal.fire({
        title: "Error!",
        text: "Failed to send verification email. Please try again later.",
        icon: "error",
        confirmButtonText: "OK",
      });
    } finally {
      setIsVerifying(false);
    }
  }, [isVerifying, base_url, params?.token, router]);

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-rose-50 to-white opacity-50">
        <div className="absolute top-0 left-0 w-full h-full animate-blob-1 bg-rose-100/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-full h-full animate-blob-2 bg-rose-200/20 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-md p-8 bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-rose-100 transform transition-all duration-500">
        <div className="flex flex-col items-center space-y-6">
          <div
            className={`w-24 h-24 rounded-full flex items-center justify-center ${
              verificationStatus === "pending"
                ? "bg-rose-100 animate-pulse"
                : verificationStatus === "success"
                ? "bg-green-100"
                : "bg-red-100"
            }`}
          >
            {verificationStatus === "pending" && (
              <Mail className="w-12 h-12 text-rose-500 animate-bounce" />
            )}
            {verificationStatus === "success" && (
              <CheckCircle className="w-12 h-12 text-green-500 animate-ping" />
            )}
            {verificationStatus === "error" && (
              <AlertCircle className="w-12 h-12 text-red-500 animate-spin" />
            )}
          </div>
          <div className="text-center">
            {verificationStatus === "pending" && (
              <>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  Verifying Your Email
                </h2>
                <p className="text-gray-600 animate-pulse">
                  Please wait while we verify your email address...
                </p>
              </>
            )}

            {verificationStatus === "success" && (
              <>
                <h2 className="text-2xl font-bold text-green-700 mb-4">
                  Verification Successful
                </h2>
                <p className="text-gray-600">
                  Your email has been verified. Redirecting...
                </p>
              </>
            )}

            {verificationStatus === "error" && (
              <>
                <h2 className="text-2xl font-bold text-red-700 mb-4">
                  Verification Failed
                </h2>
                <p className="text-gray-600">
                  Unable to verify your email. Please try again.
                </p>
                <button
                  onClick={requestEmailVerification}
                  className="mt-4 px-6 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors"
                >
                  Retry Verification
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
}
