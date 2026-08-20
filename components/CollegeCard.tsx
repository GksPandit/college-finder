"use client";
import SaveCollegeButton from "./SaveCollegeButton";

import { useState } from "react";

type College = {
  id: number;
  name: string;
  location: string;
  state?: string;
  fees: number;
  rating: number;
  placementAverage?: number;
  placementHighest?: number;
  placement?: number;
  description?: string;
  website?: string | null;
};

type CollegeCardProps = {
  college: College;
};

export default function CollegeCard({
  college,
}: CollegeCardProps) {
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  async function toggleSave() {
    if (loading) return;

    setLoading(true);

    try {
      const response = await fetch("/api/saved-colleges", {
        method: saved ? "DELETE" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          collegeId: college.id,
        }),
      });

      const result = await response.json();

      if (response.status === 401) {
        alert("Please login first");
        window.location.href = "/login";
        return;
      }

      if (!response.ok) {
        alert(result.message || "Something went wrong");
        return;
      }

      setSaved(!saved);
    } catch (error) {
      console.error("Save college error:", error);
      alert("Unable to save college");
    } finally {
      setLoading(false);
    }
  }

  return (
    <article className="rounded-2xl border bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">
            {college.name}
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            📍 {college.location}
            {college.state ? `, ${college.state}` : ""}
          </p>
        </div>

        {/* Save */}
        <button
          onClick={toggleSave}
          disabled={loading}
          title={saved ? "Remove from saved" : "Save college"}
          className={`rounded-full border px-3 py-2 text-xl transition ${
            saved
              ? "border-red-200 bg-red-50 text-red-500"
              : "text-gray-400 hover:bg-gray-50 hover:text-red-500"
          }`}
        >
          {saved ? "♥" : "♡"}
        </button>
      </div>

      {/* Description */}
      {college.description && (
        <p className="mt-4 line-clamp-2 text-sm text-gray-600">
          {college.description}
        </p>
      )}

      {/* Stats */}
      <div className="mt-5 grid grid-cols-2 gap-3">
        <div className="rounded-lg bg-slate-50 p-3">
          <p className="text-xs text-gray-500">
            Fees
          </p>

          <p className="mt-1 font-bold text-gray-900">
            ₹{college.fees.toLocaleString()}
          </p>
        </div>

        <div className="rounded-lg bg-slate-50 p-3">
          <p className="text-xs text-gray-500">
            Rating
          </p>

          <p className="mt-1 font-bold text-gray-900">
            ⭐ {college.rating}
          </p>
        </div>

        <div className="rounded-lg bg-slate-50 p-3">
          <p className="text-xs text-gray-500">
            Avg Placement
          </p>

          <p className="mt-1 font-bold text-gray-900">
            ₹
            {(
              college.placementAverage ??
              college.placement ??
              0
            ).toLocaleString()}{" "}
            LPA
          </p>
        </div>

        <div className="rounded-lg bg-slate-50 p-3">
          <p className="text-xs text-gray-500">
            Highest
          </p>

          <p className="mt-1 font-bold text-gray-900">
            ₹{college.placementHighest ?? 0} LPA
          </p>
        </div>
      </div>

      {/* Buttons */}
      <div className="mt-5 flex gap-3">
        <a
          href={`/colleges/${college.id}`}
          className="flex-1 rounded-lg bg-indigo-600 px-4 py-2.5 text-center text-sm font-semibold text-white hover:bg-indigo-700"
        >
          View Details
        </a>

        <a
          href="/compare"
          className="rounded-lg border px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
        >
          Compare
        </a>
      </div>
    </article>
  );
}