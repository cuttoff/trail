import Link from "next/link";
import type { Metadata } from "next";
import { COLLEGES_DATA } from "@/lib/data/colleges";

export const metadata: Metadata = {
  title: "NLUs & Top Law Colleges Directory — CLAT & Law Cutoffs",
  description:
    "Comprehensive directory of all 26 National Law Universities (NLUs) and top law colleges in India with historical CLAT closing ranks and audited source provenance.",
};

export default function CollegesDirectoryPage() {
  const nluCount = COLLEGES_DATA.filter((c) => c.isNlu).length;
  const nonNluCount = COLLEGES_DATA.filter((c) => !c.isNlu).length;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header Banner */}
      <div className="border-b border-slate-200 pb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              National Law Universities & Top Law Colleges
            </h1>
            <p className="mt-2 text-base text-slate-600">
              Browse all {nluCount} Participating NLUs and top law institutions in India with verified cutoff closing ranks.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center rounded-md bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
              ✓ Audited Provenance Data
            </span>
          </div>
        </div>
      </div>

      {/* Directory Content */}
      <div className="mt-8 space-y-12">
        {/* NLUs Section */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              National Law Universities (NLUs)
              <span className="rounded-full bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5">
                {nluCount} Institutions
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {COLLEGES_DATA.filter((c) => c.isNlu).map((college) => (
              <div
                key={college.id}
                className="group relative bg-white rounded-xl border border-slate-200 p-6 shadow-xs hover:shadow-md hover:border-blue-300 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
                      {college.state}
                    </span>
                    {college.nirfRank && (
                      <span className="rounded-md bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-700 ring-1 ring-inset ring-amber-600/20">
                        NIRF #{college.nirfRank}
                      </span>
                    )}
                  </div>
                  <h3 className="mt-2 text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    {college.name}
                  </h3>
                  <p className="text-xs font-medium text-slate-500 mt-1">
                    {college.shortName} • Estd. {college.established}
                  </p>
                  <p className="text-xs text-slate-600 mt-3 flex items-center gap-1">
                    📍 {college.city}, {college.state}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {college.programmes.map((prog) => (
                      <span
                        key={prog}
                        className="rounded bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600"
                      >
                        {prog}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-500">
                    CLAT Cutoffs (2024 & 2025)
                  </span>
                  <Link
                    href={`/colleges/${college.slug}`}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                  >
                    View Cutoffs →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Other Top Law Colleges Section */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              Other Top Law Institutions (AILET, SLAT, MHCET Law)
              <span className="rounded-full bg-slate-100 text-slate-700 text-xs font-semibold px-2.5 py-0.5">
                {nonNluCount} Institutions
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {COLLEGES_DATA.filter((c) => !c.isNlu).map((college) => (
              <div
                key={college.id}
                className="group relative bg-white rounded-xl border border-slate-200 p-6 shadow-xs hover:shadow-md hover:border-blue-300 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      {college.state}
                    </span>
                    {college.nirfRank && (
                      <span className="rounded-md bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-700 ring-1 ring-inset ring-amber-600/20">
                        NIRF #{college.nirfRank}
                      </span>
                    )}
                  </div>
                  <h3 className="mt-2 text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    {college.name}
                  </h3>
                  <p className="text-xs font-medium text-slate-500 mt-1">
                    {college.shortName} • Estd. {college.established}
                  </p>
                  <p className="text-xs text-slate-600 mt-3 flex items-center gap-1">
                    📍 {college.city}, {college.state}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {college.programmes.map((prog) => (
                      <span
                        key={prog}
                        className="rounded bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600"
                      >
                        {prog}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-500">
                    Exam Cutoffs
                  </span>
                  <Link
                    href={`/colleges/${college.slug}`}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                  >
                    View Details →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
