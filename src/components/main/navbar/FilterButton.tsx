"use client";
import React, { useState } from "react";
import FilterModal from "./FilterModal"; // Ensure the path is correct

// Define a type for the data received from the backend
interface FilterData {
  totalPages: number;
  currentPage: number;
  limit: number;
  result: unknown[];
}

const FilterButton: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleApplyFilters = (data: FilterData) => {
    console.log("Properties fetched:", data);
  };

  return (
    <>
      {/* Airbnb-style filter button */}
      <button
        onClick={handleOpenModal}
        className="flex items-center gap-2 px-4 py-2 border rounded-full shadow hover:bg-gray-100 transition"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-5 h-5 text-gray-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 4a1 1 0 011-1h4a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h4a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2zM3 16a1 1 0 011-1h4a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M13 6h8M13 12h8M13 18h8"
          />
        </svg>
        <span className="text-gray-700 font-medium">Filter</span>
      </button>

      {isModalOpen && (
        <FilterModal onClose={handleCloseModal} onApply={handleApplyFilters} />
      )}
    </>
  );
};

export default FilterButton;
