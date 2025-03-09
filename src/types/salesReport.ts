export interface ISalesReport {
  id: string;
  num_of_guests: number;
  total_price: number;
  quantity: number;
  add_breakfast: boolean;
  start_date: Date;
  end_date: Date;
  created_at: Date;
  user: {
    id: string;
    username: string;
    email: string;
  };
  room_types: {
    name: string;
    price: number;
    has_breakfast: boolean;
    property: {
      name: string;
    };
  };
}
