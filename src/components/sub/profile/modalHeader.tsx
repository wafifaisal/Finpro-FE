"use client";

import Image from "next/image";
import React, { useEffect } from "react";

interface ProfileImageModalProps {
  selectedImage: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ProfileImageModal({
  selectedImage,
  isOpen,
  onClose,
}: ProfileImageModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  if (!isOpen || !selectedImage) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative max-w-2xl mx-4 transform transition-all duration-300 animate-scaleIn"
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          src={selectedImage}
          alt="Full View"
          width={800}
          height={800}
          className="max-w-full max-h-[80vh] rounded-lg"
        />
        <button
          onClick={onClose}
          className="absolute -top-10 right-0 text-white text-3xl hover:text-rose-500 transition-colors"
        >
          &times;
        </button>
      </div>
    </div>
  );
}
