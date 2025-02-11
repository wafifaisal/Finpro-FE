import React from "react";
import { Minus, Plus, Check, Users, AlertCircle } from "lucide-react";
import { RoomType, RoomSelection } from "@/types/types";
import { formatCurrency } from "@/helpers/formatCurrency";

interface RoomSelectionButtonProps {
  room: RoomType;
  selection?: RoomSelection;
  onToggleBreakfast: (roomTypeId: number) => void;
  onRoomQuantityChange: (roomTypeId: number, change: number) => void;
  guests: number;
}

const RoomSelectionButton: React.FC<RoomSelectionButtonProps> = ({
  room,
  selection,
  onToggleBreakfast,
  onRoomQuantityChange,
  guests,
}) => {
  const quantity = selection?.quantity || 0;
  const isSelected = quantity > 0;

  return (
    <div className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow duration-200">
      <div className="flex flex-col gap-4">
        {/* Bagian Harga */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xl font-semibold">
              {formatCurrency(room.price)}
            </span>
            <span className="text-gray-500 text-sm">per malam</span>
          </div>

          {/* Kontrol Pemilihan Kamar */}
          <div className="flex items-center">
            {quantity > 0 ? (
              <div className="flex items-center gap-3 border border-gray-300 px-4 py-2 rounded-full">
                <button
                  onClick={() => onRoomQuantityChange(room.id, -1)}
                  className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors"
                >
                  <Minus className="w-4 h-4 text-gray-600" />
                </button>
                <span className="font-medium min-w-[1.5rem] text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => onRoomQuantityChange(room.id, 1)}
                  className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors"
                >
                  <Plus className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => onRoomQuantityChange(room.id, 1)}
                className="bg-rose-600 hover:bg-rose-700 text-white px-6 py-3 rounded-lg transition-colors duration-200 font-medium"
              >
                Tambah kamar
              </button>
            )}
          </div>
        </div>

        {/* Detail Kamar */}
        <div className="flex items-center gap-2 text-gray-600">
          <Users className="w-4 h-4" />
          <span className="text-sm">
            Maksimal {room.capacity} tamu per kamar
          </span>
        </div>

        {/* Pesan Peringatan */}
        {isSelected && room.capacity * quantity < guests && (
          <div className="flex items-center gap-2 text-rose-600 bg-rose-50 p-3 rounded-lg">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span className="text-sm">
              Diperlukan kamar tambahan untuk {guests} tamu
            </span>
          </div>
        )}

        {/* Opsi Sarapan */}
        {isSelected && room.has_breakfast && (
          <div className="pt-4 border-t border-gray-200 mt-2">
            <label className="flex items-center gap-3 cursor-pointer group">
              <div className="relative">
                <input
                  type="checkbox"
                  id={`breakfast-${room.id}`}
                  checked={selection?.addBreakfast || false}
                  onChange={() => onToggleBreakfast(room.id)}
                  className="peer sr-only"
                />
                <div className="w-5 h-5 border-2 border-gray-300 rounded peer-checked:border-rose-500 peer-checked:bg-rose-500 transition-colors">
                  {selection?.addBreakfast && (
                    <Check className="w-4 h-4 text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                  )}
                </div>
              </div>
              <div className="flex-1">
                <p className="font-medium">Tambah sarapan</p>
                <p className="text-sm text-gray-500">
                  {formatCurrency(room.breakfast_price)} per malam
                </p>
              </div>
            </label>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoomSelectionButton;
