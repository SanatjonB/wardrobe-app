"use client";

import { useState } from "react";
import Image from "next/image";

const USER_ID = "f10cfb24-a3b9-4a4b-83f2-b40012a2b2eb";
const DEFAULT_IMAGE = "/default-garment.png"; // fallback placeholder

export default function AddGarmentPage() {
  const [imageURL, setImageURL] = useState("");
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    category_id: "",
    brand: "",
    color: "",
    size: "",
    season: "",
    purchase_price: "",
  });

  // Show a local preview BEFORE submitting
  function handleImagePreview(file: File) {
    const localURL = URL.createObjectURL(file);
    setImageURL(localURL);
  }

  async function uploadImage(file: File) {
    const data = new FormData();
    data.append("file", file);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: data,
    });

    const json = await res.json();
    return json.url; // public Supabase URL
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formElement = e.currentTarget;
    const fileInput = formElement.image as HTMLInputElement;
    const file = fileInput.files?.[0] || null;

    let finalImageURL = imageURL;

    // If user uploaded a file → upload to Supabase
    if (file) {
      finalImageURL = await uploadImage(file);
      setImageURL(finalImageURL);
    }

    // If no file selected and no preview → use default placeholder
    if (!file && !imageURL) {
      finalImageURL = DEFAULT_IMAGE;
    }

    const res = await fetch("/api/garments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: USER_ID,
        ...form,
        category_id: Number(form.category_id),
        purchase_price: Number(form.purchase_price),
        image_url: finalImageURL,
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
          placeholder="Name"
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

        {/* IMAGE INPUT */}
        <div>
          <label className="block mb-1">Image</label>
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleImagePreview(file);
            }}
          />
        </div>

        {/* IMAGE PREVIEW */}
        {imageURL ? (
          <Image
            src={imageURL}
            alt="preview"
            width={128}
            height={128}
            unoptimized
            className="w-32 h-32 object-cover mt-3 rounded border"
          />
        ) : (
          <Image
            src={DEFAULT_IMAGE}
            alt="default"
            width={128}
            height={128}
            className="w-32 h-32 object-cover mt-3 rounded border opacity-60"
          />
        )}

        {/* SUBMIT BUTTON */}
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded w-full"
        >
          {loading ? "Saving..." : "Add Garment"}
        </button>
      </form>
    </div>
  );
}
