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
    label: "Where",
    placeholder: "Search destinations",
    key: "where",
    icon: <MapPin size={16} className="text-gray-500" />,
  },
  {
    label: "Check-in",
    placeholder: "Add dates",
    key: "checkIn",
    icon: <Calendar size={16} className="text-gray-500" />,
  },
  {
    label: "Check-out",
    placeholder: "Add dates",
    key: "checkOut",
    icon: <Calendar size={16} className="text-gray-500" />,
  },
  {
    label: "Who",
    placeholder: "1 guest",
    key: "who",
    icon: <Users size={16} className="text-gray-500" />,
  },
];
