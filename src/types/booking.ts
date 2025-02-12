enum BookingStatus {
  new = "new",
  completed = "completed",
  canceled = "canceled",
  waiting_payment = "waiting_payment",
}

enum PaymentMethod {
  Manual = "Manual",
  Midtrans = "Midtrans",
}

export interface IBooking {
  id: string;
  num_of_guests: number;
  total_price: number;
  details?: Record<string, any>;
  start_date: Date;
  end_date: Date;
  created_at: Date;
  updated_at: Date;
  payment_proof?: string;
  payment_method?: PaymentMethod;
  status: BookingStatus;
  user_id: string;
  room_types_id: number;
  room_types: {
    name: string;
    price: number;
    RoomImages: {
      image_url: string;
    }[];
  };
  Review?: IReview[];
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
