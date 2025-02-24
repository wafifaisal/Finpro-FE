"use client";

import ResetPasswordForm from "@/components/sub/reset-password-user/ResetPasswordForm";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ResetPasswordPage() {
  return (
    <>
      <ToastContainer />
      <ResetPasswordForm />
    </>
  );
}
