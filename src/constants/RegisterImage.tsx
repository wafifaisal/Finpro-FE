import { ImageType } from "@/components/main/register/MarqueeColumn";

export const images: ImageType[] = [
  {
    url: "https://res.cloudinary.com/dkyco4yqp/image/upload/v1740198409/8ee97f8c-3781-4393-ae3f-673283c9ec01.png",
    alt: "Luxury Villa",
    tag: "Mewah",
  },
  {
    url: "https://res.cloudinary.com/dkyco4yqp/image/upload/v1740198513/7ed30749-6c17-4634-a275-7522743a6164.png",
    alt: "Modern Apartment",
    tag: "Modern",
  },
  {
    url: "https://res.cloudinary.com/dkyco4yqp/image/upload/v1740198643/cf3c4f8b-cfc1-4af0-8c41-2656d3ae4967.png",
    alt: "Beachfront Home",
    tag: "Tepi Pantai",
  },
  {
    url: "https://res.cloudinary.com/dkyco4yqp/image/upload/v1740198726/005182cf-a6aa-407e-90f0-829857400d18.png",
    alt: "City Loft",
    tag: "Hotel",
  },
  {
    url: "https://res.cloudinary.com/dkyco4yqp/image/upload/v1740329670/th_2_h6lfml.jpg",
    alt: "Country House",
    tag: "Rumah Perdesaan",
  },
  {
    url: "https://res.cloudinary.com/dkyco4yqp/image/upload/v1740329668/th_3_sz1xsf.jpg",
    alt: "Mountain Cabin",
    tag: "Kabin Pegunungan",
  },
];

export const duplicatedImages: ImageType[] = [...images, ...images, ...images];
