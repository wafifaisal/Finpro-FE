"use client";
import React from "react";
import Image from "next/image";
import FeaturesSection from "./FeaturesSection";
import RegistrationForm from "./RegistrationForm";

const TenantRegisterForm = () => {
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
            <FeaturesSection />
            <RegistrationForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TenantRegisterForm;
