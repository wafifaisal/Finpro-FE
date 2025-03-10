import { IBooking } from "@/types/booking";

export function calculateBookingCosts(booking: IBooking) {
  const startDate = new Date(booking.start_date);
  const endDate = new Date(booking.end_date);
  const nights = Math.ceil(
    (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
  );
  const quantity = booking.quantity || 1;
  let seasonalNights = 0;
  let regularNights = 0;
  let seasonalCost = 0;
  let regularCost = 0;

  for (let i = 0; i < nights; i++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(currentDate.getDate() + i);
    let priceForNight = booking.room_types.price;
    let isSeasonal = false;

    if (
      booking.room_types.seasonal_prices &&
      booking.room_types.seasonal_prices.length > 0
    ) {
      for (const sp of booking.room_types.seasonal_prices) {
        if (sp.dates && sp.dates.length > 0) {
          const target = currentDate.toISOString().split("T")[0];
          if (
            sp.dates.some(
              (d: string) => new Date(d).toISOString().split("T")[0] === target
            )
          ) {
            priceForNight = Number(sp.price);
            isSeasonal = true;
            break;
          }
        } else if (sp.start_date && sp.end_date) {
          const spStart = new Date(sp.start_date);
          const spEnd = new Date(sp.end_date);
          if (currentDate >= spStart && currentDate <= spEnd) {
            priceForNight = Number(sp.price);
            isSeasonal = true;
            break;
          }
        }
      }
    }

    if (isSeasonal) {
      seasonalNights++;
      seasonalCost += priceForNight * quantity;
    } else {
      regularNights++;
      regularCost += priceForNight * quantity;
    }
  }

  const roomCost = seasonalCost + regularCost;
  const breakfastCost =
    booking.room_types.has_breakfast && booking.add_breakfast
      ? booking.room_types.breakfast_price * quantity * nights
      : 0;
  const computedTotal = roomCost + breakfastCost;

  return {
    nights,
    seasonalNights,
    regularNights,
    roomCost,
    breakfastCost,
    computedTotal,
  };
}
