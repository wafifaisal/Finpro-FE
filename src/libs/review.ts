import { IBooking } from "@/types/booking";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL_BE;

export async function getUserReviews(
  userId: string,
  page: number,
  limit: number,
  displayType?: "reviewed" | "unreviewed"
): Promise<{
  bookings: IBooking[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}> {
  try {
    let url = `${BASE_URL}/reviews/${userId}?page=${page}&limit=${limit}`;
    if (displayType) {
      url += `&displayType=${displayType}`;
    }
    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch reviews");
    return response.json();
  } catch (error) {
    console.error("Error fetching user reviews:", error);
    throw error;
  }
}

export async function getBookingById(bookingId: string): Promise<IBooking> {
  try {
    const response = await fetch(`${BASE_URL}/reviews/create/${bookingId}`);
    if (!response.ok) throw new Error("Failed to fetch booking");
    return response.json();
  } catch (error) {
    console.error("Error fetching booking:", error);
    throw error;
  }
}

export async function submitReview({
  userId,
  bookingId,
  rating,
  comment,
}: {
  userId: string;
  bookingId: string;
  rating: number;
  comment: string;
}): Promise<void> {
  try {
    const response = await fetch(`${BASE_URL}/reviews`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId, bookingId, rating, comment }),
    });

    if (!response.ok) {
      throw new Error("Failed to submit review");
    }
  } catch (error) {
    console.error("Error submitting review:", error);
    throw error;
  }
}
