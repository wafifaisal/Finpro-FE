import React, { useState } from "react";
import Image from "next/image";
import { Property } from "@/types/types";
import { Star, Shield, Home, MessageCircle, CheckCircle } from "lucide-react";

interface OwnerInfoProps {
  tenant: Property["tenant"];
  tenantPropertyCount: number;
}

const OwnerInfo: React.FC<OwnerInfoProps> = ({
  tenant,
  tenantPropertyCount,
}) => {
  // Ambil tahun berdasarkan properti createdAt dari tenant
  const joinYear = new Date(tenant.createdAt).getFullYear();

  // State untuk mengatur apakah email telah disalin
  const [copied, setCopied] = useState(false);

  // Fungsi untuk menyalin email tenant ke clipboard
  const handleCopyEmail = () => {
    navigator.clipboard.writeText(tenant.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mt-12 max-w-2xl">
      <div className="flex flex-col gap-6">
        {/* Bagian Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Image
                src={tenant.avatar}
                alt={tenant.name}
                width={64}
                height={64}
                className="rounded-full object-cover ring-2 ring-offset-2 ring-gray-100"
              />
              <div className="absolute -bottom-1 -right-1 bg-rose-500 text-white text-xs font-medium px-2 py-0.5 rounded-full">
                Tenant
              </div>
            </div>
            <div>
              <h2 className="text-xl font-semibold">
                Ditenant oleh {tenant.name}
              </h2>
              <p className="text-gray-500 text-sm">
                Bergabung pada tahun {joinYear}
              </p>
            </div>
          </div>
          <button
            onClick={handleCopyEmail}
            className="bg-white hover:bg-gray-50 text-gray-900 px-6 py-3 rounded-lg border border-gray-300 font-medium transition-colors duration-200 flex items-center justify-center"
          >
            {copied ? (
              <CheckCircle className="w-5 h-5 text-green-500" />
            ) : (
              "Salin Email Tenant"
            )}
          </button>
        </div>

        {/* Grid Statistik */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-3">
            <Star className="w-5 h-5 text-rose-500" />
            <div>
              <p className="font-medium">4.9 rating</p>
              <p className="text-sm text-gray-500">Dari 128 ulasan</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-rose-500" />
            <div>
              <p className="font-medium">Identitas Terverifikasi</p>
              <p className="text-sm text-gray-500">Tenant Aman</p>
            </div>
          </div>
        </div>

        {/* Informasi Tenant */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-gray-600">
            <Home className="w-4 h-4" />
            <span>{tenantPropertyCount} properti terdaftar</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <MessageCircle className="w-4 h-4" />
            <span>Biasanya merespon dalam satu jam</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OwnerInfo;
