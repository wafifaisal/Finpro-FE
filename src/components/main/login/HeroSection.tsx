import Image from "next/image";
import { Building2, Mail, Key } from "lucide-react";

export const HeroSection = () => (
  <div className="bg-gradient-to-br from-red-600 to-red-800 p-8 lg:p-12 text-white relative overflow-hidden">
    <div className="relative z-10">
      <div className="mb-8">
        <Image
          width={800}
          height={800}
          src="/nginepin-logo.png"
          alt="Logo Nginepin"
          className="w-32 mb-6 bg-white bg-opacity-20 px-5 rounded-full bg-blur-sm"
        />
        <h2 className="text-3xl lg:text-4xl font-bold mb-4">
          Portal Pemilik Properti
        </h2>
        <p className="text-red-100 mb-6">
          Kelola properti Anda dengan lebih efisien dan profesional
        </p>
      </div>

      <div className="space-y-4">
        {[
          {
            icon: <Building2 className="w-6 h-6" />,
            text: "Kelola multiple properti dalam satu dashboard",
          },
          {
            icon: <Mail className="w-6 h-6" />,
            text: "Terima permintaan sewa secara real-time",
          },
          {
            icon: <Key className="w-6 h-6" />,
            text: "Akses laporan keuangan dan analitik properti",
          },
        ].map((feature, index) => (
          <div key={index} className="flex items-center space-x-3">
            <div className="bg-red-500/20 p-2 rounded-lg">{feature.icon}</div>
            <p>{feature.text}</p>
          </div>
        ))}
      </div>
    </div>

    <div className="absolute top-0 right-0 w-full h-full opacity-10">
      <div className="absolute transform rotate-45 -right-32 -top-32 w-96 h-96 border-8 border-red-400 rounded-full"></div>
      <div className="absolute transform rotate-45 -right-48 -bottom-48 w-96 h-96 border-8 border-red-400 rounded-full"></div>
    </div>
  </div>
);
