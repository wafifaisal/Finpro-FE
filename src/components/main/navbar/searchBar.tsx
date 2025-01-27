"use client";

import React, { useEffect, useState } from "react";
import { Search } from "lucide-react";
import MobileSearchBar from "@/components/sub/mobile_navbar/mobileSearchBar";
import { SearchFields } from "@/constants/constants";
import { usePathname, useRouter } from "next/navigation";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// Define interfaces for search values and API responses
interface SearchValues {
  where: string;
  checkIn: string;
  checkOut: string;
  who: string;
}

interface RoomPriceResponse {
  price: number;
}

export default function Searchbar() {
  const base_url_be = process.env.NEXT_PUBLIC_BASE_URL_BE;
  const [searchValues, setSearchValues] = useState<SearchValues>({
    where: "",
    checkIn: "",
    checkOut: "",
    who: "",
  });

  const [roomPrice, setRoomPrice] = useState<number | null>(null);
  const isSearchDisabled = Object.values(searchValues).some(
    (value) => value.trim() === ""
  );

  const router = useRouter();

  const handleSearch = async () => {
    const params = new URLSearchParams();

    if (searchValues.where) {
      params.append("name", searchValues.where);
    }

    if (searchValues.checkIn) {
      params.append("checkIn", searchValues.checkIn);
    }

    if (searchValues.checkOut) {
      params.append("checkOut", searchValues.checkOut);
    }

    if (searchValues.who) {
      params.append("who", searchValues.who);
    }

    try {
      const response = await fetch(
        `${base_url_be}/property?${params.toString()}`
      );
      const data = await response.json();
      console.log("Search results:", data);
      router.push(`/property?${params.toString()}`);
    } catch (error) {
      console.error("Error during search:", error);
    }
  };

  const fetchRoomPrice = async () => {
    if (searchValues.where && searchValues.who) {
      const params = new URLSearchParams({
        location: searchValues.where,
        people: searchValues.who,
      });

      try {
        const response = await fetch(
          `${base_url_be}/property?${params.toString()}`
        );
        const data: RoomPriceResponse = await response.json();
        setRoomPrice(data.price); // Assume the response contains a "price" field
      } catch (error) {
        console.error("Error fetching room price:", error);
        setRoomPrice(null);
      }
    }
  };

  useEffect(() => {
    // Fetch room price when location or number of people changes
    fetchRoomPrice();
  }, [searchValues.where, searchValues.who]);

  const [isScrolled, setIsScrolled] = useState(false);
  const [loading, setLoading] = useState(true);

  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    if (window.scrollY > 0) {
      setIsScrolled(true);
    }

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    if (pathname !== "/") {
      setIsScrolled(true);
    }
  }, [pathname]);

  useEffect(() => {
    setLoading(false);
  }, []);

  if (loading) {
    return null;
  }

  return (
    <>
      <div
        className={`hidden md:block border rounded-full max-w-4xl max-[955px]:max-w-[700px] md:mx-auto my-4 ${
          isScrolled
            ? "fixed top-10 left-1/4 transform right-1/4 -translate-y-1/2 duration-500 bg-white z-40 md:shadow-md"
            : "relative transform duration-500 md:shadow-xl top-[370px] bg-white z-40"
        }`}
      >
        <div className="flex items-center justify-between space-x-2 px-4 py-3">
          {SearchFields.map((field, index) => (
            <div key={index} className="flex-grow flex flex-col relative">
              <label className="text-xs text-gray-600">{field.label}</label>
              <div className="flex items-center space-x-2">
                {field.icon}
                {field.key === "checkIn" || field.key === "checkOut" ? (
                  <DatePicker
                    selected={
                      field.key === "checkIn"
                        ? searchValues.checkIn
                          ? new Date(searchValues.checkIn)
                          : null
                        : searchValues.checkOut
                        ? new Date(searchValues.checkOut)
                        : null
                    }
                    onChange={(date: Date | null) => {
                      setSearchValues((prev) => ({
                        ...prev,
                        [field.key]: date ? date.toISOString() : "",
                      }));
                    }}
                    dateFormat="yyyy/MM/dd"
                    placeholderText={field.placeholder}
                    className="outline-none text-sm w-full truncate"
                  />
                ) : (
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
                )}
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
        {roomPrice !== null && (
          <div className="mt-2 text-sm text-gray-600">
            <p>Estimated Room Price: ${roomPrice}</p>
          </div>
        )}
      </div>
      <MobileSearchBar />
    </>
  );
}
