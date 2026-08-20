"use client";

import Navbar from "@/components/Navbar";
import { useEffect, useState } from "react";
import CollegeCard from "../../components/CollegeCard";

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

type Pagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export default function CollegesPage() {
  const [colleges, setColleges] = useState<College[]>([]);
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("All");
  const [minRating, setMinRating] = useState("All");
  const [sort, setSort] = useState("rating");

  const [pagination, setPagination] =
    useState<Pagination | null>(null);

  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function fetchColleges() {
    try {
      setLoading(true);
      setError("");

      const params = new URLSearchParams();

      params.set("page", String(page));
      params.set("limit", "6");
      params.set("sort", sort);

      if (search.trim()) {
        params.set("search", search.trim());
      }

      if (location !== "All") {
        params.set("location", location);
      }

      if (minRating !== "All") {
        params.set("minRating", minRating);
      }

      const response = await fetch(
        `/api/colleges?${params.toString()}`
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Failed to fetch colleges"
        );
      }

      setColleges(result.data || []);
      setPagination(result.pagination || null);
    } catch (error) {
      console.error("College fetch error:", error);
      setError("Unable to load colleges.");
      setColleges([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchColleges();
  }, [page, sort, search, location, minRating]);

  function clearFilters() {
    setSearch("");
    setLocation("All");
    setMinRating("All");
    setSort("rating");
    setPage(1);
  }

  return (
    <main className="min-h-screen bg-slate-50">

      {/* Navbar */}
      <Navbar />

      {/* Hero */}
      <section className="bg-indigo-700 px-6 py-12 text-white">
        <div className="mx-auto max-w-7xl">

          <p className="text-sm font-semibold text-indigo-200">
            COLLEGE DISCOVERY
          </p>

          <h1 className="mt-2 text-4xl font-bold">
            Find Your Perfect College
          </h1>

          <p className="mt-3 max-w-2xl text-indigo-100">
            Search and compare colleges based on fees,
            location, ratings and placement opportunities.
          </p>

          {/* Search */}
          <div className="mt-8 flex max-w-3xl overflow-hidden rounded-xl bg-white">
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search college or location..."
              className="flex-1 px-5 py-4 text-gray-900 outline-none"
            />

            <button
              type="button"
              onClick={() => setPage(1)}
              className="bg-orange-500 px-8 font-semibold text-white"
            >
              Search
            </button>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="grid gap-8 lg:grid-cols-[250px_1fr]">

          {/* Filters */}
          <aside className="h-fit rounded-2xl border bg-white p-5 shadow-sm">

            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold">
                Filters
              </h2>

              <button
                onClick={clearFilters}
                className="text-sm text-indigo-600 hover:underline"
              >
                Clear
              </button>
            </div>

            {/* Location */}
            <div className="mt-7">

              <label className="text-sm font-semibold">
                Location
              </label>

              <select
                value={location}
                onChange={(e) => {
                  setLocation(e.target.value);
                  setPage(1);
                }}
                className="mt-2 w-full rounded-lg border px-3 py-2.5 outline-none focus:border-indigo-500"
              >
                <option value="All">
                  All Locations
                </option>

                <option value="New Delhi">
                  New Delhi
                </option>

                <option value="Mumbai">
                  Mumbai
                </option>

                <option value="Kanpur">
                  Kanpur
                </option>

                <option value="Chennai">
                  Chennai
                </option>

                <option value="Kharagpur">
                  Kharagpur
                </option>

                <option value="Pilani">
                  Pilani
                </option>
              </select>
            </div>

            {/* Rating */}
            <div className="mt-7">

              <label className="text-sm font-semibold">
                Minimum Rating
              </label>

              <select
                value={minRating}
                onChange={(e) => {
                  setMinRating(e.target.value);
                  setPage(1);
                }}
                className="mt-2 w-full rounded-lg border px-3 py-2.5 outline-none focus:border-indigo-500"
              >
                <option value="All">
                  Any Rating
                </option>

                <option value="4.9">
                  4.9+
                </option>

                <option value="4.8">
                  4.8+
                </option>

                <option value="4.7">
                  4.7+
                </option>

                <option value="4.5">
                  4.5+
                </option>

                <option value="4">
                  4.0+
                </option>
              </select>
            </div>
          </aside>

          {/* Results */}
          <div>

            {/* Header */}
            <div className="mb-6 flex items-center justify-between">

              <div>

                <h2 className="text-2xl font-bold text-gray-900">
                  Colleges
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  {pagination
                    ? `${pagination.total} colleges found`
                    : "Loading..."}
                </p>

              </div>

              {/* Sort */}
              <select
                value={sort}
                onChange={(e) => {
                  setSort(e.target.value);
                  setPage(1);
                }}
                className="rounded-lg border bg-white px-4 py-2 text-sm"
              >
                <option value="rating">
                  Rating: High to Low
                </option>

                <option value="fees_asc">
                  Fees: Low to High
                </option>

                <option value="fees_desc">
                  Fees: High to Low
                </option>

                <option value="placement">
                  Placement: High to Low
                </option>
              </select>

            </div>

            {/* Error */}
            {error && (
              <div className="rounded-2xl border bg-white p-10 text-center">

                <div className="text-4xl">
                  ⚠️
                </div>

                <h3 className="mt-4 text-xl font-bold">
                  Something went wrong
                </h3>

                <p className="mt-2 text-gray-500">
                  {error}
                </p>

                <button
                  onClick={fetchColleges}
                  className="mt-5 rounded-lg bg-indigo-600 px-5 py-2.5 font-semibold text-white"
                >
                  Try Again
                </button>

              </div>
            )}

            {/* Loading */}
            {!error && loading && (
              <div className="grid gap-6 md:grid-cols-2">

                {[1, 2, 3, 4].map((item) => (
                  <div
                    key={item}
                    className="h-72 animate-pulse rounded-2xl bg-white"
                  />
                ))}

              </div>
            )}

            {/* Empty */}
            {!error &&
              !loading &&
              colleges.length === 0 && (
                <div className="rounded-2xl border bg-white p-12 text-center">

                  <div className="text-4xl">
                    🔍
                  </div>

                  <h3 className="mt-4 text-xl font-bold">
                    No colleges found
                  </h3>

                  <p className="mt-2 text-gray-500">
                    Try changing your search or filters.
                  </p>

                  <button
                    onClick={clearFilters}
                    className="mt-5 rounded-lg bg-indigo-600 px-5 py-2.5 font-semibold text-white"
                  >
                    Clear Filters
                  </button>

                </div>
              )}

            {/* College Cards */}
            {!error &&
              !loading &&
              colleges.length > 0 && (
                <>
                  <div className="grid gap-6 md:grid-cols-2">

                    {colleges.map((college) => (
                      <CollegeCard
                        key={college.id}
                        college={college}
                      />
                    ))}

                  </div>

                  {/* Pagination */}
                  {pagination &&
                    pagination.totalPages > 1 && (
                      <div className="mt-10 flex items-center justify-center gap-3">

                        <button
                          disabled={page === 1}
                          onClick={() =>
                            setPage((current) =>
                              Math.max(1, current - 1)
                            )
                          }
                          className="rounded-lg border bg-white px-4 py-2 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          ← Previous
                        </button>

                        <div className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white">
                          Page {pagination.page} of{" "}
                          {pagination.totalPages}
                        </div>

                        <button
                          disabled={
                            page === pagination.totalPages
                          }
                          onClick={() =>
                            setPage((current) =>
                              Math.min(
                                pagination.totalPages,
                                current + 1
                              )
                            )
                          }
                          className="rounded-lg border bg-white px-4 py-2 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          Next →
                        </button>

                      </div>
                    )}
                </>
              )}

          </div>
        </div>
      </section>
    </main>
  );
}