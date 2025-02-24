// components/PropertyNameFilter.tsx
import React, { useState, useEffect } from "react";

interface PropertyNameFilterProps {
  propertyName: string;
  setPropertyName: (name: string) => void;
}

const PropertyNameFilter: React.FC<PropertyNameFilterProps> = ({
  propertyName,
  setPropertyName,
}) => {
  const [suggestions, setSuggestions] = useState<string[]>([]);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (propertyName.trim() !== "") {
        fetch(
          `${
            process.env.NEXT_PUBLIC_BASE_URL_BE
          }/property/suggestions?name=${encodeURIComponent(propertyName)}`
        )
          .then((res) => res.json())
          .then((data) => {
            setSuggestions(data.suggestions || []);
          })
          .catch((err) => {
            console.error("Error mengambil saran:", err);
            setSuggestions([]);
          });
      } else {
        setSuggestions([]);
      }
    }, 500);
    return () => clearTimeout(handler);
  }, [propertyName]);

  return (
    <div className="mb-6 mx-10">
      <h3 className="text-lg font-semibold mb-4">Nama Properti</h3>
      <input
        type="text"
        placeholder="Masukkan nama properti"
        className="w-full border rounded p-2"
        value={propertyName}
        onChange={(e) => setPropertyName(e.target.value)}
      />
      {suggestions.length > 0 && (
        <ul className="border rounded mt-2 bg-white max-h-40 overflow-y-auto">
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              className="p-2 cursor-pointer hover:bg-gray-100"
              onClick={() => {
                setPropertyName(suggestion);
                setSuggestions([]);
              }}
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PropertyNameFilter;
