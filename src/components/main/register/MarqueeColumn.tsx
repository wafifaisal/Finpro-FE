import React from "react";
import Image from "next/image";

export interface ImageType {
  url: string;
  alt: string;
  tag: string;
}

export interface MarqueeColumnProps {
  direction?: "up" | "down";
  offset?: number;
  images: ImageType[];
}

const MarqueeColumn: React.FC<MarqueeColumnProps> = ({
  direction = "up",
  offset = 0,
  images,
}) => (
  <div className="flex-1 overflow-hidden relative h-full px-3 bg-black">
    <div
      className="animate-marquee flex flex-col gap-6 py-8"
      style={{
        animation: `marquee 35s linear infinite ${
          direction === "down" ? "reverse" : "normal"
        }`,
        transform: `translateY(${offset}%)`,
      }}
    >
      {images.map((image, index) => (
        <div
          key={index}
          className="w-full transform transition-all duration-300 hover:scale-105"
        >
          <div className="bg-white rounded-2xl shadow-md overflow-hidden group">
            <div className="relative">
              <Image
                src={image.url}
                alt={image.alt}
                width={400}
                height={300}
                className="w-full h-56 object-cover"
              />
              <div className="absolute top-3 left-3">
                <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium text-gray-800">
                  {image.tag}
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default MarqueeColumn;
