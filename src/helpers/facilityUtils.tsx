import React from "react";
import {
  FaWifi,
  FaTv,
  FaSnowflake,
  FaBell,
  FaWineBottle,
  FaTshirt,
  FaFire,
  FaFireExtinguisher,
  FaBoxOpen,
  FaLaptop,
  FaUtensils,
  FaWind,
  FaLock,
  FaBath,
  FaCoffee,
  FaRegWindowMaximize,
  FaCity,
  FaTree,
  FaUmbrellaBeach,
  FaPaw,
  FaCocktail,
  FaUsers,
  FaParking,
  FaDumbbell,
  FaSpa,
  FaChild,
  FaMapMarkedAlt,
  FaMoneyBillWave,
  FaGem,
  FaCheck,
  FaHotTub,
  FaSwimmingPool,
} from "react-icons/fa";
import { MicrowaveIcon } from "lucide-react";

export const formatFacilityName = (facility: string): string => {
  return facility
    .toLowerCase()
    .split("_")
    .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export const getRoomFacilityIcon = (facility: string) => {
  const key = facility.toUpperCase();
  const mapping: { [key: string]: JSX.Element } = {
    WIFI: <FaWifi className="inline mr-1 text-rose-600" />,
    TV: <FaTv className="inline mr-1 text-rose-600" />,
    AC: <FaSnowflake className="inline mr-1 text-rose-600" />,
    ROOM_SERVICES: <FaBell className="inline mr-1 text-rose-600" />,
    MINI_BAR: <FaWineBottle className="inline mr-1 text-rose-600" />,
    LAUNDRY: <FaTshirt className="inline mr-1 text-rose-600" />,
    SETRIKA: <FaFire className="inline mr-1 text-rose-600" />,
    ALAT_PEMADAM_API: (
      <FaFireExtinguisher className="inline mr-1 text-rose-600" />
    ),
    MICROWAVE: <MicrowaveIcon className="inline mr-1 text-rose-600" />,
    KULKAS: <FaBoxOpen className="inline mr-1 text-rose-600" />,
    RUANG_KERJA_KHUSUS: <FaLaptop className="inline mr-1 text-rose-600" />,
    KITCHEN: <FaUtensils className="inline mr-1 text-rose-600" />,
    HEATING: <FaFire className="inline mr-1 text-rose-600" />,
    AIR_PURIFIER: <FaWind className="inline mr-1 text-rose-600" />,
    SAFE: <FaLock className="inline mr-1 text-rose-600" />,
    BATHROBES: <FaBath className="inline mr-1 text-rose-600" />,
    TEA_COFFEE_MAKER: <FaCoffee className="inline mr-1 text-rose-600" />,
    BALCONY: <FaRegWindowMaximize className="inline mr-1 text-rose-600" />,
    BATHTUB: <FaBath className="inline mr-1 text-rose-600" />,
    JACUZZI: <FaHotTub className="inline mr-1 text-rose-600" />,
    PRIVATE_POOL: <FaSwimmingPool className="inline mr-1 text-rose-600" />,
  };
  return mapping[key] || <FaCheck className="inline mr-1 text-rose-600" />;
};

export const getPropertyFacilityIcon = (facility: string) => {
  const key = facility.toUpperCase();
  const mapping: { [key: string]: JSX.Element } = {
    PEMANDANGAN_KOTA: <FaCity className="inline mr-1 text-rose-600" />,
    PEMANDANGAN_ALAM: <FaTree className="inline mr-1 text-rose-600" />,
    AKSES_PANTAI: <FaUmbrellaBeach className="inline mr-1 text-rose-600" />,
    TAMAN: <FaTree className="inline mr-1 text-rose-600" />,
    RAMAH_HEWAN_PELIHARAAN: <FaPaw className="inline mr-1 text-rose-600" />,
    RESTAURANT: <FaUtensils className="inline mr-1 text-rose-600" />,
    BAR: <FaCocktail className="inline mr-1 text-rose-600" />,
    CONFERENCE_ROOM: <FaUsers className="inline mr-1 text-rose-600" />,
    PARKIR_GRATIS: <FaParking className="inline mr-1 text-rose-600" />,
    KOLAM_RENANG: <FaSwimmingPool className="inline mr-1 text-rose-600" />,
    GYM: <FaDumbbell className="inline mr-1 text-rose-600" />,
    SPA: <FaSpa className="inline mr-1 text-rose-600" />,
    TAMAN_BERMAIN: <FaChild className="inline mr-1 text-rose-600" />,
    DEKAT_WISATA: <FaMapMarkedAlt className="inline mr-1 text-rose-600" />,
    BUDGET: <FaMoneyBillWave className="inline mr-1 text-rose-600" />,
    MEWAH: <FaGem className="inline mr-1 text-rose-600" />,
  };
  return mapping[key] || <FaCheck className="inline mr-1 text-rose-600" />;
};
