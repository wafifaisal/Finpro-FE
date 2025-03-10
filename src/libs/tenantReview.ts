import { IReview, IReviewReplies } from "../types/review";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL_BE; 

export async function getReviewsByTenant(tenantId: string): Promise<IReview[]> {
  try {
    const response = await fetch(`${BASE_URL}/review-reply/tenant/${tenantId}`);

    if (!response.ok) {
      throw new Error(`Error fetching reviews: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Failed to fetch reviews:", error);
    throw error;
  }
}

export async function createReviewReply(
  tenantId: string,
  reviewId: number,
  reply: string
): Promise<IReviewReplies> {
  try {
    const response = await fetch(`${BASE_URL}/review-reply`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ tenantId, reviewId, reply }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to create review reply");
    }

    return await response.json();
  } catch (error) {
    console.error("Failed to create review reply:", error);
    throw error;
  }
}
