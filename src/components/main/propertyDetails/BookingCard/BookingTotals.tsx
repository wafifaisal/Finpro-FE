"use client";

import React from "react";
import { formatCurrency } from "@/helpers/formatCurrency";
import { Property, RoomSelection } from "@/types/types";

interface ComputedTotals {
  nights: number;
  roomCost: number;
  breakfastCost: number;
  total: number;
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
  if (!computedTotals) return null;

  return (
    <div className="mt-6 space-y-3 text-sm">
      {selectedRooms.map((selection) => {
        const roomType = property.RoomTypes.find(
          (rt) => rt.id === selection.roomTypeId
        );
        if (!roomType) return null;
        const bookingDate = checkInDate || new Date();
        const activeSeasonalPrice =
          roomType.seasonal_prices &&
          roomType.seasonal_prices.find((sp) => {
            if (sp.dates && sp.dates.length > 0) {
              const target = bookingDate.toISOString().split("T")[0];
              return sp.dates.some((d: string) => {
                const dStr = new Date(d).toISOString().split("T")[0];
                return dStr === target;
              });
            } else if (sp.start_date && sp.end_date) {
              const start = new Date(sp.start_date);
              const end = new Date(sp.end_date);
              return bookingDate >= start && bookingDate <= end;
            }
            return false;
          });
        const effectivePrice = activeSeasonalPrice
          ? activeSeasonalPrice.price
          : roomType.price;
        return (
          <div key={roomType.id} className="flex justify-between">
            <span className="underline">
              {roomType.name} x {selection.quantity} ({computedTotals.nights}{" "}
              malam)
            </span>
            <span>
              {formatCurrency(
                effectivePrice * selection.quantity * computedTotals.nights
              )}
            </span>
          </div>
        );
      })}
      {computedTotals.breakfastCost > 0 && (
        <div className="flex justify-between">
          <span className="underline">Biaya Sarapan</span>
          <span>{formatCurrency(computedTotals.breakfastCost)}</span>
        </div>
      )}
      <div className="pt-3 border-t flex justify-between font-medium">
        <span>Total</span>
        <span>{formatCurrency(computedTotals.total)}</span>
      </div>
    </div>
  );
};

export default BookingTotals;
