import React, { useRef, useState, useEffect } from "react";
import { Search } from "lucide-react";
import MobileSearchBar from "@/components/sub/mobile_navbar/mobileSearchBar";
import { getIndonesianCityImage, SearchFields } from "@/constants/constants";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import useSearchbar from "./searchInput";
import Categories from "./categories";
import { usePathname } from "next/navigation";
import Image from "next/image";

export default function Searchbar() {
  const suggestionRef = useRef<HTMLDivElement | null>(null); // suggestion list ref
  const inputRef = useRef<HTMLInputElement | null>(null); // input field ref
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const pathname = usePathname();
  const {
    searchValues,
    setSearchValues,
    suggestions,
    isScrolled,
    isSearchDisabled,
    loading,
    handleSuggestionClick,
    handleSearch,
    highlightMatch,
    text,
    incrementWho,
    decrementWho,
  } = useSearchbar();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        suggestionRef.current &&
        !suggestionRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsLocationOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (loading) return null;

  return (
    <>
      <div
        className={`hidden md:block border rounded-full max-w-4xl md:mx-auto my-4 ${
          isScrolled ? "max-w-xl px-3 z-40" : "max-w-4xl py-3 px-4 z-40"
        } ${
          isScrolled
            ? "fixed top-9 left-1/4 right-1/4 -translate-y-1/2 duration-500 bg-white shadow-md"
            : "relative top-[370px] bg-white shadow-xl duration-500"
        }`}
      >
        <div className="flex items-center justify-between space-x-2 px-4 py-2">
          {SearchFields.map((field, index) => (
            <div key={index} className="flex-grow flex flex-col relative group">
              <label className="text-xs font-medium text-gray-800 flex gap-2">
                {field.icon}
                {field.label}
              </label>
              <div className="flex items-center space-x-2">
                {field.key === "dateRange" ? (
                  <DatePicker
                    selectsRange
                    startDate={searchValues.checkIn}
                    endDate={searchValues.checkOut}
                    onChange={(update) => {
                      const [start, end] = update;
                      setSearchValues((prev) => ({
                        ...prev,
                        checkIn: start ? new Date(start) : null,
                        checkOut: end ? new Date(end) : null,
                      }));
                    }}
                    dateFormat="d MMM"
                    placeholderText={field.placeholder}
                    calendarClassName="custom-calendar"
                    className="outline-none text-sm w-full truncate hover:bg-gray-50 focus:bg-gray-50 rounded-lg px-2 py-1 transition-colors"
                  />
                ) : field.key === "where" ? (
                  <div className="relative w-full">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center">
                        <input
                          ref={inputRef}
                          type="text"
                          placeholder={field.placeholder}
                          value={searchValues.where}
                          onChange={(e) => {
                            setSearchValues((prev) => ({
                              ...prev,
                              where: e.target.value,
                            }));
                            setIsLocationOpen(true);
                          }}
                          className="outline-none text-sm w-full bg-transparent hover:bg-gray-50 focus:bg-gray-50"
                          onFocus={() => setIsLocationOpen(true)}
                        />
                      </div>
                    </div>
                    {isLocationOpen && (
                      <div
                        ref={suggestionRef}
                        className="absolute z-50 w-72 mt-6 -left-7 bg-white rounded-2xl shadow-lg border  border-gray-200 overflow-hidden"
                      >
                        <div className="p-4 border-b">
                          <h3 className="text-sm font-semibold text-gray-900">
                            Tujuan yang disarankan
                          </h3>
                        </div>
                        <div className="max-h-60 overflow-y-auto">
                          <div className="grid grid-cols-1 gap-2 p-4">
                            {suggestions.map((suggestion, idx) => {
                              const { image, country } =
                                getIndonesianCityImage(suggestion);

                              return (
                                <div
                                  key={idx}
                                  className="flex items-center p-2 hover:bg-gray-50 rounded-xl cursor-pointer transition-colors"
                                  onClick={() => {
                                    handleSuggestionClick(suggestion);
                                    setIsLocationOpen(false);
                                  }}
                                >
                                  <div className="mr-4">
                                    <Image
                                      src={image}
                                      alt={suggestion}
                                      width={50}
                                      height={50}
                                      className="w-14 h-14 object-contain rounded-lg"
                                    />
                                  </div>
                                  <div className="flex-grow">
                                    <p className="text-sm font-medium text-gray-900">
                                      {highlightMatch(suggestion, text)}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                      {country}
                                    </p>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : field.key === "who" ? (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={decrementWho}
                      className="text-sm font-bold text-gray-600 hover:text-gray-800"
                    >
                      -
                    </button>

                    <span className="px-6 w-16 text-center font-bold text-sm bg-transparent border rounded-lg">
                      {searchValues.who}
                    </span>

                    <button
                      onClick={incrementWho}
                      className="text-sm font-bold text-gray-600 hover:text-gray-800"
                    >
                      +
                    </button>
                  </div>
                ) : (
                  <input
                    type="text"
                    onChange={(e) =>
                      setSearchValues((prev) => ({
                        ...prev,
                        [field.key]: e.target.value,
                      }))
                    }
                    placeholder={field.placeholder}
                    className="outline-none text-sm w-full truncate hover:bg-gray-50 focus:bg-gray-50 rounded-lg px-2 py-1 transition-colors"
                  />
                )}
              </div>
              <div className="absolute h-8 w-px bg-gray-200 right-0 top-1/2 -translate-y-1/2" />
            </div>
          ))}
          <button
            onClick={handleSearch}
            disabled={isSearchDisabled}
            className="p-3 rounded-full bg-gradient-to-r from-rose-500 to-pink-600 text-white hover:from-rose-600 hover:to-pink-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Search className="w-3 h-3" />
          </button>
        </div>
      </div>
      {!(
        pathname === "/auth/user/login" || pathname === "/auth/user/register"
      ) && <MobileSearchBar />}
      <Categories />
    </>
  );
}
