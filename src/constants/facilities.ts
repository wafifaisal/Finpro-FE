// constants/facilities.ts
import {
  Wifi,
  Tv,
  Wind,
  Wine,
  FireExtinguisher,
  Microwave,
  Refrigerator,
  Briefcase,
  ChefHat,
  Flame,
  Fan,
  Lock,
  Coffee,
  Trees,
  Bath,
  Droplets,
  Building,
  Mountain,
  Cat,
  UtensilsCrossed,
  Car,
  Dumbbell,
  MapPin,
  PiggyBank,
  ConciergeBell,
  WashingMachine,
  WavesLadder,
  LeafIcon,
} from "lucide-react";
import { TbIroning } from "react-icons/tb";
import { GiKidSlide, GiSleevelessJacket } from "react-icons/gi";
import { FaCocktail, FaSwimmingPool } from "react-icons/fa";
import { FaSpa } from "react-icons/fa6";
import { SlDiamond } from "react-icons/sl";
import { MdOutlineMeetingRoom, MdOutlineBeachAccess } from "react-icons/md";

export const ROOM_FACILITIES = [
  { id: "WIFI", icon: Wifi, label: "WiFi" },
  { id: "TV", icon: Tv, label: "TV" },
  { id: "AC", icon: Wind, label: "AC" },
  { id: "ROOM_SERVICES", icon: ConciergeBell, label: "Layanan Kamar" },
  { id: "MINI_BAR", icon: Wine, label: "Mini Bar" },
  { id: "LAUNDRY", icon: WashingMachine, label: "Laundry" },
  { id: "SETRIKA", icon: TbIroning, label: "Setrika" },
  { id: "ALAT_PEMADAM_API", icon: FireExtinguisher, label: "Alat Pemadam Api" },
  { id: "MICROWAVE", icon: Microwave, label: "Microwave" },
  { id: "KULKAS", icon: Refrigerator, label: "Kulkas" },
  { id: "RUANG_KERJA_KHUSUS", icon: Briefcase, label: "Ruang Kerja" },
  { id: "KITCHEN", icon: ChefHat, label: "Dapur" },
  { id: "HEATING", icon: Flame, label: "Pemanas Ruangan" },
  { id: "AIR_PURIFIER", icon: Fan, label: "Penyaring Udara" },
  { id: "SAFE", icon: Lock, label: "Brankas" },
  { id: "BATHROBES", icon: GiSleevelessJacket, label: "Jubah Mandi" },
  { id: "TEA_COFFEE_MAKER", icon: Coffee, label: "Pembuat Teh/Kopi" },
  { id: "BALCONY", icon: Trees, label: "Balkon" },
  { id: "BATHTUB", icon: Bath, label: "Bak Mandi" },
  { id: "JACUZZI", icon: Droplets, label: "Jacuzzi" },
  { id: "PRIVATE_POOL", icon: WavesLadder, label: "Kolam Renang Pribadi" },
];

export const PROPERTY_FACILITIES = [
  { id: "PEMANDANGAN_KOTA", icon: Building, label: "Pemandangan Kota" },
  { id: "PEMANDANGAN_ALAM", icon: Mountain, label: "Pemandangan Alam" },
  { id: "AKSES_PANTAI", icon: MdOutlineBeachAccess, label: "Akses Pantai" },
  { id: "TAMAN", icon: LeafIcon, label: "Taman" },
  { id: "RAMAH_HEWAN_PELIHARAAN", icon: Cat, label: "Ramah Hewan" },
  { id: "RESTAURANT", icon: UtensilsCrossed, label: "Restoran" },
  { id: "BAR", icon: FaCocktail, label: "Bar" },
  {
    id: "CONFERENCE_ROOM",
    icon: MdOutlineMeetingRoom,
    label: "Ruang Konferensi",
  },
  { id: "PARKIR_GRATIS", icon: Car, label: "Parkir Gratis" },
  { id: "KOLAM_RENANG", icon: FaSwimmingPool, label: "Kolam Renang" },
  { id: "GYM", icon: Dumbbell, label: "Gym" },
  { id: "SPA", icon: FaSpa, label: "Spa" },
  { id: "TAMAN_BERMAIN", icon: GiKidSlide, label: "Area Bermain" },
  { id: "DEKAT_WISATA", icon: MapPin, label: "Dekat Wisata" },
  { id: "BUDGET", icon: PiggyBank, label: "Hemat Budget" },
  { id: "MEWAH", icon: SlDiamond, label: "Mewah" },
];
