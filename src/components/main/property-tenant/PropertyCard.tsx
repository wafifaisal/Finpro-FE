// components/PropertyCard.tsx
"use client";

import React from "react";
import Image from "next/image";
import { Plus } from "lucide-react";
import { FaLocationDot, FaStar } from "react-icons/fa6";
import { formatCurrency } from "@/helpers/formatCurrency";
import { Property } from "@/types/propertyTypes";

interface PropertyCardProps {
  property: Property;
  handleEdit: (propertyId: number) => void;
  handleDelete: (propertyId: number) => void;
  handleEditRoomType: (propertyId: number, roomTypeId: number) => void;
  handleDeleteRoomType: (roomTypeId: number) => void;
  handleCreateRoomType: (propertyId: number) => void;
}

const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  handleEdit,
  handleDelete,
  handleEditRoomType,
  handleDeleteRoomType,
  handleCreateRoomType,
}) => {
  const roomTypes = property.RoomTypes || [];

  return (
    <div className="container max-w-full flex flex-col md:flex-row bg-white rounded-md shadow-md overflow-hidden transition-all hover:shadow-lg">
      {/* Gambar Properti */}
      <div className="w-full md:w-1/3 h-48">
        <Image
          src={
            property.PropertyImages && property.PropertyImages.length > 0
              ? property.PropertyImages[0].image_url
              : "/placeholder.jpg"
          }
          width={400}
          height={400}
          alt={property.name}
          className="w-full h-full object-cover rounded-lg"
        />
      </div>
      {/* Detail Properti */}
      <div className="flex-1 p-4 space-y-2">
        <div>
          <h2 className="text-lg font-bold text-rose-600">{property.name}</h2>
          {property.desc && (
            <>
              <span className="text-xs font-semibold text-gray-700">
                Deskripsi :{" "}
              </span>
              <p
                dangerouslySetInnerHTML={{ __html: property.desc }}
                className="text-xs text-gray-700"
              />
            </>
          )}
          {property.terms_condition && (
            <>
              <span className="text-xs font-semibold text-gray-700">
                Syarat & Ketentuan :{" "}
              </span>
              <p
                dangerouslySetInnerHTML={{ __html: property.terms_condition }}
                className="text-xs text-gray-700"
              />
            </>
          )}
        </div>
        <div className="flex items-center text-xs text-gray-600">
          <FaLocationDot className="mr-1" />
          <p>
            {property.location?.address ?? "Alamat tidak tersedia"},{" "}
            {property.location?.city ?? "Kota tidak tersedia"},{" "}
            {property.location?.country ?? "Negara tidak tersedia"}
          </p>
        </div>
        {property.facilities && property.facilities.length > 0 && (
          <p className="text-xs text-gray-700">
            <span className="font-semibold">Fasilitas:</span>{" "}
            {property.facilities.join(", ")}
          </p>
        )}
        {/* Tipe Kamar */}
        <div className="border-t pt-2">
          <h3 className="text-sm font-semibold text-gray-800">Tipe Kamar</h3>
          {roomTypes.length > 0 ? (
            roomTypes.map((room) => (
              <div key={room.id} className="mt-2 p-2 border rounded">
                <div className="flex justify-between items-center">
                  <h4 className="text-sm font-bold">{room.name}</h4>
                  {room.avg_rating !== undefined &&
                    room.avg_rating !== null && (
                      <div className="flex items-center text-xs text-yellow-600">
                        <FaStar className="mr-1" />
                        {room.avg_rating.toFixed(1)}
                      </div>
                    )}
                </div>
                <p className="text-xs text-gray-700">
                  Harga: {formatCurrency(room.price)} / malam
                </p>
                <p className="text-xs text-gray-700">
                  Kapasitas: {room.capacity} orang, Stok: {room.stock}
                </p>
                {room.bed_details && (
                  <p className="text-xs text-gray-700">
                    Tempat Tidur: {room.bed_details}
                  </p>
                )}
                <p className="text-xs text-gray-700">
                  Sarapan:{" "}
                  {room.has_breakfast
                    ? `Tersedia (${formatCurrency(room.breakfast_price)})`
                    : "Tidak tersedia"}
                </p>
                {room.facilities && room.facilities.length > 0 && (
                  <p className="text-xs text-gray-700">
                    Fasilitas: {room.facilities.join(", ")}
                  </p>
                )}
                {room.seasonal_prices && room.seasonal_prices.length > 0 && (
                  <div className="mt-1">
                    <h5 className="text-xs font-semibold text-gray-800">
                      Harga Musiman:
                    </h5>
                    <ul className="list-disc list-inside text-xs text-gray-700">
                      {room.seasonal_prices.map((sp) => (
                        <li key={sp.id}>
                          {formatCurrency(sp.price)} dari{" "}
                          {new Date(sp.start_date).toLocaleDateString()} sampai{" "}
                          {new Date(sp.end_date).toLocaleDateString()}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {room.Unavailable && room.Unavailable.length > 0 && (
                  <div className="mt-1">
                    <h5 className="text-xs font-semibold text-gray-800">
                      Periode Tidak Tersedia:
                    </h5>
                    <ul className="list-disc list-inside text-xs text-gray-700">
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
                  <div className="mt-1">
                    <h5 className="text-xs font-semibold text-gray-800">
                      Ulasan:
                    </h5>
                    <ul className="list-disc list-inside text-xs text-gray-700">
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
                <div className="flex justify-end space-x-2 pt-1">
                  <button
                    onClick={() => handleEditRoomType(property.id, room.id)}
                    className="px-2 py-1 bg-green-500 hover:bg-green-600 text-white text-xs rounded transition-colors duration-300"
                  >
                    Ubah Tipe
                  </button>
                  <button
                    onClick={() => handleDeleteRoomType(room.id)}
                    className="px-2 py-1 bg-red-500 hover:bg-red-600 text-white text-xs rounded transition-colors duration-300"
                  >
                    Hapus Tipe
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-xs text-gray-500 mt-1">Belum ada tipe kamar.</p>
          )}
          <button
            onClick={() => handleCreateRoomType(property.id)}
            className="mt-2 inline-flex items-center px-3 py-1 bg-green-500 hover:bg-green-600 text-white text-xs font-medium rounded-md transition-colors duration-300"
          >
            <Plus className="w-4 h-4 mr-1" />
            Tambah Tipe Kamar
          </button>
        </div>
        {/* Tombol aksi untuk properti */}
        <div className="flex justify-end space-x-2 pt-2">
          <button
            onClick={() => handleEdit(property.id)}
            className="px-2 py-1 bg-blue-500 hover:bg-blue-600 text-white text-xs rounded transition-colors duration-300"
          >
            Ubah
          </button>
          <button
            onClick={() => handleDelete(property.id)}
            className="px-2 py-1 bg-rose-500 hover:bg-rose-600 text-white text-xs rounded transition-colors duration-300"
          >
            Hapus
          </button>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
