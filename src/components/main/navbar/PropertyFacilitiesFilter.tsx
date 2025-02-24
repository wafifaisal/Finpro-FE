// components/PropertyFacilitiesFilter.tsx
import React from "react";
import { PROPERTY_FACILITIES } from "../../../constants/facilities";

interface PropertyFacilitiesFilterProps {
  selectedPropertyFacilities: string[];
  setSelectedPropertyFacilities: (facilities: string[]) => void;
}

const PropertyFacilitiesFilter: React.FC<PropertyFacilitiesFilterProps> = ({
  selectedPropertyFacilities,
  setSelectedPropertyFacilities,
}) => {
  const toggleFacility = (id: string) => {
    if (selectedPropertyFacilities.includes(id)) {
      setSelectedPropertyFacilities(
        selectedPropertyFacilities.filter((f) => f !== id)
      );
    } else {
      setSelectedPropertyFacilities([...selectedPropertyFacilities, id]);
    }
  };

  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-4">Fasilitas Properti</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {PROPERTY_FACILITIES.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => toggleFacility(id)}
            className={`flex items-center gap-2 p-3 rounded-lg border transition-all ${
              selectedPropertyFacilities.includes(id)
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

export default PropertyFacilitiesFilter;
