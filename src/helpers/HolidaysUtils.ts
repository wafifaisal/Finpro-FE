import Holidays from "date-holidays";
import { eachDayOfInterval, format, isWeekend } from "date-fns";

const hd = new Holidays("ID");

export const getHolidayName = (dateStr: string): string | null => {
  const holiday = hd.isHoliday(new Date(dateStr));
  if (holiday && Array.isArray(holiday) && holiday.length > 0) {
    return holiday[0].name;
  }
  return null;
};

export const computeRecurringDates = (
  start: string,
  end: string,
  applyWeekend: boolean,
  applyHoliday: boolean
): string[] => {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const allDates = eachDayOfInterval({ start: startDate, end: endDate });
  return allDates
    .filter((date) => {
      const weekend = isWeekend(date);
      const holiday = hd.isHoliday(date) ? true : false;
      if (applyWeekend && applyHoliday) return weekend || holiday;
      if (applyWeekend) return weekend;
      if (applyHoliday) return holiday;
      return false;
    })
    .map((date) => format(date, "dd/MM/yyyy"));
};
