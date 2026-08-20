"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Link from "next/link";

type College = {
  id: number;
  name: string;
  location: string;
  state: string;
  fees: number;
  rating: number;
  placementAverage: number;
  placementHighest: number;
  description: string;
  website: string | null;
};

type SavedCollege = {
  id: number;
  collegeId: number;
  createdAt: string;
  college: College;
};

export default function SavedCollegesPage() {
  const [savedColleges, setSavedColleges] = useState<
    SavedCollege[]
  >([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function fetchSavedColleges() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "/api/saved-colleges"
      );

      const result = await response.json();

      if (response.status === 401) {
        window.location.href = "/login";
        return;
      }

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Failed to fetch saved colleges"
        );
      }

      setSavedColleges(result.data || []);
    } catch (error) {
      console.error(
        "Saved colleges error:",
        error
      );

      setError(
        "Unable to load saved colleges."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchSavedColleges();
  }, []);

  async function removeCollege(
    savedCollegeId: number
  ) {
    try {
      const response = await fetch(
        `/api/saved-colleges/${savedCollegeId}`,
        {
          method: "DELETE",
        }
      );

      const result = await response.json();

      if (!response.ok) {
        alert(
          result.message ||
            "Failed to remove college"
        );
        return;
      }

      setSavedColleges((current) =>
        current.filter(
          (item) =>
            item.id !== savedCollegeId
        )
      );
    } catch (error) {
      console.error(
        "Remove college error:",
        error
      );

      alert("Something went wrong.");
    }
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <Navbar />

      {/* Header */}
      <section className="bg-indigo-700 px-6 py-14 text-white">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-semibold text-indigo-200">
            YOUR COLLECTION
          </p>

          <h1 className="mt-2 text-4xl font-bold">
            Saved Colleges ❤️
          </h1>

          <p className="mt-3 max-w-2xl text-indigo-100">
            Keep your favorite colleges in one place
            and compare them later.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="mx-auto max-w-7xl px-6 py-10">

        {loading && (
          <div className="grid gap-6 md:grid-cols-2">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="h-64 animate-pulse rounded-2xl bg-white"
              />
            ))}
          </div>
        )}

        {!loading && error && (
          <div className="rounded-2xl border bg-white p-12 text-center">
            <div className="text-4xl">
              ⚠️
            </div>

            <h2 className="mt-4 text-xl font-bold">
              Something went wrong
            </h2>

            <p className="mt-2 text-gray-500">
              {error}
            </p>

            <button
              onClick={fetchSavedColleges}
              className="mt-5 rounded-lg bg-indigo-600 px-5 py-2.5 font-semibold text-white"
            >
              Try Again
            </button>
          </div>
        )}

        {!loading &&
          !error &&
          savedColleges.length === 0 && (
            <div className="rounded-2xl border bg-white p-14 text-center">

              <div className="text-5xl">
                ❤️
              </div>

              <h2 className="mt-5 text-2xl font-bold">
                No saved colleges
              </h2>

              <p className="mx-auto mt-2 max-w-md text-gray-500">
                You haven't saved any colleges yet.
                Explore colleges and save the ones
                you like.
              </p>

              <Link
                href="/colleges"
                className="mt-6 inline-block rounded-lg bg-indigo-600 px-6 py-3 font-semibold text-white hover:bg-indigo-700"
              >
                Explore Colleges
              </Link>
            </div>
          )}

        {!loading &&
          !error &&
          savedColleges.length > 0 && (
            <>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  My Saved Colleges
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  {savedColleges.length}{" "}
                  {savedColleges.length === 1
                    ? "college"
                    : "colleges"}{" "}
                  saved
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-2">

                {savedColleges.map(
                  (savedCollege) => {
                    const college =
                      savedCollege.college;

                    return (
                      <article
                        key={savedCollege.id}
                        className="rounded-2xl border bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                      >
                        <div className="flex items-start justify-between gap-4">

                          <div>
                            <h3 className="text-xl font-bold text-gray-900">
                              {college.name}
                            </h3>

                            <p className="mt-1 text-sm text-gray-500">
                              📍 {college.location},{" "}
                              {college.state}
                            </p>
                          </div>

                          <div className="rounded-lg bg-yellow-50 px-3 py-1.5 text-sm font-bold text-yellow-700">
                            ⭐ {college.rating}
                          </div>
                        </div>

                        <p className="mt-5 line-clamp-2 text-sm leading-6 text-gray-600">
                          {college.description}
                        </p>

                        <div className="mt-5 grid grid-cols-2 gap-3">

                          <div className="rounded-lg bg-slate-50 p-3">
                            <p className="text-xs text-gray-500">
                              Annual Fees
                            </p>

                            <p className="mt-1 font-bold text-gray-900">
                              ₹
                              {college.fees.toLocaleString()}
                            </p>
                          </div>

                          <div className="rounded-lg bg-slate-50 p-3">
                            <p className="text-xs text-gray-500">
                              Avg Placement
                            </p>

                            <p className="mt-1 font-bold text-gray-900">
                              ₹
                              {college.placementAverage}
                              {" "}LPA
                            </p>
                          </div>

                        </div>

                        <div className="mt-6 flex gap-3">

                          <Link
                            href={`/colleges/${college.id}`}
                            className="flex-1 rounded-lg bg-indigo-600 px-4 py-3 text-center text-sm font-semibold text-white hover:bg-indigo-700"
                          >
                            View College
                          </Link>

                          <button
                            onClick={() =>
                              removeCollege(
                                savedCollege.id
                              )
                            }
                            className="rounded-lg border px-4 py-3 text-sm font-semibold text-red-600 hover:bg-red-50"
                          >
                            Remove
                          </button>

                        </div>
                      </article>
                    );
                  }
                )}

              </div>
            </>
          )}
      </section>
    </main>
  );
}