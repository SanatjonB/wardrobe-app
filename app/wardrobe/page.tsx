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

  const USER_ID = "f10cfb24-a3b9-4a4b-83f2-b40012a2b2eb";

  // Filters
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterColor, setFilterColor] = useState<string>("all");
  const [filterSeason, setFilterSeason] = useState<string>("all");

  // Edit modal state
  const [editingGarment, setEditingGarment] = useState<Garment | null>(null);

  async function markAsWorn(garmentId: string) {
    await fetch("/api/wear", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: USER_ID,
        garment_id: garmentId,
      }),
    });

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

  function startEdit(g: Garment) {
    setEditingGarment(g);
  }

  async function saveEdit() {
    if (!editingGarment) return;

    const res = await fetch(`/api/garments/${editingGarment.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editingGarment),
    });

    if (!res.ok) {
      alert("Error saving changes");
      return;
    }

    setGarments((prev) =>
      prev.map((g) => (g.id === editingGarment.id ? editingGarment : g))
    );

    setEditingGarment(null);
  }

  async function deleteGarment(id: string) {
    const yes = confirm("Delete this item?");
    if (!yes) return;

    const res = await fetch(`/api/garments/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      alert("Error deleting garment");
      return;
    }

    setGarments((prev) => prev.filter((g) => g.id !== id));
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

      {/* FILTERS */}
      <div className="flex gap-3 mb-6">
        <select
          className="px-3 py-1 border rounded"
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
        >
          <option value="all">All Categories</option>
          <option value="1">T-Shirts</option>
          <option value="2">Shirts</option>
          <option value="3">Sweaters</option>
          <option value="4">Hoodies</option>
          <option value="5">Jackets</option>
          <option value="6">Coats</option>
          <option value="7">Jeans</option>
          <option value="8">Pants</option>
          <option value="9">Shorts</option>
          <option value="10">Skirts</option>
          <option value="11">Dresses</option>
          <option value="12">Sneakers</option>
        </select>

        <select
          className="px-3 py-1 border rounded"
          value={filterColor}
          onChange={(e) => setFilterColor(e.target.value)}
        >
          <option value="all">All Colors</option>
          <option value="Black">Black</option>
          <option value="White">White</option>
          <option value="Gray">Gray</option>
          <option value="Blue">Blue</option>
          <option value="Red">Red</option>
          <option value="Green">Green</option>
        </select>

        <select
          className="px-3 py-1 border rounded"
          value={filterSeason}
          onChange={(e) => setFilterSeason(e.target.value)}
        >
          <option value="all">All Seasons</option>
          <option value="Summer">Summer</option>
          <option value="Winter">Winter</option>
          <option value="Spring">Spring</option>
          <option value="Fall">Fall</option>
        </select>
      </div>

      {/* Garments Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {[...garments]
          .filter((g) => {
            if (
              filterCategory !== "all" &&
              g.category_id !== Number(filterCategory)
            )
              return false;
            if (filterColor !== "all" && g.color !== filterColor) return false;
            if (filterSeason !== "all" && g.season !== filterSeason)
              return false;
            return true;
          })
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

                <p className="text-xs text-gray-500 mt-1">
                  Last worn:{" "}
                  {lastWorn[g.id]
                    ? new Date(lastWorn[g.id]).toLocaleDateString()
                    : "Never"}
                </p>

                <p className="text-xs text-gray-500">
                  Worn: {wearCount[g.id] ?? 0} times
                </p>
              </div>

              {/* Edit/Delete Buttons */}
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => startEdit(g)}
                  className="flex-1 bg-blue-500 text-white py-1 rounded hover:bg-blue-600"
                >
                  Edit
                </button>

                <button
                  onClick={() => deleteGarment(g.id)}
                  className="flex-1 bg-red-500 text-white py-1 rounded hover:bg-red-600"
                >
                  Delete
                </button>
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

      {/* EDIT MODAL */}
      {editingGarment && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Edit Garment</h2>

            <input
              className="w-full p-2 border rounded mb-3"
              value={editingGarment.name}
              onChange={(e) =>
                setEditingGarment({ ...editingGarment, name: e.target.value })
              }
              placeholder="Name"
            />

            <input
              className="w-full p-2 border rounded mb-3"
              value={editingGarment.brand || ""}
              onChange={(e) =>
                setEditingGarment({ ...editingGarment, brand: e.target.value })
              }
              placeholder="Brand"
            />

            <input
              className="w-full p-2 border rounded mb-3"
              value={editingGarment.color || ""}
              onChange={(e) =>
                setEditingGarment({ ...editingGarment, color: e.target.value })
              }
              placeholder="Color"
            />

            <input
              className="w-full p-2 border rounded mb-3"
              value={editingGarment.size || ""}
              onChange={(e) =>
                setEditingGarment({ ...editingGarment, size: e.target.value })
              }
              placeholder="Size"
            />

            <input
              className="w-full p-2 border rounded mb-3"
              value={editingGarment.season || ""}
              onChange={(e) =>
                setEditingGarment({ ...editingGarment, season: e.target.value })
              }
              placeholder="Season"
            />

            <div className="flex gap-2">
              <button
                onClick={saveEdit}
                className="flex-1 bg-green-600 text-white py-2 rounded"
              >
                Save
              </button>

              <button
                onClick={() => setEditingGarment(null)}
                className="flex-1 bg-gray-500 text-white py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
