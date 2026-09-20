import Link from "next/link";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-extrabold tracking-tight text-slate-900">
              cutoff<span className="text-blue-600">.in</span>
            </span>
            <span className="rounded bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-700 border border-blue-200">
              CLAT UG
            </span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <Link href="/clat" className="hover:text-slate-900 transition-colors">
              CLAT Hub
            </Link>
            <Link href="/colleges" className="hover:text-slate-900 transition-colors">
              NLUs & Colleges
            </Link>
            <Link href="/clat/cutoffs" className="hover:text-slate-900 transition-colors">
              Cutoff Explorer
            </Link>
            <Link href="/what-can-i-get" className="hover:text-slate-900 transition-colors font-semibold text-blue-600">
              What Can I Get?
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/admin"
            className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
          >
            Admin Portal
          </Link>
        </div>
      </div>
    </header>
  );
}
