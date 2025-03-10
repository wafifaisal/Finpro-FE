import { BookingStatus, IBooking } from "@/types/booking";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL_BE;

interface ITenantBookingsResponse {
  bookings: IBooking[];
  totalPages: number;
}

export async function getTenantBooking(
  tenantId: string,
  queryString: string = ""
): Promise<ITenantBookingsResponse> {
  const response = await fetch(
    `${BASE_URL}/tenant-bookings/${tenantId}?${queryString}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  if (!response.ok) {
    throw new Error(`Error ${response.status}: ${response.statusText}`);
  }
  const data = await response.json();
  return data;
}

export const updateBookingStatus = async (
  bookingId: string,
  status: BookingStatus
) => {
  try {
    const response = await fetch(
      `${BASE_URL}/tenant-bookings/${bookingId}/status`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      }
    );

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Failed to update booking status:", error);
    throw error;
  }
};

export const resendBookingConfirmation = async (bookingId: string) => {
  try {
    const response = await fetch(
      `${BASE_URL}/tenant-bookings/${bookingId}/resend-confirmation`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      }
    );

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Failed to resend booking confirmation email:", error);
    throw error;
  }
};

export const cancelBooking = async (bookingId: string, tenantId: string) => {
  try {
    const response = await fetch(
      `${BASE_URL}/tenant-bookings/${bookingId}/cancel-booking`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tenantId }),
      }
    );

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Failed to cancel booking:", error);
    throw error;
  }
};
