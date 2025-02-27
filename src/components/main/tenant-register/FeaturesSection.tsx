import React from "react";
import { Building2, Wallet, Users } from "lucide-react";

const FeaturesSection = () => {
  return (
    <div className="space-y-6">
      <div className="grid gap-6">
        <div className="group bg-white p-6 rounded-2xl border border-gray-100 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-start space-x-4">
            <div className="bg-red-100 p-3 rounded-xl group-hover:bg-red-600 transition-colors">
              <Building2 className="h-6 w-6 text-red-600 group-hover:text-white" />
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">
                Dashboard Properti Premium
              </h3>
              <p className="text-gray-600">
                Kelola semua properti dalam satu tampilan dengan fitur analitik
                lengkap
              </p>
            </div>
          </div>
        </div>

        <div className="group bg-white p-6 rounded-2xl border border-gray-100 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-start space-x-4">
            <div className="bg-red-100 p-3 rounded-xl group-hover:bg-red-600 transition-colors">
              <Wallet className="h-6 w-6 text-red-600 group-hover:text-white" />
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">
                Pembayaran Terintegrasi
              </h3>
              <p className="text-gray-600">
                Sistem pembayaran otomatis dan laporan keuangan real-time
              </p>
            </div>
          </div>
        </div>

        <div className="group bg-white p-6 rounded-2xl border border-gray-100 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-start space-x-4">
            <div className="bg-red-100 p-3 rounded-xl group-hover:bg-red-600 transition-colors">
              <Users className="h-6 w-6 text-red-600 group-hover:text-white" />
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">
                Manajemen Penyewa
              </h3>
              <p className="text-gray-600">
                Kelola penyewa dengan mudah dan akses ke database penyewa
                terverifikasi
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturesSection;
