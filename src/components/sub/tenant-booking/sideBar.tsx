"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { FaSuitcase, FaStar } from "react-icons/fa";
import { IoMdAnalytics } from "react-icons/io";

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="main-content w-full md:w-[20%] h-96 md:min-h-screen hidden md:flex flex-col items-center gap-4 bg-gray-100 p-4">
      <Link
        className={`flex justify-center gap-2 font-semibold w-full md:w-44 p-2 rounded-md ${
          pathname === "/booking-management"
            ? "text-red-500 hover:text-red-700 border-b-2 border-red-500"
            : "text-gray-800 border-b-2 border-gray-800"
        }`}
        href="/booking-management"
      >
        <FaSuitcase className="text-2xl" />
        <p>Daftar Reservasi</p>
      </Link>

      <Link
        className={`flex justify-center gap-2 font-semibold w-full md:w-44 p-2 rounded-md ${
          pathname === "/tenant-review"
            ? "text-red-500 hover:text-red-700 border-b-2 border-red-500"
            : "text-gray-800 border-b-2 border-gray-800"
        }`}
        href="/tenant-review"
      >
        <FaStar className="text-2xl" />
        <p>Balas Ulasan</p>
      </Link>

      <Link
        className={`flex justify-center gap-2 font-semibold w-full md:w-44 p-2 rounded-md ${
          pathname === "/tenant-report"
            ? "text-red-500 hover:text-red-700 border-b-2 border-red-500"
            : "text-gray-800 border-b-2 border-gray-800"
        }`}
        href="/tenant-report"
      >
        <IoMdAnalytics className="text-2xl" />
        <p>Laporan</p>
      </Link>
    </div>
  );
}
