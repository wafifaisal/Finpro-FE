import React from "react";

interface SortOptionsFilterProps {
  sortOption: string;
  setSortOption: (option: string) => void;
}

const SortOptionsFilter: React.FC<SortOptionsFilterProps> = ({
  sortOption,
  setSortOption,
}) => {
  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-4">Opsi Penyortiran</h3>
      <div>
        <label className="block mb-1 text-sm font-medium">
          Urutkan Berdasarkan
        </label>
        <select
          className="border rounded p-2 w-full"
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
        >
          <option value="name-asc">Nama A-Z</option>
          <option value="name-desc">Nama Z-A</option>
          <option value="price-asc">Harga Terendah ke Tertinggi</option>
          <option value="price-desc">Harga Tertinggi ke Rendah</option>
        </select>
      </div>
    </div>
  );
};

export default SortOptionsFilter;
