"use client";

import React, { createContext, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import AddDefCourse from "./AddDefCourse";
import AddCourse from "./AddCourse";
import SendMessages from "./SendMessages";
import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";

export const CourseContext = createContext<any>({});

function AiCourseContent() {
  const searchParams = useSearchParams();
  const draftId = searchParams?.get("draftId") || "";

  const [step, setStep] = useState(1);
  const [Course, setCourse] = useState<any>({});

  const nextStep = () => setStep((s) => s + 1);
  const prevStep = () => setStep((s) => Math.max(1, s - 1));

  function View() {
    switch (step) {
      case 1:
        return <AddDefCourse nextStep={nextStep} draftId={draftId} />;
      case 2:
        return <AddCourse nextStep={nextStep} prevStep={prevStep} draftId={draftId} />;
      case 3:
        return <SendMessages prevStep={prevStep} />;
      default:
        return <AddDefCourse nextStep={nextStep} draftId={draftId} />;
    }
  }

  return (
    <CourseContext.Provider value={{ Course, setCourse, draftId }}>
      <Header
        title={draftId ? "اعتماد وتوليد الدورة من مسودة (AI)" : "توليد وإضافة دورة بالذكاء الاصطناعي"}
        to="/admin/def-courses"
      />
      <View />
    </CourseContext.Provider>
  );
}

export default function AiCourse() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-slate-500 font-bold text-xs">
          جاري تحميل واجهة الذكاء الاصطناعي...
        </div>
      }
    >
      <AiCourseContent />
    </Suspense>
  );
}

const Header = ({ to = "/admin/def-courses", title }: { to?: string; title: string }) => {
  return (
    <div className="flex items-center justify-between bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs mb-6">
      <div className="flex items-center gap-3">
        <Link
          href={to}
          className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition"
          aria-label="Back"
        >
          <ArrowRight className="w-4 h-4" />
        </Link>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
              {title}
            </h1>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-black bg-purple-50 text-purple-700 border border-purple-200/60">
              <Sparkles className="w-3 h-3 text-amber-500" />
              Gemini 2.5 Flash
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            استخراج تلقائي لهيكل الدورة ومراجعتها ثم نشرها مباشرة في المنصة
          </p>
        </div>
      </div>

      <Link
        href="/admin/courses"
        className="text-xs font-bold text-[#123D3A] hover:underline hidden sm:inline"
      >
        عرض كافة الدورات
      </Link>
    </div>
  );
};