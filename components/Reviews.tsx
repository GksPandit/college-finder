"use client";

import { FormEvent, useEffect, useState } from "react";

type Review = {
  id: number;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
};

type ReviewsProps = {
  collegeId: number;
};

export default function Reviews({
  collegeId,
}: ReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function fetchReviews() {
    try {
      setLoading(true);

      const response = await fetch(
        `/api/reviews?collegeId=${collegeId}`
      );

      const result = await response.json();

      if (!response.ok) {
        setError(result.message || "Failed to load reviews");
        return;
      }

      setReviews(result.data || []);
    } catch (error) {
      console.error(error);
      setError("Unable to load reviews");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchReviews();
  }, [collegeId]);

  async function handleSubmit(
    e: FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!comment.trim()) {
      setError("Please write a review.");
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          collegeId,
          rating,
          comment: comment.trim(),
        }),
      });

      const result = await response.json();

      if (response.status === 401) {
        setError("Please login to write a review.");
        return;
      }

      if (!response.ok) {
        setError(result.message || "Failed to submit review");
        return;
      }

      setSuccess("Review added successfully! ⭐");

      setComment("");
      setRating(5);

      await fetchReviews();
    } catch (error) {
      console.error(error);
      setError("Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="mt-10 rounded-2xl border bg-white p-6 shadow-sm">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">
          Student Reviews ⭐
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          See what students think about this college.
        </p>
      </div>

      {/* Write review */}
      <div className="mt-6 rounded-xl bg-slate-50 p-5">
        <h3 className="font-bold text-gray-900">
          Write a Review
        </h3>

        <form
          onSubmit={handleSubmit}
          className="mt-4 space-y-4"
        >
          {/* Rating */}
          <div>
            <label className="text-sm font-semibold text-gray-700">
              Rating
            </label>

            <select
              value={rating}
              onChange={(e) =>
                setRating(Number(e.target.value))
              }
              className="mt-2 rounded-lg border bg-white px-4 py-2 outline-none focus:border-indigo-500"
            >
              <option value={5}>⭐⭐⭐⭐⭐ — Excellent</option>
              <option value={4}>⭐⭐⭐⭐ — Very Good</option>
              <option value={3}>⭐⭐⭐ — Good</option>
              <option value={2}>⭐⭐ — Average</option>
              <option value={1}>⭐ — Poor</option>
            </select>
          </div>

          {/* Comment */}
          <div>
            <label className="text-sm font-semibold text-gray-700">
              Your Review
            </label>

            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your experience..."
              rows={4}
              className="mt-2 w-full resize-none rounded-lg border bg-white px-4 py-3 outline-none focus:border-indigo-500"
            />
          </div>

          {/* Error */}
          {error && (
            <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Success */}
          {success && (
            <div className="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-600">
              {success}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="rounded-lg bg-indigo-600 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting
              ? "Submitting..."
              : "Submit Review"}
          </button>
        </form>
      </div>

      {/* Reviews */}
      <div className="mt-8">
        <h3 className="text-lg font-bold text-gray-900">
          {reviews.length}{" "}
          {reviews.length === 1 ? "Review" : "Reviews"}
        </h3>

        {loading && (
          <p className="mt-4 text-sm text-gray-500">
            Loading reviews...
          </p>
        )}

        {!loading && reviews.length === 0 && (
          <div className="mt-4 rounded-xl border border-dashed p-8 text-center">
            <div className="text-3xl">💬</div>

            <p className="mt-3 font-semibold text-gray-700">
              No reviews yet
            </p>

            <p className="mt-1 text-sm text-gray-500">
              Be the first person to review this college.
            </p>
          </div>
        )}

        <div className="mt-4 space-y-4">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="rounded-xl border p-5"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h4 className="font-bold text-gray-900">
                    {review.userName}
                  </h4>

                  <div className="mt-1 text-sm">
                    {"⭐".repeat(review.rating)}
                  </div>
                </div>

                <span className="text-xs text-gray-400">
                  {new Date(
                    review.createdAt
                  ).toLocaleDateString()}
                </span>
              </div>

              <p className="mt-3 text-sm leading-6 text-gray-600">
                {review.comment}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}