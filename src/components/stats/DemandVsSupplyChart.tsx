"use client";

import React, { useState } from "react";
import { BarChart3, TrendingUp, AlertCircle, CheckCircle2 } from "lucide-react";

export interface CategoryMetric {
  name: string;
  demandCount: number; // Student requests
  supplyCount: number; // Available courses
  demandPercentage: number;
  supplyPercentage: number;
  gapStatus: "shortage" | "balanced" | "surplus";
}

interface DemandVsSupplyChartProps {
  categories?: CategoryMetric[];
}

export default function DemandVsSupplyChart({ categories }: DemandVsSupplyChartProps) {
  // Default rich data aligned with Idlib training ecosystem if not fully populated
  const defaultCategories: CategoryMetric[] = [
    {
      name: "تكنولوجيا المعلومات والبرمجة",
      demandCount: 340,
      supplyCount: 7,
      demandPercentage: 35,
      supplyPercentage: 33,
      gapStatus: "shortage",
    },
    {
      name: "الطب والتمريض والإسعافات",
      demandCount: 260,
      supplyCount: 5,
      demandPercentage: 27,
      supplyPercentage: 24,
      gapStatus: "shortage",
    },
    {
      name: "اللغات الحية والترجمة",
      demandCount: 180,
      supplyCount: 4,
      demandPercentage: 18,
      supplyPercentage: 19,
      gapStatus: "balanced",
    },
    {
      name: "التصميم الرقمي والميديا",
      demandCount: 140,
      supplyCount: 3,
      demandPercentage: 14,
      supplyPercentage: 14,
      gapStatus: "balanced",
    },
    {
      name: "إدارة المشاريع والأعمال",
      demandCount: 90,
      supplyCount: 2,
      demandPercentage: 9,
      supplyPercentage: 10,
      gapStatus: "balanced",
    },
  ];

  const data = categories && categories.length > 0 ? categories : defaultCategories;
  const [activeItem, setActiveItem] = useState<CategoryMetric | null>(null);

  const maxVal = Math.max(...data.flatMap((d) => [d.demandPercentage, d.supplyPercentage]), 40);

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-7 shadow-xs space-y-6">
      {/* Chart Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#123D3A]/10 text-[#123D3A]">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                تحليل الفجوة التدريبية: رغبات الطلاب مقابل العرض المتاح
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                مقارنة بين نسبة إقبال الطلاب على كل تخصص ونسبة الدورات المعروضة في إدلب
              </p>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs font-bold shrink-0 bg-slate-50 px-3.5 py-2 rounded-xl border border-slate-200/70">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#123D3A] inline-block shadow-2xs" />
            <span className="text-slate-700">طلب الطلاب (%)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#D58A38] inline-block shadow-2xs" />
            <span className="text-slate-700">الدورات المتاحة (%)</span>
          </div>
        </div>
      </div>

      {/* Bar Chart Display */}
      <div className="space-y-5">
        {data.map((cat, idx) => {
          const isSelected = activeItem?.name === cat.name;
          const demandWidth = Math.min(100, (cat.demandPercentage / maxVal) * 100);
          const supplyWidth = Math.min(100, (cat.supplyPercentage / maxVal) * 100);

          return (
            <div
              key={idx}
              onMouseEnter={() => setActiveItem(cat)}
              onMouseLeave={() => setActiveItem(null)}
              className={`p-3.5 rounded-2xl transition border ${
                isSelected
                  ? "bg-slate-50/80 border-[#123D3A]/30 shadow-xs"
                  : "bg-white border-transparent hover:border-slate-200"
              }`}
            >
              <div className="flex items-center justify-between text-xs sm:text-sm font-bold mb-2">
                <span className="text-slate-900 font-black">{cat.name}</span>
                <div className="flex items-center gap-2">
                  {cat.gapStatus === "shortage" && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/60">
                      <AlertCircle className="w-3 h-3 text-[#D58A38]" />
                      طلب مرتفع (حاجة لشركاء)
                    </span>
                  )}
                  {cat.gapStatus === "balanced" && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      توازن تدريبي
                    </span>
                  )}
                </div>
              </div>

              {/* Demand Bar */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-3">
                  <span className="text-[11px] font-bold text-slate-500 w-24 shrink-0 text-left" dir="ltr">
                    {cat.demandPercentage}% طلب ({cat.demandCount} طالب)
                  </span>
                  <div className="flex-1 bg-slate-100 rounded-full h-3 overflow-hidden p-0.5">
                    <div
                      className="bg-[#123D3A] h-full rounded-full transition-all duration-700"
                      style={{ width: `${demandWidth}%` }}
                    />
                  </div>
                </div>

                {/* Supply Bar */}
                <div className="flex items-center gap-3">
                  <span className="text-[11px] font-bold text-slate-500 w-24 shrink-0 text-left" dir="ltr">
                    {cat.supplyPercentage}% عرض ({cat.supplyCount} دورة)
                  </span>
                  <div className="flex-1 bg-slate-100 rounded-full h-3 overflow-hidden p-0.5">
                    <div
                      className="bg-[#D58A38] h-full rounded-full transition-all duration-700"
                      style={{ width: `${supplyWidth}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Strategic Insight Footer */}
      <div className="bg-amber-50/60 border border-amber-200/70 rounded-2xl p-4 flex items-start gap-3">
        <TrendingUp className="w-5 h-5 text-[#D58A38] shrink-0 mt-0.5" />
        <div className="text-xs text-amber-900 leading-relaxed font-medium">
          <strong className="font-black text-amber-950 ml-1">توصية المنظومة الذكية:</strong>
          يُظهر التحليل أعلى تركيز لطلب الطلاب في مجالات <strong>البرمجة والذكاء الاصطناعي</strong> و
          <strong>الرعاية الصحية والتمريض</strong> بنسبة تفوق 60% من مجمل الطلبات، مما يستوجب توجيه المنظمات الشريكة لافتتاح دفعات جديدة في هذه المسارات.
        </div>
      </div>
    </div>
  );
}
