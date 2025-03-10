"use client";

import React, { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Review } from "@/types/types";
import { getReviewsByTenant } from "@/libs/tenantReview";
import ReviewItem from "./ReviewItem";

interface ReviewsProps {
  tenantId: string;
  itemsPerPage?: number;
  reviews?: Review[];
}

const Reviews: React.FC<ReviewsProps> = ({ tenantId, itemsPerPage = 3 }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [reviewList, setReviewList] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hoveredRatings, setHoveredRatings] = useState<{
    [key: string]: boolean;
  }>({});
  const totalPages = Math.ceil(reviewList.length / itemsPerPage);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const isPaginated = useRef(false);

  useEffect(() => {
    async function fetchReviews() {
      setIsLoading(true);
      try {
        const reviewsData = await getReviewsByTenant(tenantId);
        const transformedReviews: Review[] = reviewsData.map((review) => ({
          ...review,
          created_at:
            review.created_at instanceof Date
              ? review.created_at.toISOString()
              : review.created_at,
          user: review.user
            ? {
                avatar: review.user.avatar,
                username: review.user.name,
                email: review.user.email,
              }
            : undefined,
        }));
        setReviewList(transformedReviews);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchReviews();
  }, [tenantId]);

  useEffect(() => {
    if (isPaginated.current && headingRef.current) {
      const yOffset = -100;
      const y =
        headingRef.current.getBoundingClientRect().top +
        window.pageYOffset +
        yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
      isPaginated.current = false;
    }
  }, [currentPage]);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentReviews = reviewList.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handlePrev = () => {
    if (currentPage > 1) {
      isPaginated.current = true;
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      isPaginated.current = true;
      setCurrentPage((prev) => prev + 1);
    }
  };

  const toggleRatingHover = (reviewId: string, isHovered: boolean) => {
    setHoveredRatings((prev) => ({
      ...prev,
      [reviewId]: isHovered,
    }));
  };

  const renderStars = (rating: number) => {
    const fullStars = "★".repeat(Math.floor(rating));
    const emptyStars = "☆".repeat(5 - Math.floor(rating));
    return (
      <span className="text-rose-500">
        {fullStars}
        {emptyStars}
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="mt-12">
        <h2 ref={headingRef} className="text-2xl font-semibold mb-4">
          Ulasan
        </h2>
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="border-b pb-4">
              <div className="flex justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                  <div>
                    <div className="h-4 w-32 bg-gray-200 rounded"></div>
                    <div className="h-3 w-24 mt-1 bg-gray-200 rounded"></div>
                  </div>
                </div>
                <div className="h-4 w-16 bg-gray-200 rounded"></div>
              </div>
              <div className="mt-3 h-4 w-full bg-gray-200 rounded"></div>
              <div className="mt-2 h-4 w-3/4 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mt-12">
      <h2
        ref={headingRef}
        className="text-2xl font-semibold mb-6 text-gray-800"
      >
        Ulasan
      </h2>

      {currentReviews && currentReviews.length > 0 ? (
        <div className="space-y-6">
          {currentReviews.map((review) => (
            <ReviewItem
              key={review.id}
              review={review}
              hoveredRatings={hoveredRatings}
              toggleRatingHover={toggleRatingHover}
              renderStars={renderStars}
            />
          ))}
        </div>
      ) : (
        <div className="p-6 text-center bg-gray-50 rounded-lg">
          <p className="text-gray-500">Belum ada ulasan.</p>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-8 space-x-2">
          <button
            onClick={handlePrev}
            disabled={currentPage === 1}
            className="flex items-center justify-center w-10 h-10 rounded-full border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
            aria-label="Previous page"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>

          <div className="px-4 text-sm text-gray-600">
            <span className="font-medium">{currentPage}</span> dari {totalPages}
          </div>

          <button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className="flex items-center justify-center w-10 h-10 rounded-full border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
            aria-label="Next page"
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      )}
    </div>
  );
};

export default Reviews;
