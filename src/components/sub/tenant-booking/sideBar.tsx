"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { FaSuitcase, FaStar } from "react-icons/fa";
import { IoMdAnalytics } from "react-icons/io";

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="main-content w-[30%] flex flex-col items-end gap-4">
      <Link
        className={`flex gap-2 font-semibold w-44 p-2 rounded-md ${
          pathname === "/booking-management"
            ? "bg-gray-100 text-red-500 hover:text-red-700"
            : "text-gray-800"
        }`}
        href="/booking-management"
      >
        <FaSuitcase className="text-2xl" />
        <p>Daftar Reservasi</p>
      </Link>

      <Link
        className={`flex gap-2 font-semibold w-44 p-2 rounded-md ${
          pathname === "/tenant-review"
            ? "bg-gray-100 text-red-500 hover:text-red-700"
            : "text-gray-800"
        }`}
        href="/tenant-review"
      >
        <FaStar className="text-2xl" />
        <p>Balas Ulasan</p>
      </Link>

      <Link
        className={`flex gap-2 font-semibold w-44 p-2 rounded-md ${
          pathname === "/report"
            ? "bg-gray-100 text-red-500 hover:text-red-700"
            : "text-gray-800"
        }`}
        href="/report"
      >
        <IoMdAnalytics className="text-2xl" />
        <p>Laporan</p>
      </Link>
    </div>
  );
}
