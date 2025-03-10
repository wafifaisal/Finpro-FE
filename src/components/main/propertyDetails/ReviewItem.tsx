"use client";

import React from "react";
import { motion } from "framer-motion";
import { Star, MessageSquare } from "lucide-react";
import Image from "next/image";
import { Review } from "@/types/types";

interface ReviewItemProps {
  review: Review;
  hoveredRatings: { [key: string]: boolean };
  toggleRatingHover: (reviewId: string, isHovered: boolean) => void;
  renderStars: (rating: number) => JSX.Element;
}

const ReviewItem: React.FC<ReviewItemProps> = ({
  review,
  hoveredRatings,
  toggleRatingHover,
  renderStars,
}) => {
  return (
    <motion.div
      key={review.id}
      className="mb-6 pb-6 border-b border-gray-200"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between">
        {review.user && (
          <div className="flex items-center space-x-3">
            <div className="relative overflow-hidden rounded-full border-2 border-white shadow">
              <Image
                src={review.user.avatar}
                alt={review.user.username}
                width={40}
                height={40}
                className="w-10 h-10 object-cover rounded-full"
              />
            </div>
            <div>
              <p className="font-medium text-gray-800">
                {review.user.username}
              </p>
              <p className="text-xs text-gray-500">
                {review.created_at &&
                  new Date(review.created_at).toLocaleDateString("id-ID", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
              </p>
            </div>
          </div>
        )}
        <motion.div
          className="flex items-center px-3 py-1 bg-black rounded-full cursor-auto"
          whileHover={{ scale: 1.05 }}
          onHoverStart={() => toggleRatingHover(review.id.toString(), true)}
          onHoverEnd={() => toggleRatingHover(review.id.toString(), false)}
        >
          <Star className="w-4 h-4 text-rose-500 mr-1 fill-rose-500" />
          <motion.span
            className="font-medium text-white"
            initial={false}
            animate={
              hoveredRatings[review.id.toString()]
                ? { opacity: 0, position: "absolute" }
                : { opacity: 1, position: "relative" }
            }
            transition={{ duration: 0.2 }}
          >
            {review.rating} / 5
          </motion.span>
          <motion.span
            className="font-medium text-white"
            initial={false}
            animate={
              hoveredRatings[review.id.toString()]
                ? { opacity: 1, position: "relative" }
                : { opacity: 0, position: "absolute" }
            }
            transition={{ duration: 0.2 }}
          >
            {renderStars(review.rating)}
          </motion.span>
        </motion.div>
      </div>

      <div
        className="text-gray-700 mt-3 leading-relaxed"
        dangerouslySetInnerHTML={{ __html: review.review }}
      ></div>

      {review.reply && (
        <motion.div
          className="mt-4 ml-5 p-4 bg-gray-50 rounded-lg border-l-4 border-rose-400"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.3 }}
        >
          <div className="flex justify-between items-start mb-3">
            <motion.div
              className="inline-flex items-center px-2 py-1 bg-rose-500 text-white text-xs rounded-full"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{
                repeat: 1,
                repeatType: "reverse",
                duration: 0.3,
                delay: 0.4,
              }}
            >
              <MessageSquare className="w-3 h-3 mr-1" />
              Tenant
            </motion.div>
          </div>

          <div
            className="text-gray-700 text-sm leading-relaxed"
            dangerouslySetInnerHTML={{ __html: review.reply.reply }}
          ></div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default ReviewItem;
