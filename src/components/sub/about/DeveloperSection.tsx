"use client";
import React, { ReactNode } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Heart } from "lucide-react";

interface DeveloperSectionProps {
  name: string;
  role: string;
  imageSrc: string;
  skills?: string[];
  imagePosition?: "left" | "right";
  children: ReactNode;
}

const DeveloperSection: React.FC<DeveloperSectionProps> = ({
  name,
  role,
  imageSrc,
  imagePosition = "left",
  children,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="py-24"
    >
      <div
        className={`container mx-auto px-6 flex flex-col ${
          imagePosition === "right" ? "md:flex-row-reverse" : "md:flex-row"
        } items-center gap-12`}
      >
        <div className="w-full md:w-1/2 flex flex-col items-center">
          <div className="relative group">
            <motion.img
              whileHover={{ scale: 1.05 }}
              src={imageSrc}
              alt={name}
              className="w-60 h-60 object-cover rounded-full"
            />
            {/* Overlay ikon yang muncul ketika hover */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
              <Heart className="text-white" size={32} />
            </div>
            {/* Dekorasi */}
            <div className="absolute -top-4 -right-4 w-16 h-16 bg-red-500 rounded-tr-full z-0" />
            <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-emerald-500 z-0" />
          </div>
          <div className="mt-4">
            <Image
              src="https://res.cloudinary.com/dkyco4yqp/image/upload/v1740058832/nginepin-logo_ilyp9b.png"
              width={100}
              height={100}
              alt="Nginepin Logo"
            />
          </div>
        </div>

        <div className="w-full md:w-1/2 space-y-8">
          <div>
            <p className="text-gray-600 text-sm uppercase tracking-wider mb-2">
              {role}
            </p>
            <h2 className="text-4xl font-bold text-gray-900">{name}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {children}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default DeveloperSection;
