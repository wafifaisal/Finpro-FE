"use client";

import { Field, ErrorMessage } from "formik";
import { Trash2 } from "lucide-react";
import { formatCurrency } from "@/helpers/formatCurrency";
import RoomImages from "./roomImages";
import RoomFacilities from "./roomFacilities";
import { RoomType } from "@/types/roomTypes";

const parseCurrency = (value: string): number => {
  return parseInt(value.replace(/[^\d]/g, "")) || 0;
};

interface RoomCardProps {
  room: RoomType;
  roomIndex: number;
  availableFacilities: { id: string; name: string }[];
  setFieldValue: <T>(field: string, value: T, shouldValidate?: boolean) => void;
  remove: (index: number) => void;
}

const RoomCard: React.FC<RoomCardProps> = ({
  room,
  roomIndex,
  availableFacilities,
  setFieldValue,
  remove,
}) => {
  return (
    <div className="border rounded-3xl p-4 md:p-8 space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Tipe Kamar {roomIndex + 1}</h2>
        {roomIndex > 0 && (
          <button
            type="button"
            onClick={() => remove(roomIndex)}
            className="p-2 text-red-500 hover:text-red-700"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-8">
          <div>
            <label className="block text-sm font-medium mb-2">Nama Kamar</label>
            <Field
              name={`rooms.${roomIndex}.name`}
              placeholder="misal: Deluxe dengan Pemandangan Laut"
              className="w-full px-4 py-3 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-black transition"
            />
            <ErrorMessage
              name={`rooms.${roomIndex}.name`}
              component="div"
              className="text-red-500 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Jumlah Kamar Tersedia
            </label>
            <Field
              name={`rooms.${roomIndex}.stock`}
              type="number"
              placeholder="Jumlah kamar"
              className="w-full px-4 py-3 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-black transition"
            />
            <ErrorMessage
              name={`rooms.${roomIndex}.stock`}
              component="div"
              className="text-red-500 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Harga per Malam
            </label>
            <input
              type="text"
              name={`rooms.${roomIndex}.price`}
              value={formatCurrency(room.price)}
              onChange={(e) => {
                const parsed = parseCurrency(e.target.value);
                setFieldValue(`rooms.${roomIndex}.price`, parsed);
              }}
              placeholder="Masukkan harga"
              className="w-full px-4 py-3 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-black transition"
            />
            <ErrorMessage
              name={`rooms.${roomIndex}.price`}
              component="div"
              className="text-red-500 text-sm"
            />
          </div>
        </div>

        <div className="space-y-8">
          <div>
            <label className="block text-sm font-medium mb-2">
              Kapasitas Tamu
            </label>
            <Field
              name={`rooms.${roomIndex}.capacity`}
              type="number"
              placeholder="Jumlah tamu maksimal"
              className="w-full px-4 py-3 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-black transition"
            />
            <ErrorMessage
              name={`rooms.${roomIndex}.capacity`}
              component="div"
              className="text-red-500 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Tata Letak Tempat Tidur
            </label>
            <Field
              as="textarea"
              name={`rooms.${roomIndex}.bed_details`}
              placeholder="misal: 1 tempat tidur King, 2 tempat tidur Twin"
              className="w-full px-4 py-3 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-black transition h-32 resize-none"
            />
            <ErrorMessage
              name={`rooms.${roomIndex}.bed_details`}
              component="div"
              className="text-red-500 text-sm"
            />
          </div>

          <div className="flex items-center gap-4 py-2">
            <label className="relative inline-flex items-center cursor-pointer">
              <Field
                type="checkbox"
                name={`rooms.${roomIndex}.has_breakfast`}
                className="sr-only peer"
              />
              <div className="w-14 h-7 bg-gray-200 peer-focus:ring-4 peer-focus:ring-gray-300 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:start-[4px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-black"></div>
            </label>
            <span className="text-sm font-medium">Termasuk Sarapan</span>
          </div>
        </div>
      </div>

      {room.has_breakfast && (
        <div className="w-full max-w-md">
          <label className="block text-sm font-medium mb-2">
            Harga Sarapan per Orang
          </label>
          <input
            type="text"
            name={`rooms.${roomIndex}.breakfast_price`}
            value={formatCurrency(room.breakfast_price)}
            onChange={(e) => {
              const parsed = parseCurrency(e.target.value);
              setFieldValue(`rooms.${roomIndex}.breakfast_price`, parsed);
            }}
            placeholder="Masukkan harga sarapan"
            className="w-full px-4 py-3 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-black transition"
          />
          <ErrorMessage
            name={`rooms.${roomIndex}.breakfast_price`}
            component="div"
            className="text-red-500 text-sm"
          />
        </div>
      )}

      <RoomFacilities
        room={room}
        roomIndex={roomIndex}
        availableFacilities={availableFacilities}
        setFieldValue={setFieldValue}
      />

      <RoomImages
        room={room}
        roomIndex={roomIndex}
        setFieldValue={setFieldValue}
      />
    </div>
  );
};

export default RoomCard;
