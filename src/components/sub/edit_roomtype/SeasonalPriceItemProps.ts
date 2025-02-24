import { SeasonalPrice } from "@/types/EditRoomTypes";

export interface SeasonalPriceItemProps {
  roomIndex: number;
  idx: number;
  price: SeasonalPrice;
  remove: (index: number) => void;
  setFieldValue: <T>(field: string, value: T, shouldValidate?: boolean) => void;
  updateRecurringDates: (
    idx: number,
    start_date: string,
    end_date: string,
    apply_weekend: boolean,
    apply_holiday: boolean
  ) => void;
  parseCurrency: (value: string) => number;
}
