import React from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  return (
    <div className="w-max mx-auto flex items-center justify-center gap-4 mt-8 shadow-md p-2 rounded-3xl bg-white">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="text-gray-500 hover:text-gray-800 hover:cursor-pointer px-4 py-2 rounded disabled:cursor-not-allowed disabled:opacity-50"
      >
        ← Previous
      </button>
      <span className="text-gray-600">
        Page {currentPage} of {totalPages}
      </span>
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="text-rose-500 hover:text-rose-800 hover:cursor-pointer px-4 py-2 rounded disabled:cursor-not-allowed disabled:opacity-50"
      >
        Next →
      </button>
    </div>
  );
}
