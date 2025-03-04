import { FaHotel, FaBuilding, FaHouseUser, FaList } from "react-icons/fa";
import { PiIslandFill } from "react-icons/pi";
import { MdOutlineVilla } from "react-icons/md";
import CategoryBox from "./categoryBox";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import FilterButton from "./FilterButton";
import { motion } from "framer-motion";

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
      staggerChildren: 0.5,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const Categories = () => {
  const params = useSearchParams();
  const activeCategory = params?.get("category");
  const pathname = usePathname();

  const isMainPage = pathname === "/" || pathname === "/property/search-result";

  const [isScrolled, setIsScrolled] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (pathname === "/property/search-result") {
      setIsScrolled(true);
      return;
    }

    const savedScrollY = sessionStorage.getItem("scrollY");
    if (savedScrollY) {
      window.scrollTo(0, parseInt(savedScrollY, 10));
      setIsScrolled(parseInt(savedScrollY, 10) > 0);
    }

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
      sessionStorage.setItem("scrollY", window.scrollY.toString());
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [pathname]);

  useEffect(() => {
    setLoading(false);
  }, []);

  if (!isMainPage) return null;
  if (loading) return null;

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className={`hidden md:block border-t-[1px] py-1 rounded-b-3xl max-w-2xl md:mx-auto my-4 ${
        isScrolled
          ? "max-w-full rounded-b-none px-3"
          : "max-w-2xl max-[955px]:max-w-[500px] py-3 px-4"
      } ${
        isScrolled
          ? "fixed top-[100px] right-0 left-0 w-full -translate-y-1/2 duration-500 bg-white md:shadow-md"
          : "relative top-[354px] bg-white md:shadow-xl duration-500"
      }`}
    >
      <div className="flex items-center justify-between overflow-x-auto overflow-y-hidden">
        {activeCategory && (
          <motion.div variants={itemVariants}>
            <CategoryBox label="Semua Properti" icon={FaList} selected={true} />
          </motion.div>
        )}
        {categories.map((item) => (
          <motion.div key={item.label} variants={itemVariants}>
            <CategoryBox
              label={item.label}
              selected={activeCategory === item.label.toLowerCase()}
              icon={item.icon}
            />
          </motion.div>
        ))}
        {pathname === "/property/search-result" && (
          <motion.div variants={itemVariants}>
            <FilterButton />
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default Categories;
