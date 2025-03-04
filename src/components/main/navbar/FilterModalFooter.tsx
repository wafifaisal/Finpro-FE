import React from "react";

interface FilterModalFooterProps {
  onClear: () => void;
  onApply: () => void;
}

const FilterModalFooter: React.FC<FilterModalFooterProps> = ({
  onClear,
  onApply,
}) => {
  return (
    <div className="px-6 py-4 border-t flex items-center justify-between bg-white">
      <button
        onClick={onClear}
        className="text-sm font-semibold underline hover:text-gray-700"
      >
        Bersihkan Semua
      </button>
      <button
        onClick={onApply}
        className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
      >
        Tampilkan Hasil
      </button>
    </div>
  );
};

export default FilterModalFooter;
