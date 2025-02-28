"use client";
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
      } catch (error) {
        console.error("Failed to fetch user bookings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
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
