"use client";

import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import {
  MessageCircle,
  Copy,
  Link as LinkIcon,
  Check,
  Search,
  CheckCircle2,
  ArrowRight,
  ExternalLink,
  MapPin,
  BookOpen,
  RotateCcw,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { formatWhatsAppPhone, generatePersonalizedMessage } from "./utils";

interface Step3Props {
  keywords: string[];
  title: string;
  link: string;
  msg: string;
  district: string;
  onBackToStep2: () => void;
  onBackToStep1: () => void;
}

interface StudentItem {
  _id: string;
  fullName: string;
  phone: string;
  District?: string;
  city?: string;
  interests?: string;
  specialization?: string;
  work?: string;
  matchedKeywords?: string[];
  createdAt?: string;
}

export default function Step3WhatsAppDispatch({
  keywords,
  title,
  link,
  msg,
  district,
  onBackToStep2,
  onBackToStep1,
}: Step3Props) {
  const [students, setStudents] = useState<StudentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "sent">("all");
  const [copiedMsgId, setCopiedMsgId] = useState<string | null>(null);
  const [copiedLinkId, setCopiedLinkId] = useState<string | null>(null);

  // Storage key for keeping track of sent students for this training
  const storageKey = useMemo(() => {
    const safeTitle = title.trim() ? title.trim().slice(0, 30) : "default_training";
    return `talaqi_sent_wa_${encodeURIComponent(safeTitle)}`;
  }, [title]);

  const [sentStudentIds, setSentStudentIds] = useState<string[]>([]);

  // Load sent students from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        setSentStudentIds(JSON.parse(stored));
      }
    } catch (e) {
      console.warn("Failed to load sent IDs from localStorage:", e);
    }
  }, [storageKey]);

  // Mark student as sent and persist
  const markAsSent = (studentId: string) => {
    setSentStudentIds((prev) => {
      if (prev.includes(studentId)) return prev;
      const updated = [...prev, studentId];
      try {
        localStorage.setItem(storageKey, JSON.stringify(updated));
      } catch (e) {
        console.warn("Failed to save to localStorage:", e);
      }
      return updated;
    });
  };

  const toggleSentStatus = (studentId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSentStudentIds((prev) => {
      let updated: string[];
      if (prev.includes(studentId)) {
        updated = prev.filter((id) => id !== studentId);
      } else {
        updated = [...prev, studentId];
      }
      try {
        localStorage.setItem(storageKey, JSON.stringify(updated));
      } catch (err) {
        console.warn("Storage error:", err);
      }
      return updated;
    });
  };

  const handleResetAllSent = () => {
    if (confirm("هل تريد إعادة ضبط حالة الإرسال لكافة الطلاب؟")) {
      setSentStudentIds([]);
      try {
        localStorage.removeItem(storageKey);
      } catch (err) {
        console.warn("Storage error:", err);
      }
      toast.info("تمت إعادة ضبط حالات الإرسال");
    }
  };

  // Fetch matched students from API
  useEffect(() => {
    let active = true;
    setLoading(true);

    const params = new URLSearchParams();
    if (keywords.length > 0) {
      params.set("keywords", keywords.join(","));
    }
    if (district && district !== "All") {
      params.set("district", district);
    }
    params.set("limit", "200");

    axios
      .get(`/api/admin/send-training/match?${params.toString()}`)
      .then(({ data }) => {
        if (active && data?.data) {
          setStudents(data.data);
        }
      })
      .catch((err) => {
        console.error("Failed to load students:", err);
        toast.error("فشل في تحميل قائمة الطلاب");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [keywords, district]);

  // Filter students by search and sent status
  const filteredStudents = useMemo(() => {
    return students.filter((st) => {
      const isSent = sentStudentIds.includes(st._id);
      if (statusFilter === "pending" && isSent) return false;
      if (statusFilter === "sent" && !isSent) return false;

      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      const matchName = st.fullName?.toLowerCase().includes(q);
      const matchInterest = st.interests?.toLowerCase().includes(q);
      const matchCity = st.city?.toLowerCase().includes(q) || st.District?.toLowerCase().includes(q);
      return matchName || matchInterest || matchCity;
    });
  }, [students, sentStudentIds, statusFilter, searchQuery]);

  // Copy customized text to clipboard
  const handleCopyText = (student: StudentItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const personalized = generatePersonalizedMessage({
      template: msg,
      studentName: student.fullName,
      courseTitle: title,
      courseLink: link,
      studentInterest: student.interests,
    });

    navigator.clipboard.writeText(personalized);
    setCopiedMsgId(student._id);
    toast.success(`تم نسخ الرسالة للطالب "${student.fullName}" 📋`);
    setTimeout(() => setCopiedMsgId(null), 2000);
  };

  // Copy training link to clipboard
  const handleCopyLink = (student: StudentItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!link) {
      toast.error("لا يوجد رابط تدريب للنسخ");
      return;
    }
    navigator.clipboard.writeText(link);
    setCopiedLinkId(student._id);
    toast.success("تم نسخ رابط التدريب بنجاح 🔗");
    setTimeout(() => setCopiedLinkId(null), 2000);
  };

  // Open WhatsApp Link directly
  const handleOpenWhatsApp = (student: StudentItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const cleanPhone = formatWhatsAppPhone(student.phone);
    if (!cleanPhone) {
      toast.error("رقم الهاتف غير متاح للواتساب");
      return;
    }

    const personalized = generatePersonalizedMessage({
      template: msg,
      studentName: student.fullName,
      courseTitle: title,
      courseLink: link,
      studentInterest: student.interests,
    });

    const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(personalized)}`;
    window.open(waUrl, "_blank", "noopener,noreferrer");
    markAsSent(student._id);
  };

  const sentCount = students.filter((s) => sentStudentIds.includes(s._id)).length;
  const totalCount = students.length;
  const progressPercent = totalCount > 0 ? Math.round((sentCount / totalCount) * 100) : 0;

  return (
    <div className="space-y-4">
      {/* Top Controls: Single-Line Toolbar */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-black text-slate-900">
              قائمة الطلاب المستهدفين ({totalCount})
            </h2>
            <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
              تمت مراسلة {sentCount} من {totalCount} ({progressPercent}%)
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onBackToStep2}
              className="rounded-xl text-xs font-bold border-slate-200 text-slate-700 h-8 px-3"
            >
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
              <span>تعديل الكلمات</span>
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onBackToStep1}
              className="rounded-xl text-xs font-bold border-slate-200 text-slate-700 h-8 px-3"
            >
              <span>تعديل التدريب</span>
            </Button>
            {sentCount > 0 && (
              <button
                type="button"
                onClick={handleResetAllSent}
                className="text-[11px] font-bold text-slate-400 hover:text-rose-600 transition p-1"
                title="إعادة ضبط حالات الإرسال"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-emerald-600 transition-all duration-300 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Filter Tabs and Search Bar in single row */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5 pt-1">
          <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-xl shrink-0">
            <button
              type="button"
              onClick={() => setStatusFilter("all")}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                statusFilter === "all" ? "bg-white text-slate-900 shadow-2xs" : "text-slate-600"
              }`}
            >
              الكل ({totalCount})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter("pending")}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                statusFilter === "pending" ? "bg-white text-slate-900 shadow-2xs" : "text-slate-600"
              }`}
            >
              بانتظار الإرسال ({totalCount - sentCount})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter("sent")}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                statusFilter === "sent" ? "bg-white text-emerald-800 shadow-2xs" : "text-slate-600"
              }`}
            >
              تمت المراسلة ✓ ({sentCount})
            </button>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="بحث باسم الطالب أو المدينة..."
              className="h-8 pr-8 text-xs rounded-xl border-slate-200 bg-white"
            />
          </div>
        </div>
      </div>

      {/* Main Student Cards List */}
      <div className="space-y-2.5">
        {loading ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center space-y-2">
            <Loader2 className="w-6 h-6 animate-spin text-[#123D3A] mx-auto" />
            <p className="text-xs font-bold text-slate-500">جاري تحميل قائمة الطلاب المطابقين...</p>
          </div>
        ) : filteredStudents.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-xs text-slate-500">
            لا يوجد طلاب مطابقون للبحث الحالي.
          </div>
        ) : (
          filteredStudents.map((student) => {
            const isSent = sentStudentIds.includes(student._id);
            const locationText = [student.District || "إدلب", student.city]
              .filter(Boolean)
              .join(" - ");

            return (
              <div
                key={student._id}
                className={`bg-white border rounded-2xl p-3.5 sm:px-4 sm:py-3 shadow-2xs transition ${
                  isSent ? "border-emerald-200 bg-emerald-50/20" : "border-slate-200/90"
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
                  {/* Student Identity: Name + Location (Phone removed as requested) */}
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                        isSent
                          ? "bg-emerald-600 text-white"
                          : "bg-[#123D3A]/10 text-[#123D3A]"
                      }`}
                    >
                      {isSent ? <Check className="w-4 h-4" /> : student.fullName?.charAt(0) || "ط"}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-slate-900 text-xs sm:text-sm truncate">
                          {student.fullName || "طالب بدون اسم"}
                        </h3>
                        {isSent && (
                          <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.2 rounded">
                            تمت المراسلة ✓
                          </span>
                        )}
                      </div>

                      {/* Location takes place of phone string */}
                      <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-0.5">
                        <MapPin className="w-3 h-3 text-[#D58A38] shrink-0" />
                        <span className="font-medium truncate">{locationText || "إدلب"}</span>
                        {student.specialization && (
                          <>
                            <span>•</span>
                            <span className="truncate max-w-[120px] text-slate-600 font-normal">
                              {student.specialization}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Matched Interest Box */}
                  <div className="p-2 sm:px-3 rounded-xl bg-amber-50/80 border border-amber-200/60 text-right space-y-0.5 lg:max-w-md w-full">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="font-bold text-amber-900 flex items-center gap-1">
                        <BookOpen className="w-3 h-3 text-[#D58A38]" />
                        <span>الاهتمام المسجل:</span>
                      </span>
                      {student.matchedKeywords && student.matchedKeywords.length > 0 && (
                        <span className="font-bold text-emerald-700 bg-emerald-100/60 px-1.5 py-0.2 rounded text-[10px]">
                          مطابق: {student.matchedKeywords.join("، ")}
                        </span>
                      )}
                    </div>
                    <p className="text-xs font-semibold text-slate-800 leading-snug truncate">
                      {student.interests || "عام / غير محدد"}
                    </p>
                  </div>

                  {/* Action Buttons: Copy Text + Copy Link + WhatsApp Send */}
                  <div className="flex items-center gap-2 shrink-0 self-end lg:self-center">
                    {/* Copy Text Button */}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={(e) => handleCopyText(student, e)}
                      className="rounded-xl h-8 px-2.5 text-slate-700 hover:text-slate-900 border-slate-200 text-xs font-bold flex items-center gap-1"
                      title="نسخ نص الرسالة"
                    >
                      {copiedMsgId === student._id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-700 text-[11px]">تم النسخ</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-slate-400" />
                          <span className="text-[11px]">نسخ النص</span>
                        </>
                      )}
                    </Button>

                    {/* Copy Link Button */}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={(e) => handleCopyLink(student, e)}
                      className="rounded-xl h-8 px-2.5 text-slate-700 hover:text-slate-900 border-slate-200 text-xs font-bold flex items-center gap-1"
                      title="نسخ رابط التدريب"
                    >
                      {copiedLinkId === student._id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-700 text-[11px]">تم الرابط</span>
                        </>
                      ) : (
                        <>
                          <LinkIcon className="w-3.5 h-3.5 text-slate-400" />
                          <span className="text-[11px]">نسخ الرابط</span>
                        </>
                      )}
                    </Button>

                    {/* Direct 1-Click WhatsApp Button */}
                    <Button
                      type="button"
                      onClick={(e) => handleOpenWhatsApp(student, e)}
                      className={`rounded-xl h-8 px-3 text-xs font-black flex items-center gap-1.5 shadow-2xs transition active:scale-95 ${
                        isSent
                          ? "bg-emerald-700 hover:bg-emerald-800 text-white"
                          : "bg-emerald-600 hover:bg-emerald-700 text-white"
                      }`}
                    >
                      <MessageCircle className="w-3.5 h-3.5 fill-white/20" />
                      <span>{isSent ? "إعادة إرسال" : "إرسال واتساب"}</span>
                      <ExternalLink className="w-3 h-3 opacity-70" />
                    </Button>

                    {/* Toggle check */}
                    <button
                      type="button"
                      onClick={(e) => toggleSentStatus(student._id, e)}
                      className={`w-7 h-7 rounded-lg flex items-center justify-center border text-xs transition ${
                        isSent
                          ? "border-emerald-300 text-emerald-700 bg-emerald-50"
                          : "border-slate-200 text-slate-300 hover:text-slate-600"
                      }`}
                      title={isSent ? "إلغاء التحديد" : "تحديد كمكتمل"}
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
