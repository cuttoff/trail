import Link from "next/link";

export default function HomePage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="text-center max-w-3xl mx-auto">
        <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 ring-1 ring-inset ring-blue-700/10 mb-4">
          Phase 1 Scaffold Live
        </span>
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
          Verified Cutoff Data for Indian Competitive Exams
        </h1>
        <p className="mt-4 text-lg text-slate-600">
          Launching with CLAT UG. Every cutoff rank and score is backed by audited source provenance documents.
        </p>

        <div className="mt-8 flex justify-center gap-4">
          <Link
            href="/what-can-i-get"
            className="rounded-md bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-xs hover:bg-blue-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            What Can I Get?
          </Link>
          <Link
            href="/clat/cutoffs"
            className="rounded-md bg-white px-5 py-3 text-sm font-semibold text-slate-900 shadow-xs ring-1 ring-inset ring-slate-300 hover:bg-slate-50"
          >
            Explore Cutoffs
          </Link>
        </div>
      </div>
    </div>
  );
}
