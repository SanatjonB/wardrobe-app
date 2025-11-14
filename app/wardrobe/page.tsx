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
  const [loading, setLoading] = useState(true);

  // TODO: Replace with real logged-in user_id later
  const USER_ID = "f10cfb24-a3b9-4a4b-83f2-b40012a2b2eb";

  useEffect(() => {
    async function fetchGarments() {
      const res = await fetch(`/api/garments?user_id=${USER_ID}`);
      const data = await res.json();
      setGarments(data);
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

      {garments.length === 0 ? (
        <p className="text-gray-600">No garments yet.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {garments.map((g) => (
            <div
              key={g.id}
              className="rounded-lg border p-3 shadow-sm hover:shadow-md transition"
            >
              <img
                src={g.image_url}
                alt={g.name}
                className="w-full h-40 object-cover rounded"
              />

              <div className="mt-2">
                <p className="font-semibold">{g.name}</p>
                <p className="text-sm text-gray-600">
                  {g.brand ? g.brand : "Unknown Brand"}
                </p>

                <p className="text-sm text-gray-500">
                  {g.color ? g.color : ""}
                </p>

                <p className="text-sm text-gray-500">
                  Size: {g.size ? g.size : "—"}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
