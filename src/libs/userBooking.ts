import { IBooking, ICreateBooking } from "@/types/booking";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL_BE;

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

export const uploadPaymentProof = async (
  bookingId: string,
  formData: FormData
): Promise<string> => {
  try {
    const response = await fetch(`${BASE_URL}/user-bookings/payment-proof`, {
      method: "PATCH",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return data.message;
  } catch (error) {
    console.error("Failed to upload payment proof:", error);
    throw error;
  }
};

export const createBooking = async (
  bookingData: ICreateBooking
): Promise<IBooking> => {
  try {
    const response = await fetch(`${BASE_URL}/user-bookings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bookingData),
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return data.booking as IBooking;
  } catch (error) {
    console.error("Failed to create booking:", error);
    throw error;
  }
};

export const getUserBookings = async (userId: string): Promise<IBooking[]> => {
  try {
    const response = await fetch(`${BASE_URL}/user-bookings/list/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return data.result as IBooking[];
  } catch (error) {
    console.error("Failed to fetch user bookings:", error);
    throw error;
  }
};

export const cancelBooking = async (bookingId: string): Promise<void> => {
  try {
    const response = await fetch(`${BASE_URL}/user-bookings/cancel-booking`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ bookingId }),
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    if (data.error) {
      throw new Error(data.error);
    }
  } catch (error) {
    console.error("Failed to cancel booking:", error);
    throw error;
  }
};
