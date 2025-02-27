import { computeRecurringDates } from "@/helpers/HolidaysUtils";
import { SeasonalPrice } from "@/types/createRoomTypes";

export const getComputedDates = (price: SeasonalPrice): (Date | string)[] => {
  if (
    price.apply_weekend &&
    price.apply_holiday &&
    price.dates &&
    price.dates.length > 0
  ) {
    return price.dates.map((d: string) => new Date(d));
  }
  if (
    (price.apply_weekend || price.apply_holiday) &&
    price.start_date &&
    price.end_date
  ) {
    return computeRecurringDates(
      price.start_date,
      price.end_date,
      price.apply_weekend ?? false,
      price.apply_holiday ?? false
    );
  }
  return [];
};
