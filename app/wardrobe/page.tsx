"use client";

import { useEffect, useState } from "react";

interface Garment {
  id: string;
  name: string;
  category_id: number;
  brand: string | null;
  color: string | null;
  size: string | null;
  season: string | null;
  image_url: string;
}

export default function WardrobePage() {
  const [garments, setGarments] = useState<Garment[]>([]);
  const [lastWorn, setLastWorn] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  // Use your real UUID
  const USER_ID = "YOUR_REAL_UUID_HERE";

  async function markAsWorn(garmentId: string) {
    await fetch("/api/wear", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: USER_ID,
        garment_id: garmentId,
      }),
    });

    alert("Marked as worn!");
    loadLastWorn(); // refresh last worn
  }

  async function loadLastWorn() {
    const res = await fetch(`/api/last-worn?user_id=${USER_ID}`);
    const data = await res.json();
    setLastWorn(data);
  }

  useEffect(() => {
    async function fetchGarments() {
      const res = await fetch(`/api/garments?user_id=${USER_ID}`);
      const data = await res.json();
      setGarments(data);

      await loadLastWorn();
      setLoading(false);
    }

    fetchGarments();
  }, []);

  if (loading) {
    return (
      <div className="p-8 text-center text-gray-500">Loading wardrobe...</div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">My Wardrobe</h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {garments.map((g) => (
          <div key={g.id} className="rounded-lg border p-3 shadow-sm">
            <img
              src={g.image_url}
              alt={g.name}
              className="w-full h-40 object-cover rounded"
            />

            <div className="mt-2">
              <p className="font-semibold">{g.name}</p>
              <p className="text-sm text-gray-600">
                {g.brand ?? "Unknown Brand"}
              </p>
              <p className="text-sm text-gray-500">{g.color}</p>
              <p className="text-sm text-gray-500">Size: {g.size ?? "—"}</p>

              {/* 🔥 NEW: Last Worn */}
              <p className="text-xs text-gray-500 mt-1">
                Last worn:{" "}
                {lastWorn[g.id]
                  ? new Date(lastWorn[g.id]).toLocaleDateString()
                  : "Never"}
              </p>
            </div>

            <button
              onClick={() => markAsWorn(g.id)}
              className="mt-3 w-full bg-green-600 text-white py-1 rounded hover:bg-green-700"
            >
              Mark as Worn
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
