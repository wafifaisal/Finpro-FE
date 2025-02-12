// components/main/propertyDetails/PropertyMap.tsx
"use client";

import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Property } from "@/types/types";
import Link from "next/link";

const markerIcon = new L.Icon({
  iconUrl:
    "https://res.cloudinary.com/dkyco4yqp/image/upload/v1739055040/property/zoum3gfa7wlohjwc772b.png",
  iconRetinaUrl:
    "https://res.cloudinary.com/dkyco4yqp/image/upload/v1739055040/property/zoum3gfa7wlohjwc772b.png",
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  shadowSize: [41, 41],
});

interface PropertyMapProps {
  property: Property;
}

const PropertyMap: React.FC<PropertyMapProps> = ({ property }) => {
  if (property.location.latitude && property.location.longitude) {
    return (
      <MapContainer
        center={[property.location.latitude, property.location.longitude]}
        zoom={13}
        scrollWheelZoom={false}
        style={{ height: "400px", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker
          position={[property.location.latitude, property.location.longitude]}
          icon={markerIcon}
        >
          <Popup>
            <div className="flex flex-col gap-2">
              <span className="font-semibold">{property.name}</span>
              <Link
                href={`https://www.google.com/maps/search/?api=1&query=${property.location.latitude},${property.location.longitude}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-3 py-1 bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white rounded transition"
              >
                Lihat di Google Maps
              </Link>
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    );
  }
  return <p>Informasi lokasi tidak tersedia.</p>;
};

export default PropertyMap;
