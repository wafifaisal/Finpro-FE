"use client";

import React, { useEffect, useState } from "react";
import { Search } from "lucide-react";
import MobileSearchBar from "@/components/sub/mobile_navbar/mobileSearchBar";
import { SearchFields, SearchValues } from "@/constants/constants";

export default function Searchbar() {
  const [searchValues, setSearchValues] = useState<SearchValues>({
    where: "",
    checkIn: "",
    checkOut: "",
    who: "1 guest",
  });

  const isSearchDisabled = Object.values(searchValues).some(
    (value) => value.trim() === ""
  );

  const handleSearch = () => {
    console.log("Search initiated with values:", searchValues);
  };

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
    <>
      <div
        className={`hidden md:block border rounded-full max-w-4xl max-[955px]:max-w-[700px] md:mx-auto my-4 ${
          isScrolled
            ? "fixed top-10 left-1/4 transform right-1/4 -translate-y-1/2 duration-1000 bg-white z-50 md:shadow-md"
            : "relative transform duration-500 md:shadow-xl top-72"
        }`}
      >
        <div className="flex items-center justify-between space-x-2 px-4 py-3">
          {SearchFields.map((field, index) => (
            <div key={index} className="flex-grow flex flex-col relative">
              <label className="text-xs text-gray-600 ">{field.label}</label>
              <div className="flex items-center space-x-2">
                {field.icon}
                <input
                  type="text"
                  placeholder={field.placeholder}
                  value={searchValues[field.key]}
                  onChange={(e) =>
                    setSearchValues((prev) => ({
                      ...prev,
                      [field.key]: e.target.value,
                    }))
                  }
                  className="outline-none text-sm w-full truncate"
                  style={{
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                />
              </div>
            </div>
          ))}
          <button
            onClick={handleSearch}
            disabled={isSearchDisabled}
            className={`bg-red-500 text-white p-2 rounded-full ${
              isSearchDisabled && "bg-gray-300 text-gray-500"
            }`}
          >
            <Search size={16} />
          </button>
        </div>
      </div>
      <MobileSearchBar />
    </>
  );
}
