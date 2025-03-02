"use client";

import React from "react";
import { Star } from "lucide-react";
import { Review } from "@/types/types";
import Image from "next/image";

interface ReviewsProps {
  reviews: Review[];
}

const Reviews: React.FC<ReviewsProps> = ({ reviews }) => {
  return (
    <div className="mt-12">
      <h2 className="text-2xl font-semibold mb-4">Ulasan</h2>
      {reviews && reviews.length > 0 ? (
        reviews.map((review) => (
          <div key={review.id} className="mb-4 border-b pb-4">
            <div className="flex items-center justify-between">
              {review.user && (
                <div className="flex items-center space-x-2">
                  <Image
                    src={review.user.avatar}
                    alt={review.user.username}
                    width={32}
                    height={32}
                    className="w-8 h-8 rounded-full"
                  />
                  <div>
                    <p className="font-medium">{review.user.username}</p>
                    <p className="text-sm text-gray-600">{review.user.email}</p>
                  </div>
                </div>
              )}
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 text-rose-500" />
                <span className="font-medium">{review.rating} / 5</span>
              </div>
            </div>
            <div
              className="mt-2"
              dangerouslySetInnerHTML={{ __html: review.review }}
            ></div>
          </div>
        ))
      ) : (
        <p>Belum ada ulasan.</p>
      )}
    </div>
  );
};

export default Reviews;
