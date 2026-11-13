"use client";

import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import {
  BookOpen,
  Link as LinkIcon,
  MessageSquare,
  Sparkles,
  ArrowLeft,
  CheckCircle2,
  RefreshCw,
  Eye,
  Loader2,
  Search,
  X,
  Building2,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { DEFAULT_WHATSAPP_TEMPLATE, generatePersonalizedMessage } from "./utils";

interface Step1Props {
  title: string;
  setTitle: (val: string) => void;
  link: string;
  setLink: (val: string) => void;
  msg: string;
  setMsg: (val: string) => void;
  courseId: string;
  setCourseId: (val: string) => void;
  onNext: () => void;
  onKeywordsLoaded?: (keys: string[]) => void;
}

export default function Step1TrainingMessage({
  title,
  setTitle,
  link,
  setLink,
  msg,
  setMsg,
  courseId,
  setCourseId,
  onNext,
  onKeywordsLoaded,
}: Step1Props) {
  const [courses, setCourses] = useState<any[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(false);
  const [isFormattingMsg, setIsFormattingMsg] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Selected course object
  const selectedCourse = courses.find((c) => c._id === courseId) || null;

  // Fetch latest 10 courses, or search when query changes
  useEffect(() => {
    let isMounted = true;
    setLoadingCourses(true);

    const timer = setTimeout(() => {
      const params = new URLSearchParams();
      params.set("limit", "10");
      params.set("sort_field", "createdAt");
      params.set("sort_order", "desc");
      if (searchQuery.trim()) {
        params.set("search", searchQuery.trim());
      }

      axios
        .get(`/api/admin/courses?${params.toString()}`)
        .then(({ data }) => {
          if (isMounted && data?.data) {
            setCourses(data.data);
          }
        })
        .catch((err) => console.warn("Failed to load courses:", err))
        .finally(() => {
          if (isMounted) setLoadingCourses(false);
        });
    }, searchQuery.trim() ? 250 : 0);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [searchQuery]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // When a course is picked from dropdown
  const handleSelectCourse = (course: any) => {
    if (!course) {
      setCourseId("");
      return;
    }
    setCourseId(course._id);
    setTitle(course.title || "");
    const origin =
      typeof window !== "undefined" && window.location.origin
        ? window.location.origin
        : "https://talaqi.vercel.app";
    const courseUrl = `${origin}/courses/${course._id}`;
    setLink(courseUrl);

    if (course.keys && Array.isArray(course.keys) && course.keys.length > 0 && onKeywordsLoaded) {
      onKeywordsLoaded(course.keys);
    }
    setIsDropdownOpen(false);
  };

  const handleClearSelectedCourse = () => {
    setCourseId("");
  };

  // AI Instant WhatsApp formatting with Gemini
  const handleAiFormatMessage = async () => {
    if (!title.trim()) {
      toast.error("يرجى كتابة عنوان التدريب أولاً لصياغة الرسالة");
      return;
    }
    try {
      setIsFormattingMsg(true);
      const res = await axios.post("/api/admin/send-training/suggest-keywords", {
        title: title.trim(),
        summary: title.trim(),
        context: msg,
      });

      if (res.data?.data?.suggestedMessage) {
        setMsg(res.data.data.suggestedMessage);
        toast.success("تمت صياغة نص الرسالة بنجاح ✨");
      }
    } catch (err) {
      console.warn("AI format failed, using default template:", err);
      toast.info("تم استخدام النص النموذجي للرسالة");
    } finally {
      setIsFormattingMsg(false);
    }
  };

  const insertVariable = (variable: string) => {
    setMsg(msg ? `${msg} ${variable}` : variable);
  };

  const handleResetTemplate = () => {
    setMsg(DEFAULT_WHATSAPP_TEMPLATE);
  };

  const sampleStudentName = "أحمد المحمد";
  const previewMessage = generatePersonalizedMessage({
    template: msg || DEFAULT_WHATSAPP_TEMPLATE,
    studentName: sampleStudentName,
    courseTitle: title || "دورة تطوير تطبيقات الويب",
    courseLink: link || "https://talaqi.vercel.app/courses/demo",
    studentInterest: "برمجة المواقع وتطبيقات الويب",
  });

  const canProceed = Boolean(title.trim() && link.trim() && msg.trim());

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
      {/* Main Form (7 cols) */}
      <div className="lg:col-span-7 space-y-4 bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
        {/* 1. Pick from Existing Courses (Max 10 with Search & Latest First) */}
        <div className="space-y-1.5" ref={dropdownRef}>
          <Label className="text-xs font-bold text-slate-700 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-[#123D3A]" />
              <span>اختيار التدريب (أحدث التدريبات المضافة)</span>
            </span>
            {loadingCourses && (
              <span className="text-[11px] text-slate-400 font-normal">جاري البحث...</span>
            )}
          </Label>

          {/* If course already selected, show clean summary card */}
          {courseId && (selectedCourse || title) ? (
            <div className="p-3 bg-emerald-50/60 border border-emerald-200 rounded-xl flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-slate-900 truncate">
                    {selectedCourse?.title || title}
                  </h4>
                  <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                    {selectedCourse?.providingEntity?.name && (
                      <span className="flex items-center gap-0.5">
                        <Building2 className="w-3 h-3 text-[#D58A38]" />
                        <span>{selectedCourse.providingEntity.name}</span>
                      </span>
                    )}
                    {(selectedCourse?.locationDetails?.city || selectedCourse?.location) && (
                      <span className="flex items-center gap-0.5">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        <span>{selectedCourse?.locationDetails?.city || selectedCourse?.location}</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsDropdownOpen(true)}
                  className="px-2.5 py-1 text-[11px] font-bold text-slate-700 hover:text-slate-900 bg-white border border-slate-200 rounded-lg transition"
                >
                  تغيير التدريب
                </button>
                <button
                  type="button"
                  onClick={handleClearSelectedCourse}
                  className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                  title="إلغاء التحديد"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : (
            /* Searchable Dropdown Trigger & List */
            <div className="relative">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <Input
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setIsDropdownOpen(true);
                  }}
                  onFocus={() => setIsDropdownOpen(true)}
                  placeholder="ابحث عن تدريب بالاسم أو الجهة (يعرض أحدث 10 تدريبات تلقائياً)..."
                  className="h-10 pr-9 pl-3 text-xs rounded-xl border-slate-200 focus:border-[#123D3A]"
                />
              </div>

              {/* Dropdown Options (Max 10) */}
              {isDropdownOpen && (
                <div className="absolute z-20 top-full mt-1.5 inset-x-0 bg-white border border-slate-200 rounded-xl shadow-lg max-h-64 overflow-y-auto divide-y divide-slate-100">
                  {loadingCourses ? (
                    <div className="p-4 text-center text-xs text-slate-400 font-bold flex items-center justify-center gap-2">
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-[#123D3A]" />
                      <span>جاري جلب التدريبات...</span>
                    </div>
                  ) : courses.length === 0 ? (
                    <div className="p-4 text-center text-xs text-slate-500">
                      لم يتم العثور على تدريبات مطابقة للبحث.
                    </div>
                  ) : (
                    courses.slice(0, 10).map((c) => (
                      <button
                        key={c._id}
                        type="button"
                        onClick={() => handleSelectCourse(c)}
                        className="w-full text-right p-3 hover:bg-slate-50 transition flex items-center justify-between gap-2"
                      >
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-slate-900 truncate">{c.title}</p>
                          <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                            {c.providingEntity?.name && (
                              <span>{c.providingEntity.name}</span>
                            )}
                            {(c.locationDetails?.city || c.location) && (
                              <span>• {c.locationDetails?.city || c.location}</span>
                            )}
                          </div>
                        </div>
                        <span className="text-[10px] font-bold text-[#123D3A] bg-[#123D3A]/10 px-2 py-0.5 rounded shrink-0">
                          اختيار
                        </span>
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* 2. Title & Link */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-slate-700">عنوان التدريب</Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="مثال: منحة تطوير الويب React"
              className="h-9 text-xs font-bold rounded-xl border-slate-200 focus:border-[#123D3A]"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-slate-700 flex items-center gap-1">
              <LinkIcon className="w-3.5 h-3.5 text-[#123D3A]" />
              <span>رابط التدريب أو التسجيل</span>
            </Label>
            <Input
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder="https://talaqi.vercel.app/courses/..."
              className="h-9 text-xs font-mono font-medium rounded-xl border-slate-200 focus:border-[#123D3A]"
              dir="ltr"
            />
          </div>
        </div>

        {/* 3. WhatsApp Message Box */}
        <div className="space-y-2 pt-1">
          <div className="flex items-center justify-between">
            <Label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
              <span>نص رسالة الواتساب المجهزة</span>
            </Label>

            {/* AI auto-format button in same row */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleAiFormatMessage}
                disabled={isFormattingMsg || !title.trim()}
                className="text-[11px] font-bold text-purple-700 hover:text-purple-900 bg-purple-50 px-2.5 py-1 rounded-lg border border-purple-200/70 flex items-center gap-1 transition"
              >
                {isFormattingMsg ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  <Sparkles className="w-3 h-3 text-amber-500 fill-amber-400" />
                )}
                <span>صياغة بالـ AI ✨</span>
              </button>

              <button
                type="button"
                onClick={handleResetTemplate}
                className="text-[11px] text-slate-400 hover:text-slate-700 transition"
                title="استعادة النص الافتراضي"
              >
                <RefreshCw className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Variables quick chips */}
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={() => insertVariable("{{name}}")}
              className="px-2 py-0.5 rounded-lg bg-emerald-50 text-emerald-800 text-[11px] font-bold border border-emerald-200 hover:bg-emerald-100"
            >
              + اسم الطالب {"{{name}}"}
            </button>
            <button
              type="button"
              onClick={() => insertVariable("{{title}}")}
              className="px-2 py-0.5 rounded-lg bg-indigo-50 text-indigo-800 text-[11px] font-bold border border-indigo-200 hover:bg-indigo-100"
            >
              + عنوان التدريب {"{{title}}"}
            </button>
            <button
              type="button"
              onClick={() => insertVariable("{{link}}")}
              className="px-2 py-0.5 rounded-lg bg-blue-50 text-blue-800 text-[11px] font-bold border border-blue-200 hover:bg-blue-100"
            >
              + رابط التدريب {"{{link}}"}
            </button>
          </div>

          <textarea
            rows={10}
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            className="w-full text-xs font-semibold p-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#123D3A]/20 transition leading-relaxed resize-y"
          />
        </div>

        {/* Action Button */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-end">
          <Button
            type="button"
            disabled={!canProceed}
            onClick={onNext}
            className="rounded-xl px-5 py-2 text-xs font-black bg-[#123D3A] hover:bg-[#0E2F2D] text-white flex items-center gap-2 shadow-xs transition"
          >
            <span>المتابعة لتحديد الكلمات المستهدفة</span>
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Right Column: Live Chat Preview (5 cols) */}
      <div className="lg:col-span-5 space-y-2">
        <span className="text-xs font-black text-slate-700 flex items-center gap-1.5 px-1">
          <Eye className="w-3.5 h-3.5 text-emerald-600" />
          معاينة محادثة واتساب
        </span>

        <div className="bg-[#EFEAE2] rounded-2xl border border-slate-300 shadow-2xs overflow-hidden text-right">
          <div className="bg-[#075E54] text-white px-3.5 py-2.5 flex items-center gap-2 shadow-xs">
            <div className="w-7 h-7 rounded-full bg-white/20 text-white flex items-center justify-center font-bold text-xs shrink-0">
              {sampleStudentName.charAt(0)}
            </div>
            <div>
              <h4 className="text-xs font-bold leading-none">{sampleStudentName}</h4>
              <span className="text-[10px] text-emerald-100/70 block mt-0.5">متصل الآن</span>
            </div>
          </div>

          <div className="p-3.5 min-h-[300px] flex flex-col justify-end">
            <div className="bg-[#E7FFDB] p-3 rounded-2xl rounded-tr-none shadow-2xs border border-emerald-100/60 text-slate-900 space-y-1.5">
              <div className="text-xs leading-relaxed whitespace-pre-wrap font-medium">
                {previewMessage}
              </div>
              <div className="flex items-center justify-end gap-1 text-[10px] text-slate-400 font-mono">
                <span>10:30 ص</span>
                <CheckCircle2 className="w-3 h-3 text-sky-500" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}