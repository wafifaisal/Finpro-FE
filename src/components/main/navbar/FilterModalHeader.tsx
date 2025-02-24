import React from "react";

interface FilterModalHeaderProps {
  onClose: () => void;
}

const FilterModalHeader: React.FC<FilterModalHeaderProps> = ({ onClose }) => {
  return (
    <div className="px-6 py-4 border-b flex items-center justify-between">
      <button onClick={onClose} className="text-gray-600 hover:text-gray-900">
        ✕
      </button>
      <h2 className="text-lg font-semibold">Filter</h2>
      <div className="w-6" />
    </div>
  );
};

export default FilterModalHeader;
