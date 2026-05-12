import Link from "next/link";

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center bg-(--sand-200) px-4">
      <div className="text-center">
        <p className="text-sm font-semibold text-(--green-800)">404</p>
        <h1 className="mt-1 font-heading text-5xl text-(--ink-900)">Page not found</h1>
        <p className="mt-2 text-sm text-(--ink-600)">
          The aisle you are looking for does not exist.
        </p>
        <Link
          href="/"
          className="mt-5 inline-flex rounded-full bg-(--green-700) px-4 py-2 text-sm font-semibold text-white"
        >
          Back to Store
        </Link>
      </div>
    </main>
  );
}
