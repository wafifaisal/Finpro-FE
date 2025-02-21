// components/main/propertyDetails/BookingCard.tsx
"use client";

import React from "react";
import { Star } from "lucide-react";
import { Property, RoomSelection, Totals } from "@/types/types";
import { formatCurrency } from "@/helpers/formatCurrency";
import { createBooking } from "@/libs/booking";
import { ICreateBooking } from "@/types/booking";

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
  totals: Totals | null;
}

const BookingCard: React.FC<BookingCardProps> = ({
  property,
  checkIn,
  setCheckIn,
  checkOut,
  setCheckOut,
  today,
  getTomorrow,
  guests,
  setGuests,
  getTotalCapacity,
  selectedRooms,
  totals,
}) => {
  // Hitung rata-rata rating dari seluruh RoomTypes
  const validRatings = property.RoomTypes.filter(
    (rt) => rt.avg_rating !== undefined && rt.avg_rating !== null
  );
  const overallRating =
    validRatings.length > 0
      ? validRatings.reduce((sum, rt) => sum + (rt.avg_rating || 0), 0) /
        validRatings.length
      : 0;

  const handleBooking = async () => {
    try {
      const bookingData: ICreateBooking = {
        userId: "608cde42-46ab-4436-973d-616efdb0339c",
        roomTypeId: selectedRooms[0]?.roomTypeId,
        numOfGuests: guests,
        startDate: checkIn,
        endDate: checkOut,
        payment_method: "Manual",
      };

      const newBooking = await createBooking(bookingData);
      console.log("Booking successful:", newBooking);
      alert("Booking successful!");
    } catch (error) {
      console.error("Booking failed:", error);
      alert("Booking failed. Please try again.");
    }
  };

  return (
    <div className="relative md:col-span-1">
      <div className="md:sticky top-28 bg-white rounded-2xl border shadow-lg p-6">
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-rose-500" />
            <span className="ml-1 font-medium">
              {overallRating ? overallRating.toFixed(1) : "0.0"}
            </span>
          </div>
        </div>
        <div className="rounded-xl border overflow-hidden mb-4">
          <div className="grid grid-cols-2">
            <div className="p-3 border-r border-b">
              <div className="text-xs font-medium">Masuk</div>
              <input
                type="date"
                value={checkIn}
                min={today}
                onChange={(e) => setCheckIn(e.target.value)}
                className="w-full outline-none text-sm mt-1"
              />
            </div>
            <div className="p-3 border-b">
              <div className="text-xs font-medium">Keluar</div>
              <input
                type="date"
                value={checkOut}
                min={checkIn ? getTomorrow(checkIn) : today}
                onChange={(e) => setCheckOut(e.target.value)}
                className="w-full outline-none text-sm mt-1"
              />
            </div>
          </div>
          <div className="p-3">
            <div className="text-xs font-medium">Tamu</div>
            <input
              type="number"
              min="1"
              value={guests}
              onChange={(e) => setGuests(Math.max(1, parseInt(e.target.value)))}
              className="w-full outline-none text-sm mt-1"
            />
            {getTotalCapacity() < guests && (
              <p className="text-rose-500 text-xs mt-2">
                Kamar yang dipilih tidak dapat menampung {guests} tamu. Silakan
                tambah kamar.
              </p>
            )}
          </div>
        </div>
        <button
          onClick={handleBooking}
          className="w-full bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white py-3 rounded-lg font-medium mt-4 transition"
          disabled={getTotalCapacity() < guests}
        >
          Pesan Sekarang
        </button>
        {totals && (
          <div className="mt-6 space-y-3 text-sm">
            {selectedRooms.map((selection) => {
              const roomType = property.RoomTypes.find(
                (rt) => rt.id === selection.roomTypeId
              );
              if (!roomType) return null;
              return (
                <div key={roomType.id} className="flex justify-between">
                  <span className="underline">
                    {roomType.name} x {selection.quantity} ({totals.nights}{" "}
                    malam)
                  </span>
                  <span>
                    {formatCurrency(
                      roomType.price * selection.quantity * totals.nights
                    )}
                  </span>
                </div>
              );
            })}
            {totals.breakfastCost > 0 && (
              <div className="flex justify-between">
                <span className="underline">Biaya Sarapan</span>
                <span>{formatCurrency(totals.breakfastCost)}</span>
              </div>
            )}
            <div className="pt-3 border-t flex justify-between font-medium">
              <span>Total</span>
              <span>{formatCurrency(totals.total)}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingCard;
