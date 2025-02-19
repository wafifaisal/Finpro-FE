// types/types.ts

export interface Location {
  city: string;
  country: string;
  address: string;
  latitude?: number;
  longitude?: number;
}

export interface PropertyImage {
  id: number;
  image_url: string;
}

export interface RoomImage {
  id: number;
  image_url: string;
}

export interface Review {
  id: number;
  rating: number;
  review: string;
  created_at?: string;
}

export interface Unavailable {
  id: number;
  start_date: string;
  end_date: string;
}

// Tipe untuk data seasonal price
export interface SeasonalPrice {
  id: number;
  price: number;
  start_date: string;
  end_date: string;
}

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
  RoomImages: RoomImage[];
  avg_rating?: number;
  Review?: Review[];
  Unavailable?: Unavailable[];
  seasonal_prices?: SeasonalPrice[];
}

export interface Tenant {
  id: string;
  name: string;
  email: string;
  avatar: string;
  createdAt: string;
}

export interface Property {
  id: number;
  name: string;
  desc?: string;
  terms_condition?: string;
  location: Location;
  PropertyImages: PropertyImage[];
  RoomTypes: RoomType[];
  reviews: Review[];
  tenant: Tenant;
  facilities: string[];
}

export interface RoomSelection {
  roomTypeId: number;
  quantity: number;
  addBreakfast: boolean;
}

export interface Totals {
  nights: number;
  basePrice: number;
  breakfastCost: number;
  total: number;
}

export type UserLocation = {
  latitude: number;
  longitude: number;
} | null;

export type PropertyList = {
  id: number;
  name: string;
  desc: string;
  category: string;
  PropertyImages?: { image_url: string }[];
  location: {
    address: string;
    city: string;
    country: string;
    latitude: string;
    longitude: string;
  };
  RoomTypes: {
    id: number;
    name: string;
    price: number;
    seasonal_prices?: { price: number; start_date: string; end_date: string }[];
    avg_rating?: number;
    Unavailable?: { id: number; start_date: string; end_date: string }[];
  }[];
  isAvailable?: boolean;
};

export interface PropertyCardProps {
  property: PropertyList;
  userLocation?: UserLocation;
  loading?: boolean;
  searchStart?: Date;
  searchEnd?: Date;
}
