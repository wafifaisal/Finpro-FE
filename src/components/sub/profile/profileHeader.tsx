"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "@/context/useSessionHook";
import { HiSparkles } from "react-icons/hi";
import Image from "next/image";
import ProfileAvatarModal from "./ProfileAvatarModal";

interface ProfileHeaderProps {
  openModal: (image: string) => void;
  selectedImage: string | null;
  setSelectedImage: React.Dispatch<React.SetStateAction<string | null>>;
}

export default function ProfileHeader({ openModal }: ProfileHeaderProps) {
  const { user } = useSession();
  const [uploading, setUploading] = useState(false);
  const [showSparkle, setShowSparkle] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const base_url = process.env.NEXT_PUBLIC_BASE_URL_BE;

  useEffect(() => {
    const timer = setTimeout(() => setShowSparkle(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative group">
      <div className="relative">
        <Image
          src={
            user?.avatar ||
            "https://res.cloudinary.com/dkyco4yqp/image/upload/v1738487804/user-circle-svgrepo-com_az7hcs.png"
          }
          alt="User Avatar"
          height={800}
          width={800}
          className="w-32 h-32 rounded-full border-4 border-white shadow-lg cursor-pointer object-cover transform transition-transform duration-300 group-hover:scale-105"
          onClick={() =>
            openModal(
              user?.avatar ||
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
        {uploading ? "Uploading..." : "Ganti Avatar"}
      </button>

      {isModalOpen && (
        <ProfileAvatarModal
          setIsModalOpen={setIsModalOpen}
          base_url={base_url}
          setUploading={setUploading}
          setShowSparkle={setShowSparkle}
        />
      )}
    </div>
  );
}
