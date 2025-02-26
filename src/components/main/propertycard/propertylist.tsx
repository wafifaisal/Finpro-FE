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

  // Calculate overall rating based on RoomTypes that have ratings.
  const validRatings = property.RoomTypes.filter(
    (room) => room.avg_rating !== undefined && room.avg_rating !== null
  );
  const overallRating =
    validRatings.length > 0
      ? validRatings.reduce((sum, room) => sum + (room.avg_rating || 0), 0) /
        validRatings.length
      : 0;

  // Set effective search dates.
  const effectiveStart = searchStart ? searchStart : new Date();
  const effectiveEnd = searchEnd
    ? searchEnd
    : new Date(effectiveStart.getTime() + 24 * 60 * 60 * 1000);

  // Determine the lowest regular price across room types.
  const lowestRegularPrice = Math.min(
    ...property.RoomTypes.map((room) => room.price)
  );

  // Calculate the lowest effective price considering seasonal pricing.
  const lowestEffectivePrice = property.RoomTypes.reduce((min, room) => {
    let effectiveRoomPrice = room.price;
    if (room.seasonal_prices && room.seasonal_prices.length > 0) {
      const applicableSeasonal = room.seasonal_prices.find((sp) => {
        if (sp.dates && sp.dates.length > 0) {
          const targetStr = effectiveStart.toISOString().split("T")[0];
          return sp.dates.some((d: string) => {
            const dStr = new Date(d).toISOString().split("T")[0];
            return dStr === targetStr;
          });
        } else if (sp.start_date && sp.end_date) {
          const spStart = new Date(sp.start_date);
          const spEnd = new Date(sp.end_date);
          return effectiveStart >= spStart && effectiveStart <= spEnd;
        }
        return false;
      });
      if (applicableSeasonal) {
        effectiveRoomPrice = applicableSeasonal.price;
      }
    }
    return Math.min(min, effectiveRoomPrice);
  }, Infinity);

  const finalPrice = lowestEffectivePrice;
  const showDiscount = lowestRegularPrice > lowestEffectivePrice;

  // Updated availability check: For each room type, determine if it's available
  // in the effective date range by checking both the Unavailable records and
  // (if available) the RoomAvailability records that report availableCount === 0.
  const isAnyRoomAvailable = property.RoomTypes.some((room) => {
    let roomUnavailable = false;
    // Check if this room type is marked unavailable in any Unavailable record.
    if (room.Unavailable && room.Unavailable.length > 0) {
      roomUnavailable = room.Unavailable.some((range) => {
        const rangeStart = new Date(range.start_date);
        const rangeEnd = new Date(range.end_date);
        return effectiveStart <= rangeEnd && effectiveEnd >= rangeStart;
      });
    }
    // If RoomAvailability exists and is an array, check if any date in the range has availableCount === 0.
    if (
      Array.isArray(room.RoomAvailability) &&
      room.RoomAvailability.length > 0
    ) {
      const roomHasZeroAvailability = room.RoomAvailability.some((ra) => {
        const raDate = new Date(ra.date);
        return (
          effectiveStart <= raDate &&
          raDate < effectiveEnd &&
          ra.availableCount === 0
        );
      });
      if (roomHasZeroAvailability) {
        roomUnavailable = true;
      }
    }
    return !roomUnavailable;
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
        regularPrice={lowestRegularPrice}
        handlePropertyClick={handlePropertyClick}
      />
    </div>
  );
}
