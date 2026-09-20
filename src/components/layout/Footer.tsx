import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50 mt-auto">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-slate-900">cutoff.in</p>
            <p className="text-xs text-slate-500 mt-1">
              Exam-agnostic cutoff intelligence platform with source provenance.
            </p>
          </div>
          <div className="flex flex-wrap gap-6 text-xs text-slate-600">
            <Link href="/clat" className="hover:underline">
              CLAT UG Hub
            </Link>
            <Link href="/colleges" className="hover:underline">
              Directory
            </Link>
            <Link href="/what-can-i-get" className="hover:underline">
              What Can I Get?
            </Link>
          </div>
        </div>
        <div className="mt-6 border-t border-slate-200 pt-4 text-xs text-slate-400">
          © {new Date().getFullYear()} cutoff.in. All rights reserved. Cutoff data is sourced from official publications with documented provenance.
        </div>
      </div>
    </footer>
  );
}
