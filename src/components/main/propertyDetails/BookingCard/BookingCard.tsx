"use client";

import React, { useMemo } from "react";
import { Property, RoomSelection } from "@/types/types";
import BookingHeader from "./BookingHeader";
import BookingDateAndGuest from "./BookingDateandGuest";
import BookingTotals from "./BookingTotals";

interface BookingCardProps {
  property: Property;
  checkIn: string;
  setCheckIn: (value: string) => void;
  checkOut: string;
  setCheckOut: (value: string) => void;
  today: string;
  getTomorrow: (dateString: string) => string;
  guests: number;
  setGuests: (value: number) => void;
  getTotalCapacity: () => number;
  selectedRooms: RoomSelection[];
}

const BookingCard: React.FC<BookingCardProps> = ({
  property,
  checkIn,
  setCheckIn,
  checkOut,
  setCheckOut,
  today,
  guests,
  setGuests,
  getTotalCapacity,
  selectedRooms,
}) => {
  const validRatings = property.RoomTypes.filter(
    (rt) => rt.avg_rating !== undefined && rt.avg_rating !== null
  );
  const overallRating =
    validRatings.length > 0
      ? validRatings.reduce((sum, rt) => sum + (rt.avg_rating || 0), 0) /
        validRatings.length
      : 0;

  // Bungkus inisialisasi tanggal dengan useMemo agar tidak berubah setiap render
  const checkInDate = useMemo(
    () => (checkIn ? new Date(checkIn) : null),
    [checkIn]
  );
  const checkOutDate = useMemo(
    () => (checkOut ? new Date(checkOut) : null),
    [checkOut]
  );
  const todayDate = new Date(today);

  const nights =
    checkInDate && checkOutDate
      ? Math.ceil(
          (checkOutDate.getTime() - checkInDate.getTime()) /
            (1000 * 60 * 60 * 24)
        )
      : 0;

  const computedTotals = useMemo(() => {
    if (!checkInDate || !checkOutDate || nights === 0) return null;
    let roomCost = 0;
    let breakfastCost = 0;

    selectedRooms.forEach((selection) => {
      const roomType = property.RoomTypes.find(
        (rt) => rt.id === selection.roomTypeId
      );
      if (!roomType) return;
      const bookingDate = checkInDate;
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
      roomCost += effectivePrice * selection.quantity * nights;
      if (selection.addBreakfast) {
        breakfastCost += roomType.breakfast_price * selection.quantity * nights;
      }
    });
    return {
      nights,
      roomCost,
      breakfastCost,
      total: roomCost + breakfastCost,
    };
  }, [checkInDate, checkOutDate, nights, selectedRooms, property.RoomTypes]);

  return (
    <div className="relative z-30 md:col-span-1">
      <div className="md:sticky top-28 bg-white rounded-2xl border shadow-lg p-6">
        <BookingHeader overallRating={overallRating} />
        <BookingDateAndGuest
          checkInDate={checkInDate}
          checkOutDate={checkOutDate}
          todayDate={todayDate}
          setCheckIn={setCheckIn}
          setCheckOut={setCheckOut}
          property={property}
          selectedRooms={selectedRooms}
          guests={guests}
          setGuests={setGuests}
          getTotalCapacity={getTotalCapacity}
        />
        <button
          className="w-full bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white py-3 rounded-lg font-medium mt-4 transition"
          disabled={getTotalCapacity() < guests}
        >
          Pesan Sekarang
        </button>
        <BookingTotals
          computedTotals={computedTotals}
          property={property}
          selectedRooms={selectedRooms}
          checkInDate={checkInDate}
        />
      </div>
    </div>
  );
};

export default BookingCard;
