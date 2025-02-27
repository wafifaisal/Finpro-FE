"use client";
import { useEffect, useState } from "react";
import { FaStar, FaTicketAlt } from "react-icons/fa";
import { RiDiscountPercentFill } from "react-icons/ri";

export default function StatGrid() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [bookingCount, setBookingCount] = useState<number>(0);
  const base_url = process.env.NEXT_PUBLIC_BASE_URL_BE;

  useEffect(() => {
    const fetchBookingCount = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No authentication token found");
          return;
        }
        const response = await fetch(
          `${base_url}/user-bookings/count-booking`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setBookingCount(data.totalBooking);
      } catch (error) {
        console.error("Error fetching booking count:", error);
      }
    };

    fetchBookingCount();
  }, [base_url]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
      {[
        {
          icon: FaTicketAlt,
          label: "Your Tickets",
          value: bookingCount.toString(),
        },
        { icon: FaStar, label: "Reviews", value: "0" },
        {
          icon: RiDiscountPercentFill,
          label: "Active Discounts",
          value: "0",
        },
      ].map((stat, index) => (
        <div
          key={index}
          className={`bg-white border border-gray-100 rounded-xl p-6 shadow-sm transition-all duration-500 cursor-pointer ${
            hoveredCard === index
              ? "transform -translate-y-2 shadow-xl bg-rose-50"
              : "hover:shadow-md"
          }`}
          onMouseEnter={() => setHoveredCard(index)}
          onMouseLeave={() => setHoveredCard(null)}
        >
          <div className="flex items-center gap-4">
            <div
              className={`p-3 rounded-full transition-all duration-300 ${
                hoveredCard === index ? "bg-rose-200" : "bg-rose-100"
              }`}
            >
              <stat.icon
                className={`text-xl transition-all duration-300 ${
                  hoveredCard === index ? "text-rose-600" : "text-rose-500"
                }`}
              />
            </div>
            <div>
              <p className="text-gray-500 text-sm">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
