// components/main/propertyDetails/RoomDetail.tsx
"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { RoomType, RoomSelection } from "@/types/types";
import RoomSelectionButton from "./RoomSelectionButton";
import { formatCurrency } from "@/helpers/formatCurrency";

interface RoomDetailProps {
  room: RoomType;
  selection?: RoomSelection;
  onToggleBreakfast: (roomTypeId: number) => void;
  onRoomQuantityChange: (roomTypeId: number, change: number) => void;
  guests: number;
}

const RoomDetail: React.FC<RoomDetailProps> = ({
  room,
  selection,
  onToggleBreakfast,
  onRoomQuantityChange,
  guests,
}) => {
  // State untuk mengatur apakah fasilitas sudah diexpand atau belum
  const [facilitiesExpanded, setFacilitiesExpanded] = useState(false);

  // Fungsi untuk toggle expand/collapse
  const toggleFacilities = () => setFacilitiesExpanded((prev) => !prev);

  // Tampilkan semua fasilitas jika sudah diexpand, jika tidak tampilkan maksimal 3 fasilitas
  const displayedFacilities = facilitiesExpanded
    ? room.facilities
    : room.facilities.slice(0, 5);

  return (
    <div className="mb-12 pb-12 border-b last:border-b-0">
      <Swiper
        modules={[Navigation, Pagination]}
        navigation
        pagination={{ clickable: true }}
        className="h-80 rounded-xl overflow-hidden mb-6"
      >
        {room.RoomImages.map((image) => (
          <SwiperSlide key={image.id}>
            <div className="relative w-full h-full">
              <Image
                src={image.image_url}
                alt={room.name}
                fill
                className="object-cover"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row justify-between items-start">
          <div>
            <h3 className="text-xl font-medium">{room.name}</h3>
            <div className="flex flex-wrap gap-4 text-gray-600 text-sm mt-2">
              {room.bed_details && <span>{room.bed_details}</span>}
              <span>Stok: {room.stock}</span>
              {room.has_breakfast && (
                <span>
                  Harga Sarapan: {formatCurrency(room.breakfast_price)}
                </span>
              )}
            </div>
          </div>
          <RoomSelectionButton
            room={room}
            selection={selection}
            onToggleBreakfast={onToggleBreakfast}
            onRoomQuantityChange={onRoomQuantityChange}
            guests={guests}
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
          {/* Tampilkan tombol expand jika jumlah fasilitas lebih dari 3 */}
          {room.facilities.length > 3 && (
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
