"use client";

import { useState } from "react";

export default function Home() {
  const [imageURL, setImageURL] = useState("");

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setImageURL(data.url);
  }

  return (
    <div style={{ padding: "40px" }}>
      <h1>Upload a Clothing Image</h1>

      <input type="file" accept="image/*" onChange={handleUpload} />

      {imageURL && (
        <div style={{ marginTop: "20px" }}>
          <p>Uploaded Image:</p>
          <img src={imageURL} width="200" alt="Uploaded garment" />
        </div>
      )}
    </div>
  );
}
