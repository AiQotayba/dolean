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
  const period = resolvedParams?.period || "week";
  const from = resolvedParams?.from || "";
  const to = resolvedParams?.to || "";

  // Compute date range
  const now = new Date();
  let startDate: Date | null = null;
  let endDate: Date | null = null;
  let periodLabel = "خلال هذا الأسبوع";

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
    <div className="space-y-4">
      {/* 1. Header: Clean & Action-Oriented without filler text */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-3.5 sm:px-5 sm:py-3 shadow-2xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-2">
          <h1 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
            لوحة التحكم والمؤشرات الأسبوعية
          </h1>
          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
            {periodLabel}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin/stats"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-[#123D3A] bg-[#123D3A]/10 hover:bg-[#123D3A]/15 transition"
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>التحليلات الشاملة</span>
          </Link>

          <PeriodSelector
            currentPeriod={period}
            initialFrom={from}
            initialTo={to}
          />
        </div>
      </div>

      {/* 2. Duolingo-style Side-by-Side Grid: Analytics on Right, Latest Student Forms on Left */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Right Column (7 cols): KPIs & Weekly Registration Chart */}
        <div className="lg:col-span-7 space-y-4">
          {/* KPI Cards Row */}
          <div className="grid grid-cols-3 gap-3">
            {/* Card 1: Courses */}
            <Link
              href="/admin/courses"
              className="group p-3 rounded-2xl bg-white border border-slate-200/90 hover:border-[#123D3A]/40 transition shadow-2xs flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">التدريبات</span>
                <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <BookOpen className="w-4 h-4" />
                </div>
              </div>
              <span className="text-2xl font-black text-slate-900 font-mono mt-2">
                {coursesCount}
              </span>
            </Link>

            {/* Card 2: Drafts */}
            <Link
              href="/admin/def-courses"
              className="group p-3 rounded-2xl bg-white border border-slate-200/90 hover:border-amber-400/50 transition shadow-2xs flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">المسودات</span>
                <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
                  <FileEdit className="w-4 h-4" />
                </div>
              </div>
              <span className="text-2xl font-black text-slate-900 font-mono mt-2">
                {pendingDefCoursesCount}
              </span>
            </Link>

            {/* Card 3: Student Requests */}
            <Link
              href="/admin/users-details"
              className="group p-3 rounded-2xl bg-white border border-slate-200/90 hover:border-purple-400/50 transition shadow-2xs flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">طلبات الطلاب</span>
                <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center">
                  <UserCheck className="w-4 h-4" />
                </div>
              </div>
              <span className="text-2xl font-black text-slate-900 font-mono mt-2">
                {periodStudentsCount}
              </span>
            </Link>
          </div>

          {/* Weekly Interactive Registration Chart */}
          <StudentRegistrationChart
            data={chartData}
            periodLabel={periodLabel}
          />

          {/* Pending Drafts Box under Chart if any */}
          {pendingDrafts.length > 0 && (
            <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                  <FileEdit className="w-3.5 h-3.5 text-amber-600" />
                  <span>مسودات تدريبية بانتظار الاعتماد ({pendingDefCoursesCount})</span>
                </h3>
                <Link
                  href="/admin/def-courses"
                  className="text-[11px] font-bold text-[#123D3A] hover:underline flex items-center gap-1"
                >
                  <span>عرض الكل</span>
                  <ArrowLeft className="w-3 h-3" />
                </Link>
              </div>

              <div className="space-y-2">
                {pendingDrafts.slice(0, 3).map((draft: any) => {
                  const idStr = draft._id.toString();
                  return (
                    <div
                      key={idStr}
                      className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between gap-3"
                    >
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-slate-800 truncate">
                          {draft.title || draft.rawText?.slice(0, 35) || "مسودة مقترح"}
                        </h4>
                        <span className="text-[10px] text-slate-400">
                          {draft.organizationName || "جهة غير محددة"}
                        </span>
                      </div>

                      <Link
                        href={`/admin/ai-course?draftId=${idStr}`}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#123D3A] text-white text-[11px] font-bold shrink-0 hover:bg-[#0E2F2D]"
                      >
                        <Sparkles className="w-3 h-3 text-amber-300" />
                        <span>اعتماد بالـ AI</span>
                      </Link>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Left Column (5 cols): Latest Student Applications directly beside stats */}
        <div className="lg:col-span-5 bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <h2 className="text-xs sm:text-sm font-black text-slate-900">
                أحدث استمارات وطلبات الطلاب
              </h2>
              <span className="text-[11px] text-slate-400">تواصل فوري عبر واتساب</span>
            </div>

            <Link
              href={
                period === "week"
                  ? "/admin/users-details?date_filter=week"
                  : period === "day"
                  ? "/admin/users-details?date_filter=today"
                  : period === "month"
                  ? "/admin/users-details?date_filter=month"
                  : "/admin/users-details"
              }
              className="text-xs font-bold text-[#123D3A] hover:underline flex items-center gap-1"
            >
              <span>كل الطلبات ({periodStudentsCount})</span>
              <ArrowLeft className="w-3 h-3" />
            </Link>
          </div>

          <div className="space-y-2">
            {recentStudents.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs font-medium">
                لا توجد طلبات مسجلة {periodLabel}
              </div>
            ) : (
              recentStudents.map((student: any) => {
                const idStr = student._id.toString();
                const cleanPhone = formatCleanPhone(student.phone);
                return (
                  <div
                    key={idStr}
                    className="p-3 rounded-xl bg-slate-50/70 border border-slate-100 hover:border-slate-200 transition flex items-center justify-between gap-2.5"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center shrink-0 font-bold text-xs">
                        {student.fullName?.charAt(0) || "ط"}
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-slate-900 truncate max-w-[150px]">
                          {student.fullName}
                        </h4>
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-0.5 truncate">
                          <span className="text-[#D58A38] font-semibold truncate max-w-[120px]">
                            {student.interests || "رغبة عامة"}
                          </span>
                          <span>•</span>
                          <span className="truncate">{student.District || "إدلب"}</span>
                        </div>
                      </div>
                    </div>

                    <div className="shrink-0">
                      {cleanPhone ? (
                        <a
                          href={`https://wa.me/${cleanPhone}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold transition shadow-2xs"
                          title="مراسلة واتساب"
                        >
                          <MessageCircle className="w-3.5 h-3.5 fill-white/20" />
                          <span>واتساب</span>
                        </a>
                      ) : (
                        <Link
                          href="/admin/users-details"
                          className="text-[11px] font-bold text-slate-600 hover:text-slate-900 px-2 py-1"
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
