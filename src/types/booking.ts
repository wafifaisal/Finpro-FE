export enum BookingStatus {
  new = "new",
  completed = "completed",
  canceled = "canceled",
  waiting_payment = "waiting_payment",
}

export interface IUserBookingsResponse {
  result: IBooking[];
  totalCount: number;
}

export interface RoomSelection {
  roomTypeId: number;
  quantity: number;
  addBreakfast: boolean;
}

export interface ISeasonalPrice {
  price: number;
  dates?: string[];
  start_date?: Date;
  end_date?: Date;
}

export interface IBooking {
  quantity: number;
  id: string;
  num_of_guests: number;
  total_price: number;
  details?: string;
  start_date: Date;
  add_breakfast: boolean;
  end_date: Date;
  created_at: Date;
  updated_at: Date;
  payment_proof?: string;
  payment_method?: "Manual" | "Midtrans";
  status: BookingStatus;
  user_id: string;
  room_types_id: number;
  room_types: {
    has_breakfast: boolean;
    breakfast_price: number;
    name: string;
    price: number;
    seasonal_prices?: ISeasonalPrice[];
    property: {
      name: string;
    };
    RoomImages: {
      image_url: string;
    }[];
  };
  Review?: IReview;
  selection?: RoomSelection;
}

export interface ICreateBooking {
  userId: string;
  roomTypeId: number;
  quantity: number;
  numOfGuests: number;
  startDate: string;
  endDate: string;
  payment_method: "Manual" | "Midtrans";
  add_breakfast: boolean;
}

export interface IReview {
  id: number;
  rating: number;
  review: string;
  user_id: string;
  room_types_id: number;
  booking_id: string;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
}
