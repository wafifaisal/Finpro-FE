"use client";

import React, { useState } from "react";
import { Star, MapPin, Share2 } from "lucide-react";
import { Property, RoomType } from "@/types/types";
import ShareModal from "./ShareModal";

interface PropertyHeaderProps {
  property: Property;
  roomtypes: RoomType[];
}

const PropertyHeader: React.FC<PropertyHeaderProps> = ({
  property,
  roomtypes,
}) => {
  const fallbackOverallRating = (() => {
    const validRatings = roomtypes.filter(
      (rt) => rt.avg_rating !== undefined && rt.avg_rating !== null
    );
    return validRatings.length > 0
      ? validRatings.reduce((sum, rt) => sum + (rt.avg_rating || 0), 0) /
          validRatings.length
      : 0;
  })();

  const overallRating = property.overallRating ?? fallbackOverallRating;

  const fallbackReviewCount = roomtypes.reduce(
    (acc, rt) => acc + (rt.Review ? rt.Review.length : 0),
    0
  );
  const aggregatedReviewCount = property.totalReviews ?? fallbackReviewCount;

  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [copyStatus, setCopyStatus] = useState("");

  const domain = process.env.NEXT_PUBLIC_BASE_URL_FE;
  const shareUrl = `${domain}/property/${property.id}`;

  const shareImage =
    property.PropertyImages && property.PropertyImages.length > 0
      ? property.PropertyImages[0].image_url
      : "https://res.cloudinary.com/dkyco4yqp/image/upload/v1738528719/nginepin-logo_bzdcsu.png";

  const shareTitle = `Lihat ${property.name}`;
  const shareDescription = property.desc
    ? property.desc.substring(0, 100) + "..."
    : `Properti Eksklusif Untuk Liburanmu ${property.location.city}, ${property.location.country}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopyStatus("Copied!");
      setTimeout(() => setCopyStatus(""), 2000);
    } catch {
      setCopyStatus("Failed to copy");
    }
  };

  return (
    <div className="mb-8">
      <h1 className="text-3xl font-semibold mb-4">{property.name}</h1>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-6 text-sm">
          <div className="flex items-center">
            <Star className="w-4 h-4 text-rose-500 fill-rose-500" />
            <span className="ml-1 font-medium">{overallRating.toFixed(1)}</span>
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

        <div className="flex gap-4">
          <button
            onClick={() => setIsShareModalOpen(true)}
            className="flex items-center gap-2 hover:bg-gray-50 px-4 py-2 rounded-full border border-gray-200 transition-all duration-200 hover:shadow-sm"
          >
            <Share2 className="w-4 h-4" />
            <span>Bagikan</span>
          </button>
        </div>
      </div>

      {isShareModalOpen && (
        <ShareModal
          shareUrl={shareUrl}
          shareImage={shareImage}
          shareTitle={shareTitle}
          shareDescription={shareDescription}
          property={property}
          handleCopyLink={handleCopyLink}
          copyStatus={copyStatus}
          onClose={() => setIsShareModalOpen(false)}
        />
      )}
    </div>
  );
};

export default PropertyHeader;
