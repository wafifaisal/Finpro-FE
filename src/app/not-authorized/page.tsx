"use client";
import React from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";
import FloatingBackground from "@/components/sub/not-authorized/FloatingBackground";

const NotAuthorized: React.FC = () => {
  const router = useRouter();

  const animasiLogo = {
    y: [0, -15, 0],
    rotate: [0, 5, 0, -5, 0],
    transition: {
      y: {
        repeat: Infinity,
        duration: 6,
        ease: "easeInOut",
      },
      rotate: {
        repeat: Infinity,
        duration: 12,
        ease: "easeInOut",
      },
    },
  };

  return (
    <div className="relative min-h-screen bg-white overflow-hidden">
      <FloatingBackground />
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{
            opacity: 1,
            scale: 1,
            ...animasiLogo,
          }}
          className="mb-16 w-64 h-64 flex items-center justify-center"
        >
          <Image
            src="https://res.cloudinary.com/dkyco4yqp/image/upload/v1738528719/nginepin-logo_bzdcsu.png"
            alt="Logo NginePin"
            width={240}
            height={96}
            className="object-contain"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-white bg-opacity-90 backdrop-blur-md rounded-2xl p-10 w-full max-w-md shadow-xl border border-gray-100"
        >
          <div className="flex flex-col items-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{
                scale: 1,
                transition: {
                  type: "spring",
                  stiffness: 260,
                  damping: 20,
                  delay: 0.3,
                },
              }}
              className="w-16 h-16 flex items-center justify-center mb-6"
            ></motion.div>

            <motion.h1
              className="text-3xl font-bold text-gray-900 mb-3 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              Akses Ditolak
            </motion.h1>

            <motion.p
              className="text-gray-600 mb-8 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              Anda tidak memiliki izin untuk mengakses halaman ini.
            </motion.p>

            <div className="flex flex-col sm:flex-row gap-4 w-full">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.4 }}
                className="py-3 px-6 bg-rose-600 border border-gray-300 text-white font-medium rounded-lg hover:bg-rose-700 transition-all duration-300 flex-1"
                onClick={() => router.push("/")}
              >
                Kembali ke halaman utama
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default NotAuthorized;
