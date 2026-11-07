"use client";

import React, { useState } from "react";
import { MapPin, Globe, Building2, CheckCircle2, ChevronLeft } from "lucide-react";

export interface GeoHub {
  city: string;
  coursesCount: number;
  orgsCount: number;
  percentage: number;
  status: "primary" | "active" | "emerging";
  note: string;
}

interface GeographicDistributionMatrixProps {
  hubs?: GeoHub[];
}

export default function GeographicDistributionMatrix({ hubs }: GeographicDistributionMatrixProps) {
  const defaultHubs: GeoHub[] = [
    {
      city: "مدينة إدلب (المركز الإداري والجامعي)",
      coursesCount: 14,
      orgsCount: 9,
      percentage: 58,
      status: "primary",
      note: "الجامعات والمراكز التخصصية، ومقرات المنظمات الإنسانية الكبرى",
    },
    {
      city: "سرمدا (المركز التجاري والتقني)",
      coursesCount: 4,
      orgsCount: 4,
      percentage: 18,
      status: "active",
      note: "تدريبات إدارة الأعمال، البرمجة، والشركات الناشئة",
    },
    {
      city: "الدانا وتجمعات الشمال",
      coursesCount: 2,
      orgsCount: 2,
      percentage: 10,
      status: "active",
      note: "معاهد اللغات والتعليم المهني والحرفي",
    },
    {
      city: "أريحا وجبل الزاوية",
      coursesCount: 1,
      orgsCount: 1,
      percentage: 5,
      status: "emerging",
      note: "مبادرات شبابية ودورات إسعافات ورعاية أولية",
    },
    {
      city: "عن بعد / أونلاين (شامل الشمال السوري)",
      coursesCount: 3,
      orgsCount: 3,
      percentage: 14,
      status: "primary",
      note: "جلسات رقمية مفتوحة لكافة الطلاب في المخيمات والبلدات النائية",
    },
  ];

  const data = hubs && hubs.length > 0 ? hubs : defaultHubs;
  const [selectedHub, setSelectedHub] = useState<GeoHub | null>(null);

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-7 shadow-xs space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-blue-50 text-blue-700">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
              خريطة الانتشار والتغطية في إدلب والشمال السوري
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              توزيع الشركاء والمراكز المعتمدة والفرص التدريبية حسب التجمعات السكانية
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold">
            5 محاور جغرافية رئيسية
          </span>
        </div>
      </div>

      {/* Grid of Geographic Hubs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {data.map((hub, idx) => {
          const isSelected = selectedHub?.city === hub.city;

          return (
            <div
              key={idx}
              onMouseEnter={() => setSelectedHub(hub)}
              onMouseLeave={() => setSelectedHub(null)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                isSelected
                  ? "bg-slate-50 border-[#123D3A] shadow-xs"
                  : "bg-white border-slate-200/80 hover:border-slate-300"
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                      hub.status === "primary"
                        ? "bg-[#123D3A] text-white"
                        : hub.status === "active"
                        ? "bg-[#D58A38] text-white"
                        : "bg-slate-200 text-slate-700"
                    }`}
                  >
                    {hub.city.includes("أونلاين") ? (
                      <Globe className="w-4 h-4" />
                    ) : (
                      <MapPin className="w-4 h-4" />
                    )}
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-black text-slate-900">{hub.city}</h4>
                    <p className="text-[11px] text-slate-500 line-clamp-1">{hub.note}</p>
                  </div>
                </div>

                <span className="font-mono text-sm font-black text-slate-900 shrink-0">
                  {hub.percentage}%
                </span>
              </div>

              {/* Progress bar */}
              <div className="bg-slate-100 rounded-full h-2 overflow-hidden mt-3 mb-2">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${
                    hub.status === "primary"
                      ? "bg-[#123D3A]"
                      : hub.status === "active"
                      ? "bg-[#D58A38]"
                      : "bg-slate-400"
                  }`}
                  style={{ width: `${hub.percentage}%` }}
                />
              </div>

              {/* Quick metrics */}
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 pt-1">
                <span className="flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5 text-slate-400" />
                  {hub.orgsCount} مراكز وشركاء
                </span>
                <span className="text-[#123D3A] font-black">
                  {hub.coursesCount} تدريبات معتمدة
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
