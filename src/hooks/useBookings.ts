import { useCallback, useEffect, useState } from "react";
import { IBooking } from "@/types/booking";
import { getTenantBooking } from "@/libs/tenantBooking";
import { useSearchParams } from "next/navigation";

export const useBookings = (tenantId?: string) => {
  const searchParams = useSearchParams();
  const [bookings, setBookings] = useState<IBooking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [totalPages, setTotalPages] = useState<number>(1);

  const queryString = searchParams.toString();

  const fetchBookings = useCallback(async () => {
    if (!tenantId) return;
    setLoading(true);
    try {
      const data = await getTenantBooking(tenantId, queryString);
      setBookings(data.bookings);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  }, [tenantId, queryString]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  return { bookings, setBookings, loading, refetch: fetchBookings, totalPages };
};
