"use client";

import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  formatShortCurrency,
  getCheapestPriceForDate,
  isDateUnavailable,
} from "@/helpers/bookingHelpers";
import { Property, RoomSelection } from "@/types/types";

interface BookingDateAndGuestProps {
  checkInDate: Date | null;
  checkOutDate: Date | null;
  todayDate: Date;
  setCheckIn: (value: string) => void;
  setCheckOut: (value: string) => void;
  property: Property;
  selectedRooms: RoomSelection[];
  guests: number;
  setGuests: (value: number) => void;
  getTotalCapacity: () => number;
}

const BookingDateAndGuest: React.FC<BookingDateAndGuestProps> = ({
  checkInDate,
  checkOutDate,
  todayDate,
  setCheckIn,
  setCheckOut,
  property,
  selectedRooms,
  guests,
  setGuests,
  getTotalCapacity,
}) => {
  return (
    <div className="rounded-lg border overflow-hidden mb-4">
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
                {formatShortCurrency(getCheapestPriceForDate(date, property))}
              </span>
            </div>
          )}
          filterDate={(date) =>
            !isDateUnavailable(date, property, selectedRooms)
          }
          dateFormat="d MMM"
          className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
        />
      </div>
      <div className="p-3">
        <div className="text-xs font-semibold text-gray-700">Tamu</div>
        <input
          type="number"
          min="0"
          value={guests === 0 ? "" : guests}
          placeholder="use client"
          onChange={(e) => {
            const parsed = parseInt(e.target.value);
            setGuests(isNaN(parsed) ? 0 : parsed);
          }}
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
  );
};

export default BookingDateAndGuest;
