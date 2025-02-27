// components/PriceRangeFilter.tsx
import React from "react";
import PriceRangeSlider from "./priceRangeSlider";

interface PriceRangeFilterProps {
  dbPriceRange: { min: number; max: number };
  sliderValue: [number, number];
  onSliderChange: (newValue: [number, number]) => void;
}

const PriceRangeFilter: React.FC<PriceRangeFilterProps> = ({
  dbPriceRange,
  sliderValue,
  onSliderChange,
}) => {
  return (
    <div className="mb-6 mx-10">
      <h3 className="text-lg font-semibold mb-10">Rentang Harga</h3>
      <PriceRangeSlider
        min={dbPriceRange.min}
        max={dbPriceRange.max}
        value={sliderValue}
        onChange={onSliderChange}
      />
    </div>
  );
};

export default PriceRangeFilter;
