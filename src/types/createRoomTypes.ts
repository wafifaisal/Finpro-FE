import { RoomType } from "./roomTypes";

export interface SeasonalPrice {
  price: number;
  start_date: string;
  end_date: string;
  apply_weekend?: boolean;
  apply_holiday?: boolean;
  dates: string[];
}

export interface UnavailablePeriod {
  start_date: string;
  end_date: string;
}

export type RoomFormType = RoomType & {
  imagePreviews: string[];
  seasonal_prices: SeasonalPrice[];
  unavailable: UnavailablePeriod[];
};

export interface CreateRoomTypeFormValues {
  rooms: RoomFormType[];
}
