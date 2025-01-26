import { Calendar, MapPin, Users } from "lucide-react";
import { JSX } from "react";

export type SearchValues = {
  where: string;
  checkIn: string;
  checkOut: string;
  who: string;
};

export const SearchFields: {
  label: string;
  placeholder: string;
  key: keyof SearchValues;
  icon: JSX.Element;
}[] = [
  {
    label: "Dimana",
    placeholder: "Cari Destinasi",
    key: "where",
    icon: <MapPin size={16} className="text-gray-500" />,
  },
  {
    label: "Check-in",
    placeholder: "Atur Tanggal",
    key: "checkIn",
    icon: <Calendar size={16} className="text-gray-500" />,
  },
  {
    label: "Check-out",
    placeholder: "Atur Tanggal",
    key: "checkOut",
    icon: <Calendar size={16} className="text-gray-500" />,
  },
  {
    label: "Atur tamu",
    placeholder: "1 Tamu",
    key: "who",
    icon: <Users size={16} className="text-gray-500" />,
  },
];
