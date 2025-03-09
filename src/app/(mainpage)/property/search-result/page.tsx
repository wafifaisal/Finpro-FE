"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import PropertyCard from "@/components/main/propertycard/propertylist";
import Pagination from "@/components/sub/search-result/Pagination";
import { UserLocation, PropertyList } from "@/types/types";
import { NoResults } from "@/components/sub/search-result/NoResult";
import { LoadingSkeleton } from "@/components/sub/search-result/LoadingSkeleton";
import Footer from "@/components/main/footer/footer";

const PropertyMap = dynamic(
  () => import("@/components/sub/search-result/SearchMap"),
  {
    ssr: false,
    loading: () => <p>Memuat peta...</p>,
  }
);

export default function SearchResultPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const where = searchParams.get("where") || "";
  const checkIn = searchParams.get("checkIn") || "";
  const checkOut = searchParams.get("checkOut") || "";
  const who = searchParams.get("who") || "";
  const pageQuery = searchParams.get("page") || "1";
  const category = searchParams.get("category") || "";
  const minPrice = searchParams.get("minPrice") || "";
  const maxPrice = searchParams.get("maxPrice") || "";
  const roomFacilities = searchParams.get("roomFacilities") || "";
  const propertyFacilities = searchParams.get("propertyFacilities") || "";
  const sortBy = searchParams.get("sortBy") || "";
  const sortOrder = searchParams.get("sortOrder") || "";
  const propertyName = searchParams.get("propertyName") || "";

  const [properties, setProperties] = useState<PropertyList[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [pagination, setPagination] = useState({
    totalPages: 1,
    currentPage: 1,
    limit: 9,
  });
  const [userLocation, setUserLocation] = useState<UserLocation>(null);

  const base_url_be: string = process.env.NEXT_PUBLIC_BASE_URL_BE || "";

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
    const params = new URLSearchParams();
    if (where) params.append("where", where);
    if (checkIn) params.append("checkIn", checkIn);
    if (checkOut) params.append("checkOut", checkOut);
    if (who) params.append("who", who);
    if (category) params.append("category", category);
    if (minPrice) params.append("minPrice", minPrice);
    if (maxPrice) params.append("maxPrice", maxPrice);
    if (roomFacilities) params.append("roomFacilities", roomFacilities);
    if (propertyFacilities)
      params.append("propertyFacilities", propertyFacilities);
    if (sortBy) params.append("sortBy", sortBy);
    if (sortOrder) params.append("sortOrder", sortOrder);
    if (propertyName) params.append("propertyName", propertyName);
    params.append("page", pageQuery);
    params.append("limit", "9");

    fetch(`${base_url_be}/property?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        let results = data.result || [];
        if (sortBy === "price") {
          results = results.sort((a: PropertyList, b: PropertyList) => {
            const minA =
              a.RoomTypes && a.RoomTypes.length > 0
                ? Math.min(
                    ...a.RoomTypes.map((rt: { price: number }) => rt.price)
                  )
                : Infinity;
            const minB =
              b.RoomTypes && b.RoomTypes.length > 0
                ? Math.min(
                    ...b.RoomTypes.map((rt: { price: number }) => rt.price)
                  )
                : Infinity;
            return sortOrder === "asc" ? minA - minB : minB - minA;
          });
        }
        setProperties(results);
        setPagination({
          totalPages: data.totalPages || 1,
          currentPage: data.currentPage || parseInt(pageQuery, 10),
          limit: data.limit || 9,
        });
        setLoading(false);
      })
      .catch((error) => {
        console.error("Gagal mengambil properti:", error);
        setLoading(false);
      });
  }, [
    where,
    checkIn,
    checkOut,
    who,
    category,
    minPrice,
    maxPrice,
    roomFacilities,
    propertyFacilities,
    sortBy,
    sortOrder,
    pageQuery,
    propertyName,
    base_url_be,
  ]);

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`/property/search-result?${params.toString()}`);
  };

  const searchStart = checkIn ? new Date(checkIn) : new Date();
  const searchEnd = checkOut
    ? new Date(checkOut)
    : new Date(searchStart.getTime() + 24 * 60 * 60 * 1000);

  return (
    <>
      <div className="container mx-auto p-4 py-28 md:py-48">
        {loading ? (
          <LoadingSkeleton userLocation={userLocation} />
        ) : properties.length === 0 ? (
          <NoResults />
        ) : (
          <div className="flex flex-col md:flex-row gap-4">
            <div className="md:w-2/3">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
                {properties.map((property) => (
                  <PropertyCard
                    key={property.id}
                    property={property}
                    userLocation={userLocation}
                    searchStart={searchStart}
                    searchEnd={searchEnd}
                  />
                ))}
              </div>
              {pagination.totalPages > 1 && (
                <Pagination
                  currentPage={pagination.currentPage}
                  totalPages={pagination.totalPages}
                  onPageChange={handlePageChange}
                />
              )}
            </div>
            <div className="md:w-1/3">
              <div className="sticky top-48">
                <PropertyMap
                  properties={properties}
                  userLocation={userLocation}
                  router={router}
                />
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}
