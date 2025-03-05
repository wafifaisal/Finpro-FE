"use client";

import React, { useMemo } from "react";
import Image from "next/image";
import { Property } from "@/types/types";

interface PhotoGridProps {
  property: Property;
  setShowAllPhotos: (value: boolean) => void;
}

const PhotoGrid: React.FC<PhotoGridProps> = ({
  property,
  setShowAllPhotos,
}) => {
  const firstImage = useMemo(
    () => property.PropertyImages[0],
    [property.PropertyImages]
  );

  const otherImages = useMemo(
    () => property.PropertyImages.slice(1, 5),
    [property.PropertyImages]
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 h-[400px] mb-12 rounded-xl overflow-hidden relative">
      <div className="col-span-1 md:col-span-2 md:row-span-2 relative group">
        <Image
          src={firstImage.image_url}
          alt={property.name}
          fill
          loading="lazy"
          className="object-cover group-hover:brightness-95 transition"
        />
      </div>
      {otherImages.map((image, idx) => (
        <div key={image.id} className="relative group">
          <Image
            src={image.image_url}
            alt={`${property.name} ${idx + 2}`}
            fill
            className="object-cover group-hover:brightness-95 transition"
          />
        </div>
      ))}
      <button
        onClick={() => setShowAllPhotos(true)}
        className="absolute bottom-4 right-4 md:bottom-2 md:right-2 bg-white px-6 py-3 rounded-lg font-medium shadow-md hover:shadow-lg transition"
      >
        Tampilkan Semua Foto
      </button>
    </div>
  );
};

export default React.memo(PhotoGrid);
