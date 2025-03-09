"use client";

import React, { useState } from "react";
import { Star } from "lucide-react";
import { Review } from "@/types/types";
import Image from "next/image";

interface ReviewsProps {
  reviews: Review[];
  itemsPerPage?: number;
}

const Reviews: React.FC<ReviewsProps> = ({ reviews, itemsPerPage = 5 }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(reviews.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentReviews = reviews.slice(startIndex, startIndex + itemsPerPage);

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-semibold mb-4">Ulasan</h2>
      {currentReviews && currentReviews.length > 0 ? (
        currentReviews.map((review) => (
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
            {review.reply && (
              <div className="mt-2 p-2 bg-gray-100 rounded">
                <p className="text-sm text-gray-800 font-medium">
                  Tenant Reply:
                </p>
                <p className="text-gray-600">{review.reply.reply}</p>
              </div>
            )}
          </div>
        ))
      ) : (
        <p>Belum ada ulasan.</p>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-4 space-x-2">
          <button
            onClick={handlePrev}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-200 rounded-l disabled:opacity-50"
          >
            Sebelumnya
          </button>
          <span className="px-4 py-2 bg-gray-100">
            {currentPage} / {totalPages}
          </span>
          <button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-gray-200 rounded-r disabled:opacity-50"
          >
            Selanjutnya
          </button>
        </div>
      )}
    </div>
  );
};

export default Reviews;
