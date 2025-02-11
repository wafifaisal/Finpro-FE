import React, { useState } from "react";
import { Property } from "@/types/types";
import {
  MdLocalParking,
  MdPool,
  MdFitnessCenter,
  MdMeetingRoom,
  MdSpa,
  MdRestaurantMenu,
  MdLocalFlorist,
  MdLocationCity,
  MdChevronRight,
  MdHelpOutline,
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
import { IconType } from "react-icons";

interface PropertyDetailsProps {
  property: Property;
  showAllFacilities: boolean;
  setShowAllFacilities: (value: boolean) => void;
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

const PropertyDetails: React.FC<PropertyDetailsProps> = ({
  property,
  showAllFacilities,
  setShowAllFacilities,
}) => {
  const [descExpanded, setDescExpanded] = useState(false);
  const [termsExpanded, setTermsExpanded] = useState(false);

  const stripHtml = (html: string): string => html.replace(/<[^>]+>/g, "");
  const descText = property.desc ? stripHtml(property.desc) : "";
  const termsText = property.terms_condition
    ? stripHtml(property.terms_condition)
    : "";
  const maxChars = 300;

  const getFacilityIcon = (facilityName: string) => {
    const normalizedName = facilityName.toUpperCase().replace(/ /g, "_");
    return iconMapping[normalizedName] || MdHelpOutline;
  };

  return (
    <div className="max-w-7xl mx-auto">
      {property.desc && (
        <div className="border-b border-gray-200 py-8">
          <div className="max-w-3xl">
            <h2 className="text-2xl font-semibold mb-4">
              Tentang Properti Ini
            </h2>
            <div className="text-gray-600 leading-relaxed">
              {descExpanded ? (
                <div dangerouslySetInnerHTML={{ __html: property.desc }}></div>
              ) : (
                <p>
                  {descText.length > maxChars
                    ? `${descText.substring(0, maxChars)}...`
                    : descText}
                </p>
              )}
              {descText.length > maxChars && (
                <button
                  onClick={() => setDescExpanded(!descExpanded)}
                  className="font-semibold underline mt-4 hover:text-gray-800"
                >
                  {descExpanded ? "Sembunyikan" : "Lihat selengkapnya"}{" "}
                  <MdChevronRight className="inline w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {property.facilities && property.facilities.length > 0 && (
        <div className="border-b border-gray-200 py-8">
          <h2 className="text-2xl font-semibold mb-6">
            Fasilitas yang Tersedia
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {(showAllFacilities
              ? property.facilities
              : property.facilities.slice(0, 6)
            ).map((facility, index) => {
              const FacilityIcon = getFacilityIcon(facility);
              return (
                <div key={index} className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center">
                    <FacilityIcon className="w-5 h-5 text-rose-500 text-sm" />
                  </div>
                  <span className="text-gray-700 capitalize">
                    {facility.replace(/_/g, " ")}
                  </span>
                </div>
              );
            })}
          </div>
          {property.facilities.length > 6 && (
            <button
              onClick={() => setShowAllFacilities(!showAllFacilities)}
              className="border border-gray-900 hover:bg-gray-100 text-gray-900 px-6 py-3 rounded-lg font-medium transition-colors"
            >
              {showAllFacilities
                ? "Sembunyikan fasilitas"
                : `Tampilkan semua ${property.facilities.length} fasilitas`}
            </button>
          )}
        </div>
      )}

      {property.terms_condition && (
        <div className="py-8">
          <h2 className="text-2xl font-semibold mb-4">
            Hal yang Perlu Diketahui
          </h2>
          <div className="max-w-3xl bg-gray-50 p-6 rounded-2xl">
            <h3 className="font-medium mb-3">Aturan Rumah</h3>
            <div className="text-gray-600 leading-relaxed">
              {termsExpanded ? (
                <div
                  dangerouslySetInnerHTML={{ __html: property.terms_condition }}
                ></div>
              ) : (
                <p>
                  {termsText.length > maxChars
                    ? `${termsText.substring(0, maxChars)}...`
                    : termsText}
                </p>
              )}
              {termsText.length > maxChars && (
                <button
                  onClick={() => setTermsExpanded(!termsExpanded)}
                  className="font-semibold underline mt-4 hover:text-gray-800"
                >
                  {termsExpanded ? "Sembunyikan" : "Lihat selengkapnya"}{" "}
                  <MdChevronRight className="inline w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyDetails;
