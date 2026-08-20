"use client";

import { FormEvent, useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleLogin(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.message || "Login failed");
        return;
      }

      setSuccess("Login successful! 🎉");

      // Small delay so user can see success message
      setTimeout(() => {
        window.location.href = "/";
      }, 800);
    } catch (error) {
      console.error(error);
      setError("Unable to connect to server");
    } finally {
      setLoading(false);
    }
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

          <div className="flex items-center gap-6 text-sm font-medium">
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

      {/* Login */}
      <section className="flex min-h-[calc(100vh-73px)] items-center justify-center px-6 py-12">
        <div className="w-full max-w-md rounded-2xl border bg-white p-8 shadow-sm">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome Back
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Login to your CollegeFinder account
            </p>
          </div>

          <form
            onSubmit={handleLogin}
            className="mt-8 space-y-5"
          >
            {/* Email */}
            <div>
              <label className="text-sm font-semibold text-gray-700">
                Email
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="mt-2 w-full rounded-lg border px-4 py-3 outline-none focus:border-indigo-500"
              />
            </div>

            {/* Password */}
            <div>
              <label className="text-sm font-semibold text-gray-700">
                Password
              </label>

              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                className="mt-2 w-full rounded-lg border px-4 py-3 outline-none focus:border-indigo-500"
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

            {/* Login button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-indigo-600 px-4 py-3 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Don't have an account?{" "}
            <a
              href="/signup"
              className="font-semibold text-indigo-600 hover:underline"
            >
              Create account
            </a>
          </p>
        </div>
      </section>
    </main>
  );
}