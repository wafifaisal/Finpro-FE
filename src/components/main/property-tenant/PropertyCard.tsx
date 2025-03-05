"use client";
import React from "react";
import Image from "next/image";
import { FaMapMarkerAlt } from "react-icons/fa";
import ExpandableText from "./ExpandableText";
import {
  formatFacilityName,
  getPropertyFacilityIcon,
} from "@/helpers/facilityUtils";
import { Property } from "@/types/propertyTypes";
import RoomTypesSection from "./RoomTypesSection";

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
  return (
    <div className="w-full sm:max-w-lg md:max-w-2xl lg:max-w-3xl xl:max-w-4xl mx-auto p-4">
      {(!property.RoomTypes || property.RoomTypes.length === 0) && (
        <div className="flex items-center mb-2">
          <span className="text-red-600 text-xl font-bold mr-2">!</span>
          <span className="text-red-600 text-sm">
            Diperlukan tipe kamar untuk mulai menjual properti !
          </span>
        </div>
      )}
      <div className="flex flex-col md:flex-row bg-white rounded-xl shadow-lg overflow-hidden transition-all hover:shadow-2xl">
        <div className="w-full md:w-1/3 h-56 relative">
          <Image
            src={
              property.PropertyImages && property.PropertyImages.length > 0
                ? property.PropertyImages[0].image_url
                : "/placeholder.jpg"
            }
            fill
            loading="lazy"
            alt={property.name}
            className="object-cover"
          />
        </div>
        <div className="flex-1 py-2 px-4 sm:px-6 space-y-2">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-rose-600">
              {property.name}
            </h2>
            {property.desc && (
              <div className="mt-1">
                <span className="block text-xs sm:text-sm font-semibold text-gray-800">
                  Deskripsi:
                </span>
                <ExpandableText text={property.desc} limit={120} />
              </div>
            )}
            {property.terms_condition && (
              <div className="mt-1">
                <span className="block text-xs sm:text-sm font-semibold text-gray-800">
                  Syarat & Ketentuan:
                </span>
                <ExpandableText text={property.terms_condition} limit={120} />
              </div>
            )}
          </div>
          <div className="flex items-center text-xs sm:text-sm text-gray-600">
            <FaMapMarkerAlt className="mr-1 sm:mr-2" />
            <p>
              {property.location?.address ?? "Alamat tidak tersedia"},{" "}
              {property.location?.city ?? "Kota tidak tersedia"},{" "}
              {property.location?.country ?? "Negara tidak tersedia"}
            </p>
          </div>
          {property.facilities && property.facilities.length > 0 && (
            <div className="flex flex-wrap gap-1 sm:gap-2">
              {property.facilities.map((facility, index) => (
                <span
                  key={index}
                  className="flex items-center text-xs sm:text-sm text-gray-700"
                >
                  {getPropertyFacilityIcon(facility)}
                  {formatFacilityName(facility)}
                </span>
              ))}
            </div>
          )}
          <RoomTypesSection
            propertyId={property.id}
            roomTypes={property.RoomTypes || []}
            handleEditRoomType={handleEditRoomType}
            handleDeleteRoomType={handleDeleteRoomType}
            handleCreateRoomType={handleCreateRoomType}
          />
          {/* Tombol aksi properti */}
          <div className="flex justify-end space-x-2 pt-2">
            <button
              onClick={() => handleEdit(property.id)}
              className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white text-xs sm:text-sm font-medium rounded-lg transition-colors duration-300"
            >
              Ubah
            </button>
            <button
              onClick={() => handleDelete(property.id)}
              className="px-3 py-1 bg-rose-500 hover:bg-rose-600 text-white text-xs sm:text-sm font-medium rounded-lg transition-colors duration-300"
            >
              Hapus
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
