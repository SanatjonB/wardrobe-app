"use client";

import { useState } from "react";
import Image from "next/image";

const USER_ID = "f10cfb24-a3b9-4a4b-83f2-b40012a2b2eb";
const DEFAULT_IMAGE = "/default-garment.png"; // fallback placeholder
const inputClass =
  "w-full p-2.5 rounded-md border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500";

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
    <div className="max-w-xl mx-auto">
      <div className="bg-white/90 backdrop-blur border border-gray-200 rounded-xl shadow-md p-6">
        <h1 className="text-2xl font-bold mb-6 text-gray-900">
          Add New Garment
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Name"
            className={inputClass}
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <select
            className={inputClass}
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
            className={inputClass}
            value={form.brand}
            onChange={(e) => setForm({ ...form, brand: e.target.value })}
          />

          <input
            type="text"
            placeholder="Color"
            className={inputClass}
            value={form.color}
            onChange={(e) => setForm({ ...form, color: e.target.value })}
          />

          <input
            type="text"
            placeholder="Size (e.g., M)"
            className={inputClass}
            value={form.size}
            onChange={(e) => setForm({ ...form, size: e.target.value })}
          />

          <input
            type="text"
            placeholder="Season (e.g., Winter)"
            className={inputClass}
            value={form.season}
            onChange={(e) => setForm({ ...form, season: e.target.value })}
          />

          <input
            type="number"
            placeholder="Purchase Price"
            className={inputClass}
            value={form.purchase_price}
            onChange={(e) =>
              setForm({ ...form, purchase_price: e.target.value })
            }
          />

          {/* IMAGE INPUT */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-800">
              Image
            </label>
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleImagePreview(file);
              }}
              className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-gray-100 file:text-gray-800 hover:file:bg-gray-200 cursor-pointer"
            />
          </div>

          {/* IMAGE PREVIEW */}
          <div className="flex justify-center mt-3">
            <div className="relative w-32 h-32 rounded-lg border overflow-hidden bg-gray-200">
              <Image
                src={imageURL || DEFAULT_IMAGE}
                alt="preview"
                fill
                unoptimized
                className="object-cover"
              />
            </div>
          </div>

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white py-2.5 rounded-md font-medium transition"
          >
            {loading ? "Saving..." : "Add Garment"}
          </button>
        </form>
      </div>
    </div>
  );
}
