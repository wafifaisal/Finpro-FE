"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation, Keyboard } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { FaLocationDot, FaStar } from "react-icons/fa6";
import { formatCurrency } from "@/helpers/formatCurrency";

// Tipe data properti (sesuai dengan schema Prisma dan file types)
type Property = {
  id: number;
  name: string;
  desc: string;
  category: string;
  PropertyImages?: { image_url: string }[];
  location: {
    address: string;
    city: string;
    country: string;
    latitude: string; // string agar sesuai dengan output Prisma
    longitude: string;
  };
  RoomTypes: { id: number; name: string; price: number; avg_rating?: number }[];
};

type UserLocation = {
  latitude: number;
  longitude: number;
} | null;

// Utility function: menghitung jarak berdasarkan koordinat
const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: string,
  lon2: string
): number => {
  const lat2Num = parseFloat(lat2);
  const lon2Num = parseFloat(lon2);
  const R = 6371; // Radius Bumi dalam km
  const dLat = ((lat2Num - lat1) * Math.PI) / 180;
  const dLon = ((lon2Num - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2Num * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const formatDistance = (distance: number): string => {
  return distance < 1
    ? `${Math.round(distance * 1000)} m`
    : `${distance.toFixed(1)} km`;
};

export default function PropertyList() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [userLocation, setUserLocation] = useState<UserLocation>(null);
  const base_url_be = process.env.NEXT_PUBLIC_BASE_URL_BE;

  // Dapatkan lokasi user
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    }
  }, []);

  useEffect(() => {
    fetch(`${base_url_be}/property?limit=8&page=1`)
      .then((response) => response.json())
      .then((data) => {
        setProperties(data.result);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching properties:", error);
        setLoading(false);
      });
  }, [base_url_be]);

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
      <h1 className="text-xl md:text-2xl font-bold mb-6 text-gray-800 text-center">
        Coba suasana yang beda, cek rumah liburan di Nginepin!
      </h1>
      <div className="grid grid-cols-1 max-[400px]:grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-[955px]:grid-cols-2">
        {loading
          ? Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="bg-gray-200 rounded-2xl overflow-hidden"
              >
                <div className="aspect-square bg-gray-300 w-max-[400px]"></div>
                <div className="p-4">
                  <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-full"></div>
                </div>
              </div>
            ))
          : properties.map((property) => {
              // Menghitung rata-rata rating dari seluruh RoomTypes yang memiliki nilai valid
              const validRatings = property.RoomTypes.filter(
                (room) =>
                  room.avg_rating !== undefined && room.avg_rating !== null
              );
              const overallRating =
                validRatings.length > 0
                  ? validRatings.reduce(
                      (sum, room) => sum + (room.avg_rating || 0),
                      0
                    ) / validRatings.length
                  : 0;

              return (
                <div
                  key={property.id}
                  className="overflow-hidden transition-shadow duration-300"
                  onMouseEnter={() => setHoveredCard(property.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <div className="relative aspect-square w-full z-20">
                    {property.PropertyImages &&
                    property.PropertyImages.length > 0 ? (
                      <Swiper
                        modules={[Pagination, Navigation, Keyboard]}
                        pagination={
                          hoveredCard === property.id
                            ? {
                                clickable: true,
                                bulletClass: "custom-bullet",
                                bulletActiveClass: "custom-bullet-active",
                              }
                            : false
                        }
                        navigation={
                          hoveredCard === property.id
                            ? {
                                nextEl: `.custom-next-${property.id}`,
                                prevEl: `.custom-prev-${property.id}`,
                              }
                            : false
                        }
                        keyboard={{ enabled: true }}
                        className="rounded-2xl h-full"
                      >
                        {property.PropertyImages.map((img, index) => (
                          <SwiperSlide
                            key={index}
                            className="relative w-full h-full"
                          >
                            <Link href={`/property/${property.id}`}>
                              <Image
                                src={img.image_url}
                                alt={property.name}
                                layout="fill"
                                objectFit="cover"
                              />
                            </Link>
                          </SwiperSlide>
                        ))}
                        {hoveredCard === property.id && (
                          <>
                            <button
                              className={`custom-prev-${property.id} absolute top-1/2 left-2 z-50 bg-white/30 hover:bg-white/50 text-white p-2 rounded-full transform -translate-y-1/2`}
                            >
                              <ChevronLeft className="md:w-4 md:h-4 lg:w-6 lg:h-6 w-3 h-3" />
                            </button>
                            <button
                              className={`custom-next-${property.id} absolute top-1/2 right-2 z-50 bg-white/30 hover:bg-white/50 text-white p-2 rounded-full transform -translate-y-1/2`}
                            >
                              <ChevronRight className="md:w-4 md:h-4 lg:w-6 lg:h-6 w-3 h-3" />
                            </button>
                          </>
                        )}
                      </Swiper>
                    ) : (
                      <Image
                        src="/nginepin-logo.png"
                        alt={property.name}
                        layout="fill"
                        objectFit="contain"
                        className="rounded-t-2xl h-auto w-auto object-cover"
                      />
                    )}
                  </div>
                  <div className="py-2 px-2">
                    <div className="flex justify-between">
                      <h2 className="text-sm md:text-lg font-semibold text-gray-800 outline-none truncate">
                        {property.name}
                      </h2>
                      <h2 className="flex gap-1 text-sm font-bold">
                        <FaStar className="" />
                        {overallRating.toFixed(1)}
                      </h2>
                    </div>
                    <div className="flex flex-col gap-1">
                      <div className="flex gap-1">
                        <FaLocationDot className="text-gray-500 text-sm" />
                        <p className="text-sm text-gray-500 outline-none truncate">
                          {property.category} di {property.location.address},{" "}
                          {property.location.city}
                        </p>
                      </div>
                      {userLocation && (
                        <p className="text-sm text-gray-500 pl-4">
                          {formatDistance(
                            calculateDistance(
                              userLocation.latitude,
                              userLocation.longitude,
                              property.location.latitude,
                              property.location.longitude
                            )
                          )}{" "}
                          dari lokasi Anda
                        </p>
                      )}
                    </div>
                    <div className="flex items-center space-x-1 outline-none truncate">
                      <h1 className="text-sm md:text-lg font-bold text-gray-800">
                        {formatCurrency(property.RoomTypes[0]?.price)}
                      </h1>
                      <span className="text-sm text-gray-500 outline-none truncate">
                        / malam
                      </span>
                    </div>
                    <Link href={`/property/${property.id}`}>
                      <div className="mt-2 flex flex-wrap items-center justify-center">
                        <button className="border text-white hover:text-black duration-300 relative group cursor-pointer overflow-hidden h-10 w-44 rounded-md bg-red-500 p-2 font-extrabold hover:bg-sky-700">
                          <div className="absolute group-hover:-top-1 group-hover:-right-2 z-10 w-16 h-16 rounded-full group-hover:scale-150 duration-700 right-12 top-12 bg-[#EB5A3C]"></div>
                          <div className="absolute group-hover:-top-1 group-hover:-right-2 z-10 w-12 h-12 rounded-full group-hover:scale-150 duration-700 right-20 -top-6 bg-[#DF9755]"></div>
                          <div className="absolute group-hover:-top-1 group-hover:-right-2 z-10 w-8 h-8 rounded-full group-hover:scale-150 duration-700 right-32 top-6 bg-[#E7D283]"></div>
                          <div className="absolute group-hover:-top-1 group-hover:-right-2 z-10 w-4 h-4 rounded-full group-hover:scale-150 duration-700 right-2 top-12 bg-[#EDF4C2]"></div>
                          <p className="z-10 absolute bottom-2 left-0 text-sm outline-none truncate w-full">
                            Cek Ketersediaan
                          </p>
                        </button>
                      </div>
                    </Link>
                  </div>
                </div>
              );
            })}
      </div>
    </div>
  );
}
