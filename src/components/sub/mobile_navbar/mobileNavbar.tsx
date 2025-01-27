"use client";
import React, { useState } from "react";
import Link from "next/link";
import { User, Search, X } from "lucide-react";
import Image from "next/image";
import Searchbar from "@/components/main/navbar/searchBar";

const MobileNavbar = () => {
  const [activeTab, setActiveTab] = useState("explore");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="md:hidden">
      <Searchbar />
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
              <Link href="/host" className="block py-3 border-b text-lg">
                Daftarkan Property Anda
              </Link>
              <Link href="/help" className="block py-3 text-lg">
                Bantuan
              </Link>
            </div>
          </div>
        </div>
      )}

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40">
        <div className="flex justify-around py-3">
          {[
            { icon: Search, label: "Explore", tab: "explore", slug: "/" },
            { icon: User, label: "Masuk", tab: "login", slug: "/login" },
          ].map(({ icon: Icon, label, tab, slug }) => (
            <div key={tab} className="flex flex-col items-center">
              {slug ? (
                <Link href={slug}>
                  <button
                    className={`flex flex-col items-center ${
                      activeTab === tab ? "text-black" : "text-gray-500"
                    }`}
                    onClick={() => setActiveTab(tab)}
                  >
                    <Icon size={20} />
                    <span className="text-xs mt-1">{label}</span>
                  </button>
                </Link>
              ) : (
                <button
                  onClick={() => setActiveTab(tab)}
                  className={`flex flex-col items-center ${
                    activeTab === tab
                      ? "text-red-500 font-bold"
                      : "text-gray-500"
                  }`}
                >
                  <Icon size={20} />
                  <span className="text-xs mt-1">{label}</span>
                </button>
              )}
            </div>
          ))}
          <Image
            src="/nginepin-logo.png"
            alt="Nginepin Logo"
            width={80}
            height={24}
            className="w-auto cursor-pointer"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          />
        </div>
      </div>
    </div>
  );
};

export default MobileNavbar;
