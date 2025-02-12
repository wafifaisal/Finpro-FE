import { IBooking } from "@/types/booking";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL_BE; // Adjust the endpoint if needed

export const getBooking = async (bookingId: string): Promise<IBooking> => {
  try {
    const response = await fetch(`${BASE_URL}/user-bookings/${bookingId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return data.result as IBooking;
  } catch (error) {
    console.error("Failed to fetch booking:", error);
    throw error;
  }
};
