"use client";

import { IBooking } from "@/types/booking";
import PaymentProofUpload from "./uploadPayment";
import BookingSummary from "./bookingSummary";

interface BookingPaymentInfoProps {
  booking: IBooking;
  selectedPaymentMethod: string | null;
  setSelectedPaymentMethod: (method: string) => void;
}

function PaymentMethodSelector({
  booking,
  selectedPaymentMethod,
  setSelectedPaymentMethod,
}: Pick<
  BookingPaymentInfoProps,
  "booking" | "selectedPaymentMethod" | "setSelectedPaymentMethod"
>) {
  return (
    <div className="flex flex-col mb-2">
      <div className="flex justify-between mb-2">
        <p className="font-semibold">Metode Pembayaran</p>
        <p>
          {booking.payment_method || selectedPaymentMethod || "Belum Dipilih"}
        </p>
      </div>
      {!booking.payment_method && (
        <div className="flex mb-4 w-full justify-around mt-2">
          <button
            onClick={() => setSelectedPaymentMethod("Manual")}
            className={`px-4 py-2 rounded-l w-full border ${
              selectedPaymentMethod === "Manual"
                ? "text-rose-700 font-semibold hover:text-rose-500 bg-gray-100 hover:bg-gray-200"
                : "text-black"
            }`}
          >
            Manual
          </button>
          <button
            onClick={() => setSelectedPaymentMethod("Midtrans")}
            className={`px-4 py-2 rounded-r w-full border ${
              selectedPaymentMethod === "Midtrans"
                ? "text-rose-700 font-semibold hover:text-rose-500 bg-gray-100 hover:bg-gray-200"
                : "text-black"
            }`}
          >
            Midtrans
          </button>
        </div>
      )}
      {selectedPaymentMethod === "Manual" && (
        <PaymentProofUpload bookingId={booking.id} />
      )}
      {selectedPaymentMethod === "Midtrans" && (
        <div className="my-4">
          <p className="font-semibold text-gray-600">
            Redirecting to Midtrans payment gateway...
          </p>
        </div>
      )}
    </div>
  );
}

function TermsSection() {
  return (
    <div className="flex flex-col mb-2">
      <p className="text-gray-700 text-xs font-light">
        Dengan membuat reservasi, saya menyetujui Peraturan Tenant, Peraturan
        Dasar untuk tamu, Kebijakan Pemesanan Ulang dan Pengembalian Dana
        Nginepin, dan bahwa Nginepin dapat menagih metode pembayaran saya jika
        saya bertanggung jawab atas kerusakan. Saya setuju untuk membayar jumlah
        total yang tertera jika Tenant menerima permohonan pemesanan saya.
      </p>
    </div>
  );
}

export default function BookingPaymentInfo({
  booking,
  selectedPaymentMethod,
  setSelectedPaymentMethod,
}: BookingPaymentInfoProps) {
  return (
    <div className="flex-1 p-4 ml-20">
      <BookingSummary booking={booking} />
      <div className="border-b-[1px] my-6"></div>
      <PaymentMethodSelector
        booking={booking}
        selectedPaymentMethod={selectedPaymentMethod}
        setSelectedPaymentMethod={setSelectedPaymentMethod}
      />
      <div className="border-b-[1px] my-6"></div>
      <TermsSection />
    </div>
  );
}
