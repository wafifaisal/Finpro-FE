"use client";

import { formatDateDay } from "@/helpers/formatDate";
import { LuCalendarClock } from "react-icons/lu";
import { RiSecurePaymentFill } from "react-icons/ri";
import { IBooking } from "@/types/booking";

interface BookingSummaryProps {
  booking: IBooking;
}

export default function BookingSummary({ booking }: BookingSummaryProps) {
  return (
    <div>
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
      <div className="flex flex-col mb-2">
        <p className="font-semibold">Kebijakan Refund</p>
        <p className="text-gray-700">
          Reservasi yang sudah dibuat tidak dapat di-refund
        </p>
      </div>
      <div className="border-b-[1px] my-4"></div>
      <div className="flex gap-4 items-center">
        <LuCalendarClock className="text-9xl text-red-700" />
        <p className="font-semibold text-sm">
          Reservasi Anda tidak akan terkonfirmasi hingga Tenant menerima
          permohonan Anda (dalam waktu 24 jam) khusus untuk pembayaran manual.{" "}
          <span className="font-normal text-gray-700">
            Anda tidak akan dikenakan biaya hingga terkonfirmasi.
          </span>
        </p>
      </div>
      <div className="flex gap-4 mb-2 items-center">
        <RiSecurePaymentFill className="text-5xl text-red-700" />
        <p className="font-semibold text-sm">
          Pembayaran menggunakan Midtrans akan langsung terkonfirmasi.
        </p>
      </div>
    </div>
  );
}
