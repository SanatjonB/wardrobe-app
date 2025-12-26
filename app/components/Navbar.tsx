"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar({ isAuthed }: { isAuthed: boolean }) {
  const pathname = usePathname();

  const linkClass = (href: string) =>
    `px-3 py-2 rounded-md text-sm font-medium transition ${
      pathname === href
        ? "bg-gray-200 text-gray-900"
        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
    }`;

  return (
    <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        <Link href="/" className="font-bold text-gray-900">
          ClosetIQ
        </Link>

        <nav className="flex items-center gap-2">
          <Link className={linkClass("/")} href="/">
            Home
          </Link>
          <Link className={linkClass("/wardrobe")} href="/wardrobe">
            Wardrobe
          </Link>
          <Link className={linkClass("/add-clothes")} href="/add-clothes">
            Add Clothes
          </Link>

          <div className="w-px h-6 bg-gray-200 mx-2" />

          {isAuthed ? (
            <form action="/auth/sign-out" method="post">
              <button className="px-3 py-2 rounded-md text-sm font-medium bg-gray-900 text-white hover:bg-black transition">
                Sign out
              </button>
            </form>
          ) : (
            <Link
              href="/auth/sign-in"
              className="px-3 py-2 rounded-md text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition"
            >
              Sign in
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
