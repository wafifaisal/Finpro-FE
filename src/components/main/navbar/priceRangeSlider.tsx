"use client";
import React from "react";
import { formatCurrency } from "../../../helpers/formatCurrency";

interface PriceRangeSliderProps {
  min: number;
  max: number;
  value: [number, number];
  onChange: (value: [number, number]) => void;
}

const PriceRangeSlider: React.FC<PriceRangeSliderProps> = ({
  min,
  max,
  value,
  onChange,
}) => {
  const getPercentage = (val: number) => ((val - min) / (max - min)) * 100;

  const handleSliderChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    index: 0 | 1
  ) => {
    const newValue = Number(event.target.value);
    const newRange = [...value] as [number, number];
    newRange[index] = newValue;
    if (index === 0 && newValue <= value[1]) {
      onChange([newValue, value[1]]);
    } else if (index === 1 && newValue >= value[0]) {
      onChange([value[0], newValue]);
    }
  };

  return (
    <div className="relative pt-10 pb-8">
      <div className="relative h-2 bg-gray-300 rounded">
        <div
          className="absolute h-full bg-[#FF5A5F] rounded"
          style={{
            left: `${getPercentage(value[0])}%`,
            right: `${100 - getPercentage(value[1])}%`,
          }}
        />
      </div>

      <div
        className="absolute"
        style={{
          left: `${getPercentage(value[0])}%`,
          transform: "translateX(-50%)",
          bottom: "calc(100% + 10px)",
        }}
      >
        <span className="bg-white text-xs px-2 py-1 rounded shadow">
          {formatCurrency(value[0])}
        </span>
      </div>

      <div
        className="absolute"
        style={{
          left: `${getPercentage(value[1])}%`,
          transform: "translateX(-50%)",
          bottom: "calc(100% + 10px)",
        }}
      >
        <span className="bg-white text-xs px-2 py-1 rounded shadow">
          {formatCurrency(value[1])}
        </span>
      </div>

      <input
        type="range"
        min={min}
        max={max}
        value={value[0]}
        onChange={(e) => handleSliderChange(e, 0)}
        className="absolute w-full h-2 -top-1 z-50 cursor-pointer appearance-none bg-transparent"
      />
      <input
        type="range"
        min={min}
        max={max}
        value={value[1]}
        onChange={(e) => handleSliderChange(e, 1)}
        className="absolute w-full h-2 -top-1 z-50 cursor-pointer appearance-none bg-transparent"
      />
    </div>
  );
};

export default PriceRangeSlider;
