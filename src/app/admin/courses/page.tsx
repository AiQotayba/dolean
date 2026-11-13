"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import {
  BookOpen,
  Sparkles,
  Plus,
  MapPin,
  Calendar,
  Building2,
  DollarSign,
  ExternalLink,
  Tag,
  Eye,
  CheckCircle2,
  Globe,
  Clock,
  MessageCircle,
  Send,
} from "lucide-react";
import { DataTable, type TableColumn } from "@/components/table/data-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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

interface CourseRecord {
  _id: string;
  title: string;
  summary?: string;
  context?: string;
  image?: string;
  providingEntity?: {
    name?: string;
    logo?: string;
  };
  center?: string;
  location?: string;
  locationType?: "online" | "in_person" | "hybrid";
  locationDetails?: {
    city?: string;
    district?: string;
  };
  pricing?: {
    isFree?: boolean;
    cost?: number;
    currency?: string;
    stipendProvided?: boolean;
    stipendNote?: string;
  };
  price?: number;
  status?: string;
  createdAt?: string;
}

export default function AdminCoursesPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [selectedCourse, setSelectedCourse] = React.useState<CourseRecord | null>(null);
  const [dialogOpen, setDialogOpen] = React.useState(false);

  const currentPricing = searchParams?.get("pricing") || "all";

  const handlePricingChange = (value: string) => {
    const params = new URLSearchParams(searchParams?.toString() || "");
    if (value === "all") {
      params.delete("pricing");
    } else {
      params.set("pricing", value);
    }
    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handleView = (course: CourseRecord) => {
    setSelectedCourse(course);
    setDialogOpen(true);
  };

  const handleEdit = (course: CourseRecord) => {
    router.push(`/admin/courses/${course._id}`);
  };

  const columns: TableColumn<CourseRecord>[] = [
    {
      key: "image",
      label: "الصورة",
      sortable: false,
      render: (_, row) => {
        const imgUrl = row.image;
        return (
          <div className="w-16 h-11 rounded-lg bg-slate-100 overflow-hidden border border-slate-200/80 shrink-0 flex items-center justify-center relative">
            {imgUrl && imgUrl.startsWith("http") ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={imgUrl}
                alt={row.title}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            ) : (
              <BookOpen className="w-4 h-4 text-slate-400" />
            )}
          </div>
        );
      },
    },
    {
      key: "title",
      label: "عنوان الدورة التدريبية",
      sortable: true,
      render: (_, row) => {
        const city = row.locationDetails?.city || row.location || "إدلب";
        const isOnline = row.locationType === "online";
        return (
          <div className="flex flex-col min-w-0 py-1">
            <span
              onClick={() => handleView(row)}
              className="font-bold text-slate-900 hover:text-[#123D3A] cursor-pointer transition truncate max-w-[280px]"
              title={row.title}
            >
              {row.title || "دورة بدون عنوان"}
            </span>
            <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-0.5">
              {isOnline ? (
                <span className="flex items-center gap-1 text-purple-700 bg-purple-50 px-1.5 py-0.2 rounded font-medium">
                  <Globe className="w-3 h-3" />
                  عن بعد (أونلاين)
                </span>
              ) : (
                <span className="flex items-center gap-1 text-slate-500 font-medium">
                  <MapPin className="w-3 h-3 text-[#D58A38]" />
                  {city}
                </span>
              )}
            </div>
          </div>
        );
      },
    },
    {
      key: "providingEntity",
      label: "الجهة المنظمة / الشريك",
      sortable: false,
      render: (_, row) => {
        const orgName = row.providingEntity?.name || row.center || "جهة معتمدة";
        return (
          <div className="flex items-center gap-1.5 text-xs text-slate-700 font-bold max-w-[190px] truncate">
            <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate" title={orgName}>
              {orgName}
            </span>
          </div>
        );
      },
    },
    {
      key: "pricing",
      label: "الرسوم",
      sortable: true,
      render: (_, row) => {
        const isFree = row.pricing?.isFree || row.price === 0;
        const cost = row.pricing?.cost || row.price || 0;

        if (isFree) {
          return (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-black bg-emerald-50 text-emerald-800 border border-emerald-200/60">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              مجاني 100%
            </span>
          );
        }

        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-black bg-blue-50 text-blue-800 border border-blue-200/60 font-mono">
            {cost} $
          </span>
        );
      },
    },
    {
      key: "createdAt",
      label: "تاريخ النشر",
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

  return (
    <div className="space-y-5">
      {/* Top Header Card */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-6 shadow-2xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#123D3A] text-white flex items-center justify-center shadow-xs">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
              إدارة الدورات والبرامج التدريبية
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              سجل تفصيلي وعالي الكثافة لكافة التدريبات المعتمدة في إدلب والشمال السوري
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
          <Link
            href="/admin/send-training"
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition shadow-xs"
          >
            <MessageCircle className="w-4 h-4 fill-white/20" />
            <span>إرسال تدريب للطلاب (واتساب)</span>
          </Link>

          <Link
            href="/admin/ai-course"
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-purple-800 hover:to-indigo-800 transition shadow-xs"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>توليد دورة بـ AI ✨</span>
          </Link>
        </div>
      </div>

      {/* Main DataTable Box */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-6 shadow-2xs space-y-4">
        <DataTable<CourseRecord>
          columns={columns}
          apiEndpoint="admin/courses"
          searchPlaceholder="ابحث باسم الدورة، المركز، المدينة، أو الكلمات المفتاحية..."
          emptyMessage="لم يتم العثور على أي دورات تدريبية مطابقة"
          enableDelete={true}
          enableEdit={true}
          enableView={true}
          deleteTitle="حذف الدورة التدريبية"
          deleteDescription={(row) =>
            `هل أنت متأكد من حذف دورة "${row.title}"؟ سيتم نقلها للأرشيف.`
          }
          extraHeaderActions={
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500 hidden sm:inline">
                الرسوم:
              </span>
              <Select value={currentPricing} onValueChange={handlePricingChange}>
                <SelectTrigger className="w-[130px] h-9 text-xs font-bold bg-white rounded-xl border-slate-200">
                  <SelectValue placeholder="تصفية بالرسوم" />
                </SelectTrigger>
                <SelectContent className="text-right">
                  <SelectItem value="all">كل الأسعار</SelectItem>
                  <SelectItem value="free">منح مجانية فقط</SelectItem>
                  <SelectItem value="paid">دورات مأجورة فقط</SelectItem>
                </SelectContent>
              </Select>
            </div>
          }
          actions={{
            onView: handleView,
            onEdit: handleEdit,
          }}
        />
      </div>

      {/* Quick Preview Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-xl p-0 rounded-3xl border border-slate-200 shadow-2xl overflow-hidden [&>button]:text-slate-400 [&>button]:hover:text-slate-700">
          {selectedCourse && (
            <div>
              {/* Image banner if present */}
              {selectedCourse.image && selectedCourse.image.startsWith("http") && (
                <div className="w-full h-44 bg-slate-100 relative overflow-hidden border-b border-slate-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={selectedCourse.image}
                    alt={selectedCourse.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-3 right-4 left-4 text-white">
                    <span className="text-[11px] font-black uppercase tracking-wider text-amber-300 block mb-1">
                      {selectedCourse.providingEntity?.name || selectedCourse.center || "جهة معتمدة"}
                    </span>
                    <h2 className="text-base sm:text-lg font-black leading-tight drop-shadow-sm">
                      {selectedCourse.title}
                    </h2>
                  </div>
                </div>
              )}

              {/* Header without image */}
              {(!selectedCourse.image || !selectedCourse.image.startsWith("http")) && (
                <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                  <span className="text-[11px] font-black text-[#123D3A] uppercase tracking-wider block mb-1">
                    {selectedCourse.providingEntity?.name || selectedCourse.center || "جهة معتمدة"}
                  </span>
                  <h2 className="text-base sm:text-lg font-black text-slate-900 leading-tight">
                    {selectedCourse.title}
                  </h2>
                </div>
              )}

              {/* Body */}
              <div className="p-6 space-y-4 text-right">
                {selectedCourse.summary && (
                  <div>
                    <span className="text-xs font-bold text-slate-400 block mb-1">الملخص</span>
                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200/60">
                      {selectedCourse.summary}
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl border border-slate-100 bg-white">
                    <span className="text-slate-400 block text-[11px] mb-0.5">نوع الحضور والموقع</span>
                    <span className="font-bold text-slate-800 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#D58A38]" />
                      {selectedCourse.locationType === "online"
                        ? "عن بعد (أونلاين)"
                        : selectedCourse.locationDetails?.city || selectedCourse.location || "إدلب"}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl border border-slate-100 bg-white">
                    <span className="text-slate-400 block text-[11px] mb-0.5">الرسوم التدريبية</span>
                    <span className="font-bold text-slate-800 flex items-center gap-1">
                      <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                      {selectedCourse.pricing?.isFree || selectedCourse.price === 0
                        ? "مجاني بالكامل"
                        : `${selectedCourse.pricing?.cost || selectedCourse.price} دولار أمريكي`}
                    </span>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="p-4 bg-white border-t border-slate-100 flex items-center justify-between">
                <Button
                  variant="outline"
                  onClick={() => setDialogOpen(false)}
                  className="rounded-xl text-xs h-9"
                >
                  إغلاق
                </Button>

                <div className="flex items-center gap-2 flex-wrap">
                  <Link
                    href={`/admin/send-training?courseId=${selectedCourse._id}`}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition shadow-xs"
                  >
                    <MessageCircle className="w-3.5 h-3.5 fill-white/20" />
                    <span>إرسال للطلاب المهتمين</span>
                  </Link>

                  <Link
                    href={`/courses/${selectedCourse._id}`}
                    target="_blank"
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-[#123D3A] bg-[#123D3A]/10 hover:bg-[#123D3A]/20 transition"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>معاينة عامة</span>
                  </Link>

                  <Button
                    onClick={() => handleEdit(selectedCourse)}
                    className="rounded-xl text-xs font-bold h-9 bg-[#123D3A] text-white hover:bg-[#0E2F2D]"
                  >
                    تعديل البيانات
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}