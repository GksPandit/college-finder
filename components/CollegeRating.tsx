"use client";

import { useEffect, useState } from "react";

type Review = {
  rating: number;
};

export default function CollegeRating({
  collegeId,
}: {
  collegeId: number;
}) {
  const [average, setAverage] = useState<number | null>(null);
  const [count, setCount] = useState(0);

  useEffect(() => {
    async function loadRating() {
      try {
        const response = await fetch(
          `/api/reviews?collegeId=${collegeId}`
        );

        const result = await response.json();

        if (!response.ok || !result.data) return;

        const reviews: Review[] = result.data;

        if (reviews.length === 0) {
          setAverage(null);
          setCount(0);
          return;
        }

        const total = reviews.reduce(
          (sum, review) => sum + review.rating,
          0
        );

        setAverage(total / reviews.length);
        setCount(reviews.length);
      } catch (error) {
        console.error("Rating error:", error);
      }
    }

    loadRating();
  }, [collegeId]);

  if (average === null) {
    return (
      <span className="text-sm text-gray-500">
        No reviews yet
      </span>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <span className="font-bold text-gray-900">
        ⭐ {average.toFixed(1)}
      </span>

      <span className="text-sm text-gray-500">
        ({count} {count === 1 ? "review" : "reviews"})
      </span>
    </div>
  );
}