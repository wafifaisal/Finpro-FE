"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { FaLocationDot, FaStar } from "react-icons/fa6";
import { Loader2 } from "lucide-react";
import { formatCurrency } from "@/helpers/formatCurrency";
import { calculateDistance, formatDistance } from "@/helpers/distanceHelpers";
import { PropertyCardProps } from "@/types/types";

interface PropertyDetailsProps {
  property: PropertyCardProps["property"];
  userLocation?: PropertyCardProps["userLocation"];
  overallRating: number;
  finalPrice: number;
  showDiscount: boolean;
  regularPrice: number;
  handlePropertyClick: () => void;
}

const PropertyDetailsComponent = ({
  property,
  userLocation,
  overallRating,
  finalPrice,
  showDiscount,
  regularPrice,
  handlePropertyClick,
}: PropertyDetailsProps) => {
  const [buttonLoading, setButtonLoading] = useState(false);

  const distanceText = useMemo(() => {
    if (userLocation) {
      const distanceValue = calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        property.location.latitude,
        property.location.longitude
      );
      return `${formatDistance(distanceValue)} dari lokasi Anda`;
    }
    return null;
  }, [userLocation, property.location.latitude, property.location.longitude]);

  const handleButtonClick = () => {
    setButtonLoading(true);
    handlePropertyClick();
  };

  return (
    <div className="py-2 px-2">
      <div className="flex justify-between">
        <h2 className="text-sm md:text-lg font-semibold text-gray-800 truncate">
          {property.name}
        </h2>
        <h2 className="flex gap-1 text-sm font-bold">
          <FaStar />
          {overallRating.toFixed(1)}
        </h2>
      </div>
      <div className="flex flex-col gap-1">
        <div className="flex gap-1">
          <FaLocationDot className="text-gray-500 text-sm" />
          <p className="text-sm text-gray-500 truncate">
            {property.category} di {property.location.address},{" "}
            {property.location.city}
          </p>
        </div>
        {userLocation && distanceText && (
          <p className="text-sm text-gray-500 pl-4">{distanceText}</p>
        )}
      </div>
      <div className="flex items-center space-x-1 truncate">
        {showDiscount ? (
          <>
            <h1 className="text-sm md:text-lg font-bold text-gray-800 line-through">
              {formatCurrency(regularPrice)}
            </h1>
            <h1 className="text-sm md:text-lg font-bold text-red-500">
              {formatCurrency(finalPrice)}
            </h1>
          </>
        ) : (
          <h1 className="text-sm md:text-lg font-bold text-gray-800">
            {formatCurrency(finalPrice)}
          </h1>
        )}
        <span className="text-sm text-gray-500">/ malam</span>
      </div>
      <div className="mt-2 flex flex-wrap items-center justify-center">
        <Link href={`/property/${property.id}`} onClick={handleButtonClick}>
          <button className="border text-white hover:text-black duration-300 relative group cursor-pointer overflow-hidden h-10 w-44 rounded-md bg-red-500 p-2 font-extrabold hover:bg-sky-700">
            <div className="absolute group-hover:-top-1 group-hover:-right-2 z-10 w-16 h-16 rounded-full group-hover:scale-150 duration-700 right-12 top-12 bg-[#EB5A3C]"></div>
            <div className="absolute group-hover:-top-1 group-hover:-right-2 z-10 w-12 h-12 rounded-full group-hover:scale-150 duration-700 right-20 -top-6 bg-[#DF9755]"></div>
            <div className="absolute group-hover:-top-1 group-hover:-right-2 z-10 w-8 h-8 rounded-full group-hover:scale-150 duration-700 right-32 top-6 bg-[#E7D283]"></div>
            <div className="absolute group-hover:-top-1 group-hover:-right-2 z-10 w-4 h-4 rounded-full group-hover:scale-150 duration-700 right-2 top-12 bg-[#EDF4C2]"></div>
            <p className="z-10 absolute bottom-2 left-0 text-sm truncate w-full">
              {buttonLoading ? (
                <Loader2 className="animate-spin mx-auto" />
              ) : (
                "Cek Ketersediaan"
              )}
            </p>
          </button>
        </Link>
      </div>
    </div>
  );
};

export const PropertyDetails = React.memo(PropertyDetailsComponent);
