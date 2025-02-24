"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, User } from "lucide-react";
import Image from "next/image";
import MobileNavbar from "@/components/sub/mobile_navbar/mobileNavbar";

import { usePathname } from "next/navigation";
import { useSession } from "@/context/useSessionHook";
import Avatar from "@/components/main/navbar/avatar";
import TenantAvatar from "@/components/main/navbar/avatarTenant";

const TripsNavbar = () => {
  const { isAuth } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const pathname = usePathname();

  useEffect(() => {
    const savedScrollY = sessionStorage.getItem("scrollY");
    if (savedScrollY) {
      window.scrollTo(0, parseInt(savedScrollY, 10));
      setIsScrolled(parseInt(savedScrollY, 10) > 0);
    }

    if (pathname !== "/") {
      setIsScrolled(true);
      return;
    }

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
      sessionStorage.setItem("scrollY", window.scrollY.toString());
    };

    if (window.scrollY > 0) {
      setIsScrolled(true);
    }

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [pathname]);

  return (
    <div className="fixed w-full z-40">
      <div
        className={`hidden md:block py-2 ${
          isScrolled
            ? "transform duration-500 shadow-md bg-white"
            : "transform duration-500 bg-transparent"
        }`}
      >
        <div className="container mx-auto px-4 py-1 flex justify-between items-center">
          <Link href={"/"}>
            <div className="flex items-center mx-4">
              <Image
                src="/nginepin-logo.png"
                alt="Nginepin Logo"
                width={400}
                height={400}
                className="h-14 w-auto"
              />
            </div>
          </Link>

          <div className="flex items-center ">
            {isAuth ? (
              <div>
                <Avatar />
                <TenantAvatar />
              </div>
            ) : (
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex items-center border border-gray-200 px-3 mx-8 py-3 rounded-full hover:shadow-md transition-all bg-white"
              >
                <Menu size={16} className="mr-2 text-gray-500" />
                <User size={16} className="text-gray-500" />
              </button>
            )}
            {isMenuOpen && (
              <div className="absolute right-11 top-20 w-64 bg-white border rounded-xl shadow-lg py-2 text-black z-50">
                <Link
                  href="/auth/user/register"
                  className="block px-4 py-2 hover:bg-gray-100"
                >
                  Buat Akun
                </Link>
                <Link
                  href="/auth/user/login"
                  className="block px-4 py-2 hover:bg-gray-100"
                >
                  Masuk
                </Link>
                <div className="border-t my-2"></div>
                <Link
                  href="/auth/tenant/homepage"
                  className="block px-4 py-2 hover:bg-gray-100"
                >
                  Daftarkan Property Anda
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
      </div>
      <MobileNavbar />
    </div>
  );
};

export default TripsNavbar;
