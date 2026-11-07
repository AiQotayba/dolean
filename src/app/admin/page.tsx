import Link from "next/link";
import Headers from "./config";
import { connectToDatabase } from "@/lib/db";
import Course from "@/models/Course";
import DefCourse from "@/models/DefCourse";
import UserDetails from "@/models/UserDetails";
import {
  BookOpen,
  FileEdit,
  UserCheck,
  Sparkles,
  ArrowLeft,
  Calendar,
  MessageCircle,
  Clock,
  CheckCircle2,
  AlertCircle,
  Plus,
  BarChart3,
} from "lucide-react";
import StudentRegistrationChart, { DayDataPoint } from "@/components/charts/StudentRegistrationChart";
import PeriodSelector from "@/components/dashboard/PeriodSelector";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface AdminHomeProps {
  searchParams?: Promise<{
    period?: string;
    from?: string;
    to?: string;
  }>;
}

export default async function HomeAdmin({ searchParams }: AdminHomeProps) {
  await Headers();

  const resolvedParams = searchParams ? await searchParams : {};
  const period = resolvedParams?.period || "month";
  const from = resolvedParams?.from || "";
  const to = resolvedParams?.to || "";

  // Compute date range
  const now = new Date();
  let startDate: Date | null = null;
  let endDate: Date | null = null;
  let periodLabel = "خلال الشهر الحالي";

  if (period === "day") {
    startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
    endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
    periodLabel = "اليوم";
  } else if (period === "week") {
    const dayOfWeek = now.getDay();
    startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - dayOfWeek, 0, 0, 0);
    endDate = new Date(startDate.getTime() + 7 * 24 * 60 * 60 * 1000 - 1);
    periodLabel = "خلال هذا الأسبوع";
  } else if (period === "month") {
    startDate = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0);
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    endDate = new Date(now.getFullYear(), now.getMonth(), daysInMonth, 23, 59, 59, 999);
    const monthNames = [
      "كانون الثاني", "شباط", "آذار", "نيسان", "أيار", "حزيران",
      "تموز", "آب", "أيلول", "تشرين الأول", "تشرين الثاني", "كانون الأول"
    ];
    periodLabel = `خلال شهر ${monthNames[now.getMonth()]}`;
  } else if (period === "30days") {
    startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    endDate = new Date(now.getTime());
    periodLabel = "خلال آخر 30 يوماً";
  } else if (period === "custom") {
    if (from) startDate = new Date(from);
    if (to) endDate = new Date(new Date(to).getTime() + 24 * 60 * 60 * 1000 - 1);
    periodLabel = from && to ? `من ${from} إلى ${to}` : "فترة مخصصة";
  } else {
    startDate = null;
    endDate = null;
    periodLabel = "جميع الفترات";
  }

  // Course filter
  const courseDateFilter: any = {};
  if (startDate && endDate) {
    courseDateFilter.createdAt = { $gte: startDate, $lte: endDate };
  } else if (startDate) {
    courseDateFilter.createdAt = { $gte: startDate };
  }

  // Student filter (checks both createdAt and create_at)
  const studentDateFilter: any = {};
  if (startDate && endDate) {
    studentDateFilter.$or = [
      { createdAt: { $gte: startDate, $lte: endDate } },
      { create_at: { $gte: startDate, $lte: endDate } },
    ];
  } else if (startDate) {
    studentDateFilter.$or = [
      { createdAt: { $gte: startDate } },
      { create_at: { $gte: startDate } },
    ];
  }

  let coursesCount = 0;
  let pendingDefCoursesCount = 0;
  let periodStudentsCount = 0;
  let chartData: DayDataPoint[] = [];
  let pendingDrafts: any[] = [];
  let recentStudents: any[] = [];

  try {
    await connectToDatabase();

    const [
      coursesInPeriod,
      pendingDraftsCount,
      studentsInPeriod,
      rawDrafts,
      rawStudents,
      allPeriodStudents,
    ] = await Promise.all([
      // 1. Courses created in period
      Course.countDocuments({
        deleteState: { $ne: true },
        ...courseDateFilter,
      }),
      // 2. Pending drafts needing review
      DefCourse.countDocuments({
        deleteState: { $ne: true },
        status: "pending",
      }),
      // 3. Student requests in period
      UserDetails.countDocuments({
        deleteState: { $ne: true },
        ...studentDateFilter,
      }),
      // 4. Latest 4 pending drafts
      DefCourse.find({
        deleteState: { $ne: true },
        status: "pending",
      })
        .sort({ createdAt: -1 })
        .limit(4)
        .lean(),
      // 5. Latest student inquiries in this period
      UserDetails.find({
        deleteState: { $ne: true },
        ...studentDateFilter,
      })
        .sort({ createdAt: -1, create_at: -1 })
        .limit(6)
        .lean(),
      // 6. All students in period for Chart aggregation
      UserDetails.find({
        deleteState: { $ne: true },
        ...studentDateFilter,
      })
        .select("createdAt create_at")
        .sort({ createdAt: 1 })
        .lean(),
    ]);

    coursesCount = coursesInPeriod;
    pendingDefCoursesCount = pendingDraftsCount;
    periodStudentsCount = studentsInPeriod;
    pendingDrafts = JSON.parse(JSON.stringify(rawDrafts));
    recentStudents = JSON.parse(JSON.stringify(rawStudents));

    // Build chart data depending on period
    if (period === "day") {
      // 8 time slots across the 24 hours of today
      const slots = [
        { label: "12 ص", startH: 0, endH: 2 },
        { label: "3 ص", startH: 3, endH: 5 },
        { label: "6 ص", startH: 6, endH: 8 },
        { label: "9 ص", startH: 9, endH: 11 },
        { label: "12 ظ", startH: 12, endH: 14 },
        { label: "3 ع", startH: 15, endH: 17 },
        { label: "6 م", startH: 18, endH: 20 },
        { label: "9 م", startH: 21, endH: 23 },
      ];
      chartData = slots.map((slot) => {
        let count = 0;
        allPeriodStudents.forEach((student: any) => {
          const d = new Date(student.createdAt || student.create_at);
          const h = d.getHours();
          if (h >= slot.startH && h <= slot.endH) {
            count++;
          }
        });
        return {
          date: `slot-${slot.startH}`,
          label: slot.label,
          count,
        };
      });
    } else if (period === "week") {
      // 7 days of the current week (Sunday to Saturday)
      const dayNames = ["الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];
      const startOfWeek = new Date(startDate || now);
      const weekPoints: DayDataPoint[] = [];

      for (let i = 0; i < 7; i++) {
        const d = new Date(startOfWeek.getFullYear(), startOfWeek.getMonth(), startOfWeek.getDate() + i);
        const dayYear = d.getFullYear();
        const dayMonth = d.getMonth();
        const dayDate = d.getDate();

        let count = 0;
        allPeriodStudents.forEach((student: any) => {
          const sDate = new Date(student.createdAt || student.create_at);
          if (
            sDate.getFullYear() === dayYear &&
            sDate.getMonth() === dayMonth &&
            sDate.getDate() === dayDate
          ) {
            count++;
          }
        });

        weekPoints.push({
          date: `${dayYear}-${dayMonth + 1}-${dayDate}`,
          label: `${dayNames[d.getDay()]} ${dayDate}`,
          count,
        });
      }
      chartData = weekPoints;
    } else if (period === "month") {
      // All days of the current month
      const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
      const monthPoints: DayDataPoint[] = [];

      for (let day = 1; day <= daysInMonth; day++) {
        let count = 0;
        allPeriodStudents.forEach((student: any) => {
          const sDate = new Date(student.createdAt || student.create_at);
          if (
            sDate.getMonth() === now.getMonth() &&
            sDate.getFullYear() === now.getFullYear() &&
            sDate.getDate() === day
          ) {
            count++;
          }
        });

        monthPoints.push({
          date: `day-${day}`,
          label: `${day}`,
          count,
        });
      }
      chartData = monthPoints;
    } else if (period === "30days") {
      // 30 days back from today
      const days30: DayDataPoint[] = [];
      for (let i = 29; i >= 0; i--) {
        const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
        const dYear = d.getFullYear();
        const dMonth = d.getMonth();
        const dDate = d.getDate();

        let count = 0;
        allPeriodStudents.forEach((student: any) => {
          const sDate = new Date(student.createdAt || student.create_at);
          if (
            sDate.getFullYear() === dYear &&
            sDate.getMonth() === dMonth &&
            sDate.getDate() === dDate
          ) {
            count++;
          }
        });

        days30.push({
          date: `${dDate}/${dMonth + 1}`,
          label: `${dDate}/${dMonth + 1}`,
          count,
        });
      }
      chartData = days30;
    } else if (period === "custom" && startDate && endDate) {
      // Custom date range: days if <= 31, otherwise group by week/month
      const diffMs = endDate.getTime() - startDate.getTime();
      const diffDays = Math.max(1, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));

      if (diffDays <= 31) {
        const customDays: DayDataPoint[] = [];
        for (let i = 0; i < diffDays; i++) {
          const d = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000);
          const dYear = d.getFullYear();
          const dMonth = d.getMonth();
          const dDate = d.getDate();

          let count = 0;
          allPeriodStudents.forEach((student: any) => {
            const sDate = new Date(student.createdAt || student.create_at);
            if (
              sDate.getFullYear() === dYear &&
              sDate.getMonth() === dMonth &&
              sDate.getDate() === dDate
            ) {
              count++;
            }
          });

          customDays.push({
            date: `${dDate}/${dMonth + 1}`,
            label: `${dDate}/${dMonth + 1}`,
            count,
          });
        }
        chartData = customDays;
      } else {
        const monthsMap = new Map<string, number>();
        allPeriodStudents.forEach((student: any) => {
          const sDate = new Date(student.createdAt || student.create_at);
          const key = `${sDate.getMonth() + 1}/${sDate.getFullYear().toString().slice(2)}`;
          monthsMap.set(key, (monthsMap.get(key) || 0) + 1);
        });
        chartData = Array.from(monthsMap.entries()).map(([label, count]) => ({
          date: label,
          label,
          count,
        }));
      }
    } else {
      // All time grouped by month/year
      const monthsMap = new Map<string, number>();
      allPeriodStudents.forEach((student: any) => {
        const sDate = new Date(student.createdAt || student.create_at);
        const key = `${sDate.getMonth() + 1}/${sDate.getFullYear().toString().slice(2)}`;
        monthsMap.set(key, (monthsMap.get(key) || 0) + 1);
      });
      chartData = Array.from(monthsMap.entries()).map(([label, count]) => ({
        date: label,
        label,
        count,
      }));
    }
  } catch (error: any) {
    console.error("Error loading fast admin dashboard stats:", error);
  }

  const formatCleanPhone = (phone: string) => {
    if (!phone) return "";
    let clean = phone.replace(/[^0-9]/g, "");
    if (clean.startsWith("00")) clean = clean.substring(2);
    if (clean.startsWith("09")) clean = "963" + clean.substring(1);
    return clean;
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Toolbar with Fast Period Filter */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-2xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
            مؤشرات العمل اليومية والتشغيلية
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            لوحة قيادة سريعة تركز على الدورات الجديدة، المسودات المعلقة، وإقبال الطلاب {periodLabel}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            href="/admin/stats"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-[#123D3A] bg-[#123D3A]/10 hover:bg-[#123D3A]/15 transition border border-[#123D3A]/20"
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>الإحصائيات الشاملة والتحليلات</span>
          </Link>

          {/* Shadcn Select Period Selector */}
          <PeriodSelector
            currentPeriod={period}
            initialFrom={from}
            initialTo={to}
          />
        </div>
      </div>

      {/* 2. Compact Horizontal KPI Cards (Icon + Label on right, Count on left) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        {/* Card 1: Courses */}
        <Link
          href="/admin/courses"
          className="group flex items-center justify-between p-3.5 sm:px-4 sm:py-3 rounded-2xl bg-white border border-slate-200/90 hover:border-[#123D3A]/40 hover:shadow-xs transition duration-150 shadow-2xs"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <BookOpen className="w-5 h-5" />
            </div>
            <span className="text-xs sm:text-sm font-bold text-slate-800 group-hover:text-[#123D3A] transition truncate">
              التدريبات
            </span>
          </div>
          <span className="text-xl sm:text-2xl font-black text-slate-900 font-mono pl-1">
            {coursesCount}
          </span>
        </Link>

        {/* Card 2: Drafts */}
        <Link
          href="/admin/def-courses"
          className="group flex items-center justify-between p-3.5 sm:px-4 sm:py-3 rounded-2xl bg-white border border-slate-200/90 hover:border-amber-400/50 hover:shadow-xs transition duration-150 shadow-2xs"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <FileEdit className="w-5 h-5" />
            </div>
            <span className="text-xs sm:text-sm font-bold text-slate-800 group-hover:text-[#D58A38] transition truncate">
              مسودة التدريبات
            </span>
          </div>
          <span className="text-xl sm:text-2xl font-black text-slate-900 font-mono pl-1">
            {pendingDefCoursesCount}
          </span>
        </Link>

        {/* Card 3: Student Requests */}
        <Link
          href="/admin/users-details"
          className="group flex items-center justify-between p-3.5 sm:px-4 sm:py-3 rounded-2xl bg-white border border-slate-200/90 hover:border-purple-400/50 hover:shadow-xs transition duration-150 shadow-2xs"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <UserCheck className="w-5 h-5" />
            </div>
            <span className="text-xs sm:text-sm font-bold text-slate-800 group-hover:text-purple-700 transition truncate">
              طلبات الطلاب
            </span>
          </div>
          <span className="text-xl sm:text-2xl font-black text-slate-900 font-mono pl-1">
            {periodStudentsCount}
          </span>
        </Link>
      </div>

      {/* 3. Interactive Student Registrations Chart */}
      <StudentRegistrationChart
        data={chartData}
        periodLabel={periodLabel}
      />

      {/* 4. Actionable Two-Column Layout: Pending Drafts & Fast Student Inquiries */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Column 1 (6 cols): Pending Drafts for Quick Conversion */}
        <div className="lg:col-span-6 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm sm:text-base font-black text-slate-900">
                المسودات بانتظار التحويل لدورة
              </h2>
              <p className="text-xs text-slate-500">
                الفرص المقترحة التي لم تُطلق كدورة تدريبية بعد
              </p>
            </div>
            <Link
              href="/admin/def-courses"
              className="text-xs font-bold text-[#123D3A] hover:text-[#D58A38] transition flex items-center gap-1"
            >
              <span>عرض كل المسودات ({pendingDefCoursesCount})</span>
              <ArrowLeft className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-2.5">
            {pendingDrafts.length === 0 ? (
              <div className="p-8 rounded-2xl bg-white border border-slate-200 text-center text-slate-400 text-xs">
                <CheckCircle2 className="w-6 h-6 text-emerald-500 mx-auto mb-2 opacity-80" />
                <p className="font-bold text-slate-700">لا توجد مسودات معلقة حالياً</p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  جميع المسودات تمت مراجعتها أو إطلاقها كدورات
                </p>
              </div>
            ) : (
              pendingDrafts.map((draft: any) => {
                const idStr = draft._id.toString();
                return (
                  <div
                    key={idStr}
                    className="p-3.5 rounded-2xl bg-white border border-slate-200/90 hover:border-amber-300 transition shadow-2xs flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
                        <FileEdit className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-slate-900 truncate max-w-[240px]">
                          {draft.title || draft.rawText?.slice(0, 40) || "مسودة مقترح تدريبي"}
                        </h4>
                        <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                          {draft.organizationName && (
                            <span className="truncate max-w-[140px] text-slate-600 font-medium">
                              {draft.organizationName}
                            </span>
                          )}
                          <span>•</span>
                          <span>بانتظار التحويل</span>
                        </div>
                      </div>
                    </div>

                    <Link
                      href={`/admin/ai-course?draftId=${idStr}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#123D3A] hover:bg-[#0E2F2D] text-white text-xs font-bold shrink-0 transition shadow-2xs"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-[#D58A38]" />
                      <span>توليد واعتماد</span>
                    </Link>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Column 2 (6 cols): Latest Student Inquiries with Direct WhatsApp */}
        <div className="lg:col-span-6 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm sm:text-base font-black text-slate-900">
                أحدث استمارات وطلبات الطلاب
              </h2>
              <p className="text-xs text-slate-500">
                تواصل وتوجيه فوري للطلاب المهتمين بالتدريب
              </p>
            </div>
            <Link
              href={
                period === "week"
                  ? "/admin/users-details?date_filter=week"
                  : period === "day"
                  ? "/admin/users-details?date_filter=today"
                  : period === "month"
                  ? "/admin/users-details?date_filter=month"
                  : period === "30days"
                  ? "/admin/users-details?date_filter=30days"
                  : period === "custom" && from && to
                  ? `/admin/users-details?date_filter=custom&from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`
                  : "/admin/users-details"
              }
              className="text-xs font-bold text-[#123D3A] hover:text-[#D58A38] transition flex items-center gap-1"
            >
              <span>جدول كل الطلبات ({periodStudentsCount})</span>
              <ArrowLeft className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-2.5">
            {recentStudents.length === 0 ? (
              <div className="p-8 rounded-2xl bg-white border border-slate-200 text-center text-slate-400 text-xs">
                لا توجد طلبات طلاب مسجلة {periodLabel}
              </div>
            ) : (
              recentStudents.map((student: any) => {
                const idStr = student._id.toString();
                const cleanPhone = formatCleanPhone(student.phone);
                return (
                  <div
                    key={idStr}
                    className="p-3.5 rounded-2xl bg-white border border-slate-200/90 hover:border-[#123D3A]/40 transition shadow-2xs flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center shrink-0 font-bold text-xs">
                        {student.fullName?.charAt(0) || "ط"}
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-slate-900 truncate max-w-[200px]">
                          {student.fullName}
                        </h4>
                        <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5 truncate">
                          <span className="text-[#D58A38] font-semibold truncate max-w-[150px]">
                            {student.interests || "رغبة عامة"}
                          </span>
                          <span>•</span>
                          <span>{student.District || "إدلب"}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {cleanPhone ? (
                        <a
                          href={`https://wa.me/${cleanPhone}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-2xs"
                          title="مراسلة عبر واتساب"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>واتساب</span>
                        </a>
                      ) : (
                        <Link
                          href="/admin/users-details"
                          className="text-xs font-bold text-slate-600 hover:text-slate-900 px-2 py-1"
                        >
                          عرض
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
