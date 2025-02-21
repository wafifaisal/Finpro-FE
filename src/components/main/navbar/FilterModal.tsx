"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Wifi,
  Tv,
  Wind,
  Wine,
  Shirt,
  FireExtinguisher,
  Microwave,
  Refrigerator,
  Briefcase,
  ChefHat,
  Flame,
  Fan,
  Lock,
  Rss,
  Coffee,
  Trees,
  Bath,
  Droplets,
  Building,
  Mountain,
  Umbrella,
  Cat,
  UtensilsCrossed,
  VideoIcon,
  Car,
  Dumbbell,
  Baby,
  MapPin,
  PiggyBank,
  Diamond,
} from "lucide-react";

// Fungsi untuk memformat harga ke dalam format rupiah
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

// Contoh data fasilitas kamar
const ROOM_FACILITIES = [
  { id: "WIFI", icon: Wifi, label: "WiFi" },
  { id: "TV", icon: Tv, label: "TV" },
  { id: "AC", icon: Wind, label: "AC" },
  { id: "ROOM_SERVICES", icon: Wifi, label: "Layanan Kamar" },
  { id: "MINI_BAR", icon: Wine, label: "Mini Bar" },
  { id: "LAUNDRY", icon: Shirt, label: "Laundry" },
  { id: "SETRIKA", icon: Wifi, label: "Setrika" },
  {
    id: "ALAT_PEMADAM_API",
    icon: FireExtinguisher,
    label: "Alat Pemadam Api",
  },
  { id: "MICROWAVE", icon: Microwave, label: "Microwave" },
  { id: "KULKAS", icon: Refrigerator, label: "Kulkas" },
  { id: "RUANG_KERJA_KHUSUS", icon: Briefcase, label: "Ruang Kerja" },
  { id: "KITCHEN", icon: ChefHat, label: "Dapur" },
  { id: "HEATING", icon: Flame, label: "Pemanas" },
  { id: "AIR_PURIFIER", icon: Fan, label: "Penyaring Udara" },
  { id: "SAFE", icon: Lock, label: "Brankas" },
  { id: "BATHROBES", icon: Rss, label: "Jubah Mandi" },
  { id: "TEA_COFFEE_MAKER", icon: Coffee, label: "Pembuat Teh/Kopi" },
  { id: "BALCONY", icon: Trees, label: "Balkon" },
  { id: "BATHTUB", icon: Bath, label: "Bak Mandi" },
  { id: "JACUZZI", icon: Droplets, label: "Jacuzzi" },
  { id: "PRIVATE_POOL", icon: Wifi, label: "Kolam Renang Pribadi" },
];

// Contoh data fasilitas properti
const PROPERTY_FACILITIES = [
  { id: "PEMANDANGAN_KOTA", icon: Building, label: "Pemandangan Kota" },
  { id: "PEMANDANGAN_ALAM", icon: Mountain, label: "Pemandangan Alam" },
  { id: "AKSES_PANTAI", icon: Umbrella, label: "Akses Pantai" },
  { id: "TAMAN", icon: Wifi, label: "Taman" },
  { id: "RAMAH_HEWAN_PELIHARAAN", icon: Cat, label: "Ramah Hewan" },
  { id: "RESTAURANT", icon: UtensilsCrossed, label: "Restoran" },
  { id: "BAR", icon: Wifi, label: "Bar" },
  { id: "CONFERENCE_ROOM", icon: VideoIcon, label: "Ruang Konferensi" },
  { id: "PARKIR_GRATIS", icon: Car, label: "Parkir Gratis" },
  { id: "KOLAM_RENANG", icon: Wifi, label: "Kolam Renang" },
  { id: "GYM", icon: Dumbbell, label: "Gym" },
  { id: "SPA", icon: Wifi, label: "Spa" },
  { id: "TAMAN_BERMAIN", icon: Baby, label: "Area Bermain" },
  { id: "DEKAT_WISATA", icon: MapPin, label: "Dekat Wisata" },
  { id: "BUDGET", icon: PiggyBank, label: "Hemat Budget" },
  { id: "MEWAH", icon: Diamond, label: "Mewah" },
];

const base_url = process.env.NEXT_PUBLIC_BASE_URL_BE;

interface FetchedProperty {
  RoomTypes?: Array<{
    price: number;
  }>;
}

