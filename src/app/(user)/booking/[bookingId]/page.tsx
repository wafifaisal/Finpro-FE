"use client";

import Loading from "@/app/loading";
import { getBooking } from "@/libs/booking";
import { IBooking } from "@/types/booking";
import { useEffect, useState } from "react";
import TripsNavbar from "@/components/sub/trips/tripsNavbar";
import BookingDetails from "@/components/sub/booking/bookingDetails";
import { getSnapToken } from "@/libs/payment";
import withGuard from "@/hoc/pageGuard";
import Swal from "sweetalert2";
import { calculateBookingCosts } from "@/helpers/calculateBookingCosts";
import BookingPaymentInfo from "@/components/sub/booking/bookingPaymentInfo";

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
      } catch (_error) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to fetch booking data.",
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchBooking();
  }, [params.bookingId]);

  useEffect(() => {
    if (selectedPaymentMethod === "Midtrans" && booking) {
      (async () => {
        try {
          const snapToken = await getSnapToken(
            booking.id,
            booking.quantity || 1
          );
          if (typeof window !== "undefined" && window.snap) {
            window.snap.pay(snapToken, {
              onSuccess: (_result: MidtransSnapResult) => {
                Swal.fire({
                  icon: "success",
                  title: "Payment Successful",
                  text: "Your payment was successful. Redirecting...",
                  timer: 3000,
                  showConfirmButton: false,
                });
              },
              onPending: (_result: MidtransSnapResult) => {
                Swal.fire({
                  icon: "info",
                  title: "Payment Pending",
                  text: "Your payment is pending.",
                });
              },
              onError: (_result: MidtransSnapResult) => {
                Swal.fire({
                  icon: "error",
                  title: "Payment Error",
                  text: "An error occurred during payment.",
                });
              },
              onClose: () => {
                Swal.fire({
                  icon: "info",
                  title: "Payment Closed",
                  text: "Refresh page to pay again.",
                });
              },
            });
          } else {
            Swal.fire({
              icon: "error",
              title: "Error",
              text: "Midtrans Snap script not loaded.",
            });
          }
        } catch (_error) {
          Swal.fire({
            icon: "error",
            title: "Payment Error",
            text: "An error occurred during the payment process.",
          });
        }
      })();
    }
  }, [selectedPaymentMethod, booking]);

  if (isLoading) return <Loading />;
  if (!booking) return <p>Booking not found.</p>;

  const {
    nights,
    seasonalNights,
    regularNights,
    roomCost,
    breakfastCost,
    computedTotal,
  } = calculateBookingCosts(booking);

  return (
    <div>
      <TripsNavbar />
      <div className="main-content flex flex-col container mx-auto p-8">
        <h1 className="text-2xl font-bold ml-24 mb-8">
          Permintaan untuk Reservasi
        </h1>
        <div className="flex gap-16">
          <BookingPaymentInfo
            booking={booking}
            selectedPaymentMethod={selectedPaymentMethod}
            setSelectedPaymentMethod={setSelectedPaymentMethod}
          />
          <BookingDetails
            booking={booking}
            seasonalNights={seasonalNights}
            regularNights={regularNights}
            quantity={booking.quantity || 1}
            nights={nights}
            roomCost={roomCost}
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
