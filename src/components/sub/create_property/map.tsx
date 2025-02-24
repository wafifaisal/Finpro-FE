"use client";

import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

interface MapProps {
  position: [number, number];
  onPositionChange: (position: [number, number]) => void;
}

const LocationPicker: React.FC<MapProps> = ({ position, onPositionChange }) => {
  useMapEvents({
    click(e) {
      onPositionChange([e.latlng.lat, e.latlng.lng]);
    },
  });

  return position ? <Marker position={position} /> : null;
};

interface Props {
  position: [number, number];
  onPositionChange: (position: [number, number]) => void;
}

const Map: React.FC<Props> = ({ position, onPositionChange }) => {
  return (
    <MapContainer center={position} zoom={13} className="h-full w-full z-10">
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <LocationPicker position={position} onPositionChange={onPositionChange} />
    </MapContainer>
  );
};

export default Map;
