"use client";

import React, { useContext, useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import axios from "axios";
import JsCookie from "js-cookie";
import { useRouter } from "next/navigation";
import FormField from "@/components/Element/FormField";
import { CourseContext } from "./page";
import { uploadImageToBlob } from "@/lib/blob";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Loader2,
  Building2,
  MapPin,
  DollarSign,
  AlertCircle,
  Upload,
  Image as ImageIcon,
  X,
} from "lucide-react";
import { toast } from "sonner";

interface AddCourseProps {
  nextStep: () => void;
  prevStep: () => void;
  draftId?: string;
}

export default function AddCourse({ nextStep, prevStep, draftId }: AddCourseProps) {
  const router = useRouter();
  const methods = useForm();
  const { handleSubmit, reset, watch } = methods;
  const { Course } = useContext(CourseContext);

  const [imageUrl, setImageUrl] = useState<string>("");
  const [isUploadingImage, setIsUploadingImage] = useState<boolean>(false);
  const [imageMsg, setImageMsg] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const token = JsCookie.get("authorization");

  useEffect(() => {
    if (Course && Object.keys(Course).length > 0) {
      reset(Course);
      if (typeof Course.image === "string" && Course.image.trim() && Course.image !== "[object Object]") {
        setImageUrl(Course.image.trim());
      }
    }
  }, [Course, reset]);

  const onSubmit = async (data: any) => {
    try {
      setIsSubmitting(true);

      // ضمان أن حقل الصورة هو رابط نصي صالح أو فارغ (وليس كائن FileList)
      const resolvedImage = typeof imageUrl === "string" ? imageUrl.trim() : "";

      // استبعاد أي قيمة كائنية قد تكون سُجلت لـ image من formState
      const { image: _ignoredImage, ...cleanData } = data;

      const payload = {
        ...cleanData,
        image: resolvedImage,
        status: "published",
        providingEntity: {
          name: data.center || Course?.center || "جهة معتمدة",
          logo: "",
        },
        locationDetails: {
          city: data.location || "إدلب",
          country: "سوريا",
        },
        pricing: {
          isFree: Number(data.price) === 0 || !data.price,
          cost: Number(data.price) || 0,
          currency: "USD",
          stipendProvided: false,
        },
      };

      const url = `/api/admin/courses`;
      const response = await axios.post(url, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // If originated from a draft, approve the draft
      if (draftId) {
        try {
          await axios.put(`/api/admin/def-courses/${draftId}`, {
            status: "approved",
          });
        } catch (draftErr) {
          console.warn("Failed to update draft status to approved:", draftErr);
        }
      }

      const createdCourse = response.data?.data || response.data;
      const createdId = createdCourse?._id;

      toast.success("تم اعتماد ونشر الدورة بنجاح! جاري تحويلك لإرسالها للطلاب المهتمين...");
      if (createdId) {
        router.push(`/admin/send-training?courseId=${createdId}`);
      } else {
        router.push("/admin/courses");
      }
    } catch (error: any) {
      console.error("Error adding course:", error);
      toast.error(error.response?.data?.message || "حدث خطأ أثناء حفظ الدورة");
    } finally {
      setIsSubmitting(false);
    }
  };

  async function uploadImage(e: React.ChangeEvent<HTMLInputElement>) {
    try {
      const files = e.target.files;
      if (!files || files.length === 0) return;
      setIsUploadingImage(true);
      setImageMsg("جاري رفع الصورة إلى Vercel Blob...");
      const blobUrl = await uploadImageToBlob(files[0]);
      setImageUrl(blobUrl);
      setImageMsg("تم رفع الصورة بنجاح إلى Vercel Blob ✓");
    } catch (err: any) {
      console.error("Vercel Blob upload error:", err);
      setImageMsg(err.message || "حدث خطأ أثناء رفع الصورة إلى Vercel Blob");
    } finally {
      setIsUploadingImage(false);
    }
  }

  return (
    <FormProvider {...methods}>
      <div className="w-full max-w-2xl mx-auto p-4 sm:p-6 bg-white rounded-3xl border border-slate-200/90 shadow-2xs text-right">
        {/* Step Indicator */}
        <div className="pb-4 mb-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold">
                ✓
              </span>
              <h2 className="text-base sm:text-lg font-black text-slate-900">
                مراجعة وتأكيد بيانات التدريب
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              يمكنك مراجعة وتعديل أي حقل قبل النشر والاعتماد النهائي
            </p>
          </div>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={prevStep}
            className="text-xs font-bold text-slate-500 gap-1"
          >
            <ArrowRight className="w-3.5 h-3.5" />
            <span>الرجوع</span>
          </Button>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <FormField
            label="عنوان الدورة التدريبية"
            name="title"
            type="text"
            placeholder="أدخل عنوان الدورة"
            validation={{ required: "عنوان الدورة مطلوب" }}
          />

          <FormField
            label="الجهة المنظمة / الشريك المنفذ"
            name="center"
            type="text"
            placeholder="مثال: مديرية التدريب والتأهيل - جامعة إدلب"
            validation={{ required: "الجهة المنظمة مطلوبة" }}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              label="الموقع أو المدينة"
              name="location"
              type="text"
              placeholder="مثال: إدلب المدينة / سرمدا"
            />

            <FormField
              label="الرسوم (0 للدورات المجانية بالكامل)"
              name="price"
              type="number"
              placeholder="0 = مجاني"
            />
          </div>

          <FormField
            label="ملخص تفاصيل ومحتوى الدورة"
            name="context"
            as="textarea"
            rows="5"
            placeholder="محتوى ومحاور الدورة وشروط القبول..."
            validation={{ required: "محتوى الدورة مطلوب" }}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex gap-2">
              <FormField
                label="أدنى عمر"
                name="age.start"
                type="number"
                placeholder="16"
              />
              <FormField
                label="أقصى عمر"
                name="age.end"
                type="number"
                placeholder="40"
              />
            </div>

            <FormField
              label="الجنسية المستهدفة"
              name="nationality"
              type="text"
              placeholder="الكل / سوري"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              label="روابط التسجيل والاستمارات"
              name="links"
              type="text"
              placeholder="رابط استمارة التسجيل أو صفحة الفيسبوك"
            />

            <FormField
              label="الكلمات المفتاحية والتصنيفات"
              name="keys"
              type="text"
              placeholder="برمجة, ذكاء اصطناعي, إدلب"
            />
          </div>

          {/* حقل صورة أو بوستر الدورة بدون ربط مع FormField لتجنب مشاكل FileList */}
          <div className="space-y-2 p-4 rounded-2xl bg-slate-50/80 border border-slate-200">
            <label className="block text-xs font-bold text-slate-800">
              صورة أو بوستر الدورة التدريبية (اختياري)
            </label>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <label className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer shadow-2xs transition">
                {isUploadingImage ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-[#123D3A]" />
                ) : (
                  <Upload className="w-3.5 h-3.5 text-slate-500" />
                )}
                <span>{isUploadingImage ? "جاري الرفع السحابي..." : "رفع صورة من جهازك"}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={uploadImage}
                  disabled={isUploadingImage}
                  className="hidden"
                />
              </label>

              <div className="flex-1">
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => {
                    setImageUrl(e.target.value);
                    setImageMsg("");
                  }}
                  placeholder="أو ألصق رابط الصورة مباشرة هنا (https://...)"
                  className="w-full text-xs px-3 py-2.5 rounded-xl bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#123D3A]/20 focus:border-[#123D3A]"
                />
              </div>
            </div>

            {imageMsg && (
              <p
                className={`text-xs font-bold ${
                  imageMsg.includes("نجاح") || imageMsg.includes("✓")
                    ? "text-emerald-700"
                    : "text-amber-700"
                }`}
              >
                {imageMsg}
              </p>
            )}

            {imageUrl &&
              (imageUrl.startsWith("http") ||
                imageUrl.startsWith("/api/blob") ||
                imageUrl.startsWith("/")) && (
              <div className="relative mt-2 inline-flex items-center gap-3 p-2 rounded-xl bg-white border border-slate-200 shadow-2xs">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imageUrl}
                  alt="معاينة البوستر"
                  className="w-14 h-14 object-cover rounded-lg border border-slate-100"
                />
                <div className="text-right">
                  <p className="text-xs font-bold text-slate-800">تم اعتماد الصورة</p>
                  <p className="text-[10px] text-slate-400 max-w-[220px] truncate" dir="ltr">
                    {imageUrl}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setImageUrl("");
                    setImageMsg("");
                  }}
                  className="p-1.5 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition"
                  title="إزالة الصورة"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Action Footer */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={prevStep}
              className="rounded-xl text-xs font-bold h-10"
            >
              الرجوع للخطوة السابقة
            </Button>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="rounded-xl text-xs font-black h-10 px-6 bg-[#123D3A] hover:bg-[#0E2F2D] text-white gap-2 shadow-xs transition"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>جاري نشر الدورة...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>اعتماد ونشر كدورة معتمدة الآن</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </FormProvider>
  );
}
