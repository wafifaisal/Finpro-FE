"use client";

import React, { useState } from "react";
import {
  Star,
  MapPin,
  Share,
  Facebook,
  Twitter,
  Linkedin,
  Copy,
  X,
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { Property, RoomType } from "@/types/types";

interface PropertyHeaderProps {
  property: Property;
  roomtypes: RoomType[];
}

const PropertyHeader: React.FC<PropertyHeaderProps> = ({
  property,
  roomtypes,
}) => {
  // Hitung rata-rata rating dari semua RoomTypes yang memiliki rating valid
  const validRatings = roomtypes.filter(
    (rt) => rt.avg_rating !== undefined && rt.avg_rating !== null
  );
  const overallRating =
    validRatings.length > 0
      ? validRatings.reduce((sum, rt) => sum + (rt.avg_rating || 0), 0) /
        validRatings.length
      : 0;

  // Hitung jumlah ulasan teragregasi
  const aggregatedReviewCount = roomtypes.reduce(
    (acc, rt) => acc + (rt.Review ? rt.Review.length : 0),
    0
  );

  // State untuk mengatur tampilan modal share
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  // Dapatkan URL properti saat ini
  const shareUrl =
    typeof window !== "undefined" ? window.location.href : "https://";

  return (
    <div className="mb-8">
      <h1 className="text-3xl font-semibold mb-4">{property.name}</h1>
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Informasi Rating dan Lokasi */}
        <div className="flex items-center gap-6 text-sm">
          <div className="flex items-center">
            <Star className="w-4 h-4 text-rose-500" />
            <span className="ml-1 font-medium">
              {overallRating ? overallRating.toFixed(1) : "0.0"}
            </span>
            <span className="mx-1">·</span>
            <span className="underline hover:text-gray-600">
              {aggregatedReviewCount} ulasan
            </span>
          </div>
          <div className="flex flex-col hover:text-gray-600">
            <div className="flex items-center">
              <MapPin className="w-4 h-4" />
              <span className="ml-1">
                {property.location.city}, {property.location.country}
              </span>
            </div>
            <p className="ml-5 text-sm text-gray-500">
              {property.location.address}
            </p>
          </div>
        </div>

        {/* Tombol Bagikan dan Like */}
        <div className="flex gap-4">
          <button
            onClick={() => setIsShareModalOpen(true)}
            className="flex items-center gap-2 hover:bg-gray-50 px-4 py-2 rounded-lg"
          >
            <Share className="w-4 h-4" />
            <span>Bagikan</span>
          </button>
        </div>
      </div>

      {/* Modal Share */}
      {isShareModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          {/* Latar belakang modal */}
          <div
            className="fixed inset-0 bg-black opacity-50"
            onClick={() => setIsShareModalOpen(false)}
          ></div>
          {/* Konten Modal */}
          <div className="bg-white p-6 rounded-lg shadow-lg relative z-10 w-11/12 max-w-md">
            <button
              onClick={() => setIsShareModalOpen(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-semibold mb-4">Bagikan Properti</h2>
            <div className="flex justify-around mb-4">
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                  shareUrl
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center"
              >
                <Facebook className="w-6 h-6 text-blue-600" />
                <span className="text-sm mt-1">Facebook</span>
              </a>
              <a
                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
                  shareUrl
                )}&text=${encodeURIComponent(property.name)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center"
              >
                <Twitter className="w-6 h-6 text-blue-400" />
                <span className="text-sm mt-1">Twitter</span>
              </a>
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
                  shareUrl
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center"
              >
                <Linkedin className="w-6 h-6 text-blue-700" />
                <span className="text-sm mt-1">LinkedIn</span>
              </a>
              <a
                href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                  property.name + " " + shareUrl
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center"
              >
                <FaWhatsapp className="w-6 h-6 text-green-500" />
                <span className="text-sm mt-1">WhatsApp</span>
              </a>
            </div>
            <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
              <input
                type="text"
                readOnly
                value={shareUrl}
                className="flex-1 px-3 py-2 text-sm"
              />
              <button
                onClick={() => navigator.clipboard.writeText(shareUrl)}
                className="px-3 py-2 bg-gray-100 hover:bg-gray-200"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyHeader;
