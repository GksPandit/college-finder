"use client";

import { useEffect, useState } from "react";

type User = {
  id: number;
  name: string;
  email: string;
};

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getUser() {
      try {
        const response = await fetch("/api/auth/me");

        if (!response.ok) {
          setUser(null);
          return;
        }

        const result = await response.json();

        if (result.success) {
          setUser(result.data);
        }
      } catch (error) {
        console.error("Auth check error:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    getUser();
  }, []);

  async function handleLogout() {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setUser(null);
        window.location.href = "/";
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  }

  return (
    <nav className="border-b bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <a
          href="/"
          className="text-2xl font-bold text-indigo-600"
        >
          CollegeFinder
        </a>

        {/* Navigation */}
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

          {user && (
            <a
              href="/saved-colleges"
              className="hover:text-indigo-600"
            >
              Saved
            </a>
          )}

          {!loading && !user && (
            <a
              href="/login"
              className="rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
            >
              Login
            </a>
          )}

          {!loading && user && (
            <div className="flex items-center gap-3">
              <div className="hidden text-right sm:block">
                <p className="font-semibold text-gray-900">
                  {user.name}
                </p>

                <p className="text-xs text-gray-500">
                  {user.email}
                </p>
              </div>

              <button
                onClick={handleLogout}
                className="rounded-lg border px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}