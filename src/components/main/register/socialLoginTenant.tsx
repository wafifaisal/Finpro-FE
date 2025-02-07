"use client";

import React from "react";
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SocialLoginTenant = () => {
  const router = useRouter();
  const base_url_be = process.env.NEXT_PUBLIC_BASE_URL_BE;

  const handleGoogleLogin = async (credentialResponse: CredentialResponse) => {
    try {
      if (!credentialResponse.credential) {
        throw new Error("Credential not found");
      }

      const tokenId = credentialResponse.credential;

      const res = await fetch(`${base_url_be}/auth/social-login-tenant`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tokenId,
          provider: "google",
        }),
      });

      if (!res.ok) {
        throw new Error("Login failed");
      }

      const data = await res.json();
      localStorage.setItem("token", data.token);
      toast.success("Login berhasil!", {
        position: "bottom-right",
        autoClose: 3000,
      });
      setTimeout(() => window.location.assign("/"), 1000);
      router.push("/");
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error.message);
        toast.error("Akun sudah terdaftar gunakan login manual", {
          position: "bottom-right",
          autoClose: 3000,
        });
      } else {
        console.error("Unknown error occurred");
        toast.error("Tidak dapat login dengan Google saat ini", {
          position: "bottom-right",
          autoClose: 3000,
        });
      }
    }
  };

  return (
    <div>
      <GoogleLogin
        onSuccess={handleGoogleLogin}
        onError={() => alert("Google Login Failed")}
      />
    </div>
  );
};

export default SocialLoginTenant;
