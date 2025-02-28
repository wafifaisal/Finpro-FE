"use client";
import React from "react";
import { formatCurrency } from "@/helpers/formatCurrency";
import { Property, RoomSelection } from "@/types/types";

interface ComputedTotals {
  nights: number;
}

interface BookingTotalsProps {
  computedTotals: ComputedTotals | null;
  property: Property;
  selectedRooms: RoomSelection[];
  checkInDate: Date | null;
}

const BookingTotals: React.FC<BookingTotalsProps> = ({
  computedTotals,
  property,
  selectedRooms,
  checkInDate,
}) => {
  if (!computedTotals || !checkInDate) return null;

  const nights = computedTotals.nights;
  const calculateRoomCostWithBreakdown = (
    roomType: Property["RoomTypes"][number],
    quantity: number,
    checkIn: Date,
    nights: number
  ): {
    seasonalCost: number;
    regularCost: number;
    seasonalNights: number;
    regularNights: number;
  } => {
    let seasonalCost = 0;
    let regularCost = 0;
    let seasonalNights = 0;
    let regularNights = 0;
    for (let i = 0; i < nights; i++) {
      const currentDate = new Date(checkIn);
      currentDate.setDate(currentDate.getDate() + i);
      let priceForNight = roomType.price;
      let isSeasonal = false;
      if (roomType.seasonal_prices && roomType.seasonal_prices.length > 0) {
        const seasonal = roomType.seasonal_prices.find((sp) => {
          if (sp.dates && sp.dates.length > 0) {
            const target = currentDate.toISOString().split("T")[0];
            return sp.dates.some((d: string) => {
              const dStr = new Date(d).toISOString().split("T")[0];
              return dStr === target;
            });
          } else if (sp.start_date && sp.end_date) {
            const start = new Date(sp.start_date);
            const end = new Date(sp.end_date);
            return currentDate >= start && currentDate <= end;
          }
          return false;
        });
        if (seasonal) {
          priceForNight = Number(seasonal.price);
          isSeasonal = true;
        }
      }
      if (isSeasonal) {
        seasonalNights++;
        seasonalCost += priceForNight * quantity;
      } else {
        regularNights++;
        regularCost += priceForNight * quantity;
      }
    }
    return { seasonalCost, regularCost, seasonalNights, regularNights };
  };

  const calculateBreakfastCost = (
    roomType: Property["RoomTypes"][number],
    quantity: number,
    nights: number
  ): number => {
    return roomType.breakfast_price * quantity * nights;
  };

  let overallSeasonalCost = 0;
  let overallRegularCost = 0;
  let overallBreakfastCost = 0;

  const items = selectedRooms.map((selection) => {
    const roomType = property.RoomTypes.find(
      (rt) => rt.id === selection.roomTypeId
    );
    if (!roomType) return null;
    const breakdown = calculateRoomCostWithBreakdown(
      roomType,
      selection.quantity,
      checkInDate,
      nights
    );
    const seasonalCost = breakdown.seasonalCost;
    const regularCost = breakdown.regularCost;
    const breakfastCost =
      roomType.has_breakfast && selection.addBreakfast
        ? calculateBreakfastCost(roomType, selection.quantity, nights)
        : 0;
    overallSeasonalCost += seasonalCost;
    overallRegularCost += regularCost;
    overallBreakfastCost += breakfastCost;

    return (
      <div key={roomType.id} className="space-y-1">
        <div className="font-semibold">
          {roomType.name} x {selection.quantity}
        </div>
        {breakdown.seasonalNights > 0 && (
          <div className="flex justify-between ml-4">
            <span>Harga Musiman ({breakdown.seasonalNights} malam)</span>
            <span>{formatCurrency(seasonalCost)}</span>
          </div>
        )}
        {breakdown.regularNights > 0 && (
          <div className="flex justify-between ml-4">
            <span>Harga Reguler ({breakdown.regularNights} malam)</span>
            <span>{formatCurrency(regularCost)}</span>
          </div>
        )}
        {roomType.has_breakfast && selection.addBreakfast && (
          <div className="flex justify-between ml-4">
            <span className="underline">Biaya Sarapan</span>
            <span>{formatCurrency(breakfastCost)}</span>
          </div>
        )}
      </div>
    );
  });

  const computedTotal =
    overallSeasonalCost + overallRegularCost + overallBreakfastCost;

  return (
    <div className="mt-6 space-y-3 text-sm">
      {items}
      {overallBreakfastCost > 0 && (
        <div className="flex justify-between">
          <span className="underline">Total Biaya Sarapan</span>
          <span>{formatCurrency(overallBreakfastCost)}</span>
        </div>
      )}
      <div className="pt-3 border-t flex justify-between font-medium">
        <span>Total</span>
        <span>{formatCurrency(computedTotal)}</span>
      </div>
    </div>
  );
};

export default BookingTotals;
