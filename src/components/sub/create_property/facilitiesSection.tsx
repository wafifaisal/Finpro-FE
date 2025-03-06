"use client";
import React from "react";
import { Check } from "lucide-react";
import { IconType } from "react-icons";
import {
  MdLocalParking,
  MdPool,
  MdFitnessCenter,
  MdMeetingRoom,
  MdSpa,
  MdRestaurantMenu,
  MdLocalFlorist,
  MdLocationCity,
} from "react-icons/md";
import {
  GiPalmTree,
  GiWallet,
  GiDiamondTrophy,
  GiMountainCave,
  GiCarousel,
  GiMartini,
} from "react-icons/gi";
import { FaPaw, FaChild } from "react-icons/fa";

export interface Facility {
  id: string;
  name: string;
  icon: string;
}

const iconMapping: Record<string, IconType> = {
  PEMANDANGAN_KOTA: MdLocationCity,
  PEMANDANGAN_ALAM: GiMountainCave,
  AKSES_PANTAI: GiPalmTree,
  TAMAN: MdLocalFlorist,
  RAMAH_HEWAN_PELIHARAAN: FaPaw,
  RESTAURANT: MdRestaurantMenu,
  BAR: GiMartini,
  CONFERENCE_ROOM: MdMeetingRoom,
  PARKIR_GRATIS: MdLocalParking,
  KOLAM_RENANG: MdPool,
  GYM: MdFitnessCenter,
  SPA: MdSpa,
  TAMAN_BERMAIN: FaChild,
  DEKAT_WISATA: GiCarousel,
  BUDGET: GiWallet,
  MEWAH: GiDiamondTrophy,
};

export const SAMPLE_FACILITIES: Facility[] = [
  {
    id: "PEMANDANGAN_KOTA",
    name: "Pemandangan Kota",
    icon: "PEMANDANGAN_KOTA",
  },
  {
    id: "PEMANDANGAN_ALAM",
    name: "Pemandangan Alam",
    icon: "PEMANDANGAN_ALAM",
  },
  { id: "AKSES_PANTAI", name: "Akses Pantai", icon: "AKSES_PANTAI" },
  { id: "TAMAN", name: "Taman", icon: "TAMAN" },
  {
    id: "RAMAH_HEWAN_PELIHARAAN",
    name: "Ramah Hewan Peliharaan",
    icon: "RAMAH_HEWAN_PELIHARAAN",
  },
  { id: "RESTAURANT", name: "Restoran", icon: "RESTAURANT" },
  { id: "BAR", name: "Bar", icon: "BAR" },
  { id: "CONFERENCE_ROOM", name: "Ruang Konferensi", icon: "CONFERENCE_ROOM" },
  { id: "PARKIR_GRATIS", name: "Parkir Gratis", icon: "PARKIR_GRATIS" },
  { id: "KOLAM_RENANG", name: "Kolam Renang", icon: "KOLAM_RENANG" },
  { id: "GYM", name: "Gym", icon: "GYM" },
  { id: "SPA", name: "Spa", icon: "SPA" },
  { id: "TAMAN_BERMAIN", name: "Taman Bermain", icon: "TAMAN_BERMAIN" },
  { id: "DEKAT_WISATA", name: "Dekat Wisata", icon: "DEKAT_WISATA" },
  { id: "BUDGET", name: "Budget", icon: "BUDGET" },
  { id: "MEWAH", name: "Mewah", icon: "MEWAH" },
];

interface FacilitiesSectionProps {
  facilities: string[];
  toggleFacility: (facilityId: string) => void;
  error?: string | string[];
  sampleFacilities: Facility[];
  touched?: boolean;
}

const FacilitiesSection: React.FC<FacilitiesSectionProps> = ({
  facilities,
  toggleFacility,
  error,
  sampleFacilities,
  touched,
}) => {
  const renderError = (err: string | string[]): string =>
    typeof err === "string"
      ? err
      : Array.isArray(err)
      ? err.join(", ")
      : JSON.stringify(err);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-900">
        Fasilitas Properti
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {sampleFacilities.map((facility) => {
          const IconComponent = iconMapping[facility.icon];
          return (
            <button
              key={facility.id}
              type="button"
              onClick={() => toggleFacility(facility.id)}
              className={`relative p-4 rounded-lg border-2 transition-all ${
                facilities.includes(facility.id)
                  ? "border-rose-500 bg-rose-50 text-rose-500"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="flex items-center space-x-3">
                {IconComponent ? (
                  <IconComponent size={24} className="text-2xl" />
                ) : (
                  <span className="text-2xl">{facility.icon}</span>
                )}
                <span className="font-medium">{facility.name}</span>
              </div>
              {facilities.includes(facility.id) && (
                <Check className="absolute top-2 right-2 w-4 h-4" />
              )}
            </button>
          );
        })}
      </div>
      {touched && error && (
        <div className="text-rose-500 text-sm">{renderError(error)}</div>
      )}
    </div>
  );
};

export default FacilitiesSection;
