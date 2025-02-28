import { IBooking } from "@/types/booking";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL_BE; //

export async function getUserReviews(userId: string): Promise<IBooking[]> {
  try {
    const response = await fetch(`${BASE_URL}/reviews/${userId}`);
    if (!response.ok) throw new Error("Failed to fetch reviews");
    return response.json();
  } catch (error) {
    console.error("Error fetching user reviews:", error);
    throw error;
  }
}
