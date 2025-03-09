import Swal from "sweetalert2";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL_BE;

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
      const errorData = await response.json();
      throw new Error(
        errorData.error || `Error ${response.status}: ${response.statusText}`
      );
    }

    const data = await response.json();
    Swal.fire({
      icon: "success",
      title: "Berhasil!",
      text: data.message || "Bukti pembayaran berhasil diunggah.",
    });
    return data.message;
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Gagal mengunggah bukti pembayaran.";
    const displayMessage = errorMessage.includes("expired")
      ? "The payment is expired"
      : errorMessage;
    console.error("Gagal mengunggah bukti pembayaran:", errorMessage);
    Swal.fire({
      icon: "error",
      title: "Kesalahan!",
      text: displayMessage,
    });
    throw error;
  }
};

export const getSnapToken = async (
  bookingId: string,
  quantity: number
): Promise<string> => {
  try {
    const response = await fetch(`${BASE_URL}/user-bookings/payment/midtrans`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ booking_id: bookingId, quantity }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.error || `Error ${response.status}: ${response.statusText}`
      );
    }

    const data = await response.json();
    return data.result as string;
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Gagal mendapatkan Snap Token.";
    const displayMessage = errorMessage.includes("expired")
      ? "The payment is expired"
      : errorMessage;
    console.error("Gagal mendapatkan Snap Token:", errorMessage);
    Swal.fire({
      icon: "error",
      title: "Kesalahan!",
      text: displayMessage,
    });
    throw error;
  }
};

export const midtransWebHook = async (
  transaction_status: string,
  order_id: string
): Promise<string> => {
  try {
    const response = await fetch(`${BASE_URL}/user-bookings/payment/webhook`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ transaction_status, order_id }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.error || `Error ${response.status}: ${response.statusText}`
      );
    }

    const data = await response.json();
    Swal.fire({
      icon: "success",
      title: "Sukses!",
      text: data.message || "Booking status updated successfully",
    });
    return data.message;
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Gagal memproses webhook Midtrans.";
    const displayMessage = errorMessage.includes("expired")
      ? "The payment is expired"
      : errorMessage;
    console.error("Gagal memproses webhook Midtrans:", errorMessage);
    Swal.fire({
      icon: "error",
      title: "Kesalahan!",
      text: displayMessage,
    });
    throw error;
  }
};
