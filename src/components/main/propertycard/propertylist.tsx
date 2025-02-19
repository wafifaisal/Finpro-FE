"use client";

import { useState } from "react";
import { PropertyCardProps } from "@/types/types";
import { PropertyImageSlider } from "./PropertyImageSlider";
import { PropertyDetails } from "./PropertyDetails";

export default function PropertyCard({
  property,
  userLocation,
  loading = false,
  searchStart,
  searchEnd,
}: PropertyCardProps) {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const base_url = process.env.NEXT_PUBLIC_BASE_URL_BE;

  if (loading) {
    return (
      <div className="overflow-hidden transition-shadow duration-300 p-2 border rounded-lg">
        <div className="relative aspect-square w-full bg-gray-300 rounded"></div>
        <div className="py-2 px-2 space-y-2">
          <div className="h-4 bg-gray-300 rounded w-3/4"></div>
          <div className="h-4 bg-gray-300 rounded w-1/2"></div>
          <div className="h-4 bg-gray-300 rounded w-full"></div>
          <div className="h-4 bg-gray-300 rounded w-1/3"></div>
        </div>
      </div>
    );
  }

  const validRatings = property.RoomTypes.filter(
    (room) => room.avg_rating !== undefined && room.avg_rating !== null
  );
  const overallRating =
    validRatings.length > 0
      ? validRatings.reduce((sum, room) => sum + (room.avg_rating || 0), 0) /
        validRatings.length
      : 0;

  // Ambil tipe kamar pertama untuk tampilan harga
  const roomType = property.RoomTypes[0];
  const regularPrice = roomType?.price;

  const effectiveStart = searchStart ? searchStart : new Date();
  const effectiveEnd = searchEnd
    ? searchEnd
    : new Date(effectiveStart.getTime() + 24 * 60 * 60 * 1000);

  // Cek harga seasonal
  let activeSeasonalPrice = undefined;
  if (roomType?.seasonal_prices && roomType.seasonal_prices.length > 0) {
    activeSeasonalPrice = roomType.seasonal_prices.find((sp) => {
      const spStart = new Date(sp.start_date);
      const spEnd = new Date(sp.end_date);
      return effectiveStart >= spStart && effectiveEnd <= spEnd;
    });
  }
  const finalPrice = activeSeasonalPrice
    ? activeSeasonalPrice.price
    : regularPrice;
  const showDiscount = !!(
    activeSeasonalPrice &&
    regularPrice &&
    regularPrice > activeSeasonalPrice.price
  );

  // Cek ketersediaan kamar
  const isAnyRoomAvailable = property.RoomTypes.some((room) => {
    if (!room.Unavailable || room.Unavailable.length === 0) return true;
    const isRoomUnavailable = room.Unavailable.some((range) => {
      const rangeStart = new Date(range.start_date);
      const rangeEnd = new Date(range.end_date);
      return effectiveStart <= rangeEnd && effectiveEnd >= rangeStart;
    });
    return !isRoomUnavailable;
  });
  const disableButton = property.isAvailable === false || !isAnyRoomAvailable;

  const handlePropertyClick = async () => {
    try {
      await fetch(`${base_url}/property/click?id=${property.id}`, {
        method: "POST",
      });
    } catch (error) {
      console.error("Error incrementing click rate:", error);
    }
  };

  return (
    <div
      className="overflow-hidden transition-shadow duration-300"
      onMouseEnter={() => setHoveredCard(property.id)}
      onMouseLeave={() => setHoveredCard(null)}
    >
      <PropertyImageSlider
        property={property}
        hoveredCard={hoveredCard}
        disableButton={disableButton}
        handlePropertyClick={handlePropertyClick}
      />
      <PropertyDetails
        property={property}
        userLocation={userLocation}
        overallRating={overallRating}
        finalPrice={finalPrice}
        showDiscount={showDiscount}
        regularPrice={regularPrice}
        handlePropertyClick={handlePropertyClick}
      />
    </div>
  );
}
