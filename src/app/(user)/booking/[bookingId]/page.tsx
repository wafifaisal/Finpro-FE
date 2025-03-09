"use client";

import Loading from "@/app/loading";
import { formatDateDay } from "@/helpers/formatDate";
import { getBooking } from "@/libs/booking";
import { IBooking } from "@/types/booking";
import { useEffect, useState } from "react";
import { LuCalendarClock } from "react-icons/lu";
import PaymentProofUpload from "@/components/sub/booking/uploadPayment";
import TripsNavbar from "@/components/sub/trips/tripsNavbar";
import BookingDetails from "@/components/sub/booking/bookingDetails";
import { getSnapToken, midtransWebHook } from "@/libs/payment";
import withGuard from "@/hoc/pageGuard";
import { RiSecurePaymentFill } from "react-icons/ri";

declare global {
  interface Window {
    snap?: {
      pay: (
        snapToken: string,
        options: {
          onSuccess: (result: MidtransSnapResult) => void;
          onPending: (result: MidtransSnapResult) => void;
          onError: (result: MidtransSnapResult) => void;
          onClose: () => void;
        }
      ) => void;
    };
  }
}
interface MidtransSnapResult {
  transaction_status: string;
  order_id: string;
}

function BookingPage({ params }: { params: { bookingId: string } }) {
  const [booking, setBooking] = useState<IBooking | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<
    string | null
  >(null);

  useEffect(() => {
    if (typeof window !== "undefined" && !window.snap) {
      const script = document.createElement("script");
      script.src = "https://app.sandbox.midtrans.com/snap/snap.js";
      script.type = "text/javascript";
      script.async = true;
      script.setAttribute(
        "data-client-key",
        process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || ""
      );
      document.body.appendChild(script);
    }
  }, []);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const bookingData = await getBooking(params.bookingId);
        setBooking(bookingData);
      } catch (error) {
        console.error("Error fetching booking:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBooking();
  }, [params.bookingId]);

  // Pastikan booking telah terload sebelum perhitungan
  let computedTotal = 0;
  let seasonalNights = 0;
  let regularNights = 0;
  let seasonalCost = 0;
  let regularCost = 0;
  let breakfastCost = 0;
  let nights = 0;
  let quantity = 1;

  if (booking) {
    const startDate = new Date(booking.start_date);
    const endDate = new Date(booking.end_date);
    nights = Math.ceil(
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    quantity = booking.quantity || 1;

    for (let i = 0; i < nights; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(currentDate.getDate() + i);
      let priceForNight = booking.room_types.price;
      let isSeasonal = false;
      if (
        booking.room_types.seasonal_prices &&
        booking.room_types.seasonal_prices.length > 0
      ) {
        for (const sp of booking.room_types.seasonal_prices) {
          if (sp.dates && sp.dates.length > 0) {
            const target = currentDate.toISOString().split("T")[0];
            if (
              sp.dates.some(
                (d: string) =>
                  new Date(d).toISOString().split("T")[0] === target
              )
            ) {
              priceForNight = Number(sp.price);
              isSeasonal = true;
              break;
            }
          } else if (sp.start_date && sp.end_date) {
            const spStart = new Date(sp.start_date);
            const spEnd = new Date(sp.end_date);
            if (currentDate >= spStart && currentDate <= spEnd) {
              priceForNight = Number(sp.price);
              isSeasonal = true;
              break;
            }
          }
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
    breakfastCost =
      booking.room_types.has_breakfast && booking.add_breakfast
        ? booking.room_types.breakfast_price * quantity * nights
        : 0;
    computedTotal = roomCost + breakfastCost;
  }

  useEffect(() => {
    if (selectedPaymentMethod === "Midtrans" && booking) {
      const midtransPayment = async () => {
        try {
          // Menggunakan computedTotal yang sudah termasuk biaya breakfast
          const snapToken = await getSnapToken(booking.id, computedTotal);
          if (typeof window !== "undefined" && window.snap) {
            window.snap.pay(snapToken, {
              onSuccess: async function (result: MidtransSnapResult) {
                console.log("Payment success", result);
                try {
                  await midtransWebHook(
                    result.transaction_status,
                    result.order_id
                  );
                } catch (webhookError) {
                  console.error(
                    "Error calling midtrans webhook:",
                    webhookError
                  );
                }
              },
              onPending: function (result: MidtransSnapResult) {
                console.log("Payment pending", result);
              },
              onError: function (result: MidtransSnapResult) {
                console.log("Payment error", result);
              },
              onClose: function () {
                console.log("Payment popup closed");
              },
            });
          } else {
            console.error("Midtrans Snap script not loaded");
          }
        } catch (error) {
          console.error("Error in midtrans payment:", error);
        }
      };

      midtransPayment();
    }
  }, [selectedPaymentMethod, booking, computedTotal]);

  if (isLoading) return <Loading />;
  if (!booking) return <p>Booking not found.</p>;

  return (
    <div>
      <TripsNavbar />
      <div className="main-content flex flex-col container mx-auto p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold ml-24">
            Permintaan untuk Reservasi
          </h1>
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
                permohonan Anda (dalam waktu 24 jam) khusus untuk pembayaran
                manual.{" "}
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
            <div className="border-b-[1px] my-6"></div>
            {/* Payment Method Section */}
            <div className="flex flex-col mb-2">
              <div className="flex justify-between mb-2">
                <p className="font-semibold">Metode Pembayaran</p>
                <p>
                  {booking.payment_method ||
                    selectedPaymentMethod ||
                    "Belum Dipilih"}
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
                        ? " text-rose-700 font-semibold hover:text-rose-500 bg-gray-100 hover:bg-gray-200"
                        : " text-black"
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
            <div className="border-b-[1px] my-6"></div>
            <div className="flex flex-col mb-2">
              <p className="text-gray-700 text-xs font-light">
                Dengan membuat reservasi, saya menyetujui Peraturan Tenant,
                Peraturan Dasar untuk tamu, Kebijakan Pemesanan Ulang dan
                Pengembalian Dana Nginepin, dan bahwa Nginepin dapat menagih
                metode pembayaran saya jika saya bertanggung jawab atas
                kerusakan. Saya setuju untuk membayar jumlah total yang tertera
                jika Tenant menerima permohonan pemesanan saya.
              </p>
            </div>
          </div>
          <BookingDetails
            booking={booking}
            seasonalNights={seasonalNights}
            regularNights={regularNights}
            quantity={quantity}
            nights={nights}
            roomCost={seasonalCost + regularCost}
            breakfastCost={breakfastCost}
            computedTotal={computedTotal}
          />
        </div>
      </div>
    </div>
  );
}

export default withGuard(BookingPage, {
  requiredRole: "user",
  redirectTo: "/not-authorized",
});
