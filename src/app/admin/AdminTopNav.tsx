"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sparkles,
  Compass,
  ChevronLeft,
} from "lucide-react";

const BREADCRUMB_MAP: Record<string, string> = {
  "/admin": "الرئيسية",
  "/admin/users-details": "طلبات واهتمامات الطلاب",
  "/admin/courses": "الدورات والتدريبات المعتمدة",
  "/admin/def-courses": "مسودات الدورات والمقترحات",
  "/admin/ai-course": "توليد دورة بالذكاء الاصطناعي",
  "/admin/users": "حسابات المستخدمين والمدراء",
  "/admin/centers": "المراكز والمنظمات بإدلب",
  "/admin/sections": "إدارة الأقسام والتصنيفات",
  "/admin/sliders": "إدارة السلايدرات والإعلانات",
  "/admin/stats": "الإحصائيات الشاملة للمنصة",
};

export function AdminTopNav() {
  const pathname = usePathname() || "";
  const currentTitle = BREADCRUMB_MAP[pathname] || "لوحة التحكم";

  return (
    <header className="sticky top-0 z-20 w-full bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-8 py-3.5 flex items-center justify-between">
      {/* Breadcrumbs & Page Identity */}
      <div className="flex items-center gap-2 text-right">
        <Link
          href="/admin"
          className="text-xs font-bold text-slate-400 hover:text-slate-700 transition"
        >
          لوحة التحكم
        </Link>
        {pathname !== "/admin" && (
          <>
            <ChevronLeft className="w-3.5 h-3.5 text-slate-300" />
            <span className="text-xs font-bold text-slate-800">
              {currentTitle}
            </span>
          </>
        )}
      </div>

      {/* Action Buttons & Fast Links */}
      <div className="flex items-center gap-2.5">
        <Link
          href="/admin/ai-course"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-xs transition active:scale-95"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">دورة بالذكاء الاصطناعي</span>
          <span className="sm:hidden">إضافة AI</span>
        </Link>

        <Link
          href="/"
          target="_blank"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 hover:text-[#123D3A] hover:border-[#123D3A] text-xs font-bold transition shadow-2xs"
          title="معاينة الموقع للطلاب"
        >
          <Compass className="w-3.5 h-3.5 text-[#D58A38]" />
          <span>معاينة الموقع</span>
        </Link>
      </div>
    </header>
  );
}
