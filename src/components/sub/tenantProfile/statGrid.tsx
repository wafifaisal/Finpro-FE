"use client";
import { useState, useEffect } from "react";
import { FaHome, FaStar } from "react-icons/fa";
import { FaMoneyBill } from "react-icons/fa6";

export default function StatGrid() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [propertyCount, setPropertyCount] = useState<number>(0);
  const [salesProfit, setSalesProfit] = useState<number>(0);
  const [reviewCount, setReviewCount] = useState<number>(0);
  const [isSmallScreen, setIsSmallScreen] = useState<boolean>(false);
  const base_url = process.env.NEXT_PUBLIC_BASE_URL_BE;

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 640);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchPropertyCount = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No authentication token found");
          return;
        }
        const response = await fetch(`${base_url}/tenant/properties`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setPropertyCount(data.totalProperties);
      } catch (error) {
        console.error("Error fetching property count:", error);
      }
    };

    const fetchSalesProfit = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No authentication token found");
          return;
        }
        const response = await fetch(
          `${base_url}/tenant-bookings/total-expenditure`,
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
        setSalesProfit(data.totalExpenditure);
      } catch (error) {
        console.error("Error fetching sales profit:", error);
      }
    };

    const fetchReviewCount = async () => {
      try {
        const tenantId = localStorage.getItem("tenantId");
        if (!tenantId) {
          console.error("No tenant id found");
          return;
        }
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No authentication token found");
          return;
        }
        const response = await fetch(`${base_url}/review-reply/count-reviews`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setReviewCount(data.length);
      } catch (error) {
        console.error("Error fetching review count:", error);
      }
    };

    fetchPropertyCount();
    fetchSalesProfit();
    fetchReviewCount();
  }, [base_url]);

  const formatSalesProfit = (profit: number): string => {
    if (isSmallScreen) {
      const abbreviated = profit / 1000;
      return `Rp${abbreviated.toFixed(1)}K`;
    }
    return profit.toLocaleString("id-ID", {
      style: "currency",
      currency: "IDR",
    });
  };

  const stats = [
    { icon: FaHome, label: "Properti Saya", value: propertyCount.toString() },
    {
      icon: FaMoneyBill,
      label: "Keuntungan Penjualan",
      value: formatSalesProfit(salesProfit),
    },
    {
      icon: FaStar,
      label: "Review dan Rating",
      value: reviewCount.toString(),
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
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
