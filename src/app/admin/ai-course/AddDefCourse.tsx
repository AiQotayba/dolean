"use client";

import React, { useContext, useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import FormField from "@/components/Element/FormField";
import axios from "axios";
import JsCookie from "js-cookie";
import { Storage } from "@/components/firebase";
import { CourseContext } from "./page";
import { Sparkles, Loader2, Bot, ArrowLeft, Clipboard, Link2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AddDefCourseProps {
  nextStep: () => void;
  draftId?: string;
}

export default function AddDefCourse({ nextStep, draftId }: AddDefCourseProps) {
  const methods = useForm();
  const { handleSubmit, reset, watch, setValue } = methods;
  const [message, setMessage] = useState<{ message: string; type: string } | null>(null);
  const [res, setRes] = useState<any>({});
  const [isAiProcessing, setIsAiProcessing] = useState(false);
  const [loadingDraft, setLoadingDraft] = useState(false);

  const { setCourse } = useContext(CourseContext);
  const token = JsCookie.get("authorization");
  const headers = { Authorization: `Bearer ${token}` };

  // Watch fields
  const contextVal = watch("context");
  const titleVal = watch("title");

  // Load draft if draftId is present
  useEffect(() => {
    if (draftId) {
      setLoadingDraft(true);
      axios
        .get(`/api/admin/def-courses/${draftId}`)
        .then(({ data }) => {
          const draft = data.data || data;
          reset({
            title: draft.title || "",
            context: draft.context || draft.rawText || "",
            res: draft.Source || draft.organizationName || "",
          });
          if (draft.image) {
            setRes((prev: any) => ({ ...prev, image: draft.image }));
          }
          setMessage({
            message: "تم تحميل بيانات المسودة بنجاح. انقر على «توليد الحقول بالـ AI» لاستخراج بيانات الدورة تلقائياً.",
            type: "success",
          });
        })
        .catch((err) => {
          console.error("Error loading draft:", err);
          setMessage({ message: "فشل في تحميل بيانات المسودة من الخادم", type: "error" });
        })
        .finally(() => setLoadingDraft(false));
    }
  }, [draftId, reset]);

  // AI Extraction Function
  const handleAiExtract = async () => {
    const rawText = contextVal || titleVal;
    if (!rawText || rawText.trim().length < 10) {
      setMessage({ message: "يرجى كتابة أو لصق نص الإعلان للتحليل بالذكاء الاصطناعي (10 أحرف على الأقل)", type: "error" });
      return;
    }

    try {
      setIsAiProcessing(true);
      setMessage(null);

      const response = await axios.post("/api/ai/parse-text", { rawText });
      if (response.data?.success && response.data?.data) {
        const parsed = response.data.data;
        const mappedCourse = {
          title: parsed.title || titleVal || "",
          context: parsed.context || contextVal || "",
          summary: parsed.summary || "",
          location: parsed.city || (parsed.locationType === "online" ? "عن بعد (أونلاين)" : "إدلب"),
          center: parsed.providingEntityName || "",
          price: parsed.isFree ? 0 : (parsed.cost || 0),
          pricing: {
            isFree: parsed.isFree,
            cost: parsed.cost || 0,
            currency: parsed.currency || "USD",
            stipendProvided: parsed.stipendProvided || false,
            stipendNote: parsed.stipendNote || "",
          },
          age: parsed.ageEligibility || { start: 16, end: 40 },
          nationality: parsed.nationalities?.[0] || "Syrian",
          keys: Array.isArray(parsed.keys) ? parsed.keys.join(", ") : "",
          links: Array.isArray(parsed.links) ? parsed.links.join(", ") : "",
          locationType: parsed.locationType || "in_person",
          image: res?.image || "",
          status: "published",
        };

        setCourse(mappedCourse);
        nextStep();
      } else {
        throw new Error(response.data?.error || "فشل تحليل النص بالذكاء الاصطناعي");
      }
    } catch (err: any) {
      console.error("AI Parse Error:", err);
      setMessage({
        message: err.response?.data?.error || err.message || "حدث خطأ أثناء معالجة النص بالذكاء الاصطناعي",
        type: "error",
      });
    } finally {
      setIsAiProcessing(false);
    }
  };

  const onSubmit = async (init: any) => {
    // If not using AI directly, do AI extraction first
    await handleAiExtract();
  };

  async function uploadImage(e: any) {
    try {
      const image: any = await Storage.add(e.target.files);
      setRes({ ...res, image: image[0] });
      setMessage({ message: "تم رفع صورة الإعلان بنجاح", type: "success" });
    } catch (err) {
      console.error("Upload error:", err);
    }
  }

  const pasteFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setValue("context", text);
      setMessage({ message: "تم لصق النص من الحافظة", type: "success" });
    } catch {
      setMessage({ message: "فشل في قراءة محتويات الحافظة", type: "error" });
    }
  };

  return (
    <FormProvider {...methods}>
      <div className="w-full max-w-2xl mx-auto p-4 sm:p-6 bg-white rounded-3xl border border-slate-200/90 shadow-2xs text-right">
        {loadingDraft && (
          <div className="flex items-center justify-center gap-2 p-6 text-slate-500 font-bold text-xs">
            <Loader2 className="w-4 h-4 animate-spin text-purple-600" />
            <span>جاري تحميل بيانات المسودة...</span>
          </div>
        )}

        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
          <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900">
                {draftId ? "الخطوة 1: معالجة واستخراج بيانات المسودة" : "الخطوة 1: إدخال نص الإعلان التدريبي"}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                ألصق نص الإعلان أو المنشور الخام وسيقوم نموذج Gemini 2.5 Flash باستخراج كافة الحقول تلقائياً
              </p>
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={pasteFromClipboard}
              className="gap-1.5 rounded-xl text-xs font-bold border-slate-300"
            >
              <Clipboard className="w-3.5 h-3.5" />
              <span>لصق من الحافظة</span>
            </Button>
          </div>

          <FormField
            label="عنوان المسودة أو الدورة (اختياري/أولي)"
            name="title"
            type="text"
            placeholder="مثال: دبلوم البرمجة والذكاء الاصطناعي - إدلب"
          />

          <FormField
            label="كامل نص الإعلان التدريبي (المنشور الخام)"
            name="context"
            as="textarea"
            rows="6"
            placeholder="ألصق هنا النص الكامل للمنشور من قنوات تلغرام أو فيسبوك..."
            validation={{ required: "نص الإعلان التدريبي مطلوب للتحليل" }}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              label="المصدر أو القناة الناشرة"
              name="res"
              placeholder="مثال: تيليغرام - قناة فرص إدلب"
            />

            <FormField
              label="بوستر أو صورة الإعلان (اختياري)"
              name="image"
              type="file"
              onChange={uploadImage}
            />
          </div>

          {res?.image && (
            <div className="p-2 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span className="text-xs font-bold text-slate-700">تم إرفاق صورة الإعلان بنجاح</span>
            </div>
          )}

          {message && (
            <div
              className={`p-3.5 rounded-xl text-xs font-bold ${
                message.type === "error"
                  ? "bg-rose-50 text-rose-700 border border-rose-200"
                  : "bg-emerald-50 text-emerald-700 border border-emerald-200"
              }`}
            >
              {message.message}
            </div>
          )}

          {/* AI Generation Button */}
          <div className="pt-2">
            <Button
              type="button"
              disabled={isAiProcessing}
              onClick={handleAiExtract}
              className="w-full h-12 rounded-2xl bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-purple-800 hover:to-indigo-800 text-white font-black text-sm shadow-md gap-2 active:scale-95 transition"
            >
              {isAiProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin text-amber-300" />
                  <span>جاري التحليل واستخراج الحقول بالذكاء الاصطناعي...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 text-amber-300" />
                  <span>توليد واستخراج الحقول بالذكاء الاصطناعي ✨</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </FormProvider>
  );
}