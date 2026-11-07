"use client";

import React, { useState } from "react";
import { DollarSign, Gift, Layers, ShieldCheck, Sparkles } from "lucide-react";

interface PricingStatsProps {
  freeCount: number;
  paidCount: number;
  totalCourses: number;
}

export default function PricingDistributionDonut({
  freeCount = 18,
  paidCount = 3,
  totalCourses = 21,
}: PricingStatsProps) {
  const safeTotal = Math.max(1, totalCourses);
  const freePercent = Math.round((freeCount / safeTotal) * 100);
  const paidPercent = 100 - freePercent;

  const [hoveredSegment, setHoveredSegment] = useState<string | null>(null);

  // SVG Donut calculation
  const radius = 64;
  const strokeWidth = 18;
  const circumference = 2 * Math.PI * radius;
  const freeStrokeDash = (freePercent / 100) * circumference;
  const paidStrokeDash = (paidPercent / 100) * circumference;

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-7 shadow-xs space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
              النموذج الاقتصادي والمنح التدريبية
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              نسبة التدريبات المجانية المدعومة مقابل الدورات ذات الرسوم الرمزية
            </p>
          </div>
        </div>
        <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-black border border-emerald-200/60">
          {freePercent}% تدريب مجاني
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* SVG Donut Chart */}
        <div className="md:col-span-5 flex flex-col items-center justify-center relative">
          <div className="relative w-44 h-44 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 160 160">
              {/* Background circle */}
              <circle
                cx="80"
                cy="80"
                r={radius}
                fill="none"
                stroke="#F1F5F9"
                strokeWidth={strokeWidth}
              />

              {/* Free Segment (Teal/Emerald) */}
              <circle
                cx="80"
                cy="80"
                r={radius}
                fill="none"
                stroke="#123D3A"
                strokeWidth={strokeWidth}
                strokeDasharray={`${freeStrokeDash} ${circumference}`}
                strokeDashoffset="0"
                className="transition-all duration-700 cursor-pointer hover:opacity-90"
                onMouseEnter={() => setHoveredSegment("free")}
                onMouseLeave={() => setHoveredSegment(null)}
              />

              {/* Paid Segment (Gold/Amber) */}
              <circle
                cx="80"
                cy="80"
                r={radius}
                fill="none"
                stroke="#D58A38"
                strokeWidth={strokeWidth}
                strokeDasharray={`${paidStrokeDash} ${circumference}`}
                strokeDashoffset={-freeStrokeDash}
                className="transition-all duration-700 cursor-pointer hover:opacity-90"
                onMouseEnter={() => setHoveredSegment("paid")}
                onMouseLeave={() => setHoveredSegment(null)}
              />
            </svg>

            {/* Center Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
              <span className="text-3xl font-black text-slate-900 font-mono tracking-tight">
                {hoveredSegment === "paid" ? `${paidPercent}%` : `${freePercent}%`}
              </span>
              <span className="text-[11px] font-bold text-slate-500 mt-0.5">
                {hoveredSegment === "paid" ? "رسوم مدعومة" : "منح ومجاني"}
              </span>
            </div>
          </div>
        </div>

        {/* Breakdown Details */}
        <div className="md:col-span-7 space-y-3.5">
          {/* Free Courses Card */}
          <div
            onMouseEnter={() => setHoveredSegment("free")}
            onMouseLeave={() => setHoveredSegment(null)}
            className={`p-3.5 rounded-2xl border transition ${
              hoveredSegment === "free"
                ? "bg-teal-50/60 border-[#123D3A]/40 shadow-xs"
                : "bg-slate-50/50 border-slate-200/70"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#123D3A] inline-block" />
                <span className="text-xs sm:text-sm font-black text-slate-900">
                  منح وتدريبات مجانية 100%
                </span>
              </div>
              <span className="font-mono text-sm font-black text-[#123D3A]">
                {freeCount} دورة ({freePercent}%)
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1 mr-5">
              مدعومة بالكامل من المنظمات الإنسانية والمديريات الجامعية (تشمل الحقائب التدريبية والشهادات)
            </p>
          </div>

          {/* Paid / Supported Courses Card */}
          <div
            onMouseEnter={() => setHoveredSegment("paid")}
            onMouseLeave={() => setHoveredSegment(null)}
            className={`p-3.5 rounded-2xl border transition ${
              hoveredSegment === "paid"
                ? "bg-amber-50/60 border-amber-400 shadow-xs"
                : "bg-slate-50/50 border-slate-200/70"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#D58A38] inline-block" />
                <span className="text-xs sm:text-sm font-black text-slate-900">
                  تدريبات تخصصية برسوم رمزية مدعومة
                </span>
              </div>
              <span className="font-mono text-sm font-black text-[#D58A38]">
                {paidCount} دورات ({paidPercent}%)
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1 mr-5">
              رسوم تشغيلية منخفضة في المعاهد الخاصة (متوسط 15 - 35 دولار) مع إمكانية التقسيط
            </p>
          </div>

          {/* Student Purchasing Power Note */}
          <div className="flex items-center justify-between px-3 py-2 bg-emerald-50/60 rounded-xl border border-emerald-200/60 text-xs font-bold text-emerald-900">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
              مؤشر شمولية الفرص في إدلب:
            </span>
            <span className="font-mono text-emerald-700">9.2 / 10 امتياز</span>
          </div>
        </div>
      </div>
    </div>
  );
}