// Fungsi untuk mengambil rentang harga dari backend
const fetchPriceRange = async () => {
  try {
    const res = await fetch(`${base_url}/property`);
    if (!res.ok) {
      throw new Error("Gagal mengambil properti");
    }
    const data = await res.json();
    let minPrice = Infinity;
    let maxPrice = -Infinity;
    (data.result as FetchedProperty[]).forEach((property) => {
      if (property.RoomTypes && Array.isArray(property.RoomTypes)) {
        property.RoomTypes.forEach((room) => {
          if (room.price < minPrice) minPrice = room.price;
          if (room.price > maxPrice) maxPrice = room.price;
        });
      }
    });
    return {
      minPrice: minPrice === Infinity ? 0 : minPrice,
      maxPrice: maxPrice === -Infinity ? 1000 : maxPrice,
    };
  } catch (error) {
    console.error("Error mengambil properti:", error);
    return { minPrice: 0, maxPrice: 1000 };
  }
};

interface FilterModalProps {
  onClose: () => void;
  onApply?: (data: {
    totalPages: number;
    currentPage: number;
    limit: number;
    result: unknown[]; // Replace any[] with unknown[]
    minPrice?: number;
    maxPrice?: number;
  }) => void;
  initialFilters?: {
    minPrice?: number;
    maxPrice?: number;
    roomFacilities?: string[];
    propertyFacilities?: string[];
    propertyName?: string;
  };
}

const PriceRangeSlider = ({
  min,
  max,
  value,
  onChange,
}: {
  min: number;
  max: number;
  value: [number, number];
  onChange: (value: [number, number]) => void;
}) => {
  const getPercentage = (val: number) => ((val - min) / (max - min)) * 100;

  const handleSliderChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    index: 0 | 1
  ) => {
    const newValue = Number(event.target.value);
    const newRange = [...value] as [number, number];
    newRange[index] = newValue;
    if (index === 0 && newValue <= value[1]) {
      onChange([newValue, value[1]]);
    } else if (index === 1 && newValue >= value[0]) {
      onChange([value[0], newValue]);
    }
  };

  return (
    <div className="relative pt-10 pb-8">
      <div className="relative h-2 bg-gray-300 rounded">
        <div
          className="absolute h-full bg-[#FF5A5F] rounded"
          style={{
            left: `${getPercentage(value[0])}%`,
            right: `${100 - getPercentage(value[1])}%`,
          }}
        />
      </div>

      <div
        className="absolute"
        style={{
          left: `${getPercentage(value[0])}%`,
          transform: "translateX(-50%)",
          bottom: "calc(100% + 10px)",
        }}
      >
        <span className="bg-white text-xs px-2 py-1 rounded shadow">
          {formatCurrency(value[0])}
        </span>
      </div>

      <div
        className="absolute"
        style={{
          left: `${getPercentage(value[1])}%`,
          transform: "translateX(-50%)",
          bottom: "calc(100% + 10px)",
        }}
      >
        <span className="bg-white text-xs px-2 py-1 rounded shadow">
          {formatCurrency(value[1])}
        </span>
      </div>

      <input
        type="range"
        min={min}
        max={max}
        value={value[0]}
        onChange={(e) => handleSliderChange(e, 0)}
        className="absolute w-full h-2 -top-1 z-50 cursor-pointer appearance-none bg-transparent"
      />
      <input
        type="range"
        min={min}
        max={max}
        value={value[1]}
        onChange={(e) => handleSliderChange(e, 1)}
        className="absolute w-full h-2 -top-1 z-50 cursor-pointer appearance-none bg-transparent"
      />
    </div>
  );
};

