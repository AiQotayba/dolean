import React from "react";
import Link from "next/link";
import {
  Code,
  Briefcase,
  Wrench,
  Languages,
  Palette,
  Calculator,
  HeartPulse,
  BarChart3,
  Compass,
  ArrowLeft,
} from "lucide-react";

interface SectionData {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
}

const ICON_MAP: Record<string, any> = {
  Code,
  Briefcase,
  Wrench,
  Languages,
  Palette,
  Calculator,
  HeartPulse,
  BarChart3,
  Compass,
};

export default function CategorySections({ sections }: { sections: SectionData[] }) {
  if (!sections || sections.length === 0) return null;

  return (
    <section className="w-full py-10 px-4 sm:px-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4 text-right">
        <div>
          <span className="text-xs font-bold text-[#D58A38] uppercase tracking-wider block mb-1">
            المسارات والتخصصات
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            استكشف مجالات التدريب في إدلب
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            اختر التخصص الذي يناسب طموحك المهني وتصفح الفرص المتاحة فوراً
          </p>
        </div>

        <Link
          href="/courses"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#123D3A] hover:text-[#D58A38] transition shrink-0"
        >
          <span>تصفح كل البرامج</span>
          <ArrowLeft className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
        {sections.map((sec) => {
          const Icon = ICON_MAP[sec.icon || ""] || Compass;
          return (
            <Link
              key={sec._id}
              href={`/courses?q=${encodeURIComponent(sec.name)}`}
              className="group p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 hover:border-[#123D3A]/40 hover:shadow-md transition-all duration-200 flex flex-col justify-between text-right space-y-3"
            >
              <div className="w-11 h-11 rounded-xl bg-slate-100 group-hover:bg-[#123D3A]/10 text-[#123D3A] flex items-center justify-center transition-colors">
                <Icon className="w-5 h-5 text-[#123D3A]" />
              </div>

              <div>
                <h3 className="text-xs sm:text-sm font-black text-slate-900 group-hover:text-[#123D3A] transition-colors">
                  {sec.name}
                </h3>
                {sec.description && (
                  <p className="text-[11px] text-slate-500 mt-1 line-clamp-1 leading-relaxed">
                    {sec.description}
                  </p>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
