"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "@/context/useSessionHook";
import { HiSparkles } from "react-icons/hi";
import Image from "next/image";
import Swal from "sweetalert2";
import AvatarUploadModal from "./AvatarUploadModal";

interface ProfileHeaderProps {
  openModal: (image: string) => void;
  selectedImage: string | null;
  setSelectedImage: React.Dispatch<React.SetStateAction<string | null>>;
}

export default function ProfileHeader({ openModal }: ProfileHeaderProps) {
  const { tenant } = useSession();
  const [showSparkle, setShowSparkle] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowSparkle(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative group">
      <div className="relative">
        <Image
          src={
            tenant?.avatar ||
            "https://res.cloudinary.com/dkyco4yqp/image/upload/v1738487804/user-circle-svgrepo-com_az7hcs.png"
          }
          alt="Tenant Avatar"
          height={800}
          width={800}
          className="w-32 h-32 rounded-full border-4 border-white shadow-lg cursor-pointer object-cover transform transition-transform duration-300 group-hover:scale-105"
          onClick={() =>
            openModal(
              tenant?.avatar ||
                "https://res.cloudinary.com/dkyco4yqp/image/upload/v1738487804/user-circle-svgrepo-com_az7hcs.png"
            )
          }
        />
        {showSparkle && (
          <HiSparkles
            className="absolute -top-2 -right-2 text-yellow-400 text-2xl animate-bounce"
            onClick={() => setShowSparkle(false)}
          />
        )}
      </div>

      <button
        onClick={() => setIsModalOpen(true)}
        className="absolute bottom-0 left-1/2 -translate-x-1/2 bg-white text-rose-500 font-bold text-xs px-3 py-1 rounded-full shadow-md cursor-pointer opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-rose-50"
      >
        Ganti Avatar
      </button>

      {isModalOpen && (
        <AvatarUploadModal
          onClose={() => setIsModalOpen(false)}
          onUploadSuccess={() => {
            setShowSparkle(true);
            setIsModalOpen(false);
            Swal.fire({
              title: "Success!",
              text: "Foto profil Anda telah berhasil diperbarui!",
              icon: "success",
              confirmButtonText: "OK",
            }).then(() => window.location.reload());
          }}
        />
      )}
    </div>
  );
}