const FilterModal: React.FC<FilterModalProps> = ({
  onClose,
  initialFilters,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Inisialisasi nama properti dari query (jika ada)
  const initialPropertyName = searchParams.get("propertyName") || "";
  const [propertyName, setPropertyName] = useState<string>(initialPropertyName);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const [sliderValue, setSliderValue] = useState<[number, number]>([0, 0]);
  const [inputMin, setInputMin] = useState<string>("");
  const [inputMax, setInputMax] = useState<string>("");

  const [dbPriceRange, setDbPriceRange] = useState<{
    min: number;
    max: number;
  }>({
    min: 0,
    max: 1000,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRoomFacilities, setSelectedRoomFacilities] = useState<
    string[]
  >(initialFilters?.roomFacilities || []);
  const [selectedPropertyFacilities, setSelectedPropertyFacilities] = useState<
    string[]
  >(initialFilters?.propertyFacilities || []);

  // Opsi penyortiran
  const [sortBy, setSortBy] = useState<string>("name");
  const [sortOrder, setSortOrder] = useState<string>("asc");

  useEffect(() => {
    const handler = setTimeout(() => {
      if (propertyName.trim() !== "") {
        fetch(
          `${base_url}/property/suggestions?name=${encodeURIComponent(
            propertyName
          )}`
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

  // Muat rentang harga dari backend
  useEffect(() => {
    const loadPriceRange = async () => {
      try {
        const data = await fetchPriceRange();
        setDbPriceRange({ min: data.minPrice, max: data.maxPrice });
        const defaultMin =
          initialFilters?.minPrice !== undefined
            ? initialFilters.minPrice
            : data.minPrice;
        const defaultMax =
          initialFilters?.maxPrice !== undefined
            ? initialFilters.maxPrice
            : data.maxPrice;
        setSliderValue([defaultMin, defaultMax]);
        setInputMin(String(defaultMin));
        setInputMax(String(defaultMax));
      } catch (error) {
        console.error("Gagal memuat rentang harga:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadPriceRange();
  }, [initialFilters]);

  const handleSliderChange = (newValue: [number, number]) => {
    setSliderValue(newValue);
    setInputMin(newValue[0].toString());
    setInputMax(newValue[1].toString());
  };

  const handleApply = () => {
    const queryParams = new URLSearchParams(searchParams.toString());

    // Tambahkan nama properti ke query
    if (propertyName.trim() !== "") {
      queryParams.set("propertyName", propertyName.trim());
    } else {
      queryParams.delete("propertyName");
    }

    if (inputMin !== "") {
      queryParams.set("minPrice", inputMin);
    } else {
      queryParams.delete("minPrice");
    }
    if (inputMax !== "") {
      queryParams.set("maxPrice", inputMax);
    } else {
      queryParams.delete("maxPrice");
    }
    if (selectedRoomFacilities.length > 0) {
      queryParams.set("roomFacilities", selectedRoomFacilities.join(","));
    } else {
      queryParams.delete("roomFacilities");
    }
    if (selectedPropertyFacilities.length > 0) {
      queryParams.set(
        "propertyFacilities",
        selectedPropertyFacilities.join(",")
      );
    } else {
      queryParams.delete("propertyFacilities");
    }
    queryParams.set("limit", "8");
    queryParams.set("page", "1");
    queryParams.set("sortBy", sortBy);
    queryParams.set("sortOrder", sortOrder);
    router.push(`/property/search-result?${queryParams.toString()}`);
    onClose();
  };

  const handleClear = () => {
    setSliderValue([dbPriceRange.min, dbPriceRange.max]);
    setInputMin("");
    setInputMax("");
    setSelectedRoomFacilities([]);
    setSelectedPropertyFacilities([]);
    setSortBy("name");
    setSortOrder("asc");
    setPropertyName("");
    setSuggestions([]);
  };

  if (isLoading) {
    return (
      <div className="absolute inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 h-screen -top-[87px]">
        <div className="bg-white rounded-xl p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 h-screen -top-[87px]">
      <div className="bg-white rounded-xl shadow-xl w-11/12 max-w-2xl max-h-[60vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b flex items-center justify-between">
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-900"
          >
            ✕
          </button>
          <h2 className="text-lg font-semibold">Filter</h2>
          <div className="w-6" />
        </div>

        <div className="overflow-y-auto px-6 py-4 max-h-[calc(50vh-120px)]">
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

          {/* Rentang Harga */}
          <div className="mb-6 mx-10">
            <h3 className="text-lg font-semibold mb-10">Rentang Harga</h3>
            <PriceRangeSlider
              min={dbPriceRange.min}
              max={dbPriceRange.max}
              value={sliderValue}
              onChange={handleSliderChange}
            />
          </div>

          {/* Fasilitas Kamar */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4">Fasilitas Kamar</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {ROOM_FACILITIES.map(({ id, icon: Icon, label }) => (
                <button
                  key={id}
                  onClick={() =>
                    setSelectedRoomFacilities((prev) =>
                      prev.includes(id)
                        ? prev.filter((f) => f !== id)
                        : [...prev, id]
                    )
                  }
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

          {/* Fasilitas Properti */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4">Fasilitas Properti</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {PROPERTY_FACILITIES.map(({ id, icon: Icon, label }) => (
                <button
                  key={id}
                  onClick={() =>
                    setSelectedPropertyFacilities((prev) =>
                      prev.includes(id)
                        ? prev.filter((f) => f !== id)
                        : [...prev, id]
                    )
                  }
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

          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4">Opsi Penyortiran</h3>
            <div className="flex flex-col gap-4">
              <div>
                <label className="block mb-1 text-sm font-medium">
                  Urut Berdasarkan
                </label>
                <select
                  className="border rounded p-2 w-full"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="name">Nama</option>
                  <option value="price">Harga</option>
                </select>
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium">Urutan</label>
                <select
                  className="border rounded p-2 w-full"
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                >
                  <option value="asc">Naik</option>
                  <option value="desc">Turun</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t flex items-center justify-between bg-white">
          <button
            onClick={handleClear}
            className="text-sm font-semibold underline hover:text-gray-700"
          >
            Bersihkan Semua
          </button>
          <button
            onClick={handleApply}
            className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            Tampilkan Hasil
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterModal;
