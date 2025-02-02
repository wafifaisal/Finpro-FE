import { Calendar, MapPin, Users } from "lucide-react";
import { JSX } from "react";

export type SearchValues = {
  where: string;
  checkIn: string;
  checkOut: string;
  who: string;
  dateRange: string; // Make sure 'dateRange' is part of the SearchValues type if you're going to use it
};

export const SearchFields: {
  label: string;
  placeholder: string;
  key: keyof SearchValues;
  icon?: JSX.Element; // Making icon optional to allow the dateRange field to not require an icon
}[] = [
  {
    label: "Dimana",
    placeholder: "Cari Destinasi",
    key: "where",
    icon: <MapPin size={16} className="text-gray-500" />,
  },
  {
    label: "Waktu Menginap",
    placeholder: "Pilih Tanggal",
    key: "dateRange",
    icon: <Calendar size={16} className="text-gray-500" />,
  },
  {
    label: "Jumlah tamu",
    placeholder: "1 Tamu",
    key: "who",
    icon: <Users size={16} className="text-gray-500" />,
  },
];

export const getIndonesianCityImage = (city: string) => {
  const cityLower = city.toLowerCase();
  switch (true) {
    case cityLower.includes("bali"):
      return {
        image:
          "https://res.cloudinary.com/dkyco4yqp/image/upload/v1738521073/59cea11e-fd40-4e08-b88e-fedcc0eb2613.png",
        country: "Pulau Dewata, surga wisata tropis",
      };
    case cityLower.includes("jakarta"):
      return {
        image:
          "https://res.cloudinary.com/dkyco4yqp/image/upload/v1738521541/051ef9cb-8b66-4216-a485-48e2f6fa3343.png",
        country: "Kota metropolitan, pusat bisnis Indonesia",
      };
    case cityLower.includes("bandung"):
      return {
        image:
          "https://res.cloudinary.com/dkyco4yqp/image/upload/v1738520935/9e9accee-5447-4259-9cdb-9bd31a1e16cf.png",
        country: "Terkenal dengan wisata kuliner dan belanja",
      };

    case cityLower.includes("manado"):
      return {
        image:
          "https://res.cloudinary.com/dkyco4yqp/image/upload/v1738521399/17709e1c-d0db-4eba-8f00-54f5351ea60d.png",
        country: "Surga diving dengan keindahan bawah laut",
      };
    case cityLower.includes("yogyakarta"):
      return {
        image:
          "https://res.cloudinary.com/dkyco4yqp/image/upload/v1738521452/787d513e-7f0a-49da-961d-4c78a04cf97e.png",
        country: "Kota budaya dan sejarah, dekat Candi Borobudur",
      };
    case cityLower.includes("makassar"):
      return {
        image:
          "https://res.cloudinary.com/dkyco4yqp/image/upload/v1738521375/2dab2f49-49e5-44f0-91cf-a3c809db6630.png",
        country: "Pusat perdagangan dan kuliner Sulawesi",
      };
    case cityLower.includes("medan"):
      return {
        image:
          "https://res.cloudinary.com/dkyco4yqp/image/upload/v1738521375/2dab2f49-49e5-44f0-91cf-a3c809db6630.png",
        country: "Pintu gerbang Sumatera, kaya akan budaya dan kuliner",
      };
    default:
      return {
        image:
          "https://res.cloudinary.com/dkyco4yqp/image/upload/v1738515638/00e1a9c2-3fdb-4b03-8086-855dda8e67fc.png",
        country: "Destinasi menarik di Indonesia",
      };
  }
};
