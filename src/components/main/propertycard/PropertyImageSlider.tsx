"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation, Keyboard } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { PropertyCardProps } from "@/types/types";

interface PropertyImageSliderProps {
  property: PropertyCardProps["property"];
  hoveredCard: number | null;
  disableButton: boolean;
  handlePropertyClick: () => void;
}

export function PropertyImageSlider({
  property,
  hoveredCard,
  disableButton,
  handlePropertyClick,
}: PropertyImageSliderProps) {
  const isHovered = hoveredCard === property.id;
  const swiperPagination = useMemo(
    () =>
      isHovered
        ? {
            clickable: true,
            bulletClass: "custom-bullet",
            bulletActiveClass: "custom-bullet-active",
          }
        : false,
    [isHovered]
  );

  const swiperNavigation = useMemo(
    () =>
      isHovered
        ? {
            nextEl: `.custom-next-${property.id}`,
            prevEl: `.custom-prev-${property.id}`,
          }
        : false,
    [isHovered, property.id]
  );

  const imageOverlay = disableButton && (
    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <span className="text-white font-bold text-lg">
        Properti Tidak tersedia
      </span>
    </div>
  );

  return (
    <div className="relative aspect-square w-full z-20">
      {property.PropertyImages && property.PropertyImages.length > 0 ? (
        <Swiper
          modules={[Pagination, Navigation, Keyboard]}
          pagination={swiperPagination}
          navigation={swiperNavigation}
          keyboard={{ enabled: true }}
          className="rounded-2xl h-full"
        >
          {property.PropertyImages.map((img, index) => (
            <SwiperSlide key={index} className="w-full h-full">
              <Link
                href={`/property/${property.id}`}
                target="_blank"
                onClick={handlePropertyClick}
              >
                <Image
                  src={img.image_url}
                  alt={property.name}
                  fill
                  loading={index === 0 ? "eager" : "lazy"}
                  priority={index === 0}
                  style={{ objectFit: "cover" }}
                  placeholder="blur"
                  blurDataURL={img.image_url}
                />
                {imageOverlay}
              </Link>
            </SwiperSlide>
          ))}
          {isHovered && (
            <>
              <button
                className={`custom-prev-${property.id} absolute top-1/2 left-2 z-50 bg-white/30 hover:bg-white/50 text-white p-2 rounded-full transform -translate-y-1/2`}
              >
                <ChevronLeft className="w-3 h-3 text-white" />
              </button>
              <button
                className={`custom-next-${property.id} absolute top-1/2 right-2 z-50 bg-white/30 hover:bg-white/50 text-white p-2 rounded-full transform -translate-y-1/2`}
              >
                <ChevronRight className="w-3 h-3 text-white" />
              </button>
            </>
          )}
        </Swiper>
      ) : (
        <Link
          href={`/property/${property.id}`}
          onClick={handlePropertyClick}
          target="_blank"
          className="relative block"
        >
          <Image
            src="/nginepin-logo.png"
            alt={property.name}
            fill
            loading="lazy"
            style={{ objectFit: "contain" }}
            className="rounded-t-2xl"
            placeholder="blur"
            blurDataURL="/placeholder.png"
          />
          {imageOverlay}
        </Link>
      )}
    </div>
  );
}
