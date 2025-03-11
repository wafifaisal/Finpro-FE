"use client";

import Image from "next/image";
import { IReview } from "@/types/review";

interface ReviewCardProps {
  review: IReview;
  reply: string;
  submitting: boolean;
  onReplyChange: (value: string) => void;
  onOpenReply: () => void;
}

export default function ReviewCard({
  review,
  reply,
  submitting,
  onReplyChange,
  onOpenReply,
}: ReviewCardProps) {
  return (
    <div className="border p-4 rounded-xl bg-white shadow-md mt-8">
      {review.propertyName && (
        <p className="text-lg font-bold mb-1">{review.propertyName}</p>
      )}
      {review.user && (
        <div className="flex items-center mb-2 border-b-[1px] pb-2">
          {review.user.avatar && (
            <Image
              src={review.user.avatar}
              alt={review.user.name}
              width={32}
              height={32}
              className="rounded-full mr-2"
            />
          )}
          <span className="text-sm font-semibold">{review.user.name}</span>
        </div>
      )}
      <p
        dangerouslySetInnerHTML={{ __html: review.review }}
        className="text-sm text-gray-600 font-semibold"
      />
      <div className="flex items-center my-2">
        {Array.from({ length: review.rating }).map((_, index) => (
          <span key={index} className="text-rose-500 text-xl">
            ★
          </span>
        ))}
        {Array.from({ length: 5 - review.rating }).map((_, index) => (
          <span key={index} className="text-gray-300 text-xl">
            ★
          </span>
        ))}
        <span className="ml-2 text-sm text-gray-600">({review.rating}/5)</span>
      </div>
      {review.reply ? (
        <div className="mt-2 p-2 bg-gray-100 rounded">
          <p className="text-sm text-gray-800 font-semibold">Balasan:</p>
          <p className="text-sm text-gray-600">{review.reply.reply}</p>
        </div>
      ) : (
        <>
          <textarea
            className="border p-2 w-full mt-2"
            placeholder="Type your reply here..."
            value={reply}
            onChange={(e) => onReplyChange(e.target.value)}
          />
          <button
            className="bg-rose-500 hover:bg-rose-600 text-white px-4 py-2 mt-2 rounded w-full md:w-auto"
            disabled={submitting}
            onClick={onOpenReply}
          >
            {submitting ? "Submitting..." : "Reply"}
          </button>
        </>
      )}
    </div>
  );
}
