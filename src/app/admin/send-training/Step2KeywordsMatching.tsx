"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Sparkles,
  Users,
  X,
  Plus,
  ArrowRight,
  ArrowLeft,
  Loader2,
  Tag,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface Step2Props {
  keywords: string[];
  setKeywords: React.Dispatch<React.SetStateAction<string[]>>;
  title: string;
  msg: string;
  district: string;
  setDistrict: (val: string) => void;
  onPrev: () => void;
  onNext: () => void;
}

const COMMON_PRESETS = [
  "برمجة",
  "تطوير ويب",
  "فرونت إند",
  "تصميم جرافيك",
  "UI/UX",
  "تمريض",
  "إسعافات أولية",
  "لغة إنجليزية",
  "تسويق رقمي",
  "محاسبة",
  "صيانة حاسوب",
];

const DISTRICT_OPTIONS = [
  { label: "كافة المناطق والمدن", value: "All" },
  { label: "مدينة إدلب", value: "إدلب" },
  { label: "سرمدا", value: "سرمدا" },
  { label: "الدانا", value: "الدانا" },
  { label: "معرة مصرين", value: "معرة مصرين" },
  { label: "أريحا", value: "أريحا" },
  { label: "حارم", value: "حارم" },
  { label: "سلقين", value: "سلقين" },
  { label: "جسر الشغور", value: "جسر الشغور" },
  { label: "أطمة والمخيمات", value: "أطمة" },
];

