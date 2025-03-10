"use client";

import { useState, useRef, useEffect } from "react";
import { useSession } from "@/context/useSessionHook";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FiMenu, FiChevronRight } from "react-icons/fi";
import {
  FaUserCircle,
  FaSignOutAlt,
  FaHome,
  FaFileInvoiceDollar,
  FaStar,
} from "react-icons/fa";
import Image from "next/image";
import { IoMdAnalytics } from "react-icons/io";

export default function TenantAvatar() {
  const { isAuth, tenant, logout } = useSession();
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
    toast.success("Logged out successfully", {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });

    logout();
    setTimeout(() => {
      window.location.assign("/auth/tenant/login");
    }, 1000);
  };

  const navigateTo = (path: string) => {
    setIsMenuOpen(false);
    router.push(path);
  };

  if (!isAuth || !tenant) {
    return null;
  }

  return (
    <div className="relative" ref={menuRef}>
      <ToastContainer />

      <button
        onClick={toggleMenu}
        className="flex items-center gap-3 px-4 py-2 rounded-xl bg-white hover:bg-gray-50 border border-gray-100 shadow-sm transition duration-200"
        aria-expanded={isMenuOpen}
        aria-controls="menu"
      >
        <FiMenu className="w-5 h-5 text-gray-600" />
        <div className="relative w-8 h-8 rounded-full overflow-hidden bg-gradient-to-br from-[#FF9A9E] to-[#FAD0C4] flex items-center justify-center">
          {tenant.avatar ? (
            <Image
              src={tenant.avatar}
              alt="avatar"
              fill
              className="object-cover"
            />
          ) : (
            <span className="text-white text-sm font-semibold">
              {tenant.name.slice(0, 2).toUpperCase() || "T"}
            </span>
          )}
        </div>
      </button>

      <div
        className={`fixed top-0 right-0 md:w-[360px] w-full h-screen bg-white shadow-2xl transform transition-all duration-300 ease-out z-50 ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-6 bg-gradient-to-r from-[#FF9A9E] to-[#FAD0C4]">
          <span className="text-lg font-semibold text-white">
            Tenant Dashboard
          </span>
          <button
            onClick={toggleMenu}
            className="text-white/80 hover:text-white transition"
          >
            ✕
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="flex items-center gap-4 pb-6 border-b border-gray-100">
            <div className="relative w-20 h-20 rounded-full overflow-hidden bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
              {tenant.avatar ? (
                <Image
                  src={tenant.avatar}
                  alt="avatar"
                  fill
                  className="object-cover"
                />
              ) : (
                <span className="text-white text-xl font-semibold">
                  {tenant.name.slice(0, 2).toUpperCase() || "T"}
                </span>
              )}
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-800">
                {tenant.name.toLocaleUpperCase()}
              </h2>
              <p className="text-gray-500 text-sm">{tenant.email}</p>
            </div>
          </div>

          <div className="space-y-1">
            <MenuItem
              icon={<FaUserCircle className="text-gray-600" />}
              label="Profil"
              onClick={() => navigateTo("/tenant-profile")}
            />
            <MenuItem
              icon={<FaHome className="text-gray-600" />}
              label="Properti Saya"
              onClick={() => navigateTo("/property-tenant")}
            />
            <MenuItem
              icon={<FaFileInvoiceDollar className="text-gray-600" />}
              label="Manajemen Reservasi"
              onClick={() => navigateTo("/booking-management")}
            />
            <MenuItem
              icon={<FaStar className="text-gray-600" />}
              label="Ulasan"
              onClick={() => navigateTo("/tenant-review")}
            />
            <MenuItem
              icon={<IoMdAnalytics className="text-gray-600" />}
              label="Laporan & Analisis"
              onClick={() => navigateTo("/tenant-report")}
            />
            <MenuItem
              icon={<FaUserCircle className="text-gray-600" />}
              label="Tentang Nginepin"
              onClick={() => navigateTo("/about")}
            />
            <div className="pt-4 mt-4 border-t border-gray-100">
              <MenuItem
                icon={<FaSignOutAlt className="text-rose-500" />}
                label={isLoggingOut ? "Logging out..." : "Sign Out"}
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
    className={`flex items-center justify-between px-4 py-3 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors ${
      highlight ? "text-red-500 hover:bg-red-50" : "text-gray-700"
    }`}
  >
    <div className="flex items-center gap-3">
      {icon}
      <span className="text-sm font-medium">{label}</span>
    </div>
    <FiChevronRight className={highlight ? "text-red-400" : "text-gray-400"} />
  </div>
);
