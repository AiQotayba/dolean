"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import {
  GraduationCap,
  Phone,
  MapPin,
  Calendar,
  MessageCircle,
  BookOpen,
  Filter,
  CheckCircle2,
  Clock,
  User,
} from "lucide-react";
import { DataTable, type TableColumn } from "@/components/table/data-table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface UserDetailRecord {
  _id: string;
  fullName: string;
  phone: string;
  District?: string;
  city?: string;
  interests?: string;
  educationLevel?: string;
  specialization?: string;
  freeCourses?: boolean;
  paidCourses?: boolean;
  paidCoursesLimit?: number;
  requiredCourses?: string[];
  createdAt?: string;
}

export default function AdminUsersDetailsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [selectedStudent, setSelectedStudent] = React.useState<UserDetailRecord | null>(null);
  const [dialogOpen, setDialogOpen] = React.useState(false);

  const currentDateFilter = searchParams?.get("date_filter") || "all";

  const handleDateFilterChange = (value: string) => {
    const params = new URLSearchParams(searchParams?.toString() || "");
    if (value === "all") {
      params.delete("date_filter");
    } else {
      params.set("date_filter", value);
    }
    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handleView = (student: UserDetailRecord) => {
    setSelectedStudent(student);
    setDialogOpen(true);
  };

  const formatCleanPhone = (phone: string) => {
    if (!phone) return "";
    let clean = phone.replace(/[^0-9]/g, "");
    if (clean.startsWith("00")) clean = clean.substring(2);
    if (clean.startsWith("09")) clean = "963" + clean.substring(1);
    return clean;
  };

  // Simplified columns: Education & Specialization removed as requested
  const columns: TableColumn<UserDetailRecord>[] = [
    {
      key: "fullName",
      label: "اسم الطالب",
      sortable: true,
      render: (_, row) => (
        <div className="flex items-center gap-3 py-1">
          <div className="w-9 h-9 rounded-xl bg-[#123D3A]/10 text-[#123D3A] flex items-center justify-center font-bold text-sm shrink-0">
            {row.fullName?.charAt(0) || "ط"}
          </div>
          <div className="flex flex-col min-w-0">
            <span
              onClick={() => handleView(row)}
              className="font-bold text-slate-900 hover:text-[#123D3A] cursor-pointer transition truncate max-w-[200px]"
            >
              {row.fullName || "طالب بدون اسم"}
            </span>
            <span className="text-[11px] text-slate-400 font-mono" dir="ltr">
              {row.phone || "—"}
            </span>
          </div>
        </div>
      ),
    },
    {
      key: "phone",
      label: "رقم الهاتف والواتساب",
      sortable: false,
      render: (val) => {
        const clean = formatCleanPhone(String(val || ""));
        return (
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-semibold text-slate-700" dir="ltr">
              {String(val || "—")}
            </span>
            {clean && (
              <a
                href={`https://wa.me/${clean}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1 rounded-md text-emerald-600 hover:bg-emerald-50 transition"
                title="مراسلة عبر واتساب"
                onClick={(e) => e.stopPropagation()}
              >
                <MessageCircle className="w-4 h-4 fill-emerald-500/20" />
              </a>
            )}
          </div>
        );
      },
    },
    {
      key: "location",
      label: "المنطقة والمدينة",
      render: (_, row) => {
        const loc = [row.District || "إدلب", row.city].filter(Boolean).join(" - ");
        return (
          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate max-w-[160px] font-medium">{loc || "إدلب"}</span>
          </div>
        );
      },
    },
    {
      key: "interests",
      label: "الاهتمام التدريبي المطلوب",
      render: (val) => (
        <div className="max-w-[240px] truncate">
          <span className="inline-block text-xs font-semibold px-2 py-0.5 rounded-md bg-[#D58A38]/10 text-[#A06018] truncate max-w-full">
            {String(val || "عام / غير محدد")}
          </span>
        </div>
      ),
    },
    {
      key: "createdAt",
      label: "تاريخ الطلب",
      sortable: true,
      render: (val) => {
        if (!val) return <span className="text-xs text-slate-400">—</span>;
        const date = new Date(val);
        const formatted = date.toLocaleDateString("ar-SY", {
          year: "numeric",
          month: "short",
          day: "numeric",
        });
        return (
          <div className="flex items-center gap-1 text-xs text-slate-500">
            <Calendar className="w-3 h-3 text-slate-400" />
            <span>{formatted}</span>
          </div>
        );
      },
    },
  ];

  const cleanSelectedPhone = selectedStudent
    ? formatCleanPhone(selectedStudent.phone)
    : "";

  const selectedLoc = selectedStudent
    ? [selectedStudent.District || "إدلب", selectedStudent.city].filter(Boolean).join(" - ")
    : "إدلب";

  const selectedDateFormatted = selectedStudent?.createdAt
    ? new Date(selectedStudent.createdAt).toLocaleDateString("ar-SY", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "—";

  return (
    <div className="space-y-5">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-1">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#123D3A] text-white flex items-center justify-center shadow-xs shrink-0">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
              طلبات واهتمامات الطلاب التدريبية
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              قائمة الطلاب المسجلين لتوجيههم ومطابقة رغباتهم مع التدريبات المتاحة
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/admin/send-training"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black text-white bg-emerald-600 hover:bg-emerald-700 transition shadow-xs active:scale-95"
          >
            <MessageCircle className="w-4 h-4 fill-white/20" />
            <span>إرسال تدريب للطلاب (واتساب) 🚀</span>
          </Link>
        </div>
      </div>

      {/* Unified Box for Table and Search/Date Filter */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-6 shadow-2xs space-y-4">
        {/* Main DataTable with Date Filter as extra header action */}
        <DataTable<UserDetailRecord>
          columns={columns}
          apiEndpoint="admin/users-details"
          searchPlaceholder="ابحث باسم الطالب، الهاتف، المدينة، أو الرغبة..."
          emptyMessage="لم يتم العثور على أي طلبات طلابية مطابقة للبحث أو التصفية"
          enableDelete={true}
          enableEdit={false}
          enableView={true}
          deleteTitle="حذف طلب الطالب"
          deleteDescription={(row) =>
            `هل أنت متأكد من حذف استمارة الطالب "${row.fullName}"؟ سيتم حذف بيانات الاتصال نهائياً.`
          }
          extraHeaderActions={
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500 hidden sm:inline">
                فلتر التاريخ:
              </span>
              <Select value={currentDateFilter} onValueChange={handleDateFilterChange}>
                <SelectTrigger className="w-[140px] h-9 text-xs font-bold bg-white rounded-xl border-slate-200">
                  <SelectValue placeholder="تصفية بالتاريخ" />
                </SelectTrigger>
                <SelectContent className="text-right">
                  <SelectItem value="all">كل التواريخ</SelectItem>
                  <SelectItem value="today">طلبات اليوم</SelectItem>
                  <SelectItem value="week">هذا الأسبوع</SelectItem>
                  <SelectItem value="month">هذا الشهر</SelectItem>
                  <SelectItem value="30days">آخر 30 يوماً</SelectItem>
                </SelectContent>
              </Select>
            </div>
          }
          actions={{
            onView: handleView,
          }}
        />
      </div>

      {/* Simplified, Decluttered Student Details Dialog Modal */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-xl p-0 rounded-3xl border border-slate-200 shadow-2xl overflow-hidden [&>button]:text-slate-400 [&>button]:hover:text-slate-700 [&>button]:z-10">
          {selectedStudent && (
            <div>
              {/* Top Clean Margin/Header */}
              <div className="pt-6 pb-4 px-6 border-b border-slate-100 bg-white">
                <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider block mb-2">
                  تفاصيل استمارة الطالب
                </span>

                {/* 1. Contact Section: Avatar + Name/Phone on Right, WhatsApp on Left */}
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-12 h-12 rounded-2xl bg-[#123D3A]/10 text-[#123D3A] flex items-center justify-center font-black text-xl shrink-0">
                      {selectedStudent.fullName?.charAt(0) || "ط"}
                    </div>
                    <div className="min-w-0">
                      <h2 className="text-base sm:text-lg font-black text-slate-900 truncate">
                        {selectedStudent.fullName}
                      </h2>
                      <span className="text-xs font-mono font-semibold text-slate-500 block mt-0.5" dir="ltr">
                        {selectedStudent.phone || "—"}
                      </span>
                    </div>
                  </div>

                  {cleanSelectedPhone && (
                    <a
                      href={`https://wa.me/${cleanSelectedPhone}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition shrink-0 active:scale-95"
                    >
                      <MessageCircle className="w-4 h-4 fill-white/20" />
                      <span>مراسلة واتساب</span>
                    </a>
                  )}
                </div>
              </div>

              {/* Body Content: Simplified and Focused */}
              <div className="p-6 space-y-4 bg-slate-50/50">
                {/* 2. Location Section: Location Icon + City/District */}
                <div className="p-3.5 bg-white border border-slate-200/80 rounded-xl flex items-center gap-3 shadow-2xs">
                  <div className="w-9 h-9 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4 text-[#D58A38]" />
                  </div>
                  <div>
                    <span className="block text-[11px] text-slate-400 font-medium">الموقع الجغرافي</span>
                    <span className="block text-xs sm:text-sm font-bold text-slate-800 mt-0.5">
                      {selectedLoc}
                    </span>
                  </div>
                </div>

                {/* 3. Training Interests */}
                <div className="p-4 bg-white border border-slate-200/80 rounded-xl shadow-2xs space-y-2">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-[#D58A38]" />
                    <span className="text-xs font-bold text-slate-800">الاهتمامات والرغبة التدريبية:</span>
                  </div>
                  <p className="text-xs sm:text-sm font-semibold text-slate-900 leading-relaxed bg-amber-50/60 border border-amber-200/60 p-3 rounded-lg">
                    {selectedStudent.interests || "عام / غير محدد"}
                  </p>

                  {selectedStudent.requiredCourses && selectedStudent.requiredCourses.length > 0 && (
                    <div className="pt-2">
                      <span className="block text-[11px] text-slate-500 font-medium mb-1">
                        دورات محددة بالاسم:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedStudent.requiredCourses.map((c, i) => (
                          <span
                            key={i}
                            className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 text-xs font-bold"
                          >
                            {c}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* 4. Training Type Preference & Request Date */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Training Type */}
                  <div className="p-3.5 bg-white border border-slate-200/80 rounded-xl shadow-2xs">
                    <span className="block text-[11px] text-slate-400 font-medium">نوع التدريب المفضل</span>
                    <div className="mt-1">
                      {selectedStudent.freeCourses && (
                        <span className="inline-block px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200/60">
                          دورات مجانية
                        </span>
                      )}
                      {selectedStudent.paidCourses && (
                        <span className="inline-block px-2 py-0.5 rounded-md bg-blue-50 text-blue-800 text-xs font-bold border border-blue-200/60 mr-1.5">
                          دورات مأجورة (حتى {selectedStudent.paidCoursesLimit || 0} $)
                        </span>
                      )}
                      {!selectedStudent.freeCourses && !selectedStudent.paidCourses && (
                        <span className="text-xs font-bold text-slate-600">غير محدد</span>
                      )}
                    </div>
                  </div>

                  {/* Request Date */}
                  <div className="p-3.5 bg-white border border-slate-200/80 rounded-xl shadow-2xs">
                    <span className="block text-[11px] text-slate-400 font-medium">تاريخ تقديم الطلب</span>
                    <div className="flex items-center gap-1.5 mt-1 text-xs font-bold text-slate-800">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{selectedDateFormatted}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Clean Footer */}
              <div className="p-4 bg-white border-t border-slate-100 flex items-center justify-between">
                <Button
                  variant="outline"
                  onClick={() => setDialogOpen(false)}
                  className="rounded-xl text-xs h-9"
                >
                  إغلاق النافذة
                </Button>

                {cleanSelectedPhone && (
                  <a
                    href={`https://wa.me/${cleanSelectedPhone}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition shadow-xs"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>مراسلة واتساب</span>
                  </a>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}