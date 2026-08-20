"use client";

import { useEffect, useState } from "react";

type Course = {
  id: number;
  name: string;
  duration: string;
  fees: number;
};

type CoursesProps = {
  collegeId: number;
};

export default function Courses({
  collegeId,
}: CoursesProps) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCourses() {
      try {
        const response = await fetch(
          `/api/courses?collegeId=${collegeId}`
        );

        const result = await response.json();

        if (response.ok) {
          setCourses(result.data || []);
        }
      } catch (error) {
        console.error("Courses error:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchCourses();
  }, [collegeId]);

  if (loading) {
    return (
      <section className="mt-10 rounded-2xl border bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-bold">
          Courses
        </h2>

        <p className="mt-4 text-sm text-gray-500">
          Loading courses...
        </p>
      </section>
    );
  }

  return (
    <section className="mt-10 rounded-2xl border bg-white p-6 shadow-sm">
      <h2 className="text-2xl font-bold text-gray-900">
        Courses & Programs 🎓
      </h2>

      <p className="mt-1 text-sm text-gray-500">
        Programs offered by this college.
      </p>

      {courses.length === 0 ? (
        <div className="mt-6 rounded-xl border border-dashed p-8 text-center">
          <p className="font-semibold text-gray-700">
            No courses available
          </p>

          <p className="mt-1 text-sm text-gray-500">
            Course information has not been added yet.
          </p>
        </div>
      ) : (
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {courses.map((course) => (
            <div
              key={course.id}
              className="rounded-xl border p-5 transition hover:shadow-sm"
            >
              <h3 className="text-lg font-bold text-gray-900">
                {course.name}
              </h3>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-lg bg-slate-50 p-3">
                  <p className="text-xs text-gray-500">
                    Duration
                  </p>

                  <p className="mt-1 font-semibold">
                    {course.duration}
                  </p>
                </div>

                <div className="rounded-lg bg-slate-50 p-3">
                  <p className="text-xs text-gray-500">
                    Fees
                  </p>

                  <p className="mt-1 font-semibold">
                    ₹{course.fees.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}