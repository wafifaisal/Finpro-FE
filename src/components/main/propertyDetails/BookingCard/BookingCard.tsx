"use client";

import React from "react";
import BookingHeader from "./BookingHeader";
import BookingDateAndGuest from "./BookingDateandGuest";
import BookingTotals from "./BookingTotals";
import { BookingCardProps } from "./interfaceBookingCard";
import { useBookingCardLogic } from "./useBookingCardLogic";

const BookingCard: React.FC<BookingCardProps> = (props) => {
  const {
    property,
    setCheckIn,
    setCheckOut,
    guests,
    setGuests,
    selectedRooms,
    getTotalCapacity,
  } = props;

  const {
    overallRating,
    checkInDate,
    checkOutDate,
    todayDate,
    bookingUnavailable,
    computedTotals,
    handleBooking,
  } = useBookingCardLogic(props);

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
        {bookingUnavailable && (
          <p className="text-red-500 font-semibold mb-2">
            Salah satu tipe kamar pada tanggal yang dipilih sedang tidak
            tersedia.
          </p>
        )}
        <button
          onClick={handleBooking}
          className="w-full bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white py-3 rounded-lg font-medium mt-4 transition"
          disabled={getTotalCapacity() < guests || bookingUnavailable}
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
