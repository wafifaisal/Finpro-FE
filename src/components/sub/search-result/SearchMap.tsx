"use client";

import React, { useMemo, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { formatCurrency, getValidCoordinate } from "@/libs/maps";
import { PropertyList, UserLocation } from "@/types/types";
import "leaflet/dist/leaflet.css";

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

function ChangeMapView({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom(), { animate: true });
  }, [center, map]);
  return null;
}

const PropertyMap = ({
  properties,
  userLocation,
  router,
}: {
  properties: PropertyList[];
  userLocation: UserLocation;
  router: ReturnType<typeof useRouter>;
}) => {
  const defaultCenter: [number, number] = useMemo(() => {
    for (const property of properties) {
      const lat = getValidCoordinate(property.location.latitude);
      const lng = getValidCoordinate(property.location.longitude);
      if (lat !== null && lng !== null) {
        return [lat, lng];
      }
    }
    if (
      userLocation &&
      !isNaN(userLocation.latitude) &&
      !isNaN(userLocation.longitude)
    ) {
      return [userLocation.latitude, userLocation.longitude];
    }
    return [0, 0];
  }, [userLocation, properties]);

  if (properties.length === 0) return null;

  const searchParams = new URLSearchParams(window.location.search);
  const checkInParam = searchParams.get("checkIn") || "";
  const checkOutParam = searchParams.get("checkOut") || "";
  const searchStart = checkInParam ? new Date(checkInParam) : new Date();
  const searchEnd = checkOutParam
    ? new Date(checkOutParam)
    : new Date(searchStart.getTime() + 24 * 60 * 60 * 1000);

  return (
    <div className="mb-8">
      <MapContainer
        center={defaultCenter}
        zoom={12}
        scrollWheelZoom={true}
        style={{ height: "470px", width: "100%" }}
      >
        <ChangeMapView center={defaultCenter} />
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        {properties.map((property) => {
          const lat = getValidCoordinate(property.location.latitude);
          const lng = getValidCoordinate(property.location.longitude);
          if (lat === null || lng === null) return null;

          const effectivePrices = property.RoomTypes.map((rt) => {
            const regular = rt.price;
            let effective = regular;
            if (rt.seasonal_prices && rt.seasonal_prices.length > 0) {
              const active = rt.seasonal_prices.find((sp) => {
                const start = new Date(sp.start_date);
                const end = new Date(sp.end_date);
                return searchStart >= start && searchEnd <= end;
              });
              if (active && active.price < regular) {
                effective = active.price;
              }
            }
            return effective;
          });
          const computedPrice =
            effectivePrices.length > 0 ? Math.min(...effectivePrices) : null;

          const isAnyRoomAvailable = property.RoomTypes.some((rt) => {
            if (!rt.Unavailable || rt.Unavailable.length === 0) return true;
            const rtUnavailable = rt.Unavailable.some((range) => {
              const rangeStart = new Date(range.start_date);
              const rangeEnd = new Date(range.end_date);
              return searchStart <= rangeEnd && searchEnd >= rangeStart;
            });
            return !rtUnavailable;
          });
          const isPropertyAvailable =
            property.isAvailable !== false && isAnyRoomAvailable;

          const markerContent =
            isPropertyAvailable && computedPrice !== null
              ? formatCurrency(computedPrice)
              : "Tidak Tersedia";

          const customIcon = L.divIcon({
            html: `<div class="bg-white border border-rose-600 text-rose-600 hover:border-white hover:text-white hover:bg-rose-600 rounded-full px-1.5 py-1 text-xs font-bold whitespace-nowrap">
                      ${markerContent}
                   </div>`,
            className: "",
            iconSize: [90, 50],
            iconAnchor: [25, 50],
          });

          return (
            <Marker key={property.id} position={[lat, lng]} icon={customIcon}>
              <Popup>
                <div className="p-2">
                  <div className="mb-2">
                    {property.PropertyImages &&
                    property.PropertyImages.length > 0 ? (
                      <Image
                        src={property.PropertyImages[0].image_url}
                        alt={property.name}
                        className="w-full h-32 object-cover rounded"
                        width={300}
                        height={128}
                      />
                    ) : (
                      <div className="w-full h-32 bg-gray-200 rounded flex items-center justify-center">
                        No Image
                      </div>
                    )}
                  </div>
                  <h3 className="font-bold text-lg">{property.name}</h3>
                  <p className="text-sm text-gray-600">
                    {property.location.address}
                  </p>
                  {isPropertyAvailable && computedPrice !== null ? (
                    <p className="mt-2 text-rose-600 font-semibold">
                      Harga mulai dari {formatCurrency(computedPrice)}
                    </p>
                  ) : (
                    <p className="mt-2 text-rose-600 font-semibold">
                      Property Tidak Tersedia
                    </p>
                  )}
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 underline inline-block mt-2"
                  >
                    Buka di Google Maps
                  </a>
                  <button
                    onClick={() => router.push(`/property/${property.id}`)}
                    className="mt-2 w-full bg-rose-600 text-white py-1 px-2 rounded hover:bg-rose-700"
                  >
                    Lihat Detail
                  </button>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default PropertyMap;
