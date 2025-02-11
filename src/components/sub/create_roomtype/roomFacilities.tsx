"use client";

import React from "react";
import { RoomType } from "@/types/roomTypes";

interface RoomFacilitiesProps {
  room: RoomType;
  roomIndex: number;
  availableFacilities: { id: string; name: string }[];
  setFieldValue: <T>(field: string, value: T, shouldValidate?: boolean) => void;
}

const RoomFacilities: React.FC<RoomFacilitiesProps> = ({
  room,
  roomIndex,
  availableFacilities,
  setFieldValue,
}) => {
  return (
    <div>
      <label className="block text-sm font-medium mb-4">Fasilitas Kamar</label>
      <div className="flex flex-wrap gap-3">
        {availableFacilities.map((facility) => (
          <button
            key={facility.id}
            type="button"
            onClick={() => {
              const current: string[] = room.facilities;
              if (current.includes(facility.id)) {
                const newFacilities = current.filter(
                  (fac: string) => fac !== facility.id
                );
                setFieldValue(`rooms.${roomIndex}.facilities`, newFacilities);
              } else {
                setFieldValue(`rooms.${roomIndex}.facilities`, [
                  ...current,
                  facility.id,
                ]);
              }
            }}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              room.facilities.includes(facility.id)
                ? "bg-black text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {facility.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default RoomFacilities;
