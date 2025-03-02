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
import { PropertyList } from "@/types/types";
import { NoResults } from "@/components/sub/search-result/NoResult";
import { calculateDistance, capitalize } from "@/helpers/calculateDistance";
import { slides } from "@/helpers/slides";
import Footer from "@/components/main/footer/footer";

type UserLocation = {
  latitude: number;
  longitude: number;
} | null;

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
    window.scrollTo(0, 0);
  }, []);
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
  useEffect(() => {
    fetch(`${base_url_be}/property`)
      .then((res) => res.json())
      .then((data) => {
        setAllProperties(data.result || []);
      })
      .catch((error) => console.error("Gagal mengambil properti:", error));
  }, [base_url_be]);
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
        setNearestProperties(filteredProperties.slice(0, 8));
      }
      setLoading(false);
    }
  }, [userLocation, allProperties, selectedCategory]);

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
            {loading ? (
              Array.from({ length: 8 }).map((_, index) => (
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
            ) : nearestProperties.length === 0 ? (
              <NoResults />
            ) : (
              nearestProperties.map((property) => (
                <SwiperSlide key={property.id}>
                  <PropertyCard
                    property={property}
                    userLocation={userLocation}
                  />
                </SwiperSlide>
              ))
            )}
          </Swiper>
          <div className="custom-prev absolute top-1/3 hidden md:block -left-0 md:-left-20 z-30 bg-rose-500 hover:bg-rose-400 text-white p-2 rounded-full transform cursor-pointer -translate-y-1/2">
            <ChevronLeft className="w-3 h-3 md:w-4 md:h-4 lg:w-6 lg:h-6" />
          </div>
          <div className="custom-next absolute top-1/3 hidden md:block -right-0 md:-right-20 z-30 bg-rose-500 hover:bg-rose-400 text-white p-2 rounded-full transform cursor-pointer -translate-y-1/2">
            <ChevronRight className="w-3 h-3 md:w-4 md:h-4 lg:w-6 lg:h-6" />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default HomePage;
