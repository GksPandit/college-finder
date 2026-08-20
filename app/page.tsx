import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50">
      {/* Navbar */}
      <Navbar />

      {/* Hero */}
      <section className="bg-indigo-700 px-6 py-20 text-white">
        <div className="mx-auto max-w-4xl text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-indigo-200">
            Find • Compare • Decide
          </p>

          <h2 className="text-4xl font-bold md:text-6xl">
            Find the Right College for Your Future
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-lg text-indigo-100">
            Search colleges, compare fees and placements, and discover
            colleges that match your goals.
          </p>

          {/* Search */}
          <div className="mx-auto mt-8 flex max-w-2xl overflow-hidden rounded-xl bg-white shadow-lg">
            <input
              type="text"
              placeholder="Search colleges, courses or locations..."
              className="flex-1 px-5 py-4 text-gray-800 outline-none"
            />

            <button className="bg-orange-500 px-7 font-semibold text-white">
              Search
            </button>
          </div>
        </div>
      </section>

      {/* Popular Categories */}
      <section className="mx-auto max-w-7xl px-6 py-12">
        <h3 className="text-2xl font-bold text-gray-900">
          Explore by Study Goal
        </h3>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {["Engineering", "Management", "Medical", "Law"].map(
            (category) => (
              <div
                key={category}
                className="cursor-pointer rounded-xl border bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <h4 className="text-lg font-semibold">
                  {category}
                </h4>

                <p className="mt-2 text-sm text-gray-500">
                  Explore colleges and courses
                </p>
              </div>
            )
          )}
        </div>
      </section>

      {/* Features */}
      <section className="bg-white px-6 py-14">
        <div className="mx-auto max-w-7xl">
          <h3 className="text-center text-2xl font-bold">
            Everything You Need to Choose Better
          </h3>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            <div className="rounded-xl border p-6">
              <div className="text-3xl">🔍</div>

              <h4 className="mt-4 text-lg font-bold">
                Search Colleges
              </h4>

              <p className="mt-2 text-gray-500">
                Find colleges using search and smart filters.
              </p>
            </div>

            <div className="rounded-xl border p-6">
              <div className="text-3xl">⚖️</div>

              <h4 className="mt-4 text-lg font-bold">
                Compare Colleges
              </h4>

              <p className="mt-2 text-gray-500">
                Compare fees, ratings, placements and locations.
              </p>
            </div>

            <div className="rounded-xl border p-6">
              <div className="text-3xl">🎯</div>

              <h4 className="mt-4 text-lg font-bold">
                College Predictor
              </h4>

              <p className="mt-2 text-gray-500">
                Enter your exam and rank to discover suitable colleges.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}