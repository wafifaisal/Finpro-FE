// src/types/roomTypes.ts
export interface RoomType {
  name: string;
  stock: string;
  price: number;
  capacity: string;
  bed_details: string;
  has_breakfast: boolean;
  breakfast_price: number;
  images: File[];
  facilities: string[];
  imagePreviews: string[]; // Pastikan properti ini ada
}
