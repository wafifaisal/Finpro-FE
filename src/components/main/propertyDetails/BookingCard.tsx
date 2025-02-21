"use client";

import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
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

/**
 * Format harga singkat. Contoh: Rp1.400.000 → "1.4k"
 */
const formatShortCurrency = (price: number): string => {
  return `${(price / 1000000).toFixed(1)}k`;
};

/**
 * Mendapatkan harga termurah untuk suatu tanggal.
 * Jika tanggal berada dalam periode seasonal, gunakan harga seasonal;
 * jika tidak, gunakan harga reguler.
 */
const getCheapestPriceForDate = (date: Date, property: Property): number => {
  const prices = property.RoomTypes.map((rt) => {
    let price = rt.price;
    if (rt.seasonal_prices) {
      const sp = rt.seasonal_prices.find((sp) => {
        const start = new Date(sp.start_date);
        const end = new Date(sp.end_date);
        return date >= start && date <= end;
      });
      if (sp) {
        price = sp.price;
      }
    }
    return price;
  });
  return Math.min(...prices);
};

/**
 * Menentukan apakah suatu tanggal tidak tersedia.
 * Tanggal dianggap tidak tersedia jika semua tipe kamar (atau kamar yang dipilih)
 * memiliki data Unavailable yang mencakup tanggal tersebut.
 */
const isDateUnavailable = (
  date: Date,
  property: Property,
  selectedRooms: RoomSelection[]
): boolean => {
  const roomTypesToCheck =
    selectedRooms.length > 0
      ? property.RoomTypes.filter((rt) =>
          selectedRooms.find((s) => s.roomTypeId === rt.id)
        )
      : property.RoomTypes;

  return roomTypesToCheck.every((rt) => {
    if (rt.Unavailable && rt.Unavailable.length > 0) {
      return rt.Unavailable.some((range) => {
        const start = new Date(range.start_date);
        const end = new Date(range.end_date);
        return date >= start && date <= end;
      });
    }
    return false;
  });
};

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
  // Konversi string tanggal ke objek Date (format "YYYY-MM-DD")
  const checkInDate = checkIn ? new Date(checkIn) : null;
  const checkOutDate = checkOut ? new Date(checkOut) : null;
  const todayDate = new Date(today);

  return (
    <div className="relative z-30 md:col-span-1">
      <div className="md:sticky top-28 bg-white rounded-2xl border shadow-lg p-6">
        {/* Header Rating */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-rose-500" />
            <span className="text-sm font-medium">
              {overallRating ? overallRating.toFixed(1) : "0.0"}
            </span>
          </div>
        </div>
        {/* Kalender Range dan Input Tamu */}
        <div className="rounded-lg border overflow-hidden mb-4">
          {/* Kalender Range: Satu input untuk memilih tanggal check-in & check-out */}
          <div className="p-3 border-b">
            <div className="text-xs font-semibold text-gray-700">
              Tanggal Masuk & Keluar
            </div>
            <DatePicker
              selected={checkInDate}
              onChange={(dates: [Date | null, Date | null]) => {
                const [start, end] = dates;
                if (start) {
                  setCheckIn(start.toISOString().split("T")[0]);
                } else {
                  setCheckIn("");
                }
                // Jika end sama dengan start, maka jangan update checkOut (atau reset ke kosong)
                if (end) {
                  if (start && end.getTime() === start.getTime()) {
                    setCheckOut("");
                  } else {
                    setCheckOut(end.toISOString().split("T")[0]);
                  }
                } else {
                  setCheckOut("");
                }
              }}
              startDate={checkInDate}
              endDate={checkOutDate}
              selectsRange
              minDate={todayDate}
              renderDayContents={(day, date) => (
                <div className="flex flex-col items-center justify-center w-full h-full">
                  <span className="text-sm font-medium">{day}</span>
                  <span className="text-xs text-gray-400">
                    {formatShortCurrency(
                      getCheapestPriceForDate(date, property)
                    )}
                  </span>
                </div>
              )}
              filterDate={(date) =>
                !isDateUnavailable(date, property, selectedRooms)
              }
              dateFormat="yyyy-MM-dd"
              className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>
          {/* Input Jumlah Tamu */}
          <div className="p-3">
            <div className="text-xs font-semibold text-gray-700">Tamu</div>
            <input
              type="number"
              min="1"
              value={guests}
              onChange={(e) =>
                setGuests(Math.max(1, parseInt(e.target.value) || 1))
              }
              className="w-full p-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
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
              const bookingDate = checkInDate || new Date();
              const activeSeasonalPrice =
                roomType.seasonal_prices &&
                roomType.seasonal_prices.find((sp) => {
                  const start = new Date(sp.start_date);
                  const end = new Date(sp.end_date);
                  return bookingDate >= start && bookingDate <= end;
                });
              const effectivePrice = activeSeasonalPrice
                ? activeSeasonalPrice.price
                : roomType.price;
              return (
                <div key={roomType.id} className="flex justify-between">
                  <span className="underline">
                    {roomType.name} x {selection.quantity} ({totals.nights}{" "}
                    malam)
                  </span>
                  <span>
                    {formatCurrency(
                      effectivePrice * selection.quantity * totals.nights
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
