import { FaHome, FaHotel, FaBuilding, FaHouseUser } from "react-icons/fa";
import { PiIslandFill } from "react-icons/pi";
import { MdOutlineVilla } from "react-icons/md";
import CategoryBox from "./categoryBox";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import FilterButton from "./FilterButton";

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
    desc: "Properti ini berupa Resor",
  },
];

const Categories = () => {
  const params = useSearchParams();
  const category = params?.get("category");
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
    <>
      <div
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
        <div className="flex items-center justify-between overflow-x-auto">
          {categories.map((item) => (
            <CategoryBox
              key={item.label}
              label={item.label}
              selected={category === item.label}
              icon={item.icon}
            />
          ))}
          {pathname === "/property/search-result" && <FilterButton />}
        </div>
      </div>
    </>
  );
};

export default Categories;
