import { Property, RoomSelection } from "@/types/types";

/**
 * Format harga singkat. Contoh: Rp1.400.000 → "1.4k"
 */
export const formatShortCurrency = (price: number): string => {
  return `${(price / 1000000).toFixed(1)}k`;
};

export const getCheapestPriceForDate = (
  date: Date,
  property: Property
): number => {
  const prices = property.RoomTypes.map((rt) => {
    let basePrice = rt.price;
    if (rt.seasonal_prices && rt.seasonal_prices.length > 0) {
      const sp = rt.seasonal_prices.find((sp) => {
        if (sp.dates && sp.dates.length > 0) {
          const targetStr = date.toISOString().split("T")[0];
          return sp.dates.some((d: string) => {
            const dStr = new Date(d).toISOString().split("T")[0];
            return dStr === targetStr;
          });
        } else if (sp.start_date && sp.end_date) {
          const start = new Date(sp.start_date);
          const end = new Date(sp.end_date);
          return date >= start && date <= end;
        }
        return false;
      });
      if (sp) {
        basePrice = sp.price;
      }
    }
    return basePrice;
  });
  return Math.min(...prices);
};

export const isDateUnavailable = (
  date: Date,
  property: Property,
  selectedRooms: RoomSelection[]
): boolean => {
  const roomTypesToCheck =
    selectedRooms.length > 0
      ? property.RoomTypes.filter((rt) =>
          selectedRooms.find((s) => s.roomTypeId === rt.id)
        )
      : property.RoomTypes;

  return roomTypesToCheck.every((rt) => {
    if (rt.Unavailable && rt.Unavailable.length > 0) {
      return rt.Unavailable.some((range) => {
        const start = new Date(range.start_date);
        const end = new Date(range.end_date);
        return date >= start && date <= end;
      });
    }
    return false;
  });
};
