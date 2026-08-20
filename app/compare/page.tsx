"use client";

import { useEffect, useState } from "react";
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

export default function ComparePage() {
  const [colleges, setColleges] = useState<College[]>([]);
  const [college1, setCollege1] = useState("");
  const [college2, setCollege2] = useState("");
  const [college3, setCollege3] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchColleges() {
      try {
        setLoading(true);

        const response = await fetch(
          "/api/colleges?page=1&limit=100&sort=rating"
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result.message || "Failed to fetch colleges"
          );
        }

        setColleges(result.data || []);
      } catch (error) {
        console.error("Compare colleges error:", error);
        setError("Unable to load colleges.");
      } finally {
        setLoading(false);
      }
    }

    fetchColleges();
  }, []);

  const selectedColleges = [
    college1,
    college2,
    college3,
  ]
    .filter(Boolean)
    .map((id) =>
      colleges.find(
        (college) => String(college.id) === id
      )
    )
    .filter(
      (college): college is College =>
        college !== undefined
    );

  function clearComparison() {
    setCollege1("");
    setCollege2("");
    setCollege3("");
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <Navbar />

      {/* Header */}
      <section className="bg-indigo-700 px-6 py-14 text-white">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-semibold text-indigo-200">
            COLLEGE COMPARISON
          </p>

          <h1 className="mt-2 text-4xl font-bold">
            Compare Colleges
          </h1>

          <p className="mt-3 max-w-2xl text-indigo-100">
            Compare fees, ratings, placements and
            other important details side by side.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="mx-auto max-w-7xl px-6 py-10">

        {/* Selection */}
        <div className="rounded-2xl border bg-white p-6 shadow-sm">

          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Select Colleges
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Select 2 or 3 colleges to compare.
              </p>
            </div>

            <button
              onClick={clearComparison}
              className="text-sm font-semibold text-indigo-600 hover:underline"
            >
              Clear
            </button>
          </div>

          {loading && (
            <p className="mt-6 text-sm text-gray-500">
              Loading colleges...
            </p>
          )}

          {error && (
            <div className="mt-6 rounded-lg bg-red-50 p-4 text-sm text-red-600">
              {error}
            </div>
          )}

          {!loading && !error && (
            <div className="mt-6 grid gap-4 md:grid-cols-3">

              {/* College 1 */}
              <div>
                <label className="text-sm font-semibold text-gray-700">
                  College 1
                </label>

                <select
                  value={college1}
                  onChange={(e) =>
                    setCollege1(e.target.value)
                  }
                  className="mt-2 w-full rounded-lg border bg-white px-4 py-3 outline-none focus:border-indigo-500"
                >
                  <option value="">
                    Select College
                  </option>

                  {colleges.map((college) => (
                    <option
                      key={college.id}
                      value={college.id}
                    >
                      {college.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* College 2 */}
              <div>
                <label className="text-sm font-semibold text-gray-700">
                  College 2
                </label>

                <select
                  value={college2}
                  onChange={(e) =>
                    setCollege2(e.target.value)
                  }
                  className="mt-2 w-full rounded-lg border bg-white px-4 py-3 outline-none focus:border-indigo-500"
                >
                  <option value="">
                    Select College
                  </option>

                  {colleges.map((college) => (
                    <option
                      key={college.id}
                      value={college.id}
                    >
                      {college.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* College 3 */}
              <div>
                <label className="text-sm font-semibold text-gray-700">
                  College 3
                </label>

                <select
                  value={college3}
                  onChange={(e) =>
                    setCollege3(e.target.value)
                  }
                  className="mt-2 w-full rounded-lg border bg-white px-4 py-3 outline-none focus:border-indigo-500"
                >
                  <option value="">
                    Select College
                  </option>

                  {colleges.map((college) => (
                    <option
                      key={college.id}
                      value={college.id}
                    >
                      {college.name}
                    </option>
                  ))}
                </select>
              </div>

            </div>
          )}
        </div>

        {/* Comparison */}
        {selectedColleges.length >= 2 ? (
          <div className="mt-8 overflow-hidden rounded-2xl border bg-white shadow-sm">

            <div className="overflow-x-auto">
              <table className="w-full min-w-[750px] border-collapse">

                <thead>
                  <tr className="bg-indigo-50">
                    <th className="w-52 px-6 py-5 text-left text-sm font-bold text-gray-700">
                      Feature
                    </th>

                    {selectedColleges.map((college) => (
                      <th
                        key={college.id}
                        className="px-6 py-5 text-left text-lg font-bold text-indigo-700"
                      >
                        {college.name}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>

                  {/* Location */}
                  <tr className="border-t">
                    <td className="px-6 py-5 font-semibold text-gray-700">
                      Location
                    </td>

                    {selectedColleges.map((college) => (
                      <td
                        key={college.id}
                        className="px-6 py-5 text-gray-600"
                      >
                        {college.location},{" "}
                        {college.state}
                      </td>
                    ))}
                  </tr>

                  {/* Fees */}
                  <tr className="border-t bg-slate-50">
                    <td className="px-6 py-5 font-semibold text-gray-700">
                      Annual Fees
                    </td>

                    {selectedColleges.map((college) => (
                      <td
                        key={college.id}
                        className="px-6 py-5 font-semibold text-gray-900"
                      >
                        ₹{college.fees.toLocaleString()}
                      </td>
                    ))}
                  </tr>

                  {/* Rating */}
                  <tr className="border-t">
                    <td className="px-6 py-5 font-semibold text-gray-700">
                      Rating
                    </td>

                    {selectedColleges.map((college) => (
                      <td
                        key={college.id}
                        className="px-6 py-5 font-semibold text-gray-900"
                      >
                        ⭐ {college.rating}
                      </td>
                    ))}
                  </tr>

                  {/* Average Placement */}
                  <tr className="border-t bg-slate-50">
                    <td className="px-6 py-5 font-semibold text-gray-700">
                      Average Placement
                    </td>

                    {selectedColleges.map((college) => (
                      <td
                        key={college.id}
                        className="px-6 py-5 font-semibold text-gray-900"
                      >
                        ₹{college.placementAverage} LPA
                      </td>
                    ))}
                  </tr>

                  {/* Highest Placement */}
                  <tr className="border-t">
                    <td className="px-6 py-5 font-semibold text-gray-700">
                      Highest Placement
                    </td>

                    {selectedColleges.map((college) => (
                      <td
                        key={college.id}
                        className="px-6 py-5 font-semibold text-green-700"
                      >
                        ₹{college.placementHighest} LPA
                      </td>
                    ))}
                  </tr>

                  {/* Website */}
                  <tr className="border-t bg-slate-50">
                    <td className="px-6 py-5 font-semibold text-gray-700">
                      Website
                    </td>

                    {selectedColleges.map((college) => (
                      <td
                        key={college.id}
                        className="px-6 py-5"
                      >
                        {college.website ? (
                          <a
                            href={college.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-semibold text-indigo-600 hover:underline"
                          >
                            Visit Website →
                          </a>
                        ) : (
                          <span className="text-gray-400">
                            Not available
                          </span>
                        )}
                      </td>
                    ))}
                  </tr>

                  {/* Details */}
                  <tr className="border-t">
                    <td className="px-6 py-5 font-semibold text-gray-700">
                      Details
                    </td>

                    {selectedColleges.map((college) => (
                      <td
                        key={college.id}
                        className="px-6 py-5"
                      >
                        <a
                          href={`/colleges/${college.id}`}
                          className="inline-block rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
                        >
                          View College
                        </a>
                      </td>
                    ))}
                  </tr>

                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="mt-8 rounded-2xl border border-dashed bg-white p-14 text-center">

            <div className="text-5xl">
              ⚖️
            </div>

            <h2 className="mt-5 text-2xl font-bold text-gray-900">
              Select at least 2 colleges
            </h2>

            <p className="mt-2 text-gray-500">
              Choose colleges above to see a detailed
              side-by-side comparison.
            </p>

          </div>
        )}
      </section>
    </main>
  );
}