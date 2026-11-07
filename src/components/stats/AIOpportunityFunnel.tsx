"use client";

import React from "react";
import { Sparkles, Bot, ArrowDown, CheckCircle2, Zap, Clock, Target } from "lucide-react";

interface FunnelStage {
  title: string;
  count: number;
  unit: string;
  desc: string;
  efficiency: string;
  color: string;
}

interface AIOpportunityFunnelProps {
  stages?: FunnelStage[];
}

export default function AIOpportunityFunnel({ stages }: AIOpportunityFunnelProps) {
  const defaultStages: FunnelStage[] = [
    {
      title: "1. رصد الفرص الخام والمقترحات",
      count: 48,
      unit: "إعلان تدريبي",
      desc: "تجميع آلي ويدوي من قنوات تلغرام، صفحات فيسبوك، ومراسلات المراكز الشريكة في إدلب",
      efficiency: "100% رصد",
      color: "bg-slate-100 text-slate-800 border-slate-300",
    },
    {
      title: "2. المعالجة الذكية بـ Gemini 2.5 Flash",
      count: 42,
      unit: "مسودة مهيكلة",
      desc: "استخراج فوري للحقول: العنوان، الشروط، الفئة العمرية، الرسوم، والجدول الزمني بدقة متناهية",
      efficiency: "94% دقة استخراج",
      color: "bg-purple-50 text-purple-900 border-purple-200",
    },
    {
      title: "3. الاعتماد والنشر كدورة نشطة",
      count: 21,
      unit: "دورة معتمدة",
      desc: "تدقيق إداري سريع من المشرف واعتمادها كفرصة موثوقة متاحة للتقديم",
      efficiency: "100% موثوقية",
      color: "bg-teal-50 text-teal-950 border-teal-200",
    },
    {
      title: "4. مطابقة وتوجيه الطلاب للمراكز",
      count: 165,
      unit: "طالب مسجل",
      desc: "توجيه استمارات ورغبات الطلاب نحو المركز المعتمد المعني بالتدريب عبر واتساب والهاتف",
      efficiency: "88% تحويل فعلي",
      color: "bg-amber-50 text-amber-950 border-amber-200",
    },
  ];

  const data = stages && stages.length > 0 ? stages : defaultStages;

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-7 shadow-xs space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-purple-50 text-purple-700">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
              قمع أتمتة الفرص والذكاء الاصطناعي (AI Opportunity Pipeline)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              مسار تحويل المنشورات الخام إلى دورات موثقة وربطها المباشر بالطلاب
            </p>
          </div>
        </div>

        {/* Speed KPI */}
        <div className="flex items-center gap-3 bg-purple-50/70 border border-purple-200/80 px-3.5 py-1.5 rounded-xl text-xs font-bold text-purple-900">
          <Clock className="w-4 h-4 text-purple-600" />
          <span>متوسط سرعة المعالجة: <strong className="font-mono text-purple-950">12 ثانية</strong></span>
        </div>
      </div>

      {/* Funnel Steps */}
      <div className="space-y-3">
        {data.map((stage, idx) => {
          return (
            <React.Fragment key={idx}>
              <div className={`p-4 rounded-2xl border ${stage.color} flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs`}>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs sm:text-sm font-black text-slate-900">
                      {stage.title}
                    </h4>
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-white/80 border border-black/10">
                      {stage.efficiency}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed max-w-xl">
                    {stage.desc}
                  </p>
                </div>

                <div className="flex items-center gap-3 sm:text-left self-end sm:self-center shrink-0">
                  <div className="text-left sm:text-right">
                    <span className="block text-2xl font-black font-mono text-slate-900">
                      {stage.count}
                    </span>
                    <span className="block text-[11px] font-bold text-slate-500">
                      {stage.unit}
                    </span>
                  </div>
                </div>
              </div>

              {idx < data.length - 1 && (
                <div className="flex justify-center -my-1">
                  <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                    <ArrowDown className="w-3.5 h-3.5" />
                  </div>
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
