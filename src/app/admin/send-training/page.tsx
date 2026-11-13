"use client";

import React, { useState, useEffect, Suspense, useCallback } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import axios from "axios";
import Link from "next/link";
import {
  Send,
  Sparkles,
  BookOpen,
  MessageSquare,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import Step1TrainingMessage from "./Step1TrainingMessage";
import Step2KeywordsMatching from "./Step2KeywordsMatching";
import Step3WhatsAppDispatch from "./Step3WhatsAppDispatch";
import { DEFAULT_WHATSAPP_TEMPLATE } from "./utils";

function SendTrainingContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Read initial values from URL searchParams
  const stepParam = parseInt(searchParams?.get("step") || "1", 10);
  const titleParam = searchParams?.get("title") || "";
  const linkParam = searchParams?.get("link") || "";
  const msgParam = searchParams?.get("msg") || "";
  const keywordsParam = searchParams?.get("keywords") || "";
  const courseIdParam = searchParams?.get("courseId") || "";
  const districtParam = searchParams?.get("district") || "All";

  const isLegacyMsg = (m?: string) => {
    if (!m) return true;
    if (m.includes("حابين نخبرك إنه فتح التسجيل")) return false;
    return (
      m.includes("وعم تبحث") ||
      m.includes("\uFFFD") ||
      m.includes("ًں") ||
      m.includes("(منصة فرص التدريب") ||
      m.includes("(فرص التدريب") ||
      m.includes("لأنك مسجل معنا وتبحث عن فرصة تطوّر فيها مهاراتك")
    );
  };

  const initialMsg = msgParam && !isLegacyMsg(msgParam) ? msgParam : DEFAULT_WHATSAPP_TEMPLATE;

  const [step, setStep] = useState<number>(stepParam >= 1 && stepParam <= 3 ? stepParam : 1);
  const [title, setTitle] = useState<string>(titleParam);
  const [link, setLink] = useState<string>(linkParam);
  const [msg, setMsg] = useState<string>(initialMsg);
  const [courseId, setCourseId] = useState<string>(courseIdParam);
  const [district, setDistrict] = useState<string>(districtParam);
  const [keywords, setKeywords] = useState<string[]>(
    keywordsParam
      ? keywordsParam
          .split(/[,،]+/)
          .map((k) => k.trim())
          .filter(Boolean)
      : []
  );

  // Sync state to URL search parameters
  const updateUrlParams = useCallback(
    (newStep: number, customOverrides?: Record<string, string>) => {
      const params = new URLSearchParams();
      params.set("step", newStep.toString());
      if (title.trim()) params.set("title", title.trim());
      if (link.trim()) params.set("link", link.trim());
      if (msg.trim() && msg !== DEFAULT_WHATSAPP_TEMPLATE) params.set("msg", msg.trim());
      if (keywords.length > 0) params.set("keywords", keywords.join(","));
      if (courseId) params.set("courseId", courseId);
      if (district && district !== "All") params.set("district", district);

      if (customOverrides) {
        Object.entries(customOverrides).forEach(([k, v]) => {
          if (v) params.set(k, v);
          else params.delete(k);
        });
      }

      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [router, pathname, title, link, msg, keywords, courseId, district]
  );

  // Fetch course details if courseId is passed in URL on mount
  useEffect(() => {
    if (courseIdParam && !titleParam) {
      axios
        .get(`/api/admin/courses/${courseIdParam}`)
        .then(({ data }) => {
          const course = data?.data || data;
          if (course) {
            if (course.title && !title) setTitle(course.title);
            if (!link) {
              const origin =
                typeof window !== "undefined" && window.location.origin
                  ? window.location.origin
                  : "https://talaqi.vercel.app";
              setLink(`${origin}/courses/${course._id}`);
            }
            if (course.keys && Array.isArray(course.keys) && keywords.length === 0) {
              setKeywords(course.keys);
            }
          }
        })
        .catch((err) => console.warn("Failed to fetch initial course:", err));
    }
  }, [courseIdParam, titleParam]);

  const goToStep = (newStep: number) => {
    setStep(newStep);
    updateUrlParams(newStep);
  };

  const steps = [
    { num: 1, title: "1. التدريب والرسالة", icon: BookOpen },
    { num: 2, title: "2. الكلمات المفتاحية والـ AI", icon: Sparkles },
    { num: 3, title: "3. إرسال واتساب للطلاب", icon: Send },
  ];

  return (
    <div className="space-y-4">
      {/* Duolingo-style Sleek Single-Line Header + Stepper */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-3 sm:px-5 sm:py-3.5 shadow-2xs flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        {/* Title */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
            <Send className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-sm sm:text-base font-black text-slate-900 tracking-tight">
              إرسال التدريب للطلاب
            </h1>
          </div>
        </div>

        {/* Compact Stepper in same row */}
        <div className="flex items-center gap-1.5 bg-slate-100/90 p-1 rounded-xl self-stretch md:self-auto overflow-x-auto">
          {steps.map((s) => {
            const isActive = step === s.num;
            const isCompleted = step > s.num;
            const canNavigate = s.num === 1 || (s.num === 2 && title.trim()) || isCompleted;

            return (
              <button
                key={s.num}
                type="button"
                onClick={() => canNavigate && goToStep(s.num)}
                disabled={!canNavigate}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
                  isActive
                    ? "bg-[#123D3A] text-white shadow-2xs"
                    : isCompleted
                    ? "bg-emerald-100 text-emerald-900 hover:bg-emerald-200"
                    : "text-slate-400 cursor-not-allowed"
                }`}
              >
                {isCompleted ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" /> : null}
                <span>{s.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Step View Content */}
      <div>
        {step === 1 && (
          <Step1TrainingMessage
            title={title}
            setTitle={setTitle}
            link={link}
            setLink={setLink}
            msg={msg}
            setMsg={setMsg}
            courseId={courseId}
            setCourseId={setCourseId}
            onNext={() => goToStep(2)}
            onKeywordsLoaded={(keys) => {
              if (keywords.length === 0) setKeywords(keys);
            }}
          />
        )}

        {step === 2 && (
          <Step2KeywordsMatching
            keywords={keywords}
            setKeywords={setKeywords}
            title={title}
            msg={msg}
            district={district}
            setDistrict={setDistrict}
            onPrev={() => goToStep(1)}
            onNext={() => goToStep(3)}
          />
        )}

        {step === 3 && (
          <Step3WhatsAppDispatch
            keywords={keywords}
            title={title}
            link={link}
            msg={msg}
            district={district}
            onBackToStep2={() => goToStep(2)}
            onBackToStep1={() => goToStep(1)}
          />
        )}
      </div>
    </div>
  );
}

export default function AdminSendTrainingPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-slate-500 font-bold text-xs">
          جاري تحميل واجهة إرسال التدريب...
        </div>
      }
    >
      <SendTrainingContent />
    </Suspense>
  );
}