export default function Step2KeywordsMatching({
  keywords,
  setKeywords,
  title,
  msg,
  district,
  setDistrict,
  onPrev,
  onNext,
}: Step2Props) {
  const [inputValue, setInputValue] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isCountLoading, setIsCountLoading] = useState(false);
  const [matchedCount, setMatchedCount] = useState<number | null>(null);

  // Add keywords separated by comma, Arabic comma, or enter
  const addKeywordsFromString = (str: string) => {
    if (!str.trim()) return;
    const parts = str
      .split(/[,،;\n]+/)
      .map((p) => p.trim())
      .filter((p) => p.length > 0);

    setKeywords((prev) => {
      const set = new Set([...prev, ...parts]);
      return Array.from(set);
    });
    setInputValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === "," || e.key === "،") {
      e.preventDefault();
      addKeywordsFromString(inputValue);
    }
  };

  const handleRemoveKeyword = (kwToRemove: string) => {
    setKeywords((prev) => prev.filter((k) => k !== kwToRemove));
  };

  // AI Keyword Suggestion with Gemini - Compact button action
  const handleAiSuggest = async () => {
    try {
      setIsAiLoading(true);
      const res = await axios.post("/api/admin/send-training/suggest-keywords", {
        title,
        summary: title,
        context: msg,
      });

      if (res.data?.data?.keywords && Array.isArray(res.data.data.keywords)) {
        const newKeys = res.data.data.keywords;
        setKeywords((prev) => {
          const combined = new Set([...prev, ...newKeys]);
          return Array.from(combined);
        });
        toast.success(`تم استخراج ${newKeys.length} كلمة وتخصص مقترح بـ AI ✨`);
      }
    } catch (err: any) {
      console.warn("AI keywords error:", err);
      toast.error("تعذر اقتراح الكلمات بالذكاء الاصطناعي");
    } finally {
      setIsAiLoading(false);
    }
  };

  // Live Query for matching students count (no pricing filter)
  useEffect(() => {
    let active = true;
    const timer = setTimeout(() => {
      setIsCountLoading(true);
      const params = new URLSearchParams();
      if (keywords.length > 0) {
        params.set("keywords", keywords.join(","));
      }
      if (district && district !== "All") {
        params.set("district", district);
      }
      params.set("countOnly", "true");

      axios
        .get(`/api/admin/send-training/match?${params.toString()}`)
        .then(({ data }) => {
          if (active && data) {
            setMatchedCount(data.total || 0);
          }
        })
        .catch((err) => {
          console.warn("Count query error:", err);
          if (active) setMatchedCount(0);
        })
        .finally(() => {
          if (active) setIsCountLoading(false);
        });
    }, 250);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [keywords, district]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
      {/* Left Column (7 cols): Input Row with Compact AI Star Button */}
      <div className="lg:col-span-7 space-y-4 bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
        {/* Keywords Input Row with Inlined AI Star Button */}
        <div className="space-y-1.5">
          <Label className="text-xs font-bold text-slate-700 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-[#123D3A]" />
              <span>الكلمات المفتاحية والتخصصات المستهدفة</span>
            </span>
            {keywords.length > 0 && (
              <button
                type="button"
                onClick={() => setKeywords([])}
                className="text-[11px] text-slate-400 hover:text-rose-600 transition"
              >
                مسح الكل
              </button>
            )}
          </Label>

          {/* Unified Single-Row Input: Input + Add + AI Star ✨ */}
          <div className="flex items-center gap-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="اكتب التخصص (مثال: برمجة، تمريض، تصميم...)"
              className="h-10 text-xs font-bold rounded-xl border-slate-200 focus:border-[#123D3A]"
            />
            
            <Button
              type="button"
              onClick={() => addKeywordsFromString(inputValue)}
              disabled={!inputValue.trim()}
              className="h-10 px-3.5 rounded-xl text-xs font-bold bg-[#123D3A] hover:bg-[#0E2F2D] text-white shrink-0"
            >
              <Plus className="w-4 h-4 ml-1" />
              <span>إضافة</span>
            </Button>

            {/* Inlined Compact AI Star Button */}
            <Button
              type="button"
              onClick={handleAiSuggest}
              disabled={isAiLoading || !title.trim()}
              className="h-10 px-3 rounded-xl text-xs font-bold bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-purple-800 hover:to-indigo-800 text-white shrink-0 shadow-2xs"
              title="اقتراح الكلمات المفتاحية بالذكاء الاصطناعي (Gemini)"
            >
              {isAiLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <div className="flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span className="hidden sm:inline">AI ✨</span>
                </div>
              )}
            </Button>
          </div>
        </div>

        {/* Active Tags */}
        <div className="space-y-1.5">
          {keywords.length === 0 ? (
            <div className="p-3.5 rounded-xl border border-dashed border-slate-200 text-center text-xs text-slate-400 font-medium">
              لم تُضف كلمات مفتاحية بعد. سيتم عرض كافة الطلاب المسجلين بالمنصة.
            </div>
          ) : (
            <div className="flex flex-wrap gap-1.5 p-3 rounded-xl bg-slate-50/70 border border-slate-200/70 max-h-36 overflow-y-auto">
              {keywords.map((kw, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-[#123D3A]/10 text-[#123D3A] border border-[#123D3A]/20"
                >
                  <span>{kw}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveKeyword(kw)}
                    className="p-0.5 rounded hover:bg-[#123D3A]/20 text-[#123D3A]/70"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Quick Presets */}
        <div className="space-y-1 pt-1">
          <span className="text-[11px] font-bold text-slate-400 block">
            اقتراحات سريعة شائعة:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {COMMON_PRESETS.map((preset) => {
              const isSelected = keywords.includes(preset);
              return (
                <button
                  key={preset}
                  type="button"
                  onClick={() => {
                    if (!isSelected) {
                      setKeywords((prev) => [...prev, preset]);
                    } else {
                      handleRemoveKeyword(preset);
                    }
                  }}
                  className={`text-[11px] font-bold px-2 py-0.5 rounded-lg border transition ${
                    isSelected
                      ? "bg-[#D58A38] text-white border-[#D58A38]"
                      : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  {isSelected ? `✓ ${preset}` : `+ ${preset}`}
                </button>
              );
            })}
          </div>
        </div>

        {/* Location Filter only (Price filter removed) */}
        <div className="pt-2 border-t border-slate-100">
          <div className="space-y-1 max-w-xs">
            <Label className="text-[11px] font-bold text-slate-600 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-slate-400" />
              <span>تصفية بالمنطقة الجغرافية</span>
            </Label>
            <select
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              className="w-full text-xs font-semibold h-9 px-3 rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-none"
            >
              {DISTRICT_OPTIONS.map((d) => (
                <option key={d.value} value={d.value}>
                  {d.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Navigation */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={onPrev}
            className="rounded-xl px-4 py-2 text-xs font-bold border-slate-200 text-slate-700 h-9"
          >
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
            <span>رجوع للتدريب</span>
          </Button>

          <Button
            type="button"
            onClick={onNext}
            className="rounded-xl px-5 py-2 text-xs font-black bg-[#123D3A] hover:bg-[#0E2F2D] text-white flex items-center gap-2 h-9"
          >
            <span>عرض قائمة الطلاب ({matchedCount ?? 0})</span>
            <ArrowLeft className="w-3.5 h-3.5 mr-1" />
          </Button>
        </div>
      </div>

      {/* Right Column (5 cols): Compact Match Counter */}
      <div className="lg:col-span-5">
        <div className="bg-[#123D3A] text-white rounded-2xl p-5 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-emerald-300">
              مطابقة في قاعدة البيانات
            </span>
            <Users className="w-4 h-4 text-[#D58A38]" />
          </div>

          <div>
            <span className="text-xs text-slate-300 block">الطلاب المهتمين المسجلين:</span>
            <div className="flex items-baseline gap-2 mt-1">
              {isCountLoading ? (
                <div className="flex items-center gap-2 py-1">
                  <Loader2 className="w-5 h-5 animate-spin text-[#D58A38]" />
                  <span className="text-slate-300 text-xs">جاري الحساب...</span>
                </div>
              ) : (
                <>
                  <span className="text-4xl font-black text-white tracking-tight">
                    {matchedCount ?? 0}
                  </span>
                  <span className="text-xs font-bold text-slate-300">طالب مطابق</span>
                </>
              )}
            </div>
          </div>

          <Button
            type="button"
            onClick={onNext}
            disabled={matchedCount === 0 || isCountLoading}
            className="w-full rounded-xl py-2 text-xs font-black bg-[#D58A38] hover:bg-[#be772b] text-white flex items-center justify-center gap-1.5 shadow-2xs mt-2"
          >
            <span>بدء الإرسال للطلاب الآن</span>
            <ArrowLeft className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
