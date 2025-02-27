import React from "react";
import { Home, DollarSign, Shield } from "lucide-react";
import CountUp from "@/components/sub/tenant_login/countUp";
import Image from "next/image";
import Link from "next/link";
import PropertyCount from "@/components/sub/tenant_login/PropertyCount";

const TenantHomesPage = () => {
  return (
    <div className="min-h-screen bg-white pt-0 md:pt-24">
      <div className="relative h-screen">
        <video
          autoPlay
          loop
          muted
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source
            src="https://res.cloudinary.com/dkyco4yqp/video/upload/v1738679667/videoplayback_1_online-video-cutter.com_cydfbe.mp4"
            type="video/mp4"
          />
        </video>
        <div className="absolute inset-0 bg-black/30" />

        <div className="relative h-full flex flex-col justify-center items-center text-white px-4 text-center">
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6">
            <h1 className="text-4xl md:text-6xl hollow-text">
              Menjadi Tenant di
            </h1>
            <Image
              src="https://res.cloudinary.com/dkyco4yqp/image/upload/v1738528719/nginepin-logo_bzdcsu.png"
              alt="Logo Nginepin"
              width={2000}
              height={2000}
              className="w-32 md:w-48 h-auto"
            />
          </div>

          <p className="text-lg md:text-xl max-w-2xl mt-4">
            Bergabunglah dengan jutaan tenant yang membagikan rumah mereka dan
            mendapatkan penghasilan tambahan di Nginepin
          </p>
          <div className="flex flex-col sm:flex-row gap-6 mt-8">
            <Link href="/auth/tenant/login">
              <button className="bg-black bg-opacity-10 backdrop-blur-md text-white px-6 md:px-8 py-3 md:py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 hover:text-black transition-colors">
                Masuk
              </button>
            </Link>
            <Link href="/auth/tenant/register">
              <button className="bg-black bg-opacity-10 backdrop-blur-md text-white px-6 md:px-8 py-3 md:py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 hover:text-black transition-colors">
                Buat Akun Tenant
              </button>
            </Link>
          </div>
        </div>
      </div>

      <section className="py-16 bg-gray-100 text-center">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <CountUp />
            <p className="text-lg md:text-xl text-gray-700 mt-2">
              Tenant Sudah Mendaftar
            </p>
          </div>
          <div>
            <PropertyCount />
            <p className="text-lg md:text-xl text-gray-700 mt-2">
              Properti Sudah Disewakan
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Mengapa menjadi tenant di Nginepin?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Home className="w-8 h-8" />,
                title: "Sewakan dengan cara Anda",
                description:
                  "Anda memiliki kendali penuh atas ruang, harga, dan aturan Anda.",
              },
              {
                icon: <DollarSign className="w-8 h-8" />,
                title: "Dapatkan penghasilan tambahan",
                description:
                  "Ubah ruang ekstra Anda menjadi penghasilan tambahan.",
              },
              {
                icon: <Shield className="w-8 h-8" />,
                title: "Sewakan dengan percaya diri",
                description:
                  "Kami menawarkan perlindungan kerusakan dan asuransi tanggung jawab.",
              },
            ].map((benefit, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-rose-100 text-rose-600 mb-4">
                  {benefit.icon}
                </div>
                <h3 className="text-lg md:text-xl font-semibold mb-2">
                  {benefit.title}
                </h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default TenantHomesPage;
