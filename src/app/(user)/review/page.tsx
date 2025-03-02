"use client";

import { useEffect, useState } from "react";
import TripsNavbar from "@/components/sub/trips/tripsNavbar";
import { getUserReviews } from "@/libs/review";
import { IBooking } from "@/types/booking";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { formatDateDay } from "@/helpers/formatDate";
import Loading from "@/app/loading";
import { LuCalendarArrowUp, LuCalendarArrowDown } from "react-icons/lu";
import { FaQuoteLeft } from "react-icons/fa6";
import { MdOutlineRateReview } from "react-icons/md";

export default function ReviewPage() {
  const [bookings, setBookings] = useState<IBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const userId = "2cc09e1c-6cfa-4c7a-8a37-b7b3b3399260"; // Replace with actual user ID

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const data = await getUserReviews(userId);
        setBookings(data);
      } catch (error) {
        console.error("Failed to fetch reviews", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [userId]);

  if (loading) {
    return <Loading />;
  }
  return (
    <div className="min-h-screen">
      <TripsNavbar />
      <div className="main-content flex flex-col container mx-auto p-8 px-60">
        <h1 className="text-xl font-bold mb-8">Ulasan Saya</h1>
        {bookings.map((booking) => (
          <div
            key={booking.id}
            className="flex w-full mx-auto border rounded-xl shadow-md mb-10"
          >
            <div className="relative h-60 w-60">
              <Image
                src={
                  booking.room_types.RoomImages[0].image_url ||
                  "/placeholder.jpg"
                }
                alt="Room"
                layout="fill"
                className="object-cover rounded-l-xl"
              />
            </div>

            <div className="flex w-[70%]">
              <div className="flex-1 p-4">
                <p className="text-lg font-semibold">
                  {booking.room_types.property.name}
                </p>
                <p className="text-sm text-gray-600">
                  {booking.room_types.name}
                </p>
                <div className="flex justify-between mt-2 text-sm border-t-[1px] border-gray-300 p-1">
                  <div className="flex flex-col">
                    <div className="flex gap-1">
                      <LuCalendarArrowUp className="my-1" />
                      <p className="text-gray-500">Check-in</p>
                    </div>
                    <p className="font-semibold">
                      {formatDateDay(booking.start_date)}
                    </p>
                  </div>
                  <div className="text-xl font-semibold text-gray-500">
                    {">"}
                  </div>
                  <div className="flex flex-col">
                    <div className="flex gap-1">
                      <LuCalendarArrowDown className="my-1" />
                      <p className="text-gray-500">Check-out</p>
                    </div>
                    <p className="font-semibold">
                      {formatDateDay(booking.end_date)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex-1 p-4 bg-gray-100 rounded-r-xl">
                {booking.Review && booking.Review.length > 0 ? (
                  <>
                    <div className="flex gap-1 text-gray-600">
                      <FaQuoteLeft />
                      <p>Anda menulis</p>
                    </div>
                    <div className="flex gap-2 text-sm mt-8">
                      <p className="text-white bg-yellow-500 rounded-l-3xl rounded-tr-3xl w-8 h-8 text-center content-center">
                        {booking.Review[0]?.rating}/5
                      </p>
                      <p
                        className="text-gray-800"
                        dangerouslySetInnerHTML={{
                          __html: booking.Review[0]?.review,
                        }}
                      ></p>
                    </div>
                  </>
                ) : (
                  <Link href={`/review/${booking.id}`}>
                    <Button className="bg-red-700 hover:bg-red-500 text-white font-semibold w-full rounded-xl">
                      <div className="flex gap-1">
                        <p>Ulas Sekarang</p>
                        <MdOutlineRateReview className="mt-1" />
                      </div>
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
