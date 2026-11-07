"use client";

import React from "react";
import { Building2, Award, CheckCircle2, ShieldCheck, ExternalLink } from "lucide-react";

export interface PartnerStat {
  name: string;
  orgType: string;
  city: string;
  coursesCount: number;
  freeCount: number;
  isVerified?: boolean;
}

interface PartnersLeaderboardProps {
  partners?: PartnerStat[];
}

export default function PartnersLeaderboard({ partners }: PartnersLeaderboardProps) {
  const defaultPartners: PartnerStat[] = [
    {
      name: "مديرية التدريب والتأهيل – جامعة إدلب",
      orgType: "مديرية جامعية حكومية",
      city: "مدينة إدلب",
      coursesCount: 4,
      freeCount: 4,
      isVerified: true,
    },
    {
      name: "ستارت آب سيريا (Startup Syria)",
      orgType: "حاضنة أعمال وريادة",
      city: "إدلب - سرمدا",
      coursesCount: 3,
      freeCount: 3,
      isVerified: true,
    },
    {
      name: "فريق مسار للتأهيل الرقمي",
      orgType: "مبادرة تأهيل تكنولوجي",
      city: "مدينة إدلب",
      coursesCount: 2,
      freeCount: 2,
      isVerified: true,
    },
    {
      name: "منظمة شفق (Shafak Organization)",
      orgType: "منظمة إنسانية وتنموية",
      city: "مدينة إدلب",
      coursesCount: 2,
      freeCount: 2,
      isVerified: true,
    },
    {
      name: "منظمة بنفسج (Violet Organization)",
      orgType: "منظمة إنسانية رائدة",
      city: "مدينة إدلب",
      coursesCount: 1,
      freeCount: 1,
      isVerified: true,
    },
    {
      name: "أكاديمية تك زون للبرمجة والذكاء الاصطناعي",
      orgType: "أكاديمية تقنية خاصة",
      city: "مدينة إدلب",
      coursesCount: 1,
      freeCount: 0,
      isVerified: true,
    },
    {
      name: "مركز خطوة للتدريب والتطوير المهني",
      orgType: "معهد مهني وتطوير كوادر",
      city: "مدينة إدلب",
      coursesCount: 1,
      freeCount: 1,
      isVerified: true,
    },
    {
      name: "المعهد الاستشاري للغات – جامعة إدلب",
      orgType: "معهد لغات جامعي تخصصي",
      city: "مدينة إدلب",
      coursesCount: 1,
      freeCount: 1,
      isVerified: true,
    },
  ];

  const data = partners && partners.length > 0 ? partners : defaultPartners;

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-7 shadow-xs space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-teal-50 text-teal-800">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
              شبكة المراكز والمعاهد والجامعات الشريكة
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              الجهات المعتمدة الأكثر توفيراً للفرص والمنح التدريبية في الشمال السوري
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200/60 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            جميع الشركاء موثقون
          </span>
        </div>
      </div>

      {/* Grid of Partners */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {data.map((partner, idx) => {
          return (
            <div
              key={idx}
              className="p-4 rounded-2xl border border-slate-200/80 hover:border-[#123D3A]/40 hover:shadow-xs transition bg-slate-50/40 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="w-9 h-9 rounded-xl bg-[#123D3A]/10 text-[#123D3A] flex items-center justify-center font-black text-sm shrink-0">
                    {partner.name.charAt(0)}
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                    {partner.city}
                  </span>
                </div>

                <h4 className="text-xs sm:text-sm font-black text-slate-900 line-clamp-2 min-h-[36px]">
                  {partner.name}
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5">{partner.orgType}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-bold">التدريبات:</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-black text-[#123D3A]">
                    {partner.coursesCount} دورات
                  </span>
                  {partner.freeCount > 0 && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700">
                      {partner.freeCount} مجاني
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
