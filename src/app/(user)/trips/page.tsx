"use client";

import Loading from "@/app/loading";
import NoTrips from "@/components/sub/trips/noTrips";
import TripsNavbar from "@/components/sub/trips/tripsNavbar";
import { cancelBooking, getUserBookings } from "@/libs/userBooking";
import { IBooking } from "@/types/booking";
import { useState, useEffect } from "react";
import Image from "next/image";
import { formatCurrency } from "@/helpers/formatCurrency";
import Link from "next/link";
import { FaRegClock, FaRegCreditCard } from "react-icons/fa6";
import { FaRegCheckCircle } from "react-icons/fa";

export default function TripsPage() {
  const [bookings, setBookings] = useState<IBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const userId = "608cde42-46ab-4436-973d-616efdb0339c";

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const userBookings = await getUserBookings(userId);
        setBookings(userBookings);
      } catch (error) {
        console.error("Failed to fetch user bookings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [userId]);

  if (loading) {
    return <Loading />;
  }

  const handleCancel = async (bookingId: string) => {
    try {
      await cancelBooking(bookingId);
      alert("Booking berhasil dibatalkan.");
      setBookings((prevBookings) =>
        prevBookings.filter((booking) => booking.id !== bookingId)
      );
    } catch (error) {
      console.log(error);
      alert("Gagal membatalkan booking. Silakan coba lagi.");
    }
  };

  return (
    <div className="min-h-screen">
      <TripsNavbar />
      <div className="main-content flex flex-col container mx-auto p-8 px-32">
        <h1 className="text-2xl font-bold">Pesanan Saya</h1>
        <div className="border-b-[1px] my-6"></div>
        {bookings.length === 0 ? (
          <NoTrips />
        ) : (
          <div className="flex flex-col gap-4">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="flex justify-between p-4 border-b-[1px] border-gray-300"
              >
                <div>
                  <h2 className="font-semibold">
                    {booking.room_types.property.name}
                  </h2>
                  {booking.room_types.RoomImages.length > 0 && (
                    <div className="relative h-16 w-16 my-2">
                      <Image
                        src={booking.room_types.RoomImages[0].image_url}
                        alt="Room"
                        layout="fill"
                        className="object-cover rounded-md"
                      />
                    </div>
                  )}
                  <p className="text-gray-800 text-sm">
                    Tipe Kamar: {booking.room_types.name}
                  </p>
                  <p className="text-gray-800 text-sm">
                    Harga: {formatCurrency(booking.room_types.price)}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 text-end font-semibold text-sm">
                    No. Reservasi: {booking.id.slice(0, 8)}
                  </p>
                  <p className="text-gray-800 text-end mt-2 text-sm font-semibold">
                    Status:
                  </p>
                  <div className="flex justify-end">
                    {booking.status === "new" && (
                      <div className="flex gap-1 mb-2">
                        <FaRegCreditCard className="text-red-700 text-xl" />
                        <p className="font-semibold text-sm">
                          Segera lakukan pembayaran
                        </p>
                      </div>
                    )}
                    {booking.status === "waiting_payment" && (
                      <div className="flex gap-1">
                        <FaRegClock className="text-yellow-500 text-xl" />
                        <p className="font-semibold text-sm">Sedang diproses</p>
                      </div>
                    )}
                    {booking.status === "completed" && (
                      <div className="flex gap-1">
                        <FaRegCheckCircle className="text-green-500 text-xl" />
                        <p className="font-semibold text-sm">Selesai</p>
                      </div>
                    )}
                  </div>
                  {booking.status === "new" && (
                    <div className="mt-2 flex gap-2 justify-end text-white">
                      <Link
                        href={`/booking/${booking.id}`}
                        className="bg-blue-600 p-1 rounded-md font-semibold text-sm hover:underline"
                      >
                        Bayar
                      </Link>
                      <button
                        onClick={() => handleCancel(booking.id)}
                        className="bg-gray-600 p-1 rounded-md font-semibold text-sm hover:underline"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
