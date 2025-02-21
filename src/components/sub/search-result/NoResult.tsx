"use client";

import { Home, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export const NoResults = () => {
  const router = useRouter();

  return (
    <div className="flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-xl shadow-lg p-8 space-y-8">
        <div className="text-center space-y-6">
          <div className="flex justify-center">
            <Home className="w-16 h-16 text-gray-400" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold text-gray-900">
              Kami tidak dapat menemukan properti yang Anda cari
            </h1>
            <p className="text-gray-600 max-w-md mx-auto">
              Properti tersebut mungkin telah dihapus atau tautan yang Anda
              ikuti salah.
            </p>
          </div>
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => router.back()}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Kembali
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
