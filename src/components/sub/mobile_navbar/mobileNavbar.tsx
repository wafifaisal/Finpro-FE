"use client";
import React, { useState } from "react";
import Link from "next/link";
import { X, Menu, Grid } from "lucide-react";
import Image from "next/image";
import Searchbar from "@/components/main/navbar/searchBar";
import Categories from "./mobileCategories";
import { useSession } from "@/context/useSessionHook";
import Avatar from "@/components/main/navbar/avatar";
import { usePathname } from "next/navigation";
import TenantAvatar from "@/components/main/navbar/avatarTenant";
import { FaHome } from "react-icons/fa";

const MobileNavbar = () => {
  const [activeTab, setActiveTab] = useState("explore");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const { isAuth } = useSession();
  const pathname = usePathname();

  return (
    <div className="md:hidden">
      {(pathname === "/" || pathname === "/property/search-result") && (
        <Searchbar />
      )}

      {isMenuOpen && (
        <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Menu</h2>
              <button onClick={() => setIsMenuOpen(false)}>
                <X size={24} />
              </button>
            </div>
            <div className="space-y-4">
              <Link
                href="/auth/user/register"
                className="block py-3 border-b text-lg"
              >
                Buat Akun
              </Link>
              <Link href="/auth/user/login" className="block py-3 text-lg">
                Masuk
              </Link>
              <Link
                href="/auth/tenant/homepage"
                className="block py-3 border-b text-lg"
              >
                Daftarkan Property Anda
              </Link>
              <Link href="/about" className="block py-3 text-lg">
                Tentang Nginepin
              </Link>
            </div>
          </div>
        </div>
      )}

      {isCategoriesOpen && (
        <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
          <div className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Kategori</h2>
              <button onClick={() => setIsCategoriesOpen(false)}>
                <X size={24} />
              </button>
            </div>
            <Categories />
          </div>
        </div>
      )}

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40">
        <div className="flex justify-around py-3">
          <div className="flex flex-col items-center">
            <Link href="/">
              <button
                className={`flex flex-col items-center ${
                  activeTab === "explore" ? "text-black" : "text-gray-500"
                }`}
                onClick={() => setActiveTab("explore")}
              >
                <FaHome size={20} />
                <span className="text-xs mt-1">Halaman Utama</span>
              </button>
            </Link>
          </div>

          <div className="flex flex-col items-center">
            {(pathname === "/" || pathname === "/property/search-result") && (
              <button
                className="flex flex-col items-center text-gray-500"
                onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
              >
                <Grid size={20} />
                <span className="text-xs mt-1">Kategori</span>
              </button>
            )}
          </div>
          {isAuth ? (
            <>
              <Avatar />
              <TenantAvatar />
            </>
          ) : (
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex items-center border border-gray-200 px-2 py-3 rounded-full hover:shadow-md transition-all bg-white"
            >
              <Menu size={16} className="mr-2 text-gray-500" />
              <Image
                src="/logo.png"
                alt="Nginepin Logo"
                width={16}
                height={16}
                className="w-auto cursor-pointer"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MobileNavbar;
