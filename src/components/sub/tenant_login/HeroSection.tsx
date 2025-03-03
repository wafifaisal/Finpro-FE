"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const HeroSection = () => {
  const [scrollY, setScrollY] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToNext = () => {
    if (heroRef.current) {
      const heroHeight = heroRef.current.offsetHeight;
      window.scrollTo({
        top: heroHeight,
        behavior: "smooth",
      });
    }
  };

  return (
    <div ref={heroRef} className="relative h-screen">
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <video
          autoPlay
          loop
          muted
          className="absolute inset-0 w-full h-full object-cover scale-110"
          style={{ transform: `scale(1.1) translateY(${scrollY * 0.15}px)` }}
        >
          <source
            src="https://res.cloudinary.com/dkyco4yqp/video/upload/v1738679667/videoplayback_1_online-video-cutter.com_cydfbe.mp4"
            type="video/mp4"
          />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/70" />
      </div>

      <div className="relative h-full flex flex-col justify-center items-center text-white px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex flex-col md:flex-row items-center gap-4 md:gap-6"
        >
          <motion.h1
            className="text-4xl md:text-7xl font-bold"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Menjadi Tenant di
          </motion.h1>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{
              opacity: 1,
              scale: 1,
              rotate: [0, 5, 0, -5, 0],
            }}
            transition={{
              duration: 0.8,
              delay: 0.6,
              rotate: { repeat: Infinity, repeatDelay: 5, duration: 2 },
            }}
          >
            <Image
              src="https://res.cloudinary.com/dkyco4yqp/image/upload/v1738528719/nginepin-logo_bzdcsu.png"
              alt="Logo Nginepin"
              width={2000}
              height={2000}
              className="w-32 md:w-48 h-auto drop-shadow-2xl"
            />
          </motion.div>
        </motion.div>

        <motion.p
          className="text-lg md:text-2xl max-w-2xl mt-6 leading-relaxed"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          Bergabunglah dengan jutaan tenant yang membagikan rumah mereka dan
          mendapatkan{" "}
          <span className="font-bold text-yellow-300">
            penghasilan tambahan
          </span>{" "}
          di Nginepin
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row gap-6 mt-10"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
        >
          <Link href="/auth/tenant/login">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-black px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl hover:bg-gray-100 transition-all duration-300"
            >
              Masuk
            </motion.button>
          </Link>
          <Link href="/auth/tenant/register">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-rose-500 to-pink-600 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Buat Akun Tenant
            </motion.button>
          </Link>
        </motion.div>

        <motion.div
          className="absolute bottom-10 left-0 right-0 flex justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.8 }}
        >
          <motion.button
            onClick={scrollToNext}
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="text-white flex flex-col items-center"
          >
            <span className="text-sm font-medium mb-2">
              Pelajari Lebih Lanjut
            </span>
            <ChevronDown className="w-6 h-6" />
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};

export default HeroSection;
