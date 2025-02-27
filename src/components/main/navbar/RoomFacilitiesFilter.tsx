// components/RoomFacilitiesFilter.tsx
import React from "react";
import { ROOM_FACILITIES } from "../../../constants/facilities";

interface RoomFacilitiesFilterProps {
  selectedRoomFacilities: string[];
  setSelectedRoomFacilities: (facilities: string[]) => void;
}

const RoomFacilitiesFilter: React.FC<RoomFacilitiesFilterProps> = ({
  selectedRoomFacilities,
  setSelectedRoomFacilities,
}) => {
  const toggleFacility = (id: string) => {
    if (selectedRoomFacilities.includes(id)) {
      setSelectedRoomFacilities(selectedRoomFacilities.filter((f) => f !== id));
    } else {
      setSelectedRoomFacilities([...selectedRoomFacilities, id]);
    }
  };

  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-4">Fasilitas Kamar</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {ROOM_FACILITIES.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => toggleFacility(id)}
            className={`flex items-center gap-2 p-3 rounded-lg border transition-all ${
              selectedRoomFacilities.includes(id)
                ? "border-gray-900 bg-gray-50"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <Icon size={18} />
            <span className="text-sm">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default RoomFacilitiesFilter;
