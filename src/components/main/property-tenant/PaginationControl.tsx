// components/PaginationControls.tsx
import React from "react";

interface PaginationControlsProps {
  page: number;
  totalPages: number;
  onPageChange: (newPage: number) => void;
}

const PaginationControls: React.FC<PaginationControlsProps> = ({
  page,
  totalPages,
  onPageChange,
}) => {
  return (
    <div className="mt-4 flex justify-center items-center space-x-2">
      <button
        onClick={() => page > 1 && onPageChange(page - 1)}
        disabled={page === 1}
        className={`px-2 py-1 rounded ${
          page === 1
            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
            : "bg-rose-500 text-white hover:bg-rose-600"
        } transition-colors duration-300 text-xs`}
      >
        Sebelumnya
      </button>
      <span className="text-gray-700 text-xs">
        Halaman {page} dari {totalPages}
      </span>
      <button
        onClick={() => page < totalPages && onPageChange(page + 1)}
        disabled={page === totalPages}
        className={`px-2 py-1 rounded ${
          page === totalPages
            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
            : "bg-rose-500 text-white hover:bg-rose-600"
        } transition-colors duration-300 text-xs`}
      >
        Berikutnya
      </button>
    </div>
  );
};

export default PaginationControls;
