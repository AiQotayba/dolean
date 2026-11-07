import Link from 'next/link';
import { connectToDatabase } from '@/lib/db';
import Organization from '@/models/Organization';
import Course from '@/models/Course';
import { Building2, ArrowLeft } from 'lucide-react';

export default async function CentersSection() {
  let centers: any[] = [];
  try {
    await connectToDatabase();
    
    // Only fetch centers that actually exist and are verified or active
    centers = await Organization.find({ deleteState: { $ne: true } })
      .limit(6)
      .lean();
  } catch (e) {
    // If DB fails or empty, hide cleanly
    return null;
  }

  // If no centers exist yet in the database, hide this section completely
  if (!centers || centers.length === 0) {
    return null;
  }

  return (
    <section className="w-full py-8 px-4 sm:px-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between pb-4 mb-6 border-b border-[#A9B5B0]/20">
        <h2 className="text-xl sm:text-2xl font-black text-[#123D3A]">
          المراكز التدريبية الشريكة
        </h2>

        <Link
          href="/center"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#D58A38] hover:text-[#BE772B] transition"
        >
          <span>بوابة المراكز</span>
          <ArrowLeft className="w-4 h-4 text-[#D58A38]" />
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 sm:gap-4">
        {centers.map((c: any) => (
          <div
            key={c._id.toString()}
            className="bg-white rounded-2xl border border-[#A9B5B0]/30 p-4 text-center flex flex-col items-center justify-center gap-2 hover:border-[#D58A38] transition shadow-xs"
          >
            <div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-500 flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-slate-800 line-clamp-1">
              {c.name}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
