import CollegeRating from "@/components/CollegeRating";
import Courses from "@/components/Courses";
import Reviews from "@/components/Reviews";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import Navbar from "@/components/Navbar";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function CollegeDetailPage({
  params,
}: PageProps) {
  const { id } = await params;

  const collegeId = Number(id);

  if (Number.isNaN(collegeId)) {
    notFound();
  }

  const college = await prisma.college.findUnique({
    where: {
      id: collegeId,
    },
  });

  if (!college) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-slate-50">

      {/* Navbar */}
      <nav className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

          <a
            href="/"
            className="text-2xl font-bold text-indigo-600"
          >
            CollegeFinder
          </a>

          <div className="flex gap-6 text-sm font-medium">
            <a
              href="/colleges"
              className="hover:text-indigo-600"
            >
              Colleges
            </a>

            <a
              href="/compare"
              className="hover:text-indigo-600"
            >
              Compare
            </a>

            <a
              href="/predictor"
              className="hover:text-indigo-600"
            >
              Predictor
            </a>
          </div>

        </div>
      </nav>

      {/* Hero */}
      <section className="bg-indigo-700 px-6 py-12 text-white">
        <div className="mx-auto max-w-7xl">

          <p className="text-sm font-semibold text-indigo-200">
            COLLEGE DETAILS
          </p>

          <h1 className="mt-2 text-4xl font-bold">
            {college.name}
          </h1>

          <p className="mt-3 text-indigo-100">
            📍 {college.location}, {college.state}
          </p>

        </div>
      </section>

      {/* Main */}
      <section className="mx-auto max-w-7xl px-6 py-10">

        <div className="grid gap-8 lg:grid-cols-3">

          {/* Left */}
          <div className="lg:col-span-2">

            {/* About */}
            <div className="rounded-2xl border bg-white p-7 shadow-sm">

              <h2 className="text-2xl font-bold text-gray-900">
                About {college.name}
              </h2>

              <p className="mt-4 leading-7 text-gray-600">
                {college.description}
              </p>

            </div>

            {/* Stats */}
            <div className="mt-6 grid gap-4 sm:grid-cols-2">

              <div className="rounded-2xl border bg-white p-6 shadow-sm">
                <p className="text-sm text-gray-500">
                  Annual Fees
                </p>

                <p className="mt-2 text-2xl font-bold text-gray-900">
                  ₹{college.fees.toLocaleString("en-IN")}
                </p>
              </div>

              <div className="rounded-2xl border bg-white p-6 shadow-sm">
                <p className="text-sm text-gray-500">
                  Rating
                </p>

                <p className="mt-2 text-2xl font-bold text-gray-900">
                  ⭐ {college.rating}
                </p>
              </div>

              <div className="rounded-2xl border bg-white p-6 shadow-sm">
                <p className="text-sm text-gray-500">
                  Average Placement
                </p>

                <p className="mt-2 text-2xl font-bold text-gray-900">
                  ₹{college.placementAverage} LPA
                </p>
              </div>

              <div className="rounded-2xl border bg-white p-6 shadow-sm">
                <p className="text-sm text-gray-500">
                  Highest Placement
                </p>

                <p className="mt-2 text-2xl font-bold text-gray-900">
                  ₹{college.placementHighest} LPA
                </p>
              </div>

            </div>

          </div>

          {/* Right Sidebar */}
          <aside className="h-fit rounded-2xl border bg-white p-6 shadow-sm">

            <h2 className="text-xl font-bold text-gray-900">
              College Overview
            </h2>

            <div className="mt-6 space-y-5">

              <div>
                <p className="text-sm text-gray-500">
                  College
                </p>

                <p className="mt-1 font-semibold text-gray-900">
                  {college.name}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">
                  Location
                </p>

                <p className="mt-1 font-semibold text-gray-900">
                  {college.location}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">
                  State
                </p>

                <p className="mt-1 font-semibold text-gray-900">
                  {college.state}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">
                  Rating
                </p>

                <p className="mt-1 font-semibold text-gray-900">
                  ⭐ {college.rating}
                </p>
              </div>

            </div>

            {/* Buttons */}
            <div className="mt-8 space-y-3">

              <a
                href={college.website ?? "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-lg bg-indigo-600 px-5 py-3 text-center font-semibold text-white transition hover:bg-indigo-700"
              >
                Visit Official Website →
              </a>

              <a
                href={`/compare?ids=${college.id}`}
                className="block rounded-lg border border-indigo-600 px-5 py-3 text-center font-semibold text-indigo-600 transition hover:bg-indigo-50"
              >
                Add to Compare
              </a>

              <a
                href="/colleges"
                className="block rounded-lg border px-5 py-3 text-center font-semibold text-gray-700 transition hover:bg-gray-50"
              >
                ← Back to Colleges
              </a>

            </div>

          </aside>

        </div>

      </section>
<CollegeRating collegeId={college.id} />
<Courses collegeId={college.id} />
<Reviews collegeId={college.id} />
    </main>
  );
}