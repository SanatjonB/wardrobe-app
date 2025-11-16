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
  const [sortType, setSortType] = useState<"recent" | "old" | "most" | "least">(
    "recent"
  );
  const [garments, setGarments] = useState<Garment[]>([]);
  const [lastWorn, setLastWorn] = useState<Record<string, string>>({});
  const [wearCount, setWearCount] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

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

    loadLastWorn();
    loadWearCount();
  }

  async function loadLastWorn() {
    const res = await fetch(`/api/last-worn?user_id=${USER_ID}`);
    const data = await res.json();
    setLastWorn(data);
  }

  async function loadWearCount() {
    const res = await fetch(`/api/wear-count?user_id=${USER_ID}`);
    const data = await res.json();
    setWearCount(data);
  }

  useEffect(() => {
    async function load() {
      const res = await fetch(`/api/garments?user_id=${USER_ID}`);
      const data = await res.json();
      setGarments(data);

      await loadLastWorn();
      await loadWearCount();

      setLoading(false);
    }

    load();
  }, []);

  if (loading) {
    return (
      <div className="p-8 text-center text-gray-500">Loading wardrobe...</div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">My Wardrobe</h1>

      {/* Sorting Buttons */}
      <div className="flex gap-3 mb-6">
        <button
          onClick={() => setSortType("recent")}
          className="px-3 py-1 border rounded hover:bg-gray-100"
        >
          Recent
        </button>
        <button
          onClick={() => setSortType("old")}
          className="px-3 py-1 border rounded hover:bg-gray-100"
        >
          Oldest
        </button>
        <button
          onClick={() => setSortType("most")}
          className="px-3 py-1 border rounded hover:bg-gray-100"
        >
          Most Worn
        </button>
        <button
          onClick={() => setSortType("least")}
          className="px-3 py-1 border rounded hover:bg-gray-100"
        >
          Least Worn
        </button>
      </div>

      {/* Garments Grid with Sorting Applied */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {[...garments]
          .sort((a, b) => {
            const lastA = lastWorn[a.id]
              ? new Date(lastWorn[a.id]).getTime()
              : 0;
            const lastB = lastWorn[b.id]
              ? new Date(lastWorn[b.id]).getTime()
              : 0;

            const countA = wearCount[a.id] ?? 0;
            const countB = wearCount[b.id] ?? 0;

            if (sortType === "recent") return lastB - lastA;
            if (sortType === "old") return lastA - lastB;
            if (sortType === "most") return countB - countA;
            if (sortType === "least") return countA - countB;

            return 0;
          })
          .map((g) => (
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

                {/* Last worn */}
                <p className="text-xs text-gray-500 mt-1">
                  Last worn:{" "}
                  {lastWorn[g.id]
                    ? new Date(lastWorn[g.id]).toLocaleDateString()
                    : "Never"}
                </p>

                {/* Wear count */}
                <p className="text-xs text-gray-500">
                  Worn: {wearCount[g.id] ?? 0} times
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
