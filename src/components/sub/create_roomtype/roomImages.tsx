"use client";

import React, { ChangeEvent } from "react";
import { Upload, X } from "lucide-react";
import { ErrorMessage } from "formik";
import { RoomType } from "@/types/roomTypes";
import Image from "next/image";

interface RoomImagesProps {
  room: RoomType;
  roomIndex: number;
  setFieldValue: <T>(
    field: string,
    value: T,
    shouldValidate?: boolean | undefined
  ) => void;
}

const RoomImages: React.FC<RoomImagesProps> = ({
  room,
  roomIndex,
  setFieldValue,
}) => {
  return (
    <div>
      <label className="block text-sm font-medium mb-6">Foto Kamar</label>
      <div className="grid grid-cols-4 auto-rows-[180px] gap-4">
        {room.imagePreviews && room.imagePreviews.length > 0 && (
          <div className="col-span-2 row-span-2 relative group">
            <Image
              fill
              src={room.imagePreviews[0]}
              alt="Pratinjau Utama"
              className="w-full h-full object-cover rounded-3xl"
            />
            <button
              type="button"
              onClick={() => {
                const newImages = room.images.filter((_, i) => i !== 0);
                const newPreviews = room.imagePreviews.filter(
                  (_, i) => i !== 0
                );
                setFieldValue(`rooms.${roomIndex}.images`, newImages);
                setFieldValue(`rooms.${roomIndex}.imagePreviews`, newPreviews);
              }}
              className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {room.imagePreviews &&
          room.imagePreviews.slice(1).map((preview: string, index: number) => (
            <div key={index + 1} className="relative group">
              <Image
                fill
                src={preview}
                alt={`Pratinjau ${index + 2}`}
                className="w-full h-full object-cover rounded-3xl"
              />
              <button
                type="button"
                onClick={() => {
                  const newImages = room.images.filter(
                    (_, i) => i !== index + 1
                  );
                  const newPreviews = room.imagePreviews.filter(
                    (_, i) => i !== index + 1
                  );
                  setFieldValue(`rooms.${roomIndex}.images`, newImages);
                  setFieldValue(
                    `rooms.${roomIndex}.imagePreviews`,
                    newPreviews
                  );
                }}
                className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}

        <label className="relative group border-2 border-dashed border-gray-300 rounded-3xl flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 transition-colors">
          <div className="flex flex-col items-center gap-2">
            <div className="p-4 bg-gray-50 rounded-full">
              <Upload className="w-6 h-6 text-gray-400" />
            </div>
            <span className="text-sm text-gray-500">Tambah Foto</span>
          </div>
          <input
            type="file"
            multiple
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              if (e.target.files) {
                const files = Array.from(e.target.files);
                const newPreviews = files.map((file) =>
                  URL.createObjectURL(file)
                );
                setFieldValue(`rooms.${roomIndex}.images`, [
                  ...room.images,
                  ...files,
                ]);
                setFieldValue(`rooms.${roomIndex}.imagePreviews`, [
                  ...room.imagePreviews,
                  ...newPreviews,
                ]);
              }
            }}
            accept="image/jpg, image/jpeg, image/png, image/gif"
            className="hidden"
          />
        </label>
      </div>
      <ErrorMessage
        name={`rooms.${roomIndex}.images`}
        component="div"
        className="mt-2 text-red-600 text-sm"
      />
    </div>
  );
};

export default RoomImages;
