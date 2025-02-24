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
  imagePreviews: string[];
}

export interface RoomTypeDetail {
  id: number;
  price: number;
  seasonal_prices?: {
    start_date: string;
    end_date: string;
    price: number | string;
  }[];
  has_breakfast: boolean;
  breakfast_price: number;
  capacity: number;
  Unavailable?: {
    start_date: string;
    end_date: string;
  }[];
}
