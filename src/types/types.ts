import { IReviewReplies } from "./review";

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
  user?: {
    avatar: string;
    username: string;
    email: string;
  };
  reply?: IReviewReplies | null;
}

export interface Unavailable {
  id: number;
  start_date: string;
  end_date: string;
}

export interface SeasonalPrice {
  id: number;
  price: number;
  start_date: string;
  end_date: string;
  dates: string[];
}

export interface RoomAvailability {
  id: number;
  date: string;
  availableCount: number;
  room_typesId: number;
}

export interface RoomType {
  property_id: number;
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
  reviewCount?: number;
  Review?: Review[];
  Unavailable?: Unavailable[];
  seasonal_prices?: SeasonalPrice[];
  RoomAvailability?: RoomAvailability[];
}

export interface Tenant {
  id: string;
  name: string;
  email: string;
  avatar: string;
  createdAt: string;
  properties?: Property[];
}

export interface Property {
  id: number;
  name: string;
  desc?: string;
  terms_condition?: string;
  location: Location;
  PropertyImages: PropertyImage[];
  RoomTypes: RoomType[];
  overallRating?: number;
  totalReviews?: number;
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
    RoomAvailability: boolean;
    id: number;
    name: string;
    price: number;
    seasonal_prices?: {
      price: number;
      start_date: string;
      end_date: string;
      dates: string[];
    }[];
    avg_rating?: number;
    reviewCount?: number;
    Unavailable?: { id: number; start_date: string; end_date: string }[];
    Review?: Review[];
  }[];
  isAvailable?: boolean;
  overallRating?: number;
  totalReviews?: number;
};

export interface PropertyCardProps {
  property: PropertyList;
  userLocation?: UserLocation;
  loading?: boolean;
  searchStart?: Date;
  searchEnd?: Date;
}

export interface SearchField {
  key: string;
  icon: React.ReactNode;
  label: string;
  placeholder: string;
}

export interface SearchValues {
  where: string;
  checkIn: Date | null;
  checkOut: Date | null;
  who: number;
  dateRange: Date[];
  [key: string]: string | number | Date | Date[] | null;
}

export interface FormValues {
  data: string;
  password: string;
}
