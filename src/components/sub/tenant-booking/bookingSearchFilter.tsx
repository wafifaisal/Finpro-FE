"use client";

import React, { useState } from "react";
import { FaSearch, FaTimes, FaFilter } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

interface BookingSearchFilterProps {
  initialFilterType: string;
  initialSearchValue: string;
  onSearch: (filterType: string, searchValue: string) => void;
  onClear: () => void;
}

const BookingSearchFilter: React.FC<BookingSearchFilterProps> = ({
  initialFilterType,
  initialSearchValue,
  onSearch,
  onClear,
}) => {
  const [filterType, setFilterType] = useState(initialFilterType);
  const [searchValue, setSearchValue] = useState(initialSearchValue);
  const [showFilterOptions, setShowFilterOptions] = useState(false);

  const filterOptions = [
    { value: "property", label: "Filter" },
    { value: "status-new", label: "Baru" },
    { value: "status-waiting_payment", label: "Sedang Diproses" },
    { value: "status-completed", label: "Selesai" },
    { value: "reservationId", label: "No. Reservasi" },
  ];

  const handleSubmit = () => {
    onSearch(filterType, searchValue);
  };

  return (
    <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
      <div className="relative flex-grow">
        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          placeholder="Cari berdasarkan tipe kamar..."
          className="w-full pl-10 pr-10 py-3 border rounded-md bg-gray-100 focus:bg-white focus:ring-2 focus:ring-rose-500 transition-all duration-300"
        />
        {searchValue && (
          <button
            onClick={() => {
              setSearchValue("");
              onClear();
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            <FaTimes />
          </button>
        )}
      </div>
      <div className="relative">
        <button
          onClick={() => setShowFilterOptions(!showFilterOptions)}
          className="flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white px-4 py-3 rounded-lg transition-all duration-300"
        >
          <FaFilter />
          <span>
            {filterOptions.find((opt) => opt.value === filterType)?.label ||
              "Filter"}
          </span>
        </button>
        <AnimatePresence>
          {showFilterOptions && (
            <motion.div
              className="absolute right-0 mt-2 bg-white shadow-xl rounded-xl p-4 min-w-[250px] z-30"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
            >
              <div className="flex flex-col gap-2">
                {filterOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      setFilterType(option.value);
                      setShowFilterOptions(false);
                    }}
                    className={`px-4 py-2 rounded-lg text-left hover:bg-gray-100 transition-colors ${
                      filterType === option.value
                        ? "bg-rose-100 text-rose-700 font-medium"
                        : ""
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <button
        onClick={handleSubmit}
        className="bg-rose-500 text-white px-4 py-3 rounded-lg transition-all duration-300"
      >
        Cari
      </button>
    </div>
  );
};

export default BookingSearchFilter;
