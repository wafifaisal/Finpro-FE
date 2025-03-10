"use client";

import { IReview } from "@/types/review";
import ReviewCard from "./reviewCard";

interface ReviewListProps {
  reviews: IReview[];
  reply: { [key: number]: string };
  submitting: { [key: number]: boolean };
  onReplyChange: (reviewId: number, value: string) => void;
  onOpenReply: (reviewId: number) => void;
}

export default function ReviewList({
  reviews,
  reply,
  submitting,
  onReplyChange,
  onOpenReply,
}: ReviewListProps) {
  return (
    <>
      {reviews.map((review) => (
        <ReviewCard
          key={review.id}
          review={review}
          reply={reply[review.id] || ""}
          submitting={!!submitting[review.id]}
          onReplyChange={(value) => onReplyChange(review.id, value)}
          onOpenReply={() => onOpenReply(review.id)}
        />
      ))}
    </>
  );
}
