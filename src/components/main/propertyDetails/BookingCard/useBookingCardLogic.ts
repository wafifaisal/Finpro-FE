import { useMemo, useCallback, useContext } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { SessionContext } from "@/context/sessionProvider";
import { createBooking } from "@/libs/booking";
import { ICreateBooking } from "@/types/booking";
import { useSession } from "@/context/useSessionHook";
import { BookingCardProps } from "./interfaceBookingCard";

export const useBookingCardLogic = ({
  property,
  checkIn,
  checkOut,
  today,
  guests,
  selectedRooms,
}: BookingCardProps) => {
  const { isAuth, type, loading } = useContext(SessionContext) || {};
  const router = useRouter();
  const { user } = useSession();

  // Gunakan overallRating dari property jika ada, jika tidak hitung dari room types.
  const overallRating = useMemo(() => {
    if (property.overallRating != null) {
      return property.overallRating;
    }
    const validRatings = property.RoomTypes.filter(
      (rt) => rt.avg_rating != null
    );
    return validRatings.length > 0
      ? validRatings.reduce((sum, rt) => sum + (rt.avg_rating || 0), 0) /
          validRatings.length
      : 0;
  }, [property]);

  const checkInDate = useMemo(
    () => (checkIn ? new Date(checkIn) : null),
    [checkIn]
  );
  const checkOutDate = useMemo(
    () => (checkOut ? new Date(checkOut) : null),
    [checkOut]
  );
  const todayDate = new Date(today);

  const nights =
    checkInDate && checkOutDate
      ? Math.ceil(
          (checkOutDate.getTime() - checkInDate.getTime()) /
            (1000 * 60 * 60 * 24)
        )
      : 0;

  const getMinAvailability = useCallback(
    (roomId: number): number => {
      const room = property.RoomTypes.find((rt) => rt.id === roomId);
      if (!room || !checkInDate || !checkOutDate) return room?.stock || 0;

      let minAvail = room.stock;
      const dates: Date[] = [];
      const current = new Date(checkInDate);
      while (current < checkOutDate) {
        dates.push(new Date(current));
        current.setDate(current.getDate() + 1);
      }

      dates.forEach((date) => {
        const dateStr = date.toISOString().split("T")[0];
        const record = room.RoomAvailability?.find((ra) => {
          const raDateStr = new Date(ra.date).toISOString().split("T")[0];
          return raDateStr === dateStr;
        });
        const availForDate = record ? record.availableCount : room.stock;
        if (availForDate < minAvail) {
          minAvail = availForDate;
        }
      });
      return minAvail;
    },
    [property.RoomTypes, checkInDate, checkOutDate]
  );

  const bookingUnavailable = useMemo(() => {
    if (!checkInDate || !checkOutDate) return false;
    for (const selection of selectedRooms) {
      const minAvail = getMinAvailability(selection.roomTypeId);
      if (selection.quantity > minAvail) {
        return true;
      }
    }
    return false;
  }, [selectedRooms, checkInDate, checkOutDate, getMinAvailability]);

  const computedTotals = useMemo(() => {
    if (!checkInDate || !checkOutDate || nights === 0) return null;
    let roomCost = 0;
    let breakfastCost = 0;

    selectedRooms.forEach((selection) => {
      const roomType = property.RoomTypes.find(
        (rt) => rt.id === selection.roomTypeId
      );
      if (!roomType) return;
      const activeSeasonalPrice =
        roomType.seasonal_prices &&
        roomType.seasonal_prices.find((sp) => {
          if (sp.dates && sp.dates.length > 0) {
            const target = checkInDate.toISOString().split("T")[0];
            return sp.dates.some((d: string) => {
              const dStr = new Date(d).toISOString().split("T")[0];
              return dStr === target;
            });
          } else if (sp.start_date && sp.end_date) {
            const start = new Date(sp.start_date);
            const end = new Date(sp.end_date);
            return checkInDate >= start && checkInDate <= end;
          }
          return false;
        });
      const effectivePrice = activeSeasonalPrice
        ? Number(activeSeasonalPrice.price)
        : roomType.price;
      roomCost += effectivePrice * selection.quantity * nights;
      if (selection.addBreakfast) {
        breakfastCost += roomType.breakfast_price * selection.quantity * nights;
      }
    });

    return {
      nights,
      roomCost,
      breakfastCost,
      total: roomCost + breakfastCost,
    };
  }, [checkInDate, checkOutDate, nights, selectedRooms, property.RoomTypes]);

  const handleBooking = async () => {
    if (loading) return;
    if (!isAuth) {
      const currentPath = window.location.pathname + window.location.search;
      Swal.fire({
        icon: "warning",
        title: "Kamu Belum Login",
        text: "Anda harus login untuk memesan. Mengalihkan ke login...",
        timer: 3000,
        timerProgressBar: true,
        showConfirmButton: false,
      }).then(() => {
        router.replace(
          `/auth/user/login?redirect=${encodeURIComponent(currentPath)}`
        );
      });
      return;
    }
    if (type !== "user") {
      router.replace("/not-authorized");
      return;
    }

    try {
      const bookingData: ICreateBooking = {
        userId: user?.id || "",
        roomTypeId: selectedRooms[0]?.roomTypeId,
        quantity: selectedRooms[0]?.quantity || 1,
        numOfGuests: guests,
        startDate: checkIn,
        endDate: checkOut,
        payment_method: "Manual",
        add_breakfast: selectedRooms[0]?.addBreakfast || false,
      };

      const newBooking = await createBooking(bookingData);
      console.log("Booking successful:", newBooking);
    } catch (error) {
      console.error("Booking failed:", error);
    }
  };

  return {
    overallRating,
    checkInDate,
    checkOutDate,
    todayDate,
    bookingUnavailable,
    computedTotals,
    handleBooking,
    getMinAvailability,
  };
};
