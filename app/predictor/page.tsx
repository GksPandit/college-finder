"use client";

import { FormEvent, useState } from "react";
import Navbar from "@/components/Navbar";

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

type PredictorResult = {
  college: College;
  reason?: string;
};

export default function PredictorPage() {
  const [exam, setExam] = useState("JEE Main");
  const [rank, setRank] = useState("");

  const [results, setResults] = useState<
    PredictorResult[]
  >([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);

  async function handleSubmit(
    e: FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    setError("");
    setResults([]);
    setSearched(false);

    const numericRank = Number(rank);

    if (!rank.trim()) {
      setError("Please enter your rank.");
      return;
    }

    if (
      !Number.isInteger(numericRank) ||
      numericRank <= 0
    ) {
      setError(
        "Rank must be a positive whole number."
      );
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/predictor", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          exam,
          rank: numericRank,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Failed to predict colleges"
        );
      }

      setResults(result.data || []);
      setSearched(true);
    } catch (error) {
      console.error("Predictor error:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setExam("JEE Main");
    setRank("");
    setResults([]);
    setError("");
    setSearched(false);
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <Navbar />

      {/* Header */}
      <section className="bg-indigo-700 px-6 py-16 text-white">
        <div className="mx-auto max-w-4xl text-center">

          <p className="text-sm font-semibold text-indigo-200">
            COLLEGE PREDICTOR
          </p>

          <h1 className="mt-2 text-4xl font-bold md:text-5xl">
            Find Colleges You Can Target 🎯
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-indigo-100">
            Enter your entrance exam and rank to
            discover colleges matching your result.
          </p>

        </div>
      </section>

      {/* Predictor Form */}
      <section className="mx-auto max-w-4xl px-6 py-10">

        <div className="rounded-2xl border bg-white p-6 shadow-sm md:p-8">

          <h2 className="text-2xl font-bold text-gray-900">
            Enter Your Details
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            We'll use your rank to find suitable
            colleges.
          </p>

          <form
            onSubmit={handleSubmit}
            className="mt-7 space-y-6"
          >

            {/* Exam */}
            <div>
              <label className="text-sm font-semibold text-gray-700">
                Entrance Exam
              </label>

              <select
                value={exam}
                onChange={(e) =>
                  setExam(e.target.value)
                }
                className="mt-2 w-full rounded-lg border px-4 py-3 outline-none focus:border-indigo-500"
              >
                <option value="JEE Main">
                  JEE Main
                </option>

                <option value="JEE Advanced">
                  JEE Advanced
                </option>

                <option value="NEET">
                  NEET
                </option>

                <option value="CAT">
                  CAT
                </option>
              </select>
            </div>

            {/* Rank */}
            <div>
              <label className="text-sm font-semibold text-gray-700">
                Your Rank
              </label>

              <input
                type="number"
                min="1"
                value={rank}
                onChange={(e) =>
                  setRank(e.target.value)
                }
                placeholder="Example: 5000"
                className="mt-2 w-full rounded-lg border px-4 py-3 outline-none focus:border-indigo-500"
              />
            </div>

            {/* Error */}
            {error && (
              <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            {/* Buttons */}
            <div className="flex gap-3">

              <button
                type="submit"
                disabled={loading}
                className="flex-1 rounded-lg bg-indigo-600 px-5 py-3 font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading
                  ? "Finding Colleges..."
                  : "Predict Colleges"}
              </button>

              {(searched || rank) && (
                <button
                  type="button"
                  onClick={reset}
                  className="rounded-lg border px-5 py-3 font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Reset
                </button>
              )}

            </div>
          </form>
        </div>

        {/* Results */}
        {searched && (
          <div className="mt-10">

            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Recommended Colleges
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Based on {exam} rank{" "}
                <span className="font-semibold">
                  {rank}
                </span>
              </p>
            </div>

            {results.length === 0 ? (
              <div className="rounded-2xl border bg-white p-12 text-center">

                <div className="text-5xl">
                  🔍
                </div>

                <h3 className="mt-4 text-xl font-bold">
                  No matching colleges found
                </h3>

                <p className="mt-2 text-gray-500">
                  Try entering a different rank or
                  exam.
                </p>

              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2">

                {results.map((item) => {
                  const college = item.college;

                  return (
                    <article
                      key={college.id}
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

                      <div className="mt-5 grid grid-cols-2 gap-3">

                        <div className="rounded-lg bg-slate-50 p-3">
                          <p className="text-xs text-gray-500">
                            Fees
                          </p>

                          <p className="mt-1 font-bold">
                            ₹
                            {college.fees.toLocaleString()}
                          </p>
                        </div>

                        <div className="rounded-lg bg-slate-50 p-3">
                          <p className="text-xs text-gray-500">
                            Avg Placement
                          </p>

                          <p className="mt-1 font-bold">
                            ₹
                            {college.placementAverage}
                            {" "}LPA
                          </p>
                        </div>

                      </div>

                      {item.reason && (
                        <p className="mt-4 text-sm text-gray-600">
                          {item.reason}
                        </p>
                      )}

                      <a
                        href={`/colleges/${college.id}`}
                        className="mt-5 block rounded-lg bg-indigo-600 px-4 py-3 text-center text-sm font-semibold text-white hover:bg-indigo-700"
                      >
                        View College
                      </a>

                    </article>
                  );
                })}

              </div>
            )}

          </div>
        )}

      </section>
    </main>
  );
}