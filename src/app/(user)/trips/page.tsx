"use client";
<<<<<<< HEAD

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
=======
import { useState, useEffect } from "react";
import React from "react";
import Navbar from "@/components/main/navbar/Navbar";
import Loading from "@/app/loading";
import FilterPanel from "@/components/main/trips/FilterPanel";
import BookingItem from "@/components/main/trips/BookingItem";
import Pagination from "@/components/main/trips/Pagination";
import { getUserBookings, cancelBooking } from "@/libs/booking";
import { IBooking } from "@/types/booking";
import { useSession } from "@/context/useSessionHook";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import withGuard from "@/hoc/pageGuard";

function TripsPage() {
  const { user } = useSession();
  const [bookings, setBookings] = useState<IBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 4;
  const [totalCount, setTotalCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<
    "all" | "new" | "waiting_payment" | "completed"
  >("all");
  const [reservationNo, setReservationNo] = useState("");
  const [filterCheckIn, setFilterCheckIn] = useState<Date | null>(null);
  const [filterCheckOut, setFilterCheckOut] = useState<Date | null>(null);
  const [showFilterOptions, setShowFilterOptions] = useState(false);
  useEffect(() => {
    if (!user) return;
    const fetchBookings = async () => {
      setLoading(true);
      try {
        const data = await getUserBookings(
          currentPage,
          limit,
          debouncedSearchTerm,
          filterStatus,
          reservationNo,
          filterCheckIn,
          filterCheckOut
        );
        setBookings(data.result);
        setTotalCount(data.totalCount);
>>>>>>> 3e23c60884a7ebd72589a913b65d5317a15be9d4
      } catch (error) {
        console.error("Failed to fetch user bookings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
<<<<<<< HEAD
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
=======
  }, [
    user,
    currentPage,
    debouncedSearchTerm,
    filterStatus,
    reservationNo,
    filterCheckIn,
    filterCheckOut,
  ]);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);
  const totalPages = Math.ceil(totalCount / limit);
  const handleCancel = async (bookingId: string) => {
    try {
      await cancelBooking(bookingId);
      const toast = document.createElement("div");
      toast.className =
        "fixed bottom-4 right-4 bg-rose-500 text-white p-4 rounded-lg shadow-lg z-50";
      toast.innerHTML = "Booking berhasil dibatalkan.";
      document.body.appendChild(toast);
      setTimeout(() => document.body.removeChild(toast), 3000);
      setBookings((prev) => prev.filter((booking) => booking.id !== bookingId));
    } catch (error) {
      console.error(error);
      const toast = document.createElement("div");
      toast.className =
        "fixed bottom-4 right-4 bg-red-500 text-white p-4 rounded-lg shadow-lg z-50";
      toast.innerHTML = "Gagal membatalkan booking. Silakan coba lagi.";
      document.body.appendChild(toast);
      setTimeout(() => document.body.removeChild(toast), 3000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-white to-rose-50 pt-0 md:pt-20">
        <div className="relative bg-rose-600 text-white overflow-hidden">
          <div className="absolute inset-0 bg-[url('/images/pattern.svg')] opacity-10 animate-pulse"></div>
          <div className="container mx-auto px-4 py-8 relative z-10">
            <h1 className="text-3xl font-bold">Pesanan Saya</h1>
            <p className="mt-2 text-rose-100">
              Kelola semua reservasi Anda di satu tempat
            </p>
          </div>
        </div>

        <div className="container mx-auto p-4 md:p-8 max-w-6xl">
          <FilterPanel
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            filterStatus={filterStatus}
            setFilterStatus={setFilterStatus}
            reservationNo={reservationNo}
            setReservationNo={setReservationNo}
            filterCheckIn={filterCheckIn}
            setFilterCheckIn={setFilterCheckIn}
            filterCheckOut={filterCheckOut}
            setFilterCheckOut={setFilterCheckOut}
            showFilterOptions={showFilterOptions}
            setShowFilterOptions={setShowFilterOptions}
          />

          {bookings.length === 0 ? (
            <motion.div
              className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl shadow-sm"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Image
                src="https://res.cloudinary.com/dkyco4yqp/image/upload/v1740519552/Hands_-_Phone_x2vpai.png"
                alt="No trips"
                width={200}
                height={200}
              />
              <h3 className="text-2xl font-bold mt-6">Belum ada pesanan</h3>
              <p className="text-gray-500 mt-2 mb-6">
                Waktunya untuk merencanakan liburan Anda berikutnya!
              </p>
              <Link
                href="/property/search-result"
                className="bg-gradient-to-r from-rose-600 to-rose-700 text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-all duration-300"
              >
                Jelajahi Properti
              </Link>
            </motion.div>
          ) : (
            <>
              {filterStatus !== "all" && (
                <motion.div
                  className="mb-4 flex items-center gap-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className="bg-rose-100 text-rose-700 px-3 py-1 rounded-full text-sm font-medium flex items-center">
                    {filterStatus === "new" && "Menunggu Pembayaran"}
                    {filterStatus === "waiting_payment" && "Sedang Diproses"}
                    {filterStatus === "completed" && "Selesai"}
                    <button
                      onClick={() => setFilterStatus("all")}
                      className="ml-2 text-rose-700 hover:text-rose-900"
                    >
                      ✕
                    </button>
                  </div>
                  <span className="text-gray-500 text-sm">
                    Menampilkan {bookings.length} dari {totalCount} pesanan
                  </span>
                </motion.div>
              )}

              <motion.div className="flex flex-col gap-6">
                {bookings.map((booking) => (
                  <BookingItem
                    key={booking.id}
                    booking={booking}
                    onCancel={handleCancel}
                  />
                ))}
              </motion.div>

              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default withGuard(TripsPage, {
  requiredRole: "user",
  redirectTo: "/not-authorized",
});
>>>>>>> 3e23c60884a7ebd72589a913b65d5317a15be9d4
