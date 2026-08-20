"use client";

import { FormEvent, useState } from "react";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSignup(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.message || "Signup failed");
        return;
      }

      setSuccess("Account created successfully! 🎉");

      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");

      setTimeout(() => {
        window.location.href = "/login";
      }, 1000);
    } catch (error) {
      console.error("Signup error:", error);
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

          <a
            href="/login"
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
          >
            Login
          </a>
        </div>
      </nav>

      {/* Signup */}
      <section className="flex min-h-[calc(100vh-73px)] items-center justify-center px-6 py-12">
        <div className="w-full max-w-md rounded-2xl border bg-white p-8 shadow-sm">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">
              Create Account
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Join CollegeFinder and discover better colleges
            </p>
          </div>

          <form
            onSubmit={handleSignup}
            className="mt-8 space-y-5"
          >
            {/* Name */}
            <div>
              <label className="text-sm font-semibold text-gray-700">
                Full Name
              </label>

              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                required
                className="mt-2 w-full rounded-lg border px-4 py-3 outline-none focus:border-indigo-500"
              />
            </div>

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
                placeholder="Minimum 6 characters"
                required
                className="mt-2 w-full rounded-lg border px-4 py-3 outline-none focus:border-indigo-500"
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label className="text-sm font-semibold text-gray-700">
                Confirm Password
              </label>

              <input
                type="password"
                value={confirmPassword}
                onChange={(e) =>
                  setConfirmPassword(e.target.value)
                }
                placeholder="Confirm your password"
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

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-indigo-600 px-4 py-3 font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Already have an account?{" "}
            <a
              href="/login"
              className="font-semibold text-indigo-600 hover:underline"
            >
              Login
            </a>
          </p>
        </div>
      </section>
    </main>
  );
}