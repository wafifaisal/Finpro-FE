import { CreateRoomTypeFormValues } from "@/types/createRoomTypes";

const initialValues: CreateRoomTypeFormValues = {
  rooms: [
    {
      name: "",
      stock: "",
      price: 0,
      capacity: "",
      bed_details: "",
      has_breakfast: false,
      breakfast_price: 0,
      images: [],
      facilities: [],
      imagePreviews: [],
      seasonal_prices: [],
      unavailable: [],
    },
  ],
};

export default initialValues;
