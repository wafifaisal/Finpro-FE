"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, User } from "lucide-react";
import Image from "next/image";
import MobileNavbar from "@/components/sub/mobile_navbar/mobileNavbar";
import Searchbar from "./searchBar";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="fixed w-full z-50">
      <div
        className={`hidden md:block py-4 ${
          isScrolled
            ? "transform duration-500 shadow-md bg-white"
            : "transform duration-500 bg-transparent"
        }`}
      >
        <div className="container mx-auto px-4 py-1 flex justify-between items-center">
          <div className="flex items-center mx-8">
            <Image
              src="/nginepin-logo.png"
              alt="Nginepin Logo"
              width={400}
              height={400}
              className="h-14 w-auto"
            />
          </div>

          <div className="flex items-center ">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex items-center border border-gray-200 px-3 mx-8 py-3 rounded-full hover:shadow-md transition-all bg-white"
            >
              <Menu size={16} className="mr-2 text-gray-500" />
              <User size={16} className="text-gray-500" />
            </button>
            {isMenuOpen && (
              <div className="absolute right-11 top-16 w-64 bg-white border rounded-xl shadow-lg py-2 text-black z-50">
                <Link
                  href="/auth/user/register"
                  className="block px-4 py-2 hover:bg-gray-100"
                >
                  Registrasi
                </Link>
                <Link
                  href="/login"
                  className="block px-4 py-2 hover:bg-gray-100"
                >
                  Log in
                </Link>
                <div className="border-t my-2"></div>
                <Link
                  href="/host"
                  className="block px-4 py-2 hover:bg-gray-100"
                >
                  Sewakan Property Anda
                </Link>
                <Link
                  href="/help"
                  className="block px-4 py-2 hover:bg-gray-100"
                >
                  Help
                </Link>
              </div>
            )}
          </div>
        </div>
        <Searchbar />
      </div>
      <MobileNavbar />
    </div>
  );
};

export default Navbar;
