"use client";
import React, { useState } from "react";
import Image from "next/image";
import { Plus } from "lucide-react";
import { FaStar } from "react-icons/fa";
import { formatCurrency } from "@/helpers/formatCurrency";
import {
  getRoomFacilityIcon,
  formatFacilityName,
} from "@/helpers/facilityUtils";
import { RoomType } from "@/types/propertyTypes";

interface RoomTypesSectionProps {
  propertyId: number;
  roomTypes: RoomType[];
  handleEditRoomType: (propertyId: number, roomTypeId: number) => void;
  handleDeleteRoomType: (roomTypeId: number) => void;
  handleCreateRoomType: (propertyId: number) => void;
}
const RoomTypesSection: React.FC<RoomTypesSectionProps> = ({
  propertyId,
  roomTypes,
  handleEditRoomType,
  handleDeleteRoomType,
  handleCreateRoomType,
}) => {
  const [showRoomTypes, setShowRoomTypes] = useState(false);

  return (
    <div className="border-t pt-2">
      <div className="flex justify-between items-center">
        <h3 className="text-sm sm:text-base font-semibold text-gray-800">
          Tipe Kamar
        </h3>
        <button
          onClick={() => setShowRoomTypes(!showRoomTypes)}
          className="text-rose-600 text-xs sm:text-sm font-medium focus:outline-none"
        >
          {showRoomTypes ? "Sembunyikan" : "Lihat Tipe Kamar"}
        </button>
      </div>
      {showRoomTypes && (
        <>
          {roomTypes.length > 0 ? (
            roomTypes.map((room) => (
              <div
                key={room.id}
                className="mt-2 p-2 border rounded-lg bg-rose-50 flex flex-col sm:flex-row gap-2"
              >
                <div className="w-full sm:w-1/3 h-40 relative rounded-lg overflow-hidden">
                  <Image
                    src={
                      room.RoomImages && room.RoomImages.length > 0
                        ? room.RoomImages[0].image_url
                        : ""
                    }
                    alt={room.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <h4 className="text-sm sm:text-lg font-bold text-gray-900">
                      {room.name}
                    </h4>
                    {room.avg_rating !== undefined &&
                      room.avg_rating !== null && (
                        <div className="flex items-center text-xs sm:text-sm text-yellow-600">
                          <FaStar className="mr-1" />
                          {room.avg_rating.toFixed(1)}
                        </div>
                      )}
                  </div>
                  <p className="text-xs sm:text-sm text-gray-700 mt-1">
                    Harga: {formatCurrency(room.price)} / malam
                  </p>
                  <p className="text-xs sm:text-sm text-gray-700">
                    Kapasitas: {room.capacity} orang, Stok: {room.stock}
                  </p>
                  {room.bed_details && (
                    <p className="text-xs sm:text-sm text-gray-700">
                      Tempat Tidur: {room.bed_details}
                    </p>
                  )}
                  <p className="text-xs sm:text-sm text-gray-700">
                    Sarapan:{" "}
                    {room.has_breakfast
                      ? `Tersedia (${formatCurrency(
                          room.breakfast_price ?? 0
                        )})`
                      : "Tidak tersedia"}
                  </p>
                  {room.facilities && room.facilities.length > 0 && (
                    <div className="mt-1">
                      <span className="font-semibold text-xs sm:text-sm text-gray-700">
                        Fasilitas:
                      </span>
                      <div className="flex flex-wrap gap-1 sm:gap-2 mt-1">
                        {room.facilities.map((facility, idx) => (
                          <span
                            key={idx}
                            className="flex items-center text-xs sm:text-sm text-gray-700"
                          >
                            {getRoomFacilityIcon(facility)}
                            {formatFacilityName(facility)}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {room.seasonal_prices && room.seasonal_prices.length > 0 && (
                    <div className="mt-2">
                      <h5 className="text-xs sm:text-sm font-semibold text-gray-800">
                        Harga Musiman:
                      </h5>
                      <ul className="list-disc list-inside text-xs sm:text-sm text-gray-700">
                        {room.seasonal_prices.map((sp) => (
                          <li key={sp.id}>
                            {formatCurrency(sp.price)} dari{" "}
                            {new Date(sp.start_date).toLocaleDateString()}{" "}
                            sampai {new Date(sp.end_date).toLocaleDateString()}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {room.Unavailable && room.Unavailable.length > 0 && (
                    <div className="mt-2">
                      <h5 className="text-xs sm:text-sm font-semibold text-gray-800">
                        Periode Tidak Tersedia:
                      </h5>
                      <ul className="list-disc list-inside text-xs sm:text-sm text-gray-700">
                        {room.Unavailable.map((u) => (
                          <li key={u.id}>
                            {new Date(u.start_date).toLocaleDateString()} -{" "}
                            {new Date(u.end_date).toLocaleDateString()}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {room.Review && room.Review.length > 0 && (
                    <div className="mt-2">
                      <h5 className="text-xs sm:text-sm font-semibold text-gray-800">
                        Ulasan:
                      </h5>
                      <ul className="list-disc list-inside text-xs sm:text-sm text-gray-700">
                        {room.Review.map((rev) => (
                          <li key={rev.id}>
                            <strong>{rev.rating} / 5</strong> - {rev.review}{" "}
                            <span className="text-gray-500">
                              (
                              {rev.created_at
                                ? new Date(rev.created_at).toLocaleDateString()
                                : ""}
                              )
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <div className="flex justify-end space-x-2 mt-2">
                    <button
                      onClick={() => handleEditRoomType(propertyId, room.id)}
                      className="px-2 py-1 bg-rose-500 hover:bg-rose-600 text-white text-xs sm:text-sm rounded-lg transition-colors duration-300"
                    >
                      Ubah Tipe
                    </button>
                    <button
                      onClick={() => handleDeleteRoomType(room.id)}
                      className="px-2 py-1 bg-gray-500 hover:bg-gray-600 text-white text-xs sm:text-sm rounded-lg transition-colors duration-300"
                    >
                      Hapus Tipe
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-xs sm:text-sm text-gray-500">
              Belum ada tipe kamar.
            </p>
          )}
          <button
            onClick={() => handleCreateRoomType(propertyId)}
            className="mt-2 inline-flex items-center px-3 py-1 bg-rose-500 hover:bg-rose-600 text-white text-xs sm:text-sm font-medium rounded-lg transition-colors duration-300"
          >
            <Plus className="w-4 h-4 mr-1" />
            Tambah Tipe Kamar
          </button>
        </>
      )}
    </div>
  );
};
export default RoomTypesSection;
