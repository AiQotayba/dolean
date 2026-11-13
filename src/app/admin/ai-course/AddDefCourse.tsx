"use client";

import React, { useContext, useEffect, useState, useRef } from "react";
import { FormProvider, useForm } from "react-hook-form";
import axios from "axios";
import JsCookie from "js-cookie";
import { uploadImageToBlob } from "@/lib/blob";
import { CourseContext } from "./page";
import {
  ImagePlus,
  Loader2,
  Clipboard,
  X,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface AddDefCourseProps {
  nextStep: () => void;
  draftId?: string;
}

export default function AddDefCourse({ nextStep, draftId }: AddDefCourseProps) {
  const methods = useForm();
  const { handleSubmit, reset, watch, setValue } = methods;
  const [message, setMessage] = useState<{ message: string; type: "error" | "success" } | null>(null);
  const [res, setRes] = useState<any>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [loadingDraft, setLoadingDraft] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { setCourse } = useContext(CourseContext);
  const token = JsCookie.get("authorization");
  const headers = { Authorization: `Bearer ${token}` };

  // Watch fields
  const contextVal = watch("context");
  const titleVal = watch("title");
  const sourceVal = watch("res");

  // Load draft if draftId is present in URL
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
            setFilePreview(draft.image);
          }
        })
        .catch((err) => {
          console.warn("Error loading draft:", err);
          setMessage({ message: "تعذر تحميل بيانات المسودة من الخادم", type: "error" });
        })
        .finally(() => setLoadingDraft(false));
    }
  }, [draftId, reset]);

  // Construct course object from parsed AI response
  const applyParsedCourse = (parsed: any, fallbackImage?: string) => {
    const resolvedImage = fallbackImage || (typeof res?.image === "string" ? res.image : "");
    const mappedCourse = {
      title: parsed.title || titleVal || "",
      context: parsed.context || contextVal || "",
      summary: parsed.summary || "",
      location: parsed.city || (parsed.locationType === "online" ? "عن بعد (أونلاين)" : "إدلب"),
      center: parsed.providingEntityName || sourceVal || "",
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
      image: resolvedImage,
      status: "published",
    };

    setCourse(mappedCourse);
    nextStep();
  };

  // Main unified extraction handler
  const handleExtract = async () => {
    const rawText = (contextVal || titleVal || "").trim();

    // Ensure user provided either an image or text
    if (!selectedFile && !filePreview && rawText.length < 5) {
      setMessage({
        message: "يرجى إضافة صورة البوستر أو كتابة نص الإعلان للبدء",
        type: "error",
      });
      return;
    }

    try {
      setIsProcessing(true);
      setMessage(null);

      // Case 1: Image file selected (with optional text)
      if (selectedFile) {
        const formData = new FormData();
        formData.append("file", selectedFile);
        if (rawText) {
          formData.append("notes", `${titleVal ? "العنوان: " + titleVal + "\n" : ""}${contextVal || ""}`);
        }

        // Upload to Vercel Blob in background
        let uploadedUrl = typeof res?.image === "string" ? res.image : "";
        const uploadPromise = !uploadedUrl
          ? uploadImageToBlob(selectedFile)
              .then((url) => {
                if (url && typeof url === "string") {
                  uploadedUrl = url;
                  setRes((prev: any) => ({ ...prev, image: url }));
                }
              })
              .catch((e) => console.warn("Vercel Blob upload failed:", e))
          : Promise.resolve();

        const [response] = await Promise.all([
          axios.post("/api/ai/parse-image", formData, {
            headers: { "Content-Type": "multipart/form-data" },
          }),
          uploadPromise,
        ]);

        if (response.data?.success && response.data?.data) {
          applyParsedCourse(response.data.data, uploadedUrl);
        } else {
          throw new Error(response.data?.error || "فشل استخراج البيانات من صورة البوستر");
        }
      } else {
        // Case 2: Text only (or remote draft image already loaded)
        const response = await axios.post("/api/ai/parse-text", { rawText });
        if (response.data?.success && response.data?.data) {
          applyParsedCourse(response.data.data, filePreview || "");
        } else {
          throw new Error(response.data?.error || "فشل استخراج البيانات من نص الإعلان");
        }
      }
    } catch (err: any) {
      console.warn("Extraction Error:", err);
      setMessage({
        message: err.response?.data?.error || err.message || "حدث خطأ أثناء استخراج البيانات، يرجى المحاولة ثانية",
        type: "error",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSelectFile = async (file: File) => {
    setSelectedFile(file);
    setFilePreview(URL.createObjectURL(file));

    // Upload to Vercel Blob in background
    try {
      const url = await uploadImageToBlob(file);
      if (url && typeof url === "string") {
        setRes((prev: any) => ({ ...prev, image: url }));
      }
    } catch (err) {
      console.warn("Vercel Blob upload error:", err);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleSelectFile(files[0]);
    }
  };

  const handleRemoveImage = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSelectedFile(null);
    setFilePreview(null);
    setRes((prev: any) => ({ ...prev, image: "" }));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const pasteFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setValue("context", text);
    } catch {
      setMessage({ message: "تعذر الوصول إلى الحافظة تلقائياً", type: "error" });
    }
  };

  return (
    <FormProvider {...methods}>
      <div className="w-full max-w-2xl mx-auto p-5 sm:p-7 bg-white rounded-3xl border border-slate-200/90 shadow-2xs text-right space-y-5">
        {loadingDraft && (
          <div className="flex items-center justify-center gap-2 p-4 text-slate-500 font-bold text-xs">
            <Loader2 className="w-4 h-4 animate-spin text-[#123D3A]" />
            <span>جاري تحميل بيانات المسودة...</span>
          </div>
        )}

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />

        {/* 1. Poster Area on Top */}
        <div className="space-y-1.5">
          {!filePreview ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              onDrop={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                  handleSelectFile(e.dataTransfer.files[0]);
                }
              }}
              className="w-full h-44 sm:h-52 border-2 border-dashed border-slate-200 hover:border-[#123D3A]/40 bg-slate-50/70 hover:bg-slate-50 rounded-2xl transition cursor-pointer flex flex-col items-center justify-center text-center p-4 group"
            >
              <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-[#123D3A] group-hover:scale-105 transition shadow-2xs">
                <ImagePlus className="w-6 h-6" />
              </div>
              <span className="text-xs sm:text-sm font-bold text-slate-800 mt-2.5">
                إضافة بوستر التدريب
              </span>
              <span className="text-[11px] text-slate-400 mt-0.5">
                انقر لاختيار الصورة أو اسحبها إلى هنا
              </span>
            </div>
          ) : (
            <div className="relative w-full rounded-2xl overflow-hidden border border-slate-200 bg-slate-950/5 flex items-center justify-center max-h-[340px]">
              <img
                src={filePreview}
                alt="بوستر التدريب"
                className="w-full max-h-[340px] object-contain rounded-2xl"
              />
              <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/75 via-black/35 to-transparent flex items-center justify-between">
                <span className="text-[11px] font-bold text-white/95 bg-black/40 backdrop-blur px-2.5 py-1 rounded-lg truncate max-w-[200px]">
                  {selectedFile ? selectedFile.name : "بوستر التدريب"}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-2.5 py-1 rounded-lg text-xs font-bold bg-white text-slate-800 hover:bg-slate-100 transition shadow-xs"
                  >
                    تغيير الصورة
                  </button>
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="p-1.5 rounded-lg text-white/80 hover:text-white bg-black/40 hover:bg-rose-600 transition"
                    title="إزالة الصورة"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 2. Optional Title & Source under Poster */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 block">
              عنوان التدريب (اختياري)
            </label>
            <Input
              {...methods.register("title")}
              placeholder="اكتب عنوان التدريب إن وجد..."
              className="h-10 text-xs rounded-xl border-slate-200 focus:border-[#123D3A]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 block">
              مصدر الإعلان أو القناة (اختياري)
            </label>
            <Input
              {...methods.register("res")}
              placeholder="مثال: تيليغرام، فيسبوك..."
              className="h-10 text-xs rounded-xl border-slate-200 focus:border-[#123D3A]"
            />
          </div>
        </div>

        {/* 3. Full Text under them */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-700">
              النص الكامل للتدريب
            </label>
            <button
              type="button"
              onClick={pasteFromClipboard}
              className="text-[11px] font-bold text-[#123D3A] hover:underline flex items-center gap-1"
            >
              <Clipboard className="w-3 h-3" />
              <span>لصق من الحافظة</span>
            </button>
          </div>
          <textarea
            {...methods.register("context")}
            rows={5}
            placeholder="ألصق هنا النص الكامل للإعلان أو المنشور..."
            className="w-full text-xs rounded-xl border border-slate-200 p-3 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#123D3A] focus:ring-1 focus:ring-[#123D3A] transition resize-y leading-relaxed"
          />
        </div>

        {/* Message Banner if needed */}
        {message && (
          <div
            className={`p-3 rounded-xl text-xs font-bold ${
              message.type === "error"
                ? "bg-rose-50 text-rose-700 border border-rose-200"
                : "bg-emerald-50 text-emerald-700 border border-emerald-200"
            }`}
          >
            {message.message}
          </div>
        )}

        {/* 4. Single Extraction CTA Button */}
        <div className="pt-1">
          <Button
            type="button"
            disabled={isProcessing}
            onClick={handleExtract}
            className="w-full h-12 rounded-2xl bg-[#123D3A] hover:bg-[#0E2F2D] text-white font-black text-xs sm:text-sm shadow-sm transition active:scale-[0.99] flex items-center justify-center gap-2"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>جاري استخراج بيانات التدريب...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>استخراج بيانات التدريب من الإعلان</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </FormProvider>
  );
}