export interface RoomType {
  id: number;
  name: string;
  price: number;
  capacity: number;
  stock: number;
  bed_details?: string;
  has_breakfast: boolean;
  breakfast_price: number;
  facilities: string[];
  RoomImages?: { id: number; image_url: string }[];
  avg_rating?: number;
  Review?: {
    id: number;
    rating: number;
    review: string;
    created_at?: string;
  }[];
  Unavailable?: { id: number; start_date: string; end_date: string }[];
  seasonal_prices?: {
    id: number;
    price: number;
    start_date: string;
    end_date: string;
    apply_weekend?: boolean;
    apply_holiday?: boolean;
  }[];
}

export interface Location {
  address: string;
  city: string;
  country: string;
  latitude: string;
  longitude: string;
}

export interface Property {
  id: number;
  name: string;
  desc?: string;
  terms_condition?: string;
  PropertyImages: { id: number; image_url: string }[];
  category: string;
  location?: Location;
  facilities: string[];
  RoomTypes?: RoomType[];
  reviews?: {
    id: number;
    rating: number;
    review: string;
    created_at?: string;
  }[];
}

export interface PropertyFormValues {
  name: string;
  desc: string;
  category: string;
  terms_condition: string;
  address: string;
  country: string;
  city: string;
  facilities: string[];
  images: File[];
}
