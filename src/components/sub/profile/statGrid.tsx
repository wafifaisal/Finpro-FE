"use client";
import { useSession } from "@/context/useSessionHook";
import { useEffect, useState } from "react";
import { FaStar, FaTicketAlt } from "react-icons/fa";
import { RiMoneyDollarBoxFill } from "react-icons/ri";

export default function StatGrid() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [bookingCount, setBookingCount] = useState<number>(0);
  const [reviewCount, setReviewCount] = useState<number>(0);
  const [expenditure, setExpenditure] = useState<number>(0);
  const [isSmallScreen, setIsSmallScreen] = useState<boolean>(false);
  const base_url = process.env.NEXT_PUBLIC_BASE_URL_BE;
  const { user } = useSession();
  const userId = user?.id;

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 640);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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

    const fetchExpenditure = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No authentication token found");
          return;
        }
        const response = await fetch(
          `${base_url}/user-bookings/total-expenditure`,
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
        setExpenditure(data.totalExpenditure);
      } catch (error) {
        console.error("Error fetching expenditure:", error);
      }
    };

    const fetchReviewCount = async () => {
      try {
        if (!userId) {
          console.error("No user id found");
          return;
        }
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No authentication token found");
          return;
        }
        const response = await fetch(`${base_url}/reviews/count/${userId}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setReviewCount(data.totalReview);
      } catch (error) {
        console.error("Error fetching review count:", error);
      }
    };

    fetchBookingCount();
    fetchExpenditure();
    fetchReviewCount();
  }, [base_url, userId]);

  const formatExpenditure = (value: number) => {
    if (isSmallScreen) {
      const abbreviated = value / 1000;
      return `Rp${abbreviated.toFixed(1)}K`;
    }
    return value.toLocaleString("id-ID", {
      style: "currency",
      currency: "IDR",
    });
  };

  const stats = [
    {
      icon: FaTicketAlt,
      label: "Jumlah Booking",
      value: bookingCount.toString(),
    },
    {
      icon: FaStar,
      label: "Jumlah Review",
      value: reviewCount.toString(),
    },
    {
      icon: RiMoneyDollarBoxFill,
      label: "Total Pengeluaran Anda",
      value: formatExpenditure(expenditure),
    },
  ];

  return (
    <div className="px-0 md:px-4 mt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {stats.map((stat, index) => (
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
