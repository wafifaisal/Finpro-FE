// components/FilterModal.tsx
"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { fetchPriceRange } from "../../../helpers/property";
import FilterModalHeader from "./FilterModalHeader";
import FilterModalFooter from "./FilterModalFooter";
import PropertyNameFilter from "./PropertyNameFilter";
import PriceRangeFilter from "./PriceRangeFilter";
import RoomFacilitiesFilter from "./RoomFacilitiesFilter";
import PropertyFacilitiesFilter from "./PropertyFacilitiesFilter";
import SortOptionsFilter from "./SortOptionsFilter";

interface FilterModalProps {
  onClose: () => void;
  onApply?: (data: {
    totalPages: number;
    currentPage: number;
    limit: number;
    result: unknown[];
    minPrice?: number;
    maxPrice?: number;
  }) => void;
  initialFilters?: {
    minPrice?: number;
    maxPrice?: number;
    roomFacilities?: string[];
    propertyFacilities?: string[];
    propertyName?: string;
  };
}

const FilterModal: React.FC<FilterModalProps> = ({
  onClose,
  initialFilters,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialPropertyName = searchParams.get("propertyName") || "";
  const [propertyName, setPropertyName] = useState<string>(initialPropertyName);

  const [sliderValue, setSliderValue] = useState<[number, number]>([0, 0]);
  const [inputMin, setInputMin] = useState<string>("");
  const [inputMax, setInputMax] = useState<string>("");

  const [dbPriceRange, setDbPriceRange] = useState<{
    min: number;
    max: number;
  }>({ min: 0, max: 1000 });
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRoomFacilities, setSelectedRoomFacilities] = useState<
    string[]
  >(initialFilters?.roomFacilities || []);
  const [selectedPropertyFacilities, setSelectedPropertyFacilities] = useState<
    string[]
  >(initialFilters?.propertyFacilities || []);
  const [sortOption, setSortOption] = useState<string>("name-asc");

  // Muat rentang harga dari backend
  useEffect(() => {
    const loadPriceRange = async () => {
      try {
        const data = await fetchPriceRange();
        setDbPriceRange({ min: data.minPrice, max: data.maxPrice });
        const defaultMin =
          initialFilters?.minPrice !== undefined
            ? initialFilters.minPrice
            : data.minPrice;
        const defaultMax =
          initialFilters?.maxPrice !== undefined
            ? initialFilters.maxPrice
            : data.maxPrice;
        setSliderValue([defaultMin, defaultMax]);
        setInputMin(String(defaultMin));
        setInputMax(String(defaultMax));
      } catch (error) {
        console.error("Gagal memuat rentang harga:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadPriceRange();
  }, [initialFilters]);

  const handleSliderChange = (newValue: [number, number]) => {
    setSliderValue(newValue);
    setInputMin(newValue[0].toString());
    setInputMax(newValue[1].toString());
  };

  const handleApply = () => {
    const queryParams = new URLSearchParams(searchParams.toString());

    if (propertyName.trim() !== "") {
      queryParams.set("propertyName", propertyName.trim());
    } else {
      queryParams.delete("propertyName");
    }
    if (inputMin !== "") {
      queryParams.set("minPrice", inputMin);
    } else {
      queryParams.delete("minPrice");
    }
    if (inputMax !== "") {
      queryParams.set("maxPrice", inputMax);
    } else {
      queryParams.delete("maxPrice");
    }
    if (selectedRoomFacilities.length > 0) {
      queryParams.set("roomFacilities", selectedRoomFacilities.join(","));
    } else {
      queryParams.delete("roomFacilities");
    }
    if (selectedPropertyFacilities.length > 0) {
      queryParams.set(
        "propertyFacilities",
        selectedPropertyFacilities.join(",")
      );
    } else {
      queryParams.delete("propertyFacilities");
    }
    queryParams.set("limit", "8");
    queryParams.set("page", "1");

    const [sortBy, sortOrder] = sortOption.split("-");
    queryParams.set("sortBy", sortBy);
    queryParams.set("sortOrder", sortOrder);

    router.push(`/property/search-result?${queryParams.toString()}`);
    onClose();
  };

  const handleClear = () => {
    setSliderValue([dbPriceRange.min, dbPriceRange.max]);
    setInputMin("");
    setInputMax("");
    setSelectedRoomFacilities([]);
    setSelectedPropertyFacilities([]);
    setSortOption("name-asc");
    setPropertyName("");
  };

  if (isLoading) {
    return (
      <div className="absolute inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 h-screen -top-[87px]">
        <div className="bg-white rounded-xl p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 h-screen -top-[87px]">
      <div className="bg-white rounded-xl shadow-xl w-11/12 max-w-2xl max-h-[60vh] overflow-hidden">
        <FilterModalHeader onClose={onClose} />
        <div className="overflow-y-auto px-6 py-4 max-h-[calc(50vh-120px)]">
          <PropertyNameFilter
            propertyName={propertyName}
            setPropertyName={setPropertyName}
          />
          <PriceRangeFilter
            dbPriceRange={dbPriceRange}
            sliderValue={sliderValue}
            onSliderChange={handleSliderChange}
          />
          <RoomFacilitiesFilter
            selectedRoomFacilities={selectedRoomFacilities}
            setSelectedRoomFacilities={setSelectedRoomFacilities}
          />
          <PropertyFacilitiesFilter
            selectedPropertyFacilities={selectedPropertyFacilities}
            setSelectedPropertyFacilities={setSelectedPropertyFacilities}
          />
          <SortOptionsFilter
            sortOption={sortOption}
            setSortOption={setSortOption}
          />
        </div>
        <FilterModalFooter onClear={handleClear} onApply={handleApply} />
      </div>
    </div>
  );
};

export default FilterModal;
