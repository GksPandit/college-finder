"use client";

import { useEffect, useState } from "react";

export default function SaveCollegeButton({
  collegeId,
}: {
  collegeId: number;
}) {
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function checkSaved() {
      try {
        const response = await fetch("/api/saved-colleges");

        if (!response.ok) {
          setSaved(false);
          return;
        }

        const result = await response.json();

        const exists = result.data?.some(
          (item: any) => item.collegeId === collegeId
        );

        setSaved(Boolean(exists));
      } catch (error) {
        console.error("Check saved college error:", error);
      } finally {
        setLoading(false);
      }
    }

    checkSaved();
  }, [collegeId]);

  async function handleSave() {
    setMessage("");
    setSaving(true);

    try {
      if (saved) {
        setMessage("Already saved");
        return;
      }

      const response = await fetch("/api/saved-colleges", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          collegeId,
        }),
      });

      const result = await response.json();

      if (response.status === 401) {
        window.location.href = "/login";
        return;
      }

      if (!response.ok) {
        setMessage(result.message || "Failed to save");
        return;
      }

      setSaved(true);
      setMessage("Saved");
    } catch (error) {
      console.error("Save college error:", error);
      setMessage("Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <button
        disabled
        className="rounded-lg border px-4 py-2 text-sm text-gray-400"
      >
        Loading...
      </button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleSave}
        disabled={saving}
        className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
          saved
            ? "bg-green-100 text-green-700"
            : "border bg-white text-gray-700 hover:border-indigo-500 hover:text-indigo-600"
        }`}
      >
        {saving
          ? "Saving..."
          : saved
          ? "✓ Saved"
          : "♡ Save College"}
      </button>

      {message && (
        <span className="text-xs text-gray-500">
          {message}
        </span>
      )}
    </div>
  );
}