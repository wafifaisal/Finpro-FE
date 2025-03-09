import Swal from "sweetalert2";
import {
  IBooking,
  ICreateBooking,
  IUserBookingsResponse,
} from "@/types/booking";

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
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Gagal mengambil booking.";
    console.error("Gagal mengambil booking:", errorMessage);
    Swal.fire({
      icon: "error",
      title: "Kesalahan!",
      text: errorMessage,
    });
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
    Swal.fire({
      icon: "success",
      title: "Booking Dibuat!",
      text: "Booking telah berhasil dibuat.",
    });
    return data.booking as IBooking;
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Gagal membuat booking.";
    console.error("Gagal membuat booking:", errorMessage);
    Swal.fire({
      icon: "error",
      title: "Kesalahan!",
      text: errorMessage,
    });
    throw error;
  }
};

export const getUserBookings = async (
  page: number = 1,
  limit: number = 4,
  search?: string,
  status?: string,
  reservationNo?: string,
  filterCheckIn?: Date | null,
  filterCheckOut?: Date | null
): Promise<IUserBookingsResponse> => {
  try {
    const queryParams = new URLSearchParams();
    queryParams.append("page", page.toString());
    queryParams.append("limit", limit.toString());
    if (search) {
      queryParams.append("search", search);
    }
    if (status && status !== "all") {
      queryParams.append("status", status);
    }
    if (reservationNo) {
      queryParams.append("reservationNo", reservationNo);
    }
    if (filterCheckIn) {
      queryParams.append("checkIn", filterCheckIn.toISOString());
    }
    if (filterCheckOut) {
      queryParams.append("checkOut", filterCheckOut.toISOString());
    }

    const token = localStorage.getItem("token");
    if (!token) throw new Error("Token tidak ditemukan");

    const response = await fetch(
      `${BASE_URL}/user-bookings/list?${queryParams.toString()}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return { result: data.result as IBooking[], totalCount: data.totalCount };
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Gagal mengambil daftar booking pengguna.";
    console.error("Gagal mengambil daftar booking pengguna:", errorMessage);
    Swal.fire({
      icon: "error",
      title: "Kesalahan!",
      text: errorMessage,
    });
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
    Swal.fire({
      icon: "success",
      title: "Booking Dibatalkan!",
      text: "Booking telah berhasil dibatalkan.",
    });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Gagal membatalkan booking.";
    console.error("Gagal membatalkan booking:", errorMessage);
    Swal.fire({
      icon: "error",
      title: "Kesalahan!",
      text: errorMessage,
    });
    throw error;
  }
};
