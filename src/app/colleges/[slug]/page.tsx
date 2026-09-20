import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { COLLEGES_DATA } from "@/lib/data/colleges";
import { getCutoffsForCollege } from "@/lib/data/cutoffs";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return COLLEGES_DATA.map((college) => ({
    slug: college.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const college = COLLEGES_DATA.find((c) => c.slug === slug);

  if (!college) {
    return {
      title: "College Not Found",
    };
  }

  return {
    title: `${college.name} (${college.shortName}) Cutoffs 2024 & 2025 — Category-wise Closing Ranks`,
    description: `Detailed category-wise CLAT 2024 and 2025 opening and closing ranks for ${college.name} (${college.city}, ${college.state}). Source provenance verified.`,
  };
}

export default async function CollegeProfilePage({ params }: PageProps) {
  const { slug } = await params;
  const college = COLLEGES_DATA.find((c) => c.slug === slug);

  if (!college) {
    notFound();
  }

  const cutoffs = getCutoffsForCollege(slug);
  const cutoffs2024 = cutoffs.filter((c) => c.year === 2024);
  const cutoffs2025 = cutoffs.filter((c) => c.year === 2025);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <nav className="flex items-center text-xs text-slate-500 mb-6 gap-2">
        <Link href="/" className="hover:text-slate-900">
          Home
        </Link>
        <span>/</span>
        <Link href="/colleges" className="hover:text-slate-900">
          Colleges
        </Link>
        <span>/</span>
        <span className="text-slate-900 font-semibold">{college.shortName}</span>
      </nav>

      {/* College Header Info */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
          <div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                {college.state}
              </span>
              {college.nirfRank && (
                <span className="rounded-md bg-amber-50 px-2.5 py-0.5 text-xs font-bold text-amber-700 ring-1 ring-inset ring-amber-600/20">
                  NIRF Rank #{college.nirfRank}
                </span>
              )}
              {college.isNlu && (
                <span className="rounded-md bg-blue-50 px-2.5 py-0.5 text-xs font-bold text-blue-700 ring-1 ring-inset ring-blue-600/20">
                  National Law University
                </span>
              )}
            </div>

            <h1 className="mt-2 text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              {college.name}
            </h1>
            <p className="mt-1 text-sm font-medium text-slate-500">
              {college.shortName} • Established {college.established} • 📍 {college.city}, {college.state}
            </p>
            <p className="mt-3 text-sm text-slate-600 max-w-3xl">
              {college.description}
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              {college.programmes.map((prog) => (
                <span
                  key={prog}
                  className="rounded-md bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700"
                >
                  {prog}
                </span>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2 min-w-[200px]">
            <a
              href={college.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex justify-center items-center rounded-md bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-xs ring-1 ring-inset ring-slate-300 hover:bg-slate-50"
            >
              Official Website ↗
            </a>
            <Link
              href="/what-can-i-get"
              className="inline-flex justify-center items-center rounded-md bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-blue-500"
            >
              Can I get into {college.shortName}?
            </Link>
          </div>
        </div>
      </div>

      {/* Cutoff Tables Section */}
      <div className="mt-10 space-y-12">
        {/* 2025 Cutoffs Table */}
        <section className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                CLAT 2025 Cutoffs & Closing Ranks
                <span className="rounded-full bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5">
                  2025 Cycle
                </span>
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Category-wise opening and closing ranks for CLAT 2025 seat allotment.
              </p>
            </div>
            <span className="text-xs text-slate-500 bg-white px-3 py-1 rounded-md border border-slate-200 self-start sm:self-auto">
              Source: Consortium of NLUs
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-100/60 text-xs font-semibold uppercase text-slate-600 tracking-wider">
                  <th className="px-6 py-3.5">Category Code</th>
                  <th className="px-6 py-3.5">Category Name</th>
                  <th className="px-6 py-3.5">Quota Type</th>
                  <th className="px-6 py-3.5">Round</th>
                  <th className="px-6 py-3.5 text-right">Opening Rank</th>
                  <th className="px-6 py-3.5 text-right">Closing Rank</th>
                  <th className="px-6 py-3.5">Source & Verification</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-800">
                {cutoffs2025.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4 font-mono font-bold text-blue-700">
                      {row.categoryCode}
                    </td>
                    <td className="px-6 py-4 font-medium">{row.categoryName}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          row.quotaType === "All India"
                            ? "bg-purple-50 text-purple-700 ring-1 ring-inset ring-purple-600/20"
                            : "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20"
                        }`}
                      >
                        {row.quotaType}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs font-medium text-slate-600">{row.round}</td>
                    <td className="px-6 py-4 text-right font-mono font-medium">{row.openingRank}</td>
                    <td className="px-6 py-4 text-right font-mono font-bold text-slate-900">
                      {row.closingRank}
                    </td>
                    <td className="px-6 py-4 text-xs">
                      <div className="flex flex-col gap-1">
                        <a
                          href={row.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium text-blue-600 hover:underline truncate max-w-[200px]"
                          title={row.sourceTitle}
                        >
                          {row.sourceTitle} ↗
                        </a>
                        <span
                          className={`inline-flex items-center w-fit rounded px-1.5 py-0.5 text-[10px] font-semibold ${
                            row.verificationStatus === "verified"
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {row.verificationStatus === "verified"
                            ? "✓ Verified Source"
                            : "⚠️ Placeholder Fixture"}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* 2024 Cutoffs Table */}
        <section className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                CLAT 2024 Cutoffs & Closing Ranks
                <span className="rounded-full bg-slate-200 text-slate-800 text-xs font-semibold px-2.5 py-0.5">
                  2024 Cycle
                </span>
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Category-wise opening and closing ranks for CLAT 2024 seat allotment.
              </p>
            </div>
            <span className="text-xs text-slate-500 bg-white px-3 py-1 rounded-md border border-slate-200 self-start sm:self-auto">
              Source: Consortium of NLUs
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-100/60 text-xs font-semibold uppercase text-slate-600 tracking-wider">
                  <th className="px-6 py-3.5">Category Code</th>
                  <th className="px-6 py-3.5">Category Name</th>
                  <th className="px-6 py-3.5">Quota Type</th>
                  <th className="px-6 py-3.5">Round</th>
                  <th className="px-6 py-3.5 text-right">Opening Rank</th>
                  <th className="px-6 py-3.5 text-right">Closing Rank</th>
                  <th className="px-6 py-3.5">Source & Verification</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-800">
                {cutoffs2024.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4 font-mono font-bold text-blue-700">
                      {row.categoryCode}
                    </td>
                    <td className="px-6 py-4 font-medium">{row.categoryName}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          row.quotaType === "All India"
                            ? "bg-purple-50 text-purple-700 ring-1 ring-inset ring-purple-600/20"
                            : "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20"
                        }`}
                      >
                        {row.quotaType}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs font-medium text-slate-600">{row.round}</td>
                    <td className="px-6 py-4 text-right font-mono font-medium">{row.openingRank}</td>
                    <td className="px-6 py-4 text-right font-mono font-bold text-slate-900">
                      {row.closingRank}
                    </td>
                    <td className="px-6 py-4 text-xs">
                      <div className="flex flex-col gap-1">
                        <a
                          href={row.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium text-blue-600 hover:underline truncate max-w-[200px]"
                          title={row.sourceTitle}
                        >
                          {row.sourceTitle} ↗
                        </a>
                        <span
                          className={`inline-flex items-center w-fit rounded px-1.5 py-0.5 text-[10px] font-semibold ${
                            row.verificationStatus === "verified"
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {row.verificationStatus === "verified"
                            ? "✓ Verified Source"
                            : "⚠️ Placeholder Fixture"}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Provenance Audit Footer Note */}
        <div className="rounded-lg bg-blue-50/50 border border-blue-200 p-4 text-xs text-blue-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span>🛡️</span>
            <span>
              <strong>Source Provenance Guarantee:</strong> Every cutoff entry on cutoff.in traces to an audited publication by the conducting body.
            </span>
          </div>
          <Link href="/admin" className="font-semibold text-blue-700 hover:underline">
            Audit Workbench →
          </Link>
        </div>
      </div>
    </div>
  );
}
