"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { fetchPriceRange } from "../../../helpers/property";
import FilterModalHeader from "@/components/main/navbar/FilterModalHeader";
import PropertyNameFilter from "@/components/main/navbar/PropertyNameFilter";
import PriceRangeFilter from "@/components/main/navbar/PriceRangeFilter";
import RoomFacilitiesFilter from "@/components/main/navbar/RoomFacilitiesFilter";
import PropertyFacilitiesFilter from "@/components/main/navbar/PropertyFacilitiesFilter";
import SortOptionsFilter from "@/components/main/navbar/SortOptionsFilter";
import FilterModalFooter from "@/components/main/navbar/FilterModalFooter";

interface FilterModalMobileProps {
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

const FilterModalMobile: React.FC<FilterModalMobileProps> = ({
  onClose,
  initialFilters,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialPropertyName =
    searchParams.get("propertyName") || initialFilters?.propertyName || "";
  const [propertyName, setPropertyName] = useState<string>(initialPropertyName);
  const [sliderValue, setSliderValue] = useState<[number, number]>([0, 0]);
  const [inputMin, setInputMin] = useState<string>("");
  const [inputMax, setInputMax] = useState<string>("");
  const [dbPriceRange, setDbPriceRange] = useState<{
    min: number;
    max: number;
  }>({
    min: 0,
    max: 1000,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRoomFacilities, setSelectedRoomFacilities] = useState<
    string[]
  >(initialFilters?.roomFacilities || []);
  const [selectedPropertyFacilities, setSelectedPropertyFacilities] = useState<
    string[]
  >(initialFilters?.propertyFacilities || []);
  const [sortOption, setSortOption] = useState<string>("name-asc");

  useEffect(() => {
    const loadPriceRange = async () => {
      try {
        const data = await fetchPriceRange();
        setDbPriceRange({ min: data.minPrice, max: data.maxPrice });
        const minPriceQuery = searchParams.get("minPrice");
        const maxPriceQuery = searchParams.get("maxPrice");
        const defaultMin =
          minPriceQuery !== null
            ? parseInt(minPriceQuery, 10)
            : initialFilters?.minPrice ?? data.minPrice;
        const defaultMax =
          maxPriceQuery !== null
            ? parseInt(maxPriceQuery, 10)
            : initialFilters?.maxPrice ?? data.maxPrice;
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
  }, [initialFilters, searchParams]);

  useEffect(() => {
    const roomFacilitiesQuery = searchParams.get("roomFacilities");
    if (roomFacilitiesQuery) {
      setSelectedRoomFacilities(roomFacilitiesQuery.split(","));
    }
    const propertyFacilitiesQuery = searchParams.get("propertyFacilities");
    if (propertyFacilitiesQuery) {
      setSelectedPropertyFacilities(propertyFacilitiesQuery.split(","));
    }
    const sortBy = searchParams.get("sortBy");
    const sortOrder = searchParams.get("sortOrder");
    if (sortBy && sortOrder) {
      setSortOption(`${sortBy}-${sortOrder}`);
    }
  }, [searchParams]);

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
    const queryParams = new URLSearchParams(searchParams.toString());
    queryParams.delete("propertyName");
    queryParams.delete("minPrice");
    queryParams.delete("maxPrice");
    queryParams.delete("roomFacilities");
    queryParams.delete("propertyFacilities");
    queryParams.delete("sortBy");
    queryParams.delete("sortOrder");
    queryParams.set("page", "1");
    router.push(`/property/search-result?${queryParams.toString()}`);
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white rounded-xl p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black bg-opacity-50">
      <div className="bg-white w-full rounded-t-2xl shadow-xl max-h-[90vh] overflow-hidden">
        <FilterModalHeader onClose={onClose} />
        <div className="overflow-y-auto px-4 py-4 max-h-[calc(90vh-140px)]">
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

export default FilterModalMobile;
