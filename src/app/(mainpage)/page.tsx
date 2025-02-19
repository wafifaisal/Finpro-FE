"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import HeroSection from "@/components/main/hero/heroSection";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Keyboard } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import PropertyCard from "@/components/main/propertycard/propertylist";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { PropertyList } from "@/types/types";

type UserLocation = {
  latitude: number;
  longitude: number;
} | null;

const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: string,
  lon2: string
): number => {
  const lat2Num = parseFloat(lat2);
  const lon2Num = parseFloat(lon2);
  const R = 6371; // Radius bumi dalam kilometer
  const dLat = ((lat2Num - lat1) * Math.PI) / 180;
  const dLon = ((lon2Num - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2Num * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

const HomePage = () => {
  const [allProperties, setAllProperties] = useState<PropertyList[]>([]);
  const [nearestProperties, setNearestProperties] = useState<PropertyList[]>(
    []
  );
  const [userLocation, setUserLocation] = useState<UserLocation>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const base_url_be = process.env.NEXT_PUBLIC_BASE_URL_BE || "";
  const searchParams = useSearchParams();
  const selectedCategory = searchParams.get("category") || "";

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => console.error("Gagal mendapatkan lokasi:", error)
      );
    }
  }, []);

  // Fetch data properti dari backend
  useEffect(() => {
    fetch(`${base_url_be}/property`)
      .then((res) => res.json())
      .then((data) => {
        setAllProperties(data.result || []);
      })
      .catch((error) => console.error("Gagal mengambil properti:", error));
  }, [base_url_be]);

  // Filter dan urutkan properti berdasarkan jarak dan kategori (jika dipilih)
  useEffect(() => {
    if (allProperties.length > 0) {
      let filteredProperties = allProperties;
      if (selectedCategory) {
        filteredProperties = allProperties.filter(
          (property) =>
            property.category.toLowerCase() === selectedCategory.toLowerCase()
        );
      }
      if (userLocation) {
        const sorted = [...filteredProperties].sort((a, b) => {
          const distA = calculateDistance(
            userLocation.latitude,
            userLocation.longitude,
            a.location.latitude,
            a.location.longitude
          );
          const distB = calculateDistance(
            userLocation.latitude,
            userLocation.longitude,
            b.location.latitude,
            b.location.longitude
          );
          return distA - distB;
        });
        setNearestProperties(sorted.slice(0, 8));
      } else {
        // Fallback: tampilkan 8 properti pertama
        setNearestProperties(filteredProperties.slice(0, 8));
      }
      setLoading(false);
    }
  }, [userLocation, allProperties, selectedCategory]);

  const slides = [
    {
      image: "/3.png",
      title: "Temukan Penginapan Impianmu di Setiap Sudut Kota",
      buttonText: "Eksplor Sekarang",
      buttonLink: "/property/search-result",
    },
    {
      image: "/1.png",
      title: "Bergabunglah dalam Komunitas Pecinta Perjalanan Berkualitas",
      buttonText: "Buat Akun",
      buttonLink: "/auth/user/register",
    },
    {
      image: "/2.png",
      title: "Tingkatkan Bisnis Properti dengan Sistem Manajemen Modern",
      buttonText: "Bergabung Bisnis",
      buttonLink: "/auth/tenant/register",
    },
    {
      image: "/4.png",
      title: (
        <div className="flex items-center text-center flex-wrap w-full sm:w-[800px]">
          <span className="ml-2 md:ml-12 mr-2">Kenali Lebih Jauh</span>
          <Image
            src="/nginepin-logo.png"
            alt="NGINEPIN"
            width={100}
            height={100}
            className="mx-auto md:mx-0"
          />
        </div>
      ),
      buttonText: "Pelajari Lebih Lanjut",
      buttonLink: "/about",
    },
    {
      image: "/nginepin-logo.png",
      title: "",
    },
  ];

  return (
    <div>
      <HeroSection slides={slides} />
      <div className="pt-48 mx-4 sm:mx-8 md:mx-32 my-10">
        <h2 className="text-2xl font-bold text-center mb-8">
          {selectedCategory
            ? `Jangan Lewatkan ${capitalize(
                selectedCategory
              )} Impian di Sekitar Anda!`
            : "Jangan Lewatkan Properti Terdekat"}
        </h2>
        <div className="relative">
          <Swiper
            modules={[Navigation, Keyboard]}
            spaceBetween={20}
            slidesPerView={1}
            breakpoints={{
              640: { slidesPerView: 2 },
              768: { slidesPerView: 3 },
              1024: { slidesPerView: 4 },
            }}
            navigation={{
              nextEl: ".custom-next",
              prevEl: ".custom-prev",
            }}
          >
            {loading
              ? Array.from({ length: 8 }).map((_, index) => (
                  <SwiperSlide key={index}>
                    <PropertyCard
                      property={{
                        id: index,
                        name: "",
                        desc: "",
                        category: "",
                        RoomTypes: [],
                        location: {
                          address: "",
                          city: "",
                          country: "",
                          latitude: "0",
                          longitude: "0",
                        },
                      }}
                      loading={true}
                    />
                  </SwiperSlide>
                ))
              : nearestProperties.map((property) => (
                  <SwiperSlide key={property.id}>
                    <PropertyCard
                      property={property}
                      userLocation={userLocation}
                    />
                  </SwiperSlide>
                ))}
          </Swiper>
          <div className="custom-prev absolute top-1/3 hidden md:block -left-0 md:-left-20 z-30 bg-rose-500 hover:bg-rose-400 text-white p-2 rounded-full transform cursor-pointer -translate-y-1/2">
            <ChevronLeft className="w-3 h-3 md:w-4 md:h-4 lg:w-6 lg:h-6" />
          </div>
          <div className="custom-next absolute top-1/3 hidden md:block -right-0 md:-right-20 z-30 bg-rose-500 hover:bg-rose-400 text-white p-2 rounded-full transform cursor-pointer -translate-y-1/2">
            <ChevronRight className="w-3 h-3 md:w-4 md:h-4 lg:w-6 lg:h-6" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
