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
    no_telp: "",
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
    if (isSubmitting) return; // Prevent duplicate calls
    setIsSubmitting(true);

    if (!params?.token) {
      toast.error("Invalid verification token.");
      router.push("/");
      return;
    }

    const { username, password, confirmPassword, no_telp } = formData;

    if (!username || !password || !confirmPassword || !no_telp) {
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
          no_handphone: no_telp,
        }),
      });

      if (!res.ok) {
        const errorResponse = await res.json();
        throw new Error(errorResponse.message || "Verification failed");
      }

      const result = await res.json();
      toast.success(result.message || "Account successfully verified!");
      setTimeout(() => {
        router.push("/login/loginuser");
      }, 3000);
    } catch (err: any) {
      console.error("Verification Error:", err);
      toast.error(err.message || "Verification failed! Please try again.");
      setTimeout(() => {
        router.push("/");
      }, 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <ToastContainer />
      <div className="w-full max-w-md p-6 bg-white rounded shadow-md">
        <h1 className="text-2xl font-semibold text-center text-gray-700">
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
            <label className="block mb-2 text-sm font-medium text-gray-600">
              Username
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:ring-indigo-200"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium text-gray-600">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:ring-indigo-200"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium text-gray-600">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:ring-indigo-200"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium text-gray-600">
              Phone Number
            </label>
            <input
              type="text"
              name="no_telp"
              value={formData.no_telp}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:ring-indigo-200"
              required
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full px-3 py-2 text-white bg-indigo-500 rounded ${
              isSubmitting ? "opacity-50" : "hover:bg-indigo-600"
            }`}
          >
            {isSubmitting ? "Verifying..." : "Verify Account"}
          </button>
        </form>
      </div>
    </div>
  );
}
