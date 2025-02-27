"use client";
import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { FaRegClock, FaRegCreditCard, FaRegCheckCircle } from "react-icons/fa";
import { IBooking, BookingStatus } from "@/types/booking";
import { formatCurrency } from "@/helpers/formatCurrency";

interface BookingItemProps {
  booking: IBooking;
  onCancel: (bookingId: string) => void;
}

const BookingItem: React.FC<BookingItemProps> = ({ booking, onCancel }) => {
  const startDate = new Date(booking.start_date);
  const endDate = new Date(booking.end_date);
  const nights = Math.ceil(
    (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
  );
  const quantity = booking.quantity || 1;

  // Hitung breakdown untuk harga kamar per malam (seasonal dan regular)
  let seasonalNights = 0;
  let regularNights = 0;
  let seasonalCost = 0;
  let regularCost = 0;
  for (let i = 0; i < nights; i++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(currentDate.getDate() + i);
    let priceForNight = booking.room_types.price;
    let isSeasonal = false;
    if (
      booking.room_types.seasonal_prices &&
      booking.room_types.seasonal_prices.length > 0
    ) {
      const seasonal = booking.room_types.seasonal_prices.find((sp) => {
        if (sp.dates && sp.dates.length > 0) {
          const target = currentDate.toISOString().split("T")[0];
          return sp.dates.some((d: string) => {
            const dStr = new Date(d).toISOString().split("T")[0];
            return dStr === target;
          });
        } else if (sp.start_date && sp.end_date) {
          const spStart = new Date(sp.start_date);
          const spEnd = new Date(sp.end_date);
          return currentDate >= spStart && currentDate <= spEnd;
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
  const roomCost = seasonalCost + regularCost;
  const breakfastCost =
    booking.room_types.has_breakfast && booking.add_breakfast
      ? booking.room_types.breakfast_price * quantity * nights
      : 0;
  const computedTotal = roomCost + breakfastCost;

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  return (
    <motion.div
      key={booking.id}
      variants={itemVariants}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
    >
      <div className="flex flex-col md:flex-row">
        <div className="relative md:w-1/3 h-48 md:h-auto overflow-hidden">
          {booking.room_types.RoomImages.length > 0 ? (
            <Image
              src={booking.room_types.RoomImages[0].image_url}
              alt={booking.room_types.property.name}
              fill
              className="object-cover hover:scale-110 transition-transform duration-700"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-200">
              <span className="text-gray-400">No image</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          <div className="absolute bottom-4 left-4 text-white">
            <span className="text-xs font-medium bg-rose-600 px-2 py-1 rounded-full">
              {nights} {nights === 1 ? "malam" : "malam"}
            </span>
          </div>
        </div>

        <div className="p-6 flex-grow">
          <div className="flex flex-col md:flex-row justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-800 hover:text-rose-600 transition-colors">
                {booking.room_types.property.name}
              </h2>
              <p className="text-gray-600 mt-1">{booking.room_types.name}</p>
              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-rose-100 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-rose-600"></div>
                  </div>
                  <p className="text-sm text-gray-600">
                    Check-in:{" "}
                    <span className="font-medium">
                      {startDate.toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-rose-100 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-rose-600"></div>
                  </div>
                  <p className="text-sm text-gray-600">
                    Check-out:{" "}
                    <span className="font-medium">
                      {endDate.toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-rose-100 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-rose-600"></div>
                  </div>
                  <p className="text-sm text-gray-600">
                    Tamu:{" "}
                    <span className="font-medium">{booking.num_of_guests}</span>
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-4 md:mt-0 text-right">
              <p className="text-gray-500 text-xs">
                No. Reservasi:{" "}
                <span className="font-mono">{booking.id.slice(0, 8)}</span>
              </p>
              <div className="mt-2">
                {booking.status === BookingStatus.new && (
                  <div className="flex items-center justify-end gap-2 text-rose-600 bg-rose-50 px-3 py-1 rounded-full">
                    <FaRegCreditCard className="text-sm" />
                    <p className="text-sm font-medium">Segera Bayar</p>
                  </div>
                )}
                {booking.status === BookingStatus.waiting_payment && (
                  <div className="flex items-center justify-end gap-2 text-yellow-600 bg-yellow-50 px-3 py-1 rounded-full">
                    <FaRegClock className="text-sm" />
                    <p className="text-sm font-medium">Dalam Proses</p>
                  </div>
                )}
                {booking.status === BookingStatus.completed && (
                  <div className="flex items-center justify-end gap-2 text-green-600 bg-green-50 px-3 py-1 rounded-full">
                    <FaRegCheckCircle className="text-sm" />
                    <p className="text-sm font-medium">Selesai</p>
                  </div>
                )}
                {booking.status === BookingStatus.canceled && (
                  <div className="flex items-center justify-end gap-2 text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                    <p className="text-sm font-medium">Dibatalkan</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="font-bold mb-2">Rincian Kamar yang Dipesan</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center">
                <span className="underline">
                  {booking.room_types.name} x {quantity} ({nights}{" "}
                  {nights === 1 ? "malam" : "malam"})
                </span>
                <span>{formatCurrency(roomCost)}</span>
              </div>
              {seasonalNights > 0 && (
                <div className="flex justify-between ml-4">
                  <span>Harga Musiman ({seasonalNights} malam)</span>
                  <span>{formatCurrency(seasonalCost)}</span>
                </div>
              )}
              {regularNights > 0 && (
                <div className="flex justify-between ml-4">
                  <span>Harga Reguler ({regularNights} malam)</span>
                  <span>{formatCurrency(regularCost)}</span>
                </div>
              )}
              {booking.room_types.has_breakfast && booking.add_breakfast && (
                <div className="flex justify-between">
                  <span className="underline">Biaya Sarapan</span>
                  <span>{formatCurrency(breakfastCost)}</span>
                </div>
              )}
              <div className="pt-3 border-t flex justify-between font-medium">
                <span>Total</span>
                <span>{formatCurrency(computedTotal)}</span>
              </div>
            </div>
          </div>

          {booking.status === BookingStatus.new && (
            <div className="mt-6 flex gap-3 justify-end">
              <Link
                href={`/booking/${booking.id}`}
                className="bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-700 hover:to-rose-800 text-white px-6 py-2 rounded-lg font-medium transition-all duration-300"
              >
                Bayar Sekarang
              </Link>
              <button
                onClick={() => onCancel(booking.id)}
                className="border border-rose-300 text-rose-700 hover:bg-rose-100 px-4 py-2 rounded-lg font-medium transition-all duration-300"
              >
                Batalkan
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default BookingItem;
