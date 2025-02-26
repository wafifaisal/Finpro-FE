"use client";

import React from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  if (totalPages <= 1) return null;

  return (
    <div className="mt-8 flex justify-center">
      <div className="flex items-center bg-white rounded-full shadow-md overflow-hidden">
        <button
          onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 text-rose-600 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          ← Prev
        </button>
        <div className="flex px-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter(
              (page) =>
                page === 1 ||
                page === totalPages ||
                (page >= currentPage - 1 && page <= currentPage + 1)
            )
            .map((page, index, array) => (
              <React.Fragment key={page}>
                {index > 0 && array[index - 1] !== page - 1 && (
                  <span className="px-2 py-2 text-gray-400">...</span>
                )}
                <button
                  onClick={() => onPageChange(page)}
                  className={`w-10 h-10 flex items-center justify-center rounded-full mx-1 transition-colors ${
                    currentPage === page
                      ? "bg-rose-600 text-white font-medium"
                      : "text-gray-700 hover:bg-rose-50"
                  }`}
                >
                  {page}
                </button>
              </React.Fragment>
            ))}
        </div>
        <button
          onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-4 py-2 text-rose-600 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          Next →
        </button>
      </div>
    </div>
  );
};

export default Pagination;
