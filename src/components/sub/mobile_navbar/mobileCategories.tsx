"use client";

import { FaHome, FaHotel, FaBuilding, FaHouseUser } from "react-icons/fa";
import { PiIslandFill } from "react-icons/pi";
import { MdOutlineVilla } from "react-icons/md";
import CategoryBox from "../../main/navbar/categoryBox";
import { usePathname, useSearchParams } from "next/navigation";

export const categories = [
  {
    label: "Hotel",
    icon: FaHotel,
    link: "/property?type=hotel",
    desc: "Properti ini berupa Hotel",
  },
  {
    label: "Villa",
    icon: MdOutlineVilla,
    link: "/property?type=villa",
    desc: "Properti ini berupa Villa",
  },
  {
    label: "Rumah",
    icon: FaHome,
    link: "/property?type=house",
    desc: "Properti ini berupa Rumah",
  },
  {
    label: "Apartmen",
    icon: FaBuilding,
    link: "/property?type=apartment",
    desc: "Properti ini berupa Apartmen",
  },
  {
    label: "Resor",
    icon: PiIslandFill,
    link: "/property?type=resort",
    desc: "Properti ini berupa Resor",
  },
  {
    label: "Guest House",
    icon: FaHouseUser,
    link: "/property?type=guest-house",
    desc: "Properti ini berupa Guest House",
  },
];

const MobileCategories = () => {
  const params = useSearchParams();
  const category = params?.get("category");
  const pathname = usePathname();
  const isMainPage = pathname === "/" || pathname === "/property/search-result";

  if (!isMainPage) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 p-0 gap-10 sm:p-5 text-4xl">
      {categories.map((item) => (
        <CategoryBox
          key={item.label}
          label={item.label}
          selected={category === item.label}
          icon={item.icon}
        />
      ))}
    </div>
  );
};

export default MobileCategories;
