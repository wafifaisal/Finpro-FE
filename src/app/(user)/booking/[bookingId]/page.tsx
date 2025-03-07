"use client";

import Loading from "@/app/loading";
import { formatCurrency } from "@/helpers/formatCurrency";
import { formatDateDay } from "@/helpers/formatDate";
import { getBooking } from "@/libs/booking";
import { IBooking } from "@/types/booking";
import { useEffect, useState } from "react";
import Image from "next/image";
import { LuCalendarClock } from "react-icons/lu";
import PaymentProofUpload from "@/components/sub/booking/uploadPayment";
import TripsNavbar from "@/components/sub/trips/tripsNavbar";

export default function BookingPage({
  params,
}: {
  params: { bookingId: string };
}) {
  const [booking, setBooking] = useState<IBooking | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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

  if (isLoading) return <Loading />;
  if (!booking) return <p>Booking not found.</p>;

  const startDate = new Date(booking.start_date);
  const endDate = new Date(booking.end_date);
  const nights = Math.ceil(
    (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
  );
  const quantity = booking.quantity || 1;
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
      for (const sp of booking.room_types.seasonal_prices) {
        if (sp.dates && sp.dates.length > 0) {
          const target = currentDate.toISOString().split("T")[0];
          if (
            sp.dates.some((d: string) => {
              const dStr = new Date(d).toISOString().split("T")[0];
              return dStr === target;
            })
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

  const breakfastCost =
    booking.room_types.has_breakfast && booking.add_breakfast
      ? booking.room_types.breakfast_price * quantity * nights
      : 0;

  const computedTotal = roomCost + breakfastCost;

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
                        {formatCurrency(booking.room_types.price)} x {quantity}{" "}
                        kamar x {regularNights} malam (Harga Reguler)
                      </p>
                    )}
                    {seasonalNights > 0 && (
                      <p className="text-sm">
                        {booking.room_types.seasonal_prices &&
                        booking.room_types.seasonal_prices[0]
                          ? formatCurrency(
                              Number(
                                booking.room_types.seasonal_prices[0].price
                              )
                            )
                          : formatCurrency(booking.room_types.price)}{" "}
                        x {quantity} kamar x {seasonalNights} malam (Harga
                        Musiman)
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="mb-4">
                    {formatCurrency(booking.room_types.price)} x {quantity}{" "}
                    kamar x {nights} malam
                  </p>
                )}
                <div className="border-b-[1px] border-gray-400 mb-4"></div>
                <div className="space-y-2">
                  <p>
                    <span>Biaya Kamar: </span> {formatCurrency(roomCost)}
                  </p>
                  {booking.room_types.has_breakfast &&
                    booking.add_breakfast && (
                      <p>
                        <span>Biaya Sarapan: </span>{" "}
                        {formatCurrency(breakfastCost)}
                      </p>
                    )}
                  <p className="font-bold">
                    Total: {formatCurrency(computedTotal)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
