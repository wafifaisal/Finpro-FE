"use client";

import React, { useMemo } from "react";
import Image from "next/image";
import { ChevronLeft } from "lucide-react";
import { Property } from "@/types/types";

interface PhotoGalleryProps {
  property: Property;
  onClose: () => void;
}

const PhotoGallery: React.FC<PhotoGalleryProps> = ({ property, onClose }) => {
  const images = useMemo(
    () =>
      property.PropertyImages.map((image) => (
        <div key={image.id} className="relative mb-4 break-inside-avoid">
          <Image
            src={image.image_url}
            alt={property.name}
            width={600}
            height={400}
            loading="lazy"
            className="rounded-lg"
          />
        </div>
      )),
    [property.PropertyImages, property.name]
  );

  return (
    <div className="fixed inset-0 bg-black z-50 overflow-auto">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <button
          onClick={onClose}
          className="fixed top-8 left-8 bg-white/10 hover:bg-white/20 p-2 rounded-full backdrop-blur-sm transition"
        >
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>
        <div className="columns-2 md:columns-3 gap-4 pt-16">{images}</div>
      </div>
    </div>
  );
};

export default React.memo(PhotoGallery);
