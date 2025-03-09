"use client";

import Image from "next/image";
import { formatCurrency } from "@/helpers/formatCurrency";
import { IBooking } from "@/types/booking";

interface BookingDetailsProps {
  booking: IBooking;
  seasonalNights: number;
  regularNights: number;
  quantity: number;
  nights: number;
  roomCost: number;
  breakfastCost: number;
  computedTotal: number;
}

export default function BookingDetails({
  booking,
  seasonalNights,
  regularNights,
  quantity,
  nights,
  roomCost,
  breakfastCost,
  computedTotal,
}: BookingDetailsProps) {
  return (
    <div className="flex-1 border border-gray-400 rounded-xl h-fit p-4 sticky z-10 top-28">
      <div className="flex gap-6 items-center">
        <div className="relative w-28 h-28 mb-4">
          <Image
            src={booking.room_types.RoomImages[0].image_url}
            alt={booking.room_types.name}
            layout="fill"
            className="object-cover rounded-lg"
          />
        </div>
        <div className="flex flex-col w-[375px]">
          <h2 className="text-lg font-bold">{booking.room_types.name}</h2>
          <div className="border-b-[1px] border-gray-400 mb-4"></div>
          <h3 className="font-semibold">Detail Harga</h3>
          {seasonalNights > 0 || regularNights > 0 ? (
            <div className="mb-4 space-y-1">
              {regularNights > 0 && (
                <p className="text-sm">
                  {formatCurrency(booking.room_types.price)} x {quantity} kamar
                  x {regularNights} malam (Harga Reguler)
                </p>
              )}
              {seasonalNights > 0 && (
                <p className="text-sm">
                  {booking.room_types.seasonal_prices &&
                  booking.room_types.seasonal_prices[0]
                    ? formatCurrency(
                        Number(booking.room_types.seasonal_prices[0].price)
                      )
                    : formatCurrency(booking.room_types.price)}{" "}
                  x {quantity} kamar x {seasonalNights} malam (Harga Musiman)
                </p>
              )}
            </div>
          ) : (
            <p className="mb-4">
              {formatCurrency(booking.room_types.price)} x {quantity} kamar x{" "}
              {nights} malam
            </p>
          )}
          <div className="border-b-[1px] border-gray-400 mb-4"></div>
          <div className="space-y-2">
            <p>
              <span>Biaya Kamar: </span> {formatCurrency(roomCost)}
            </p>
            {booking.room_types.has_breakfast && booking.add_breakfast && (
              <p>
                <span>Biaya Sarapan: </span> {formatCurrency(breakfastCost)}
              </p>
            )}
            <p className="font-bold">Total: {formatCurrency(computedTotal)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
