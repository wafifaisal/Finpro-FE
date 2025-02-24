import React from "react";
import { usePathname } from "next/navigation";
import DesktopSearchbar from "./DesktopSearchBar";
import MobileSearchBar from "@/components/sub/mobile_navbar/mobileSearchBar";
import Categories from "./categories";

export default function Searchbar() {
  const pathname = usePathname();

  return (
    <>
      <DesktopSearchbar />
      {!(
        pathname === "/auth/user/login" || pathname === "/auth/user/register"
      ) && <MobileSearchBar />}
      <Categories />
    </>
  );
}
