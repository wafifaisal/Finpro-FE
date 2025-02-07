"use client";

import { useSession } from "@/context/useSessionHook";
import { useState } from "react";
import { FaUser } from "react-icons/fa";
import Image from "next/image";
import Navbar from "@/components/main/navbar/Navbar";
import ProfileEmail from "@/components/sub/profile/emailSection";
import ProfilePassword from "@/components/sub/profile/passwordSection";
import StatGrid from "@/components/sub/profile/statGrid";
import ProfileHeader from "@/components/sub/profile/profileHeader";
import ProfileImageModal from "@/components/sub/profile/modalHeader";

export default function ProfilePage() {
  const { isAuth, type, user } = useSession();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const getRandomEmoji = () => {
    const emojis = ["✈️", "🧳", "🏨", "🛋️", "🎉"];
    return emojis[Math.floor(Math.random() * emojis.length)];
  };

  const openModal = (image: string) => {
    setSelectedImage(image);
    setIsModalOpen(true);
  };

  if (!isAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <p className="text-gray-800">Please log in to view your profile.</p>
      </div>
    );
  }

  if (type !== "user") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <p className="text-gray-800">
          You are not authorized to view this page.
        </p>
      </div>
    );
  }

  console.log("user", user);

  return (
    <>
      <Navbar />
      <div
        className={`min-h-screen bg-white transition-opacity duration-1000 pt-0 pb-24 md:pb-0 md:pt-24`}
      >
        {/* Animated Background Header */}
        <div className="bg-gradient-to-r from-rose-400 to-rose-600 h-48 relative overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute animate-float text-2xl"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                }}
              >
                {getRandomEmoji()}
              </div>
            ))}
          </div>
          <div className="container mx-auto px-4 h-full flex items-end pb-16">
            <h1 className="text-3xl md:text-6xl font-bold text-white transform transition-transform duration-700 translate-y-0">
              Halaman Profil
            </h1>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-0 md:px-4 -mt-16">
          <div className="bg-white rounded-xl shadow-lg p-8  transform transition-all duration-700 hover:shadow-2xl">
            {/* Profile Header */}
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
              {/* Profile Header Disini */}
              <ProfileHeader
                openModal={openModal}
                selectedImage={selectedImage}
                setSelectedImage={setSelectedImage}
              />
              <div className="flex-1">
                <div className="flex justify-between flex-col md:flex-row items-center md:items-start">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800 transform transition-all duration-300 hover:text-rose-500">
                      {user?.username || "Guest"}
                    </h2>
                    <Image
                      src={
                        "https://res.cloudinary.com/dkyco4yqp/image/upload/v1738592375/397058184_11532508_le85qm.png"
                      }
                      alt="stroke"
                      width={800}
                      height={800}
                      className="relative w-32 -top-8"
                    />
                    <div className="-mt-14 mr-3">
                      <p className="text-gray-500 top-8 flex flex-row md:flex-col gap-3">
                        <ProfileEmail />
                      </p>
                      <p className="text-gray-500 top-8 flex gap-3">
                        <FaUser className="text-gray-300 my-1" /> :{" "}
                        {user?.id || "No Email Available"}
                      </p>
                      <ProfilePassword />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <StatGrid />
          </div>
        </div>
      </div>

      {/* Profile Image Modal with Animation */}
      <ProfileImageModal
        selectedImage={selectedImage}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
