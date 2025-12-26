import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="py-10">
      <div className="bg-white border border-gray-300 rounded-xl shadow-lg p-10">
        <h1 className="text-4xl font-bold text-gray-900">
          See all your clothes. Stop buying duplicates.
        </h1>

        <p className="mt-4 text-gray-600 max-w-2xl">
          Track what you own, filter instantly, log wears, and get AI-powered
          recommendations on what to buy next based on what you already have.
        </p>

        <div className="mt-6 flex gap-3">
          <Link
            href="/auth/sign-up"
            className="px-5 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition"
          >
            Get started
          </Link>

          <Link
            href="/auth/sign-in"
            className="px-5 py-3 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 text-gray-900 font-medium transition"
          >
            Sign in
          </Link>
        </div>

        <div className="mt-10 grid sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-lg border bg-gray-50">
            <p className="font-semibold text-gray-900">
              All your clothes, organized
            </p>
            <p className="text-sm text-gray-600 mt-1">
              One place to see everything you own with fast filters.
            </p>
          </div>

          <div className="p-5 rounded-lg border bg-gray-50">
            <p className="font-semibold text-gray-900">Wear tracking</p>
            <p className="text-sm text-gray-600 mt-1">
              Know what you actually wear and what sits unused.
            </p>
          </div>

          <div className="p-5 rounded-lg border bg-gray-50">
            <p className="font-semibold text-gray-900">AI recommendations</p>
            <p className="text-sm text-gray-600 mt-1">
              Buy what you need next—based on gaps and wear behavior.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
