"use client";

import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  return (
    <main className="min-h-screen flex items-center justify-center bg-black">
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8 w-full max-w-sm text-center space-y-6">
        <h1 className="text-2xl font-bold text-white">Wardrobe App</h1>

        <p className="text-sm text-gray-400">
          Manage what you own and what you wear
        </p>

        <div className="space-y-3">
          <button
            onClick={() => router.push("/wardrobe")}
            className="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition"
          >
            Go to Wardrobe
          </button>

          <button
            onClick={() => router.push("/add-garment")}
            className="w-full py-3 rounded-lg bg-zinc-700 hover:bg-zinc-600 text-white font-medium transition"
          >
            Add Garment
          </button>
        </div>
      </div>
    </main>
  );
}
