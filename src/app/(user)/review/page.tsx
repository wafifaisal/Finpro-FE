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
import { useSession } from "@/context/useSessionHook";
import withGuard from "@/hoc/pageGuard";
import { FaQuoteLeft } from "react-icons/fa";
import { LuCalendarArrowUp, LuCalendarArrowDown } from "react-icons/lu";
import { MdOutlineRateReview } from "react-icons/md";
import Pagination from "@/components/main/trips/Pagination";

function ReviewPage() {
  const { user } = useSession();
  const [bookings, setBookings] = useState<IBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 4;
  const [totalCount, setTotalCount] = useState(0);
  const [displayType, setDisplayType] = useState<"reviewed" | "unreviewed">(
    "unreviewed"
  );

  useEffect(() => {
    const fetchReviews = async () => {
      if (!user) return;
      setLoading(true);
      try {
        const data = await getUserReviews(
          user.id,
          currentPage,
          limit,
          displayType
        );
        setBookings(data.bookings);
        setTotalCount(data.pagination.total);
      } catch (error) {
        console.error("Failed to fetch reviews", error);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, [user, currentPage, limit, displayType]);

  useEffect(() => {
    setCurrentPage(1);
  }, [displayType]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  const totalPages = Math.ceil(totalCount / limit);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-rose-50">
      <TripsNavbar />
      {/* Adjusted container: on mobile uses smaller horizontal padding */}
      <div className="main-content flex flex-col container mx-auto p-8 px-4 md:px-60  mt-[-80px] md:mt-0 mb-16 md:mb-0">
        <h1 className="text-xl font-bold">Ulasan Saya</h1>
        <div className="border-b-[1px] w-full my-4"></div>
        <div className="flex gap-4 mb-6">
          <Button
            onClick={() => setDisplayType("unreviewed")}
            className={
              displayType === "unreviewed"
                ? "bg-rose-500 hover:bg-rose-700 text-white font-semibold"
                : "bg-gray-200 hover:bg-gray-300 text-gray-800"
            }
          >
            Belum Diulas
          </Button>
          <Button
            onClick={() => setDisplayType("reviewed")}
            className={
              displayType === "reviewed"
                ? "bg-rose-500 hover:bg-rose-700 text-white font-semibold"
                : "bg-gray-200 hover:bg-gray-300 text-gray-800"
            }
          >
            Sudah Diulas
          </Button>
        </div>

        {bookings.length === 0 ? (
          <p className="text-gray-500">Tidak ada pesanan untuk ditampilkan.</p>
        ) : (
          bookings.map((booking) => (
            <div
              key={booking.id}
              className="flex flex-col md:flex-row w-full mx-auto border rounded-xl shadow-md mb-10"
            >
              {/* Image container: full width on mobile, fixed on md+ */}
              <div className="relative h-60 w-full md:w-60">
                <Image
                  src={
                    booking.room_types.RoomImages[0].image_url ||
                    "/placeholder.jpg"
                  }
                  alt="Room"
                  layout="fill"
                  className="object-cover rounded-t-xl md:rounded-l-xl md:rounded-t-none"
                />
              </div>

              {/* Details container: stacks vertically on mobile, side-by-side on desktop */}
              <div className="flex flex-col md:flex-row w-full md:w-[70%]">
                <div className="w-full md:w-1/2 p-4">
                  <p className="text-lg font-semibold">
                    {booking.room_types.property.name}
                  </p>
                  <p className="text-sm text-gray-600">
                    {booking.room_types.name}
                  </p>
                  <div className="flex justify-between mt-2 text-sm border-t border-gray-300 p-1">
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

                <div className="w-full md:w-1/2 p-4 bg-gray-100 md:rounded-r-xl">
                  {booking.Review && booking.Review.length > 0 ? (
                    <>
                      <div className="flex gap-1 text-gray-600">
                        <FaQuoteLeft />
                        <p>Anda menulis</p>
                      </div>
                      <div className="flex gap-2 text-sm mt-8">
                        <p className="text-white bg-yellow-500 rounded-l-3xl rounded-tr-3xl w-8 h-8 p-2 text-center">
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
                      <Button className="bg-rose-500 hover:bg-rose-600 text-white font-semibold w-full rounded-xl">
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
          ))
        )}

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </div>
    </div>
  );
}

export default withGuard(ReviewPage, {
  requiredRole: "user",
  redirectTo: "/not-authorized",
});
