"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import {
  FileEdit,
  Sparkles,
  Plus,
  MapPin,
  Calendar,
  ExternalLink,
  Bot,
  AlertCircle,
  CheckCircle2,
  Clock,
  Layers,
  ArrowRight,
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

interface DefCourseRecord {
  _id: string;
  title?: string;
  context?: string;
  rawText?: string;
  image?: string;
  Source?: string;
  sourceUrl?: string;
  location?: string;
  organizationName?: string;
  processedByAi?: boolean;
  status: "pending" | "approved" | "rejected";
  createdAt?: string;
}

export default function AdminDefCoursesPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [selectedDraft, setSelectedDraft] = React.useState<DefCourseRecord | null>(null);
  const [dialogOpen, setDialogOpen] = React.useState(false);

  const currentStatus = searchParams?.get("status") || "all";

  const handleStatusChange = (value: string) => {
    const params = new URLSearchParams(searchParams?.toString() || "");
    if (value === "all") {
      params.delete("status");
    } else {
      params.set("status", value);
    }
    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handleView = (draft: DefCourseRecord) => {
    setSelectedDraft(draft);
    setDialogOpen(true);
  };

  const handleEdit = (draft: DefCourseRecord) => {
    router.push(`/admin/def-courses/${draft._id}`);
  };

  const handleAIGenerate = (draftId: string) => {
    router.push(`/admin/ai-course?draftId=${draftId}`);
  };

  const columns: TableColumn<DefCourseRecord>[] = [
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
                alt={row.title || "مسودة"}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            ) : (
              <FileEdit className="w-4 h-4 text-slate-400" />
            )}
          </div>
        );
      },
    },
    {
      key: "title",
      label: "عنوان / نص المسودة",
      sortable: true,
      render: (_, row) => (
        <div className="flex flex-col min-w-0 py-1">
          <span
            onClick={() => handleView(row)}
            className="font-bold text-slate-900 hover:text-[#123D3A] cursor-pointer transition truncate max-w-[280px]"
            title={row.title || row.rawText || "مسودة"}
          >
            {row.title || row.rawText?.slice(0, 50) || "مسودة إعلان تدريبي خام"}
          </span>
          <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
            {row.location && (
              <span className="flex items-center gap-1 text-slate-500 font-medium">
                <MapPin className="w-3 h-3 text-[#D58A38]" />
                {row.location}
              </span>
            )}
            {row.organizationName && (
              <span className="text-slate-400 truncate max-w-[140px]">
                {row.organizationName}
              </span>
            )}
          </div>
        </div>
      ),
    },
    {
      key: "Source",
      label: "المصدر والجهة",
      sortable: false,
      render: (val, row) => {
        const srcText = String(val || row.organizationName || "إدخال يدوي");
        return (
          <div className="flex items-center gap-1 text-xs text-slate-600 font-bold max-w-[180px] truncate">
            <span className="truncate" title={srcText}>
              {srcText}
            </span>
          </div>
        );
      },
    },
    {
      key: "status",
      label: "حالة المعالجة",
      sortable: true,
      render: (val) => {
        const isApproved = val === "approved";
        return isApproved ? (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-black bg-emerald-50 text-emerald-800 border border-emerald-200/60">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            معتمدة كدورة
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-black bg-amber-50 text-amber-800 border border-amber-200/60">
            <Clock className="w-3 h-3 text-amber-600" />
            بانتظار المعالجة
          </span>
        );
      },
    },
    {
      key: "aiAction",
      label: "الاعتماد بالذكاء الاصطناعي",
      sortable: false,
      render: (_, row) => {
        if (row.status === "approved") {
          return (
            <span className="text-[11px] font-bold text-slate-400">
              تم النشر سابقاً
            </span>
          );
        }

        return (
          <Button
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleAIGenerate(row._id);
            }}
            className="h-8 px-3 rounded-xl bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-purple-800 hover:to-indigo-800 text-white font-bold text-xs shadow-xs gap-1.5 transition active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>توليد واعتماد ✨</span>
          </Button>
        );
      },
    },
    {
      key: "createdAt",
      label: "تاريخ الإضافة",
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
          <div className="w-10 h-10 rounded-xl bg-purple-700 text-white flex items-center justify-center shadow-xs">
            <FileEdit className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
              مسودات ومقترحات الدورات التدريبية
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              إدارة الإعلانات الخام والمقترحات واعتمادها بنقرة واحدة عبر الذكاء الاصطناعي
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 shrink-0">
          <Link
            href="/admin/ai-course"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-purple-800 hover:to-indigo-800 transition shadow-xs"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>إضافة وتوليد بـ AI</span>
          </Link>
        </div>
      </div>

      {/* Main DataTable Box */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-6 shadow-2xs space-y-4">
        <DataTable<DefCourseRecord>
          columns={columns}
          apiEndpoint="admin/def-courses"
          searchPlaceholder="ابحث بنص المسودة، المصدر، أو المدينة..."
          emptyMessage="لم يتم العثور على أي مسودات أو إعلانات مطابقة"
          enableDelete={true}
          enableEdit={true}
          enableView={true}
          deleteTitle="حذف المسودة"
          deleteDescription={(row) =>
            `هل أنت متأكد من حذف مسودة "${row.title || 'الإعلان'}"؟`
          }
          extraHeaderActions={
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500 hidden sm:inline">
                حالة المسودة:
              </span>
              <Select value={currentStatus} onValueChange={handleStatusChange}>
                <SelectTrigger className="w-[140px] h-9 text-xs font-bold bg-white rounded-xl border-slate-200">
                  <SelectValue placeholder="تصفية بالحالة" />
                </SelectTrigger>
                <SelectContent className="text-right">
                  <SelectItem value="all">كافة المسودات</SelectItem>
                  <SelectItem value="pending">بانتظار المعالجة</SelectItem>
                  <SelectItem value="approved">معتمدة ومنشورة</SelectItem>
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

      {/* Preview Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-xl p-0 rounded-3xl border border-slate-200 shadow-2xl overflow-hidden [&>button]:text-slate-400 [&>button]:hover:text-slate-700">
          {selectedDraft && (
            <div>
              <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[11px] font-black uppercase tracking-wider text-purple-700">
                    {selectedDraft.Source || "مسودة إعلان تدريبي"}
                  </span>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-200/80 text-slate-700">
                    {selectedDraft.status === "approved" ? "معتمدة" : "قيد المراجعة"}
                  </span>
                </div>
                <h2 className="text-base sm:text-lg font-black text-slate-900 leading-tight">
                  {selectedDraft.title || "مسودة إعلان تدريبي"}
                </h2>
              </div>

              <div className="p-6 space-y-4 text-right">
                <div>
                  <span className="text-xs font-bold text-slate-400 block mb-1">
                    النص الخام المستورد:
                  </span>
                  <div className="text-xs sm:text-sm text-slate-800 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200/60 max-h-60 overflow-y-auto whitespace-pre-wrap">
                    {selectedDraft.context || selectedDraft.rawText || "لا يوجد نص تفصيلي للمسودة."}
                  </div>
                </div>

                {selectedDraft.sourceUrl && (
                  <div className="text-xs text-slate-500 flex items-center gap-1.5 truncate">
                    <span className="font-bold">رابط المصدر:</span>
                    <a
                      href={selectedDraft.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-600 hover:underline truncate"
                    >
                      {selectedDraft.sourceUrl}
                    </a>
                  </div>
                )}
              </div>

              <div className="p-4 bg-white border-t border-slate-100 flex items-center justify-between">
                <Button
                  variant="outline"
                  onClick={() => setDialogOpen(false)}
                  className="rounded-xl text-xs h-9"
                >
                  إغلاق
                </Button>

                {selectedDraft.status !== "approved" && (
                  <Button
                    onClick={() => handleAIGenerate(selectedDraft._id)}
                    className="rounded-xl text-xs font-bold h-9 bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-purple-800 hover:to-indigo-800 text-white gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span>توليد واعتماد بالـ AI ✨</span>
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}