"use client";

import React, { useState } from "react";
import { Formik, Form } from "formik";
import PasswordField from "./PasswordField";
import ResetPasswordSchema from "@/constants/ResetPasswordSchema";
import { Shield } from "lucide-react";
import Link from "next/link";

interface ResetPasswordFormProps {
  onSubmit: (values: {
    newPassword: string;
    confirmPassword: string;
  }) => Promise<void>;
  isLoading: boolean;
}

const ResetPasswordForm: React.FC<ResetPasswordFormProps> = ({
  onSubmit,
  isLoading,
}) => {
  const [showPassword, setShowPassword] = useState({
    new: false,
    confirm: false,
  });

  return (
    <>
      <div className="flex justify-center mb-6">
        <div className="p-3 bg-rose-50 rounded-2xl">
          <Shield className="w-8 h-8 text-rose-500" />
        </div>
      </div>

      <h1 className="text-3xl font-bold mb-2 text-gray-900 text-center">
        Buat Password Baru
      </h1>
      <p className="text-gray-500 text-center mb-8">
        Pastikan aman dan mudah diingat
      </p>

      <Formik
        initialValues={{ newPassword: "", confirmPassword: "" }}
        validationSchema={ResetPasswordSchema}
        onSubmit={onSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="space-y-6">
            <PasswordField
              name="newPassword"
              placeholder="Enter new password"
              show={showPassword.new}
              onToggle={() =>
                setShowPassword((prev) => ({ ...prev, new: !prev.new }))
              }
            />
            <PasswordField
              name="confirmPassword"
              placeholder="Confirm new password"
              show={showPassword.confirm}
              onToggle={() =>
                setShowPassword((prev) => ({ ...prev, confirm: !prev.confirm }))
              }
            />
            <button
              type="submit"
              disabled={isSubmitting || isLoading}
              className={`w-full py-3 rounded-xl text-white font-medium transition-all ${
                isSubmitting || isLoading
                  ? "bg-rose-300 cursor-not-allowed"
                  : "bg-rose-500 hover:bg-rose-600 active:scale-[0.98] shadow-lg shadow-rose-500/25 hover:shadow-rose-500/35"
              }`}
            >
              {isSubmitting || isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Mengatur Ulang Kata Sandi...{" "}
                </span>
              ) : (
                "Setel Ulang Kata Sandi"
              )}
            </button>
          </Form>
        )}
      </Formik>

      <p className="mt-8 text-center text-sm text-gray-500">
        Ingat password anda?{" "}
        <Link
          href="/auth/tenant/login"
          className="text-rose-500 hover:text-rose-600 font-medium"
        >
          Log in
        </Link>
      </p>
    </>
  );
};

export default ResetPasswordForm;
