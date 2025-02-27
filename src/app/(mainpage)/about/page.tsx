"use client";
import React from "react";
import { motion } from "framer-motion";
import FloatingShape from "@/components/sub/about/FloatingShape";
import FeatureCard from "@/components/sub/about/FeatureCard";
import DeveloperSection from "@/components/sub/about/DeveloperSection";
import {
  CreditCard,
  Users,
  MessageSquare,
  Shield,
  LayoutDashboard,
  MapPinHouse,
  ChartLineIcon,
} from "lucide-react";

const Portfolio: React.FC = () => {
  return (
    <div className="pt-16 min-h-[60vh] bg-white">
      <div className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <FloatingShape delay={0} initialX={-100}>
          <div className="w-16 h-16 bg-red-500 rounded-tr-full" />
        </FloatingShape>
        <FloatingShape delay={500} initialX={100}>
          <div className="w-16 h-16 bg-emerald-500" />
        </FloatingShape>
        <FloatingShape delay={1000} initialX={0}>
          <div className="w-16 h-16 bg-blue-500 rounded-full opacity-50" />
        </FloatingShape>
        <div className="text-center space-y-6 p-4 z-10">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-600 text-sm uppercase tracking-wider"
          >
            Web | Sewa | Properti
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-6xl font-bold text-gray-900"
          >
            Tentang Nginepin
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-gray-600 max-w-md mx-auto pt-10"
          >
            Selamat datang di Nginepin! Kami adalah tim kreatif yang
            menghadirkan aplikasi sewa properti modern. Dengan teknologi terkini
            dan desain yang menarik, kami membuat proses sewa jadi lebih mudah,
            cepat, dan aman. Bergabunglah dan rasakan cara baru menyewa
            properti!
          </motion.p>
        </div>
      </div>

      {/* Nginepin Section */}
      <div className="relative flex flex-col items-center justify-center h-[40vh] bg-white">
        <svg viewBox="0 0 1320 300" className="absolute w-full h-full">
          <text
            x="50%"
            y="50%"
            dy=".35em"
            textAnchor="middle"
            className="font-pacifico fill-transparent stroke-red-700 text-[280px] md:text-[140px] animate-stroke"
          >
            Nginepin
          </text>
        </svg>
      </div>

      {/* Sarah's Section */}
      <DeveloperSection
        name="Wafi Faisal Falah"
        role="Product Experience Lead"
        imagePosition="left"
        imageSrc="https://res.cloudinary.com/dkyco4yqp/image/upload/v1740056380/IMG_7378_Original_aruchi.jpg"
      >
        <FeatureCard
          icon={LayoutDashboard}
          title="Homepage / Landing Page"
          description="Menyajikan tampilan beranda yang menarik dengan navigasi intuitif untuk pengalaman pengguna yang optimal."
        />
        <FeatureCard
          icon={Users}
          title="User / Tenant Authentication and Profiles"
          description="Menyediakan sistem autentikasi dan pembuatan profil yang aman, memastikan akses yang mudah bagi pengguna dan penyewa."
        />
        <FeatureCard
          icon={MapPinHouse}
          title="Property Management"
          description="Mengelola properti dengan efisien melalui sistem terintegrasi dan komunikasi yang lancar."
        />
      </DeveloperSection>

      {/* Alex's Section */}
      <DeveloperSection
        name="Afga Ghifari Jamaludin"
        role="Technical Transactions Lead"
        imagePosition="right"
        imageSrc="https://res.cloudinary.com/dkyco4yqp/image/upload/v1740055248/Afga_Ghifari_Profile_Picture_ia3ma1.jpg"
      >
        <FeatureCard
          icon={Shield}
          title="User Transaction Process"
          description="Memproses transaksi pengguna dengan cepat dan aman menggunakan infrastruktur yang andal."
        />
        <FeatureCard
          icon={CreditCard}
          title="Tenant Transaction Management"
          description="Mengatur transaksi penyewa dengan sistem keamanan tinggi dan pengawasan yang ketat."
        />
        <FeatureCard
          icon={MessageSquare}
          title="Review"
          description="Mengumpulkan dan menampilkan ulasan untuk meningkatkan kualitas layanan dan kepercayaan pengguna."
        />
        <FeatureCard
          icon={ChartLineIcon}
          title="Report & Analysis"
          description="Menyediakan laporan dan analisis mendalam untuk mendukung pengambilan keputusan strategis."
        />
      </DeveloperSection>
    </div>
  );
};

export default Portfolio;
