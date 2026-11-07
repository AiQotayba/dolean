"use client";

import React, { useContext, useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import axios from "axios";
import JsCookie from "js-cookie";
import { useRouter } from "next/navigation";
import FormField from "@/components/Element/FormField";
import { CourseContext } from "./page";
import { Storage } from "@/components/firebase";
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

  const [Res, setRes] = useState<any>({});
  const [imageMsg, setImageMsg] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const token = JsCookie.get("authorization");

  useEffect(() => {
    if (Course && Object.keys(Course).length > 0) {
      reset(Course);
      if (Course.image) {
        setRes({ image: Course.image });
      }
    }
  }, [Course, reset]);

  const onSubmit = async (data: any) => {
    try {
      setIsSubmitting(true);
      const payload = {
        ...data,
        ...Res,
        image: Res?.image || data.image || Course?.image || "",
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

      toast.success("تم اعتماد ونشر الدورة التدريبية بنجاح!");
      router.push("/admin/courses");
    } catch (error: any) {
      console.error("Error adding course:", error);
      toast.error(error.response?.data?.message || "حدث خطأ أثناء حفظ الدورة");
    } finally {
      setIsSubmitting(false);
    }
  };

  async function uploadImage(e: any) {
    try {
      setImageMsg("جاري رفع الصورة...");
      const image: any = await Storage.add(e.target.files);
      setImageMsg("تم رفع الصورة بنجاح");
      setRes({ ...Res, image: image[0] });
    } catch {
      setImageMsg("فشل رفع الصورة");
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
                الخطوة 2: مراجعة واعتماد تفاصيل الدورة المنشورة
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              تم استخراج الحقول التالية تلقائياً بواسطة الذكاء الاصطناعي. يمكنك تعديل أي حقل قبل الاعتماد النهائي.
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
            <span>تعديل النص الأصلي</span>
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

          <FormField
            label="صورة أو بوستر الدورة"
            name="image"
            type="file"
            onChange={uploadImage}
          />
          {imageMsg && (
            <p className="text-xs font-bold text-emerald-700">{imageMsg}</p>
          )}

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
