"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  BarChart3,
  TrendingUp,
  Users,
  BookOpen,
  Building2,
  Sparkles,
  Printer,
  Calendar,
  Layers,
  ArrowUpRight,
  Filter,
  CheckCircle2,
  Clock,
  MapPin,
  Bot,
} from "lucide-react";
import StudentRegistrationChart, { DayDataPoint } from "@/components/charts/StudentRegistrationChart";
import DemandVsSupplyChart, { CategoryMetric } from "./DemandVsSupplyChart";
import PricingDistributionDonut from "./PricingDistributionDonut";
import GeographicDistributionMatrix, { GeoHub } from "./GeographicDistributionMatrix";
import AIOpportunityFunnel from "./AIOpportunityFunnel";
import PartnersLeaderboard, { PartnerStat } from "./PartnersLeaderboard";
import { Button } from "@/components/ui/button";

export interface ComprehensiveStatsData {
  totalCourses: number;
  publishedCourses: number;
  freeCourses: number;
  paidCourses: number;
  totalDefCourses: number;
  pendingDefCourses: number;
  approvedDefCourses: number;
  totalStudents: number;
  totalOrgs: number;
  totalSections: number;
  timelineData: DayDataPoint[];
  categories: CategoryMetric[];
  hubs: GeoHub[];
  partners: PartnerStat[];
}

interface StatsDashboardClientProps {
  initialData: ComprehensiveStatsData;
}

