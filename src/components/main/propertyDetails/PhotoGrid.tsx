// components/main/propertyDetails/PhotoGrid.tsx
"use client";

import React from "react";
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
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 h-[400px] mb-12 rounded-xl overflow-hidden relative">
      <div className="col-span-1 md:col-span-2 md:row-span-2 relative group">
        <Image
          src={property.PropertyImages[0].image_url}
          alt={property.name}
          fill
          className="object-cover group-hover:brightness-95 transition"
        />
      </div>
      {property.PropertyImages.slice(1, 5).map((image, idx) => (
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

export default PhotoGrid;
