"use client";

import React from "react";
import { Star } from "lucide-react";
import { Property } from "@/types/types";

interface ReviewsProps {
  reviews: Property["reviews"];
}

const Reviews: React.FC<ReviewsProps> = ({ reviews }) => {
  return (
    <div className="mt-12">
      <h2 className="text-2xl font-semibold mb-4">Ulasan</h2>
      {reviews && reviews.length > 0 ? (
        reviews.map((review) => (
          <div key={review.id} className="mb-4 border-b pb-4">
            <div className="flex items-center">
              <Star className="w-4 h-4 text-rose-500" />
              <span className="ml-1 font-medium">{review.rating}</span>
            </div>
            <p className="mt-2">{review.review}</p>
          </div>
        ))
      ) : (
        <p>Belum ada ulasan.</p>
      )}
    </div>
  );
};

export default Reviews;