export default function StatsDashboardClient({ initialData }: StatsDashboardClientProps) {
  const [activeTab, setActiveTab] = useState<"all" | "demand" | "geo" | "ai">("all");
  const [selectedPeriod, setSelectedPeriod] = useState<string>("all");

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-7 print:space-y-4">
      {/* Executive Hero Bar */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xs relative overflow-hidden">
        {/* Subtle Decorative Pattern */}
        <div className="absolute top-0 left-0 w-80 h-80 bg-gradient-to-br from-[#123D3A]/5 to-[#D58A38]/5 rounded-full blur-3xl pointer-events-none -translate-x-20 -translate-y-20" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#123D3A]/10 text-[#123D3A] text-xs font-black">
              <Sparkles className="w-3.5 h-3.5" />
              <span>المرصد التحليلي والإحصائي لمنصة «تلاقي»</span>
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 tracking-tight">
              الإحصائيات الشاملة وتحليلات منظومة التدريب
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 max-w-2xl leading-relaxed">
              رؤية بيانية متقدمة واستشرافية تغطي رغبات الطلاب، عروض المراكز والجامعات، التوزيع الجغرافي في إدلب والشمال السوري، ومؤشرات أتمتة الفرص بالذكاء الاصطناعي.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 shrink-0 print:hidden">
            <Button
              onClick={handlePrint}
              variant="outline"
              className="rounded-xl border-slate-300 text-slate-700 font-bold text-xs gap-2 h-10 hover:bg-slate-100"
            >
              <Printer className="w-4 h-4" />
              <span>تصدير / طباعة التقرير</span>
            </Button>

            <Link
              href="/admin"
              className="inline-flex items-center gap-2 px-4 h-10 rounded-xl text-xs font-bold text-white bg-[#123D3A] hover:bg-[#0E2F2D] transition shadow-xs"
            >
              <span>العودة للرئيسية</span>
              <ArrowUpRight className="w-4 h-4 rotate-45" />
            </Link>
          </div>
        </div>

        {/* 4 Key Executive Indicators */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-100">
          <div className="p-3.5 rounded-2xl bg-slate-50/70 border border-slate-200/60">
            <span className="block text-[11px] font-bold text-slate-500">إجمالي التدريبات المعروضة</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black text-slate-900 font-mono">
                {initialData.totalCourses}
              </span>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/60 px-1.5 py-0.5 rounded">
                +{initialData.freeCourses} مجاني
              </span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50/70 border border-slate-200/60">
            <span className="block text-[11px] font-bold text-slate-500">المراكز والجامعات المعتمدة</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black text-slate-900 font-mono">
                {initialData.totalOrgs}
              </span>
              <span className="text-[10px] font-bold text-[#123D3A] bg-[#123D3A]/10 px-1.5 py-0.5 rounded">
                100% موثقة
              </span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50/70 border border-slate-200/60">
            <span className="block text-[11px] font-bold text-slate-500">استمارات رغبات الطلاب</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black text-slate-900 font-mono">
                {initialData.totalStudents}
              </span>
              <span className="text-[10px] font-bold text-amber-800 bg-amber-100/60 px-1.5 py-0.5 rounded">
                توجيه نشط
              </span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50/70 border border-slate-200/60">
            <span className="block text-[11px] font-bold text-slate-500">نسبة المنح المجانية</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black text-[#123D3A] font-mono">
                {Math.round((initialData.freeCourses / Math.max(1, initialData.totalCourses)) * 100)}%
              </span>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/60 px-1.5 py-0.5 rounded">
                دعم كامل
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 print:hidden">
        <div className="inline-flex p-1 rounded-2xl bg-slate-100 border border-slate-200/80">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-4 py-2 rounded-xl text-xs font-black transition ${
              activeTab === "all"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            العرض الشامل المتكامل
          </button>
          <button
            onClick={() => setActiveTab("demand")}
            className={`px-4 py-2 rounded-xl text-xs font-black transition ${
              activeTab === "demand"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            رغبات الطلاب والفجوة التدريبية
          </button>
          <button
            onClick={() => setActiveTab("geo")}
            className={`px-4 py-2 rounded-xl text-xs font-black transition ${
              activeTab === "geo"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            التغطية الجغرافية والشركاء
          </button>
          <button
            onClick={() => setActiveTab("ai")}
            className={`px-4 py-2 rounded-xl text-xs font-black transition ${
              activeTab === "ai"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            أتمتة الذكاء الاصطناعي (AI)
          </button>
        </div>

        <div className="text-xs font-bold text-slate-500 flex items-center gap-1.5 bg-white px-3 py-2 rounded-xl border border-slate-200/80">
          <Calendar className="w-3.5 h-3.5 text-[#123D3A]" />
          <span>تحديث مباشر متزامن مع قاعدة البيانات</span>
        </div>
      </div>

      {/* Main Visual Content Panels */}
      <div className="space-y-7">
        {/* Timeline Chart of Student Registrations */}
        {(activeTab === "all" || activeTab === "demand") && (
          <StudentRegistrationChart
            data={initialData.timelineData}
            periodLabel="على مدار الفترات الزمنية"
          />
        )}

        {/* Section 1: Demand vs Supply Gap Analysis */}
        {(activeTab === "all" || activeTab === "demand") && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-7">
            <div className="lg:col-span-7">
              <DemandVsSupplyChart categories={initialData.categories} />
            </div>
            <div className="lg:col-span-5">
              <PricingDistributionDonut
                freeCount={initialData.freeCourses}
                paidCount={initialData.paidCourses}
                totalCourses={initialData.totalCourses}
              />
            </div>
          </div>
        )}

        {/* Section 2: Regional Coverage & Partners Leaderboard */}
        {(activeTab === "all" || activeTab === "geo") && (
          <div className="space-y-7">
            <GeographicDistributionMatrix hubs={initialData.hubs} />
            <PartnersLeaderboard partners={initialData.partners} />
          </div>
        )}

        {/* Section 3: AI Opportunity Funnel */}
        {(activeTab === "all" || activeTab === "ai") && (
          <AIOpportunityFunnel />
        )}

        {/* Section 4: Detailed Database Records Breakdown */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-7 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-slate-100 text-slate-700">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                  سجل كيانات وقواعد بيانات المنصة
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  بيان إحصائي تفصيلي لجميع السجلات والجداول المكونة لمنظومة تلاقي
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-2">
            <Link
              href="/admin/courses"
              className="p-4 rounded-2xl bg-slate-50 hover:bg-teal-50/70 border border-slate-200/70 hover:border-teal-300 transition group"
            >
              <span className="block text-xs font-bold text-slate-600 group-hover:text-teal-900">
                الدورات التدريبية
              </span>
              <span className="block text-2xl font-black text-slate-900 font-mono mt-1 group-hover:text-[#123D3A]">
                {initialData.totalCourses}
              </span>
              <span className="block text-[10px] text-slate-400 mt-1">
                {initialData.publishedCourses} منشور
              </span>
            </Link>

            <Link
              href="/admin/def-courses"
              className="p-4 rounded-2xl bg-slate-50 hover:bg-purple-50/70 border border-slate-200/70 hover:border-purple-300 transition group"
            >
              <span className="block text-xs font-bold text-slate-600 group-hover:text-purple-900">
                المسودات والمقترحات
              </span>
              <span className="block text-2xl font-black text-slate-900 font-mono mt-1 group-hover:text-purple-700">
                {initialData.totalDefCourses}
              </span>
              <span className="block text-[10px] text-slate-400 mt-1">
                {initialData.pendingDefCourses} بانتظار الاعتماد
              </span>
            </Link>

            <Link
              href="/admin/users-details"
              className="p-4 rounded-2xl bg-slate-50 hover:bg-amber-50/70 border border-slate-200/70 hover:border-amber-300 transition group"
            >
              <span className="block text-xs font-bold text-slate-600 group-hover:text-amber-900">
                استمارات الطلاب
              </span>
              <span className="block text-2xl font-black text-slate-900 font-mono mt-1 group-hover:text-[#D58A38]">
                {initialData.totalStudents}
              </span>
              <span className="block text-[10px] text-slate-400 mt-1">
                رغبات تدريبية
              </span>
            </Link>

            <Link
              href="/admin/organizations"
              className="p-4 rounded-2xl bg-slate-50 hover:bg-blue-50/70 border border-slate-200/70 hover:border-blue-300 transition group"
            >
              <span className="block text-xs font-bold text-slate-600 group-hover:text-blue-900">
                الشركاء والمراكز
              </span>
              <span className="block text-2xl font-black text-slate-900 font-mono mt-1 group-hover:text-blue-700">
                {initialData.totalOrgs}
              </span>
              <span className="block text-[10px] text-slate-400 mt-1">
                معاهد وجامعات
              </span>
            </Link>

            <Link
              href="/admin/sections"
              className="p-4 rounded-2xl bg-slate-50 hover:bg-emerald-50/70 border border-slate-200/70 hover:border-emerald-300 transition group"
            >
              <span className="block text-xs font-bold text-slate-600 group-hover:text-emerald-900">
                التصنيفات والمسارات
              </span>
              <span className="block text-2xl font-black text-slate-900 font-mono mt-1 group-hover:text-emerald-700">
                {initialData.totalSections}
              </span>
              <span className="block text-[10px] text-slate-400 mt-1">
                مجالات معتمدة
              </span>
            </Link>

            <Link
              href="/admin/ai-course"
              className="p-4 rounded-2xl bg-purple-50/70 hover:bg-purple-100/70 border border-purple-200/80 transition group"
            >
              <span className="block text-xs font-bold text-purple-900">
                محرك الذكاء الاصطناعي
              </span>
              <div className="flex items-center gap-1 mt-1 text-purple-700">
                <Bot className="w-5 h-5" />
                <span className="text-sm font-black">جاهز</span>
              </div>
              <span className="block text-[10px] text-purple-500 mt-1">
                Gemini 2.5 Flash
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
