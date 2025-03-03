"use client";

import { useState, useMemo, useCallback } from "react";
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
  const overallRating = property.overallRating ?? 0;
  const { effectiveStart, effectiveEnd } = useMemo(() => {
    const start = searchStart ? new Date(searchStart) : new Date();
    const end = searchEnd
      ? new Date(searchEnd)
      : new Date(start.getTime() + 24 * 60 * 60 * 1000);
    return { effectiveStart: start, effectiveEnd: end };
  }, [searchStart, searchEnd]);
  const lowestRegularPrice = useMemo(
    () => Math.min(...property.RoomTypes.map((room) => room.price)),
    [property.RoomTypes]
  );
  const lowestEffectivePrice = useMemo(() => {
    return property.RoomTypes.reduce((min, room) => {
      let effectiveRoomPrice = room.price;

      if (room.seasonal_prices?.length) {
        const applicableSeasonal = room.seasonal_prices.find((sp) => {
          if (sp.dates?.length) {
            const targetStr = effectiveStart.toISOString().split("T")[0];
            return sp.dates.some((d: string) => {
              return new Date(d).toISOString().split("T")[0] === targetStr;
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
  }, [property.RoomTypes, effectiveStart]);

  const finalPrice = lowestEffectivePrice;
  const showDiscount = lowestRegularPrice > lowestEffectivePrice;
  const isAnyRoomAvailable = useMemo(() => {
    return property.RoomTypes.some((room) => {
      let roomUnavailable = room.Unavailable?.some((range) => {
        const rangeStart = new Date(range.start_date);
        const rangeEnd = new Date(range.end_date);
        return effectiveStart <= rangeEnd && effectiveEnd >= rangeStart;
      });

      if (!roomUnavailable && Array.isArray(room.RoomAvailability)) {
        roomUnavailable = room.RoomAvailability.some((ra) => {
          const raDate = new Date(ra.date);
          return (
            effectiveStart <= raDate &&
            raDate < effectiveEnd &&
            ra.availableCount === 0
          );
        });
      }

      return !roomUnavailable;
    });
  }, [property.RoomTypes, effectiveStart, effectiveEnd]);

  const disableButton = !property.isAvailable || !isAnyRoomAvailable;
  const handlePropertyClick = useCallback(async () => {
    try {
      await fetch(`${base_url}/property/click?id=${property.id}`, {
        method: "POST",
      });
    } catch (error) {
      console.error("Error incrementing click rate:", error);
    }
  }, [base_url, property.id]);

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
