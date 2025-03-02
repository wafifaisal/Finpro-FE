import { Star } from "lucide-react";

export default function Rating({
  setFieldValue,
  values,
}: {
  setFieldValue: any;
  values: number;
}) {
  const handleRating = (rating: number) => {
    setFieldValue("rating", rating);
  };

  return (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`cursor-pointer w-8 h-8 ${
            star <= values ? "text-yellow-400" : "text-gray-300"
          }`}
          onClick={() => handleRating(star)}
        />
      ))}
    </div>
  );
}
