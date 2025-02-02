"use client";

import { useState, useRef, useEffect } from "react";
import { useSession } from "@/context/useSessionHook";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { TbMenuDeep } from "react-icons/tb";
import { FaUserCircle, FaSignOutAlt } from "react-icons/fa";
import { FiChevronRight } from "react-icons/fi";
import { FaRegCalendarCheck } from "react-icons/fa";
import Image from "next/image";
import { FaStar } from "react-icons/fa6";

export default function Avatar() {
  const { isAuth, user, logout } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();
  const menuRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    toast.success("You have been logged out successfully.", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });

    logout();

    setTimeout(() => {
      window.location.assign("/login");
    }, 1000);
  };

  const navigateTo = (path: string) => {
    setIsMenuOpen(false);
    router.push(path);
  };

  if (!isAuth || !user) {
    return null;
  }

  return (
    <div className="relative" ref={menuRef}>
      <ToastContainer />

      <button
        onClick={toggleMenu}
        className="flex items-center gap-3 px-4 py-2 rounded-full border border-gray-200 hover:shadow-md transition duration-200 bg-white"
        aria-expanded={isMenuOpen}
        aria-controls="menu"
      >
        <TbMenuDeep className="w-5 h-5 text-gray-500" />
        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
          <span className="text-gray-600 text-sm font-medium">
            {user.username?.slice(0, 2).toUpperCase() || "U"}
          </span>
        </div>
      </button>

      {/* Sliding Menu - Airbnb style */}
      <div
        className={`fixed top-0 right-0 md:w-[320px] w-full h-screen bg-white shadow-xl transform transition-all duration-300 ease-out z-50 ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <span className="text-lg font-semibold text-gray-800">Menu</span>
          <button
            onClick={toggleMenu}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            ✕
          </button>
        </div>

        <div className="p-3 md:p-6 space-y-6 overflow-hidden w-full outline-none truncate">
          <div className="flex items-center gap-4 pb-6 border-b border-gray-100">
            <Image
              src={
                user.avatar ||
                "https://res.cloudinary.com/dkyco4yqp/image/upload/v1738487804/user-circle-svgrepo-com_az7hcs.png"
              }
              alt="avatar"
              width={60}
              height={60}
              className="rounded-full"
            />
            <div>
              <h2 className="text-sm md:text-lg font-semibold text-gray-800">
                {user.username.toLocaleUpperCase()}
              </h2>
              <p className="text-gray-500 text-xs md:text-sm ">{user.email}</p>
            </div>
          </div>

          <div className="space-y-2">
            <MenuItem
              icon={<FaUserCircle className="text-gray-600" />}
              label="Profil"
              onClick={() => navigateTo("/profile")}
            />
            <MenuItem
              icon={<FaRegCalendarCheck className="text-gray-600" />}
              label="Pesanan Saya"
              onClick={() => navigateTo("/")}
            />
            <MenuItem
              icon={<FaStar className="text-gray-600" />}
              label="Ulasan"
              onClick={() => navigateTo("/")}
            />
            <div className="pt-4 mt-4 border-t border-gray-100">
              <MenuItem
                icon={<FaSignOutAlt className="text-gray-600" />}
                label={isLoggingOut ? "Logging out..." : "Log out"}
                onClick={handleLogout}
                highlight
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface MenuItemProps {
  icon: JSX.Element;
  label: string;
  onClick: () => void;
  highlight?: boolean;
}

const MenuItem = ({ icon, label, onClick, highlight }: MenuItemProps) => (
  <div
    onClick={onClick}
    className={`flex items-center justify-between px-4 py-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors ${
      highlight ? "text-rose-500 hover:bg-rose-50" : "text-gray-700"
    }`}
  >
    <div className="flex items-center gap-3">
      {icon}
      <span className="text-sm font-medium">{label}</span>
    </div>
    <FiChevronRight className="text-gray-400" />
  </div>
);
