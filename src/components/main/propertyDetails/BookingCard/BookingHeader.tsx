"use client";

import React from "react";
import { Star } from "lucide-react";

interface BookingHeaderProps {
  overallRating: number;
}

const BookingHeader: React.FC<BookingHeaderProps> = ({ overallRating }) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <div className="flex items-center gap-1">
        <Star className="w-4 h-4 text-rose-500" />
        <span className="text-sm font-medium">
          {overallRating ? overallRating.toFixed(1) : "0.0"}
        </span>
      </div>
    </div>
  );
};

export default BookingHeader;
