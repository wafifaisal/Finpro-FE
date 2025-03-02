import { useEffect, useState } from "react";
import { getTenantBooking } from "@/libs/tenantBooking";
import { IBooking } from "@/types/booking";

export const useBookings = (tenantId: string | undefined) => {
  const [bookings, setBookings] = useState<IBooking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!tenantId) {
      console.error("Tenant ID is not available");
      return;
    }
    const fetchBookings = async () => {
      try {
        const data = await getTenantBooking(tenantId);
        setBookings(data);
      } catch (err) {
        console.error("Error fetching bookings", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, [tenantId]);

  return { bookings, setBookings, loading };
};
