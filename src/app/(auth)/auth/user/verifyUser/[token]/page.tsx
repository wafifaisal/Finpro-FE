"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function VerifyPage({
  params,
}: {
  params?: { token?: string };
}) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    no_handphone: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const base_url = process.env.NEXT_PUBLIC_BASE_URL_BE;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const onVerify = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    if (!params?.token) {
      toast.error("Invalid verification token.");
      router.push("/");
      return;
    }

    const { username, password, confirmPassword, no_handphone } = formData;

    if (!username || !password || !confirmPassword || !no_handphone) {
      toast.error("All fields are required.");
      setIsSubmitting(false);
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      setIsSubmitting(false);
      return;
    }

    try {
      const res = await fetch(`${base_url}/auth/verifyUser/${params.token}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
          confirmPassword,
          no_handphone: no_handphone,
        }),
      });

      if (!res.ok) {
        const errorResponse = await res.json();
        throw new Error(errorResponse.message || "Verification failed");
      }

      const result = await res.json();
      toast.success(result.message || "Account successfully verified!");
      setTimeout(() => {
        router.push("/auth/user/login");
      }, 3000);
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
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-center min-h-screen bg-white pt-20">
        <ToastContainer />
        <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg border-2 border-red-500">
          <h1 className="text-3xl font-semibold text-center text-red-600">
            Verify Your Account
          </h1>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              onVerify();
            }}
            className="mt-4"
          >
            <div className="mb-4">
              <label className="block mb-2 text-sm font-medium text-red-500">
                Username
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-red-500 rounded focus:outline-none focus:ring focus:ring-red-200"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2 text-sm font-medium text-red-500">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-red-500 rounded focus:outline-none focus:ring focus:ring-red-200"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2 text-sm font-medium text-red-500">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-red-500 rounded focus:outline-none focus:ring focus:ring-red-200"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2 text-sm font-medium text-red-500">
                Phone Number
              </label>
              <input
                type="text"
                name="no_handphone"
                value={formData.no_handphone}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-red-500 rounded focus:outline-none focus:ring focus:ring-red-200"
                required
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full px-3 py-2 text-white bg-red-500 rounded-lg hover:bg-red-600 focus:outline-none focus:ring focus:ring-red-200 ${
                isSubmitting ? "opacity-50" : ""
              }`}
            >
              {isSubmitting ? "Verifying..." : "Verify Account"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
