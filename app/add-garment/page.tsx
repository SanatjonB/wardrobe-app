"use client";

import { useState } from "react";

export default function AddGarmentPage() {
  const [imageURL, setImageURL] = useState("");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    user_id: "", // You will replace with real user ID later
    name: "",
    category_id: "",
    brand: "",
    color: "",
    size: "",
    season: "",
    purchase_price: "",
  });

  async function uploadImage(file: File) {
    const data = new FormData();
    data.append("file", file);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: data,
    });

    const json = await res.json();
    return json.url;
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formElement = e.currentTarget; // <- typed correctly
    const fileInput = formElement.image as HTMLInputElement; // <- typed correctly
    const file = fileInput.files?.[0] || null;

    let url = imageURL;

    // Upload image if file selected
    if (file) {
      url = await uploadImage(file);
      setImageURL(url);
    }

    const res = await fetch("/api/garments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        category_id: Number(form.category_id),
        purchase_price: Number(form.purchase_price),
        image_url: url,
      }),
    });

    const result = await res.json();
    setLoading(false);

    if (!res.ok) {
      alert("Error: " + JSON.stringify(result.error));
      return;
    }

    alert("Garment added!");
  }

  return (
    <div className="p-8 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Add New Garment</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="User ID"
          className="w-full p-2 border rounded"
          value={form.user_id}
          onChange={(e) => setForm({ ...form, user_id: e.target.value })}
        />

        <input
          type="text"
          placeholder="Name (e.g., Black Hoodie)"
          className="w-full p-2 border rounded"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <select
          className="w-full p-2 border rounded"
          value={form.category_id}
          onChange={(e) => setForm({ ...form, category_id: e.target.value })}
        >
          <option value="">Select Category</option>
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

        <input
          type="text"
          placeholder="Brand"
          className="w-full p-2 border rounded"
          value={form.brand}
          onChange={(e) => setForm({ ...form, brand: e.target.value })}
        />

        <input
          type="text"
          placeholder="Color"
          className="w-full p-2 border rounded"
          value={form.color}
          onChange={(e) => setForm({ ...form, color: e.target.value })}
        />

        <input
          type="text"
          placeholder="Size (e.g., M)"
          className="w-full p-2 border rounded"
          value={form.size}
          onChange={(e) => setForm({ ...form, size: e.target.value })}
        />

        <input
          type="text"
          placeholder="Season (e.g., Winter)"
          className="w-full p-2 border rounded"
          value={form.season}
          onChange={(e) => setForm({ ...form, season: e.target.value })}
        />

        <input
          type="number"
          placeholder="Purchase Price"
          className="w-full p-2 border rounded"
          value={form.purchase_price}
          onChange={(e) => setForm({ ...form, purchase_price: e.target.value })}
        />

        <div>
          <label className="block mb-1">Image</label>
          <input type="file" name="image" accept="image/*" />
        </div>

        {imageURL && (
          <img
            src={imageURL}
            alt="preview"
            className="w-32 h-32 object-cover mt-3 rounded border"
          />
        )}

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {loading ? "Saving..." : "Add Garment"}
        </button>
      </form>
    </div>
  );
}
