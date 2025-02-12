"use client";

import Loading from "@/app/loading";
import { formatCurrency } from "@/helpers/formatCurrency";
import { formatDateDay } from "@/helpers/formatDate";
import { getBooking } from "@/libs/booking";
import { IBooking } from "@/types/booking";
import { useState, useEffect } from "react";
import Image from "next/image";
import { LuCalendarClock } from "react-icons/lu";
import PaymentProofUpload from "@/components/sub/booking/uploadPayment";
import Link from "next/link";

export default function BookingPage() {
  const [booking, setBooking] = useState<IBooking | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Add loading state

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const bookingData = await getBooking(
          "d0eb6091-b549-44e6-b71d-3b959c6a6222"
        ); // Replace with dynamic ID
        setBooking(bookingData);
      } catch (error) {
        console.error("Error fetching booking:", error);
      } finally {
        setIsLoading(false); // Set loading to false after fetching
      }
    };

    fetchBooking();
  }, []);

  if (isLoading) return <Loading />;

  if (!booking) return <p>Booking not found.</p>;

  return (
    <div className="flex flex-col container mx-auto p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold ml-24">Permintaan untuk Reservasi</h1>
      </div>
      <div className="flex gap-16">
        <div className="flex-1 p-4 ml-20">
          <div className="flex flex-col mb-2">
            <p className="font-semibold">Tanggal</p>
            <p className="text-gray-700">
              {formatDateDay(booking.start_date)} -{" "}
              {formatDateDay(booking.end_date)}
            </p>
          </div>
          <div className="flex flex-col mb-2">
            <p className="font-semibold">Guests</p>
            <p className="text-gray-700">{booking.num_of_guests}</p>
          </div>
          <div className="border-b-[1px] my-6"></div>
          <div>
            <div className="flex justify-between mb-2">
              <p className="font-semibold">Metode Pembayaran</p>
              <p>{booking.payment_method}</p>
            </div>
            {booking.payment_method === "Manual" && (
              <PaymentProofUpload bookingId={booking.id} />
            )}
          </div>
          <div className="border-b-[1px] my-6"></div>
          <div className="flex flex-col mb-2">
            <p className="font-semibold">Kebijakan Refund</p>
            <p className="text-gray-700">
              Reservasi yang sudah dibuat tidak dapat di-refund
            </p>
          </div>
          <div className="border-b-[1px] my-6"></div>
          <div className="flex gap-4 mb-2 items-center">
            <LuCalendarClock className="text-9xl text-red-700" />
            <p className="font-semibold">
              Reservasi Anda tidak akan terkonfirmasi hingga Tenant menerima
              permohonan Anda (dalam waktu 24 jam) khusus untuk pembayaran
              manual.{" "}
              <span className="font-normal text-gray-700">
                Anda tidak akan dikenakan biaya hingga terkonfirmasi.
              </span>
            </p>
          </div>
          <div className="border-b-[1px] my-6"></div>
          <div className="flex flex-col mb-2">
            <p className="text-gray-700 text-xs font-light">
              Dengan memilih tombol di bawah, saya menyetujui Peraturan Tenant,
              Peraturan Dasar untuk tamu, Kebijakan Pemesanan Ulang dan
              Pengembalian Dana Nginepin, dan bahwa Nginepin dapat menagih
              metode pembayaran saya jika saya bertanggung jawab atas kerusakan.
              Saya setuju untuk membayar jumlah total yang tertera jika Tenant
              menerima permohonan pemesanan saya.
            </p>
          </div>
          <div className=" my-10">
            <Link
              href={"/"}
              className="bg-red-700 px-6 py-4 rounded-lg text-white font-semibold"
            >
              Buat Reservasi
            </Link>
          </div>
        </div>
        <div className="flex-1 border border-gray-400 rounded-xl h-64 p-4 sticky z-10 top-8">
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
              <p className="mb-4 ">
                {formatCurrency(booking.total_price)} x 1 malam
              </p>
              <div className="border-b-[1px] border-gray-400 mb-4"></div>
              <p className="">
                <span>Total:</span> {formatCurrency(booking.total_price)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
