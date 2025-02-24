import { SeasonalPrice } from "@/types/createRoomTypes";

export interface SeasonalPriceItemProps {
  price: SeasonalPrice;
  index: number;
  roomIndex: number;
  remove: (index: number) => void;
  setFieldValue: (
    field: string,
    value: unknown,
    shouldValidate?: boolean
  ) => void;
  updateRecurringDates: (
    idx: number,
    newStart: string,
    newEnd: string,
    newApplyWeekend: boolean,
    newApplyHoliday: boolean
  ) => void;
}
