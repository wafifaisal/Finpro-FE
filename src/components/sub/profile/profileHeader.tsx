"use client";

import { useSession } from "@/context/useSessionHook";
import { useState, useEffect } from "react";
import { HiSparkles } from "react-icons/hi";
import Swal from "sweetalert2";
import Image from "next/image";

interface ProfileHeaderProps {
  openModal: (image: string) => void;
  selectedImage: string | null;
  setSelectedImage: React.Dispatch<React.SetStateAction<string | null>>;
}

export default function ProfileHeader({
  openModal,
  selectedImage,
  setSelectedImage,
}: ProfileHeaderProps) {
  const { user } = useSession();
  const [uploading, setUploading] = useState(false);
  const [showSparkle, setShowSparkle] = useState(false);
  const base_url = process.env.NEXT_PUBLIC_BASE_URL_BE;

  useEffect(() => {
    const timer = setTimeout(() => setShowSparkle(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) {
      Swal.fire({
        title: "Error!",
        text: "No file selected. Please choose a file to upload.",
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No token found");

    try {
      setUploading(true);
      const response = await fetch(`${base_url}/users/avatar-cloud`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        setShowSparkle(true);
        Swal.fire({
          title: "Success!",
          text: "Your profile picture has been updated successfully!",
          icon: "success",
          confirmButtonText: "OK",
        }).then(() => window.location.reload());
      } else {
        throw new Error(`Failed to upload. Status: ${response.status}`);
      }
    } catch {
      Swal.fire({
        title: "Error!",
        text: "Failed to update your profile picture. Please try again later.",
        icon: "error",
        confirmButtonText: "OK",
      });
    } finally {
      setUploading(false);
    }
  };

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
      <label className="absolute bottom-0 left-1/2 -translate-x-1/2 bg-white text-rose-500 font-bold text-xs px-3 py-1 rounded-full shadow-md cursor-pointer opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-rose-50">
        {uploading ? "Uploading..." : "Ganti Avatar"}
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
          disabled={uploading}
        />
      </label>
    </div>
  );
}
