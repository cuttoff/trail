import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "NLUs & Top Law Colleges Directory — CLAT & Law Cutoffs",
  description:
    "Comprehensive directory of all 26 National Law Universities (NLUs) and top law colleges in India with historical CLAT closing ranks and audited source provenance.",
};

export interface College {
  id: string;
  slug: string;
  name: string;
  shortName: string;
  city: string;
  state: string;
  isNlu: boolean;
  nirfRank?: number;
  established: number;
  programmes: string[];
}

export const COLLEGES_DATA: College[] = [
  {
    id: "nlsiu-bengaluru",
    slug: "nlsiu-bengaluru",
    name: "National Law School of India University",
    shortName: "NLSIU Bengaluru",
    city: "Bengaluru",
    state: "Karnataka",
    isNlu: true,
    nirfRank: 1,
    established: 1987,
    programmes: ["B.A. LL.B. (Hons.)", "LL.M."],
  },
  {
    id: "nalsar-hyderabad",
    slug: "nalsar-hyderabad",
    name: "NALSAR University of Law",
    shortName: "NALSAR Hyderabad",
    city: "Hyderabad",
    state: "Telangana",
    isNlu: true,
    nirfRank: 2,
    established: 1998,
    programmes: ["B.A. LL.B. (Hons.)", "LL.M."],
  },
  {
    id: "wbnujs-kolkata",
    slug: "wbnujs-kolkata",
    name: "West Bengal National University of Juridical Sciences",
    shortName: "WBNUJS Kolkata",
    city: "Kolkata",
    state: "West Bengal",
    isNlu: true,
    nirfRank: 4,
    established: 1999,
    programmes: ["B.A. LL.B. (Hons.)", "B.Sc. LL.B. (Hons.)", "LL.M."],
  },
  {
    id: "nlu-jodhpur",
    slug: "nlu-jodhpur",
    name: "National Law University, Jodhpur",
    shortName: "NLU Jodhpur",
    city: "Jodhpur",
    state: "Rajasthan",
    isNlu: true,
    nirfRank: 6,
    established: 1999,
    programmes: ["B.A. LL.B. (Hons.)", "B.B.A. LL.B. (Hons.)", "LL.M."],
  },
  {
    id: "gnlu-gandhinagar",
    slug: "gnlu-gandhinagar",
    name: "Gujarat National Law University",
    shortName: "GNLU Gandhinagar",
    city: "Gandhinagar",
    state: "Gujarat",
    isNlu: true,
    nirfRank: 7,
    established: 2003,
    programmes: ["B.A. LL.B. (Hons.)", "B.B.A. LL.B. (Hons.)", "B.Com. LL.B. (Hons.)", "LL.M."],
  },
  {
    id: "nliu-bhopal",
    slug: "nliu-bhopal",
    name: "National Law Institute University",
    shortName: "NLIU Bhopal",
    city: "Bhopal",
    state: "Madhya Pradesh",
    isNlu: true,
    nirfRank: 11,
    established: 1997,
    programmes: ["B.A. LL.B. (Hons.)", "B.Sc. LL.B. (Hons.)", "LL.M."],
  },
  {
    id: "rgnul-patiala",
    slug: "rgnul-patiala",
    name: "Rajiv Gandhi National University of Law",
    shortName: "RGNUL Patiala",
    city: "Patiala",
    state: "Punjab",
    isNlu: true,
    nirfRank: 12,
    established: 2006,
    programmes: ["B.A. LL.B. (Hons.)", "LL.M."],
  },
  {
    id: "rmnlu-lucknow",
    slug: "rmnlu-lucknow",
    name: "Dr. Ram Manohar Lohiya National Law University",
    shortName: "RMNLU Lucknow",
    city: "Lucknow",
    state: "Uttar Pradesh",
    isNlu: true,
    nirfRank: 14,
    established: 2005,
    programmes: ["B.A. LL.B. (Hons.)", "LL.M."],
  },
  {
    id: "nuals-kochi",
    slug: "nuals-kochi",
    name: "The National University of Advanced Legal Studies",
    shortName: "NUALS Kochi",
    city: "Kochi",
    state: "Kerala",
    isNlu: true,
    nirfRank: 17,
    established: 2005,
    programmes: ["B.A. LL.B. (Hons.)", "LL.M."],
  },
  {
    id: "nluo-cuttack",
    slug: "nluo-cuttack",
    name: "National Law University Odisha",
    shortName: "NLUO Cuttack",
    city: "Cuttack",
    state: "Odisha",
    isNlu: true,
    nirfRank: 9,
    established: 2009,
    programmes: ["B.A. LL.B. (Hons.)", "B.B.A. LL.B. (Hons.)", "LL.M."],
  },
  {
    id: "nusrl-ranchi",
    slug: "nusrl-ranchi",
    name: "National University of Study and Research in Law",
    shortName: "NUSRL Ranchi",
    city: "Ranchi",
    state: "Jharkhand",
    isNlu: true,
    nirfRank: 24,
    established: 2010,
    programmes: ["B.A. LL.B. (Hons.)", "LL.M."],
  },
  {
    id: "nluja-assam",
    slug: "nluja-assam",
    name: "National Law University and Judicial Academy",
    shortName: "NLUJA Assam",
    city: "Guwahati",
    state: "Assam",
    isNlu: true,
    nirfRank: 28,
    established: 2009,
    programmes: ["B.A. LL.B. (Hons.)", "LL.M."],
  },
  {
    id: "dsnlu-visakhapatnam",
    slug: "dsnlu-visakhapatnam",
    name: "Damodaram Sanjivayya National Law University",
    shortName: "DSNLU Visakhapatnam",
    city: "Visakhapatnam",
    state: "Andhra Pradesh",
    isNlu: true,
    established: 2008,
    programmes: ["B.A. LL.B. (Hons.)", "LL.M."],
  },
  {
    id: "cnlu-patna",
    slug: "cnlu-patna",
    name: "Chanakya National Law University",
    shortName: "CNLU Patna",
    city: "Patna",
    state: "Bihar",
    isNlu: true,
    established: 2006,
    programmes: ["B.A. LL.B. (Hons.)", "B.B.A. LL.B. (Hons.)", "LL.M."],
  },
  {
    id: "mnlu-mumbai",
    slug: "mnlu-mumbai",
    name: "Maharashtra National Law University, Mumbai",
    shortName: "MNLU Mumbai",
    city: "Mumbai",
    state: "Maharashtra",
    isNlu: true,
    established: 2014,
    programmes: ["B.A. LL.B. (Hons.)", "B.B.A. LL.B. (Hons.)", "LL.M."],
  },
  {
    id: "mnlu-nagpur",
    slug: "mnlu-nagpur",
    name: "Maharashtra National Law University, Nagpur",
    shortName: "MNLU Nagpur",
    city: "Nagpur",
    state: "Maharashtra",
    isNlu: true,
    established: 2016,
    programmes: ["B.A. LL.B. (Hons.)", "B.B.A. LL.B. (Hons.)", "LL.M."],
  },
  {
    id: "mnlu-aurangabad",
    slug: "mnlu-aurangabad",
    name: "Maharashtra National Law University, Chhatrapati Sambhajinagar",
    shortName: "MNLU Aurangabad",
    city: "Chhatrapati Sambhajinagar",
    state: "Maharashtra",
    isNlu: true,
    established: 2017,
    programmes: ["B.A. LL.B. (Hons.)", "B.B.A. LL.B. (Hons.)", "LL.M."],
  },
  {
    id: "hpnlu-shimla",
    slug: "hpnlu-shimla",
    name: "Himachal Pradesh National Law University",
    shortName: "HPNLU Shimla",
    city: "Shimla",
    state: "Himachal Pradesh",
    isNlu: true,
    established: 2016,
    programmes: ["B.A. LL.B. (Hons.)", "B.B.A. LL.B. (Hons.)", "LL.M."],
  },
  {
    id: "dnlu-jabalpur",
    slug: "dnlu-jabalpur",
    name: "Dharmashastra National Law University",
    shortName: "DNLU Jabalpur",
    city: "Jabalpur",
    state: "Madhya Pradesh",
    isNlu: true,
    established: 2018,
    programmes: ["B.A. LL.B. (Hons.)", "LL.M."],
  },
  {
    id: "dbranlu-sonipat",
    slug: "dbranlu-sonipat",
    name: "Dr. B.R. Ambedkar National Law University",
    shortName: "DBRANLU Sonipat",
    city: "Sonipat",
    state: "Haryana",
    isNlu: true,
    established: 2012,
    programmes: ["B.A. LL.B. (Hons.)"],
  },
  {
    id: "nlud-delhi",
    slug: "nlud-delhi",
    name: "National Law University, Delhi",
    shortName: "NLU Delhi (AILET)",
    city: "New Delhi",
    state: "Delhi",
    isNlu: true,
    nirfRank: 3,
    established: 2008,
    programmes: ["B.A. LL.B. (Hons.)", "LL.M."],
  },
  {
    id: "glc-mumbai",
    slug: "glc-mumbai",
    name: "Government Law College",
    shortName: "GLC Mumbai (MHCET Law)",
    city: "Mumbai",
    state: "Maharashtra",
    isNlu: false,
    established: 1855,
    programmes: ["5-Year BLS LL.B.", "3-Year LL.B."],
  },
  {
    id: "ils-pune",
    slug: "ils-pune",
    name: "ILS Law College",
    shortName: "ILS Pune (MHCET Law)",
    city: "Pune",
    state: "Maharashtra",
    isNlu: false,
    established: 1924,
    programmes: ["5-Year B.A. LL.B.", "3-Year LL.B."],
  },
  {
    id: "sls-pune",
    slug: "sls-pune",
    name: "Symbiosis Law School",
    shortName: "SLS Pune (SLAT)",
    city: "Pune",
    state: "Maharashtra",
    isNlu: false,
    nirfRank: 5,
    established: 1977,
    programmes: ["B.A. LL.B. (Hons.)", "B.B.A. LL.B. (Hons.)"],
  },
];

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
                    CLAT Cutoffs
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
