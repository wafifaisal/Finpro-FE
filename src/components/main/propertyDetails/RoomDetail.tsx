"use client";

import React, { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { RoomType, RoomSelection } from "@/types/types";
import RoomSelectionButton from "./RoomSelectionButton";
import { formatCurrency } from "@/helpers/formatCurrency";

interface RoomDetailProps {
  room: RoomType;
  selection?: RoomSelection;
  onToggleBreakfast: (roomTypeId: number) => void;
  onRoomQuantityChange: (roomTypeId: number, change: number) => void;
  guests: number;
  selectedDate: string;
}

const RoomDetail: React.FC<RoomDetailProps> = ({
  room,
  selection,
  onToggleBreakfast,
  onRoomQuantityChange,
  guests,
  selectedDate,
}) => {
  const base_url = process.env.NEXT_PUBLIC_BASE_URL_BE;
  const [effectiveRoom, setEffectiveRoom] = useState<RoomType>(room);
  useEffect(() => {
    const fetchRoomDetail = async () => {
      try {
        const res = await fetch(`${base_url}/property/rooms/${room.id}`);
        if (!res.ok) {
          throw new Error("Failed to fetch room detail");
        }
        const data: RoomType = await res.json();
        setEffectiveRoom(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchRoomDetail();
    const interval = setInterval(fetchRoomDetail, 3000);
    return () => clearInterval(interval);
  }, [room.id, base_url]);

  const [facilitiesExpanded, setFacilitiesExpanded] = useState(false);
  const toggleFacilities = () => setFacilitiesExpanded((prev) => !prev);
  const facilities = effectiveRoom.facilities || [];
  const displayedFacilities = facilitiesExpanded
    ? facilities
    : facilities.slice(0, 5);
  const bookingDate = useMemo(() => new Date(selectedDate), [selectedDate]);

  const availableCountFromAvailability = useMemo(() => {
    if (
      effectiveRoom.RoomAvailability &&
      effectiveRoom.RoomAvailability.length > 0
    ) {
      const selectedDateStr = bookingDate.toISOString().split("T")[0];
      const record = effectiveRoom.RoomAvailability.find((ra) => {
        const raDateStr = new Date(ra.date).toISOString().split("T")[0];
        return raDateStr === selectedDateStr;
      });
      if (record) {
        return record.availableCount;
      }
    }
    return effectiveRoom.stock;
  }, [effectiveRoom, bookingDate]);

  const isDateUnavailable = useMemo(() => {
    if (effectiveRoom.Unavailable && effectiveRoom.Unavailable.length > 0) {
      const selectedDateStr = bookingDate.toISOString().split("T")[0];
      return effectiveRoom.Unavailable.some((u) => {
        const startStr = new Date(u.start_date).toISOString().split("T")[0];
        const endStr = new Date(u.end_date).toISOString().split("T")[0];
        return selectedDateStr >= startStr && selectedDateStr <= endStr;
      });
    }
    return false;
  }, [effectiveRoom, bookingDate]);

  const availableCount = isDateUnavailable ? 0 : availableCountFromAvailability;
  const roomUnavailable = availableCount <= 0;

  return (
    <div className="mb-12 pb-12 border-b last:border-b-0">
      <div className="relative w-full mb-6 group">
        {roomUnavailable && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-black bg-opacity-50">
            <p className="text-white text-xl font-bold">
              Kamar ini tidak tersedia
            </p>
          </div>
        )}
        <Swiper
          modules={[Navigation, Pagination]}
          pagination={{
            clickable: true,
            bulletClass: "custom-bullet",
            bulletActiveClass: "custom-bullet-active",
          }}
          navigation={{
            nextEl: `.custom-next-${effectiveRoom.id}`,
            prevEl: `.custom-prev-${effectiveRoom.id}`,
          }}
          className="h-80 rounded-xl overflow-hidden"
        >
          {(effectiveRoom.RoomImages || []).map((image) => (
            <SwiperSlide key={image.id} className="w-full h-full">
              <div className="relative w-full h-full">
                <Image
                  src={image.image_url}
                  alt={effectiveRoom.name}
                  fill
                  className="object-cover"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
        <button
          className={`custom-prev-${effectiveRoom.id} absolute top-1/2 left-2 z-50 bg-white/30 hover:bg-white/50 text-white p-2 rounded-full transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity`}
        >
          <ChevronLeft className="w-3 h-3" />
        </button>
        <button
          className={`custom-next-${effectiveRoom.id} absolute top-1/2 right-2 z-50 bg-white/30 hover:bg-white/50 text-white p-2 rounded-full transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity`}
        >
          <ChevronRight className="w-3 h-3" />
        </button>
      </div>
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row justify-between items-start">
          <div>
            <h3 className="text-xl font-medium">{effectiveRoom.name}</h3>
            <div className="flex flex-wrap gap-4 text-gray-600 text-sm mt-2">
              {effectiveRoom.bed_details && (
                <span>{effectiveRoom.bed_details}</span>
              )}
              <span>Jumlah Kamar Tersedia: {availableCount}</span>
              {effectiveRoom.has_breakfast && (
                <span>
                  Harga Sarapan: {formatCurrency(effectiveRoom.breakfast_price)}
                </span>
              )}
            </div>
            {(availableCount <= 0 || roomUnavailable) && (
              <p className="mt-2 text-red-500 font-semibold">
                Kamar Tidak Tersedia
              </p>
            )}
          </div>
          <RoomSelectionButton
            room={effectiveRoom}
            selection={selection}
            onToggleBreakfast={onToggleBreakfast}
            onRoomQuantityChange={onRoomQuantityChange}
            guests={guests}
            selectedDate={selectedDate}
          />
        </div>
        <div>
          <div className="flex flex-wrap gap-2">
            {displayedFacilities.map((facility, index) => (
              <span
                key={index}
                className="bg-gray-50 px-3 py-1.5 rounded-full text-sm"
              >
                {facility.replace(/_/g, " ")}
              </span>
            ))}
          </div>
          {facilities.length > 3 && (
            <button
              onClick={toggleFacilities}
              className="text-blue-500 text-sm mt-2 flex items-center"
            >
              {facilitiesExpanded
                ? "Tampilkan lebih sedikit"
                : "Lihat selengkapnya"}
              <svg
                className={`w-4 h-4 ml-1 transform transition-transform duration-200 ${
                  facilitiesExpanded ? "rotate-180" : ""
                }`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoomDetail;
