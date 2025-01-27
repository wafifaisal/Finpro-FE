"use client";

import React from "react";
import { GoogleLogin } from "@react-oauth/google";
import { useRouter } from "next/navigation"; // Import useRouter

const SocialLogin = () => {
  const router = useRouter(); // Initialize useRouter
  const base_url_be = process.env.NEXT_PUBLIC_BASE_URL_BE;

  const handleGoogleLogin = async (credentialResponse: any) => {
    try {
      const tokenId = credentialResponse.credential; // Extract tokenId from the response

      // Send tokenId to the backend using fetch
      const res = await fetch(`${base_url_be}/auth/social-login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tokenId, // Send tokenId to the backend
          provider: "google", // Specify the provider as "google"
        }),
      });

      // Check if the response is successful
      if (!res.ok) {
        throw new Error("Login failed");
      }

      const data = await res.json(); // Parse JSON response
      alert("Login Successful: " + data.message);

      // Redirect to the home page
      router.push("/");
    } catch (err: any) {
      console.error(err.message || "Google Login Failed");
      alert("Google Login Failed");
    }
  };

  return (
    <div className="social-login-container">
      <h2>Social Login</h2>

      <GoogleLogin
        onSuccess={handleGoogleLogin} // On successful login, handle the response
        onError={() => alert("Google Login Failed")} // Handle error
      />
    </div>
  );
};

export default SocialLogin;
