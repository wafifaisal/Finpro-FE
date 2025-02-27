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
  const userId = "608cde42-46ab-4436-973d-616efdb0339c"; // Replace with actual user ID

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
      <div className="main-content flex flex-col container mx-auto p-8 px-32">
        <h1 className="text-2xl font-bold">Ulasan Saya</h1>
        <div className="border-b-[1px] my-6"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {bookings.map((booking) => (
            <div key={booking.id} className="border rounded-lg shadow-md p-4">
              {/* Image */}
              {booking.room_types.RoomImages?.length ? (
                <div className="relative h-16 w-16 my-2">
                  <Image
                    src={
                      booking.room_types.RoomImages[0].image_url ||
                      "/placeholder.jpg"
                    }
                    alt="Room"
                    layout="fill"
                    className="object-cover rounded-md"
                  />
                </div>
              ) : (
                <p className="text-gray-500">No Image Available</p>
              )}

              {/* Details */}
              <div className="mt-4">
                <p className="text-lg font-semibold">
                  {booking.room_types.property.name}
                </p>
                <p className="text-sm text-gray-600">
                  {booking.room_types.name}
                </p>
                <p className="text-sm text-gray-600">
                  {formatDateDay(booking.start_date)} -{" "}
                  {formatDateDay(booking.end_date)}
                </p>
              </div>

              {/* Review Section */}
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
    </div>
  );
}
