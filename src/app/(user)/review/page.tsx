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

export default function ReviewPage() {
  const [bookings, setBookings] = useState<IBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const userId = "f4a225e8-b8f2-4e9f-ab1a-c79d16b9c5a8"; // Replace with actual user ID

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
        <h1 className="text-2xl font-bold">Ulasan Saya</h1>
        <div className="border-b-[1px] my-6"></div>

        {bookings.map((booking) => (
          <div
            key={booking.id}
            className="flex w-full bg-gray-200 mx-auto border rounded-xl shadow-md mb-10 gap-4"
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

            <div className="mt-4">
              <p className="text-lg font-semibold">
                {booking.room_types.property.name}
              </p>
              <p className="text-sm text-gray-600">{booking.room_types.name}</p>
              <p className="text-sm text-gray-600">
                {formatDateDay(booking.start_date)} -{" "}
                {formatDateDay(booking.end_date)}
              </p>
            </div>

            <div className="mt-4">
              {booking.Review ? (
                <div>
                  <p className="text-yellow-500">
                    ⭐ {booking.Review.rating}/5
                  </p>
                  <p className="text-gray-800">{booking.Review.review}</p>
                </div>
              ) : (
                <Link href={`/create-review/${booking.id}`}>
                  <Button className="bg-blue-500 text-white w-full">
                    Review this property
                  </Button>
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
