"use client";
import React from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { FaHotel, FaBuilding, FaHouseUser, FaList } from "react-icons/fa";
import { PiIslandFill } from "react-icons/pi";
import { MdOutlineVilla } from "react-icons/md";
import FilterButton from "../../main/navbar/FilterButton";
import CategoryBox from "@/components/main/navbar/categoryBox";

export const categories = [
  {
    label: "Hotel",
    icon: FaHotel,
    desc: "Properti ini berupa Hotel",
  },
  {
    label: "Villa",
    icon: MdOutlineVilla,
    desc: "Properti ini berupa Villa",
  },
  {
    label: "Apartmen",
    icon: FaBuilding,
    desc: "Properti ini berupa Apartmen",
  },
  {
    label: "Resor",
    icon: PiIslandFill,
    desc: "Properti ini berupa Resor",
  },
  {
    label: "Guest House",
    icon: FaHouseUser,
    desc: "Properti ini berupa Guest House",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

interface MobileCategoriesProps {
  onCategorySelect: () => void;
}

const MobileCategories: React.FC<MobileCategoriesProps> = ({
  onCategorySelect,
}) => {
  const params = useSearchParams();
  const activeCategory = params?.get("category");
  const pathname = usePathname();
  const isMainPage = pathname === "/" || pathname === "/property/search-result";

  if (!isMainPage) return null;

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="block md:hidden border-t py-3 w-full my-2 bg-white"
    >
      {" "}
      <div className="flex flex-col overflow-y-hidden px-4 gap-4">
        {activeCategory && (
          <motion.div variants={itemVariants}>
            <div onClick={onCategorySelect} className="cursor-pointer">
              <CategoryBox
                label="Semua Properti"
                icon={FaList}
                selected={true}
              />
            </div>
          </motion.div>
        )}

        {categories.map((item) => (
          <motion.div key={item.label} variants={itemVariants}>
            <div onClick={onCategorySelect} className="cursor-pointer">
              <CategoryBox
                label={item.label}
                selected={activeCategory === item.label.toLowerCase()}
                icon={item.icon}
              />
            </div>
          </motion.div>
        ))}

        {pathname === "/property/search-result" && (
          <motion.div variants={itemVariants}>
            <div className="border-b my-5">
              <p className="font-bold">Filter Pencarian</p>
            </div>
            <div className="flex justify-center">
              <FilterButton />
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default MobileCategories;
