"use client";

import React, { useState } from "react";
import { TrendingUp, Users, Calendar, Award } from "lucide-react";

export interface DayDataPoint {
  date: string;       // e.g. "2026-11-01" or "1 نوفمبر"
  label: string;      // e.g. "1 نيسان" or "الأحد 1"
  count: number;
}

interface StudentRegistrationChartProps {
  data: DayDataPoint[];
  periodLabel?: string;
}

export default function StudentRegistrationChart({
  data,
  periodLabel = "خلال الشهر الحالي",
}: StudentRegistrationChartProps) {
  const [hoveredPoint, setHoveredPoint] = useState<DayDataPoint | null>(null);

  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 text-center text-slate-400">
        <Users className="w-8 h-8 mx-auto mb-2 opacity-40 text-[#123D3A]" />
        <p className="text-xs font-bold">لا توجد طلبات مسجلة خلال هذه الفترة</p>
      </div>
    );
  }

  const counts = data.map((d) => d.count);
  const totalRegistrations = counts.reduce((acc, c) => acc + c, 0);
  const maxCount = Math.max(...counts, 1);
  const avgCount = (totalRegistrations / data.length).toFixed(1);

  // Peak day
  const peakIndex = counts.indexOf(Math.max(...counts));
  const peakPoint = data[peakIndex];

  // SVG dimensions
  const height = 180;
  const paddingX = 36;
  const paddingTop = 24;
  const paddingBottom = 32;
  const chartHeight = height - paddingTop - paddingBottom;
  const width = Math.max(800, data.length * 60);

  // Calculate coordinates for SVG path
  const points = data.map((d, i) => {
    const x =
      data.length > 1
        ? paddingX + (i / (data.length - 1)) * (width - paddingX * 2)
        : width / 2;
    const y = paddingTop + chartHeight - (d.count / maxCount) * chartHeight;
    return { x, y, ...d };
  });

  const pathD = points.reduce((acc, pt, i) => {
    return i === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`;
  }, "");

  const areaD =
    points.length > 1
      ? `${pathD} L ${points[points.length - 1].x} ${paddingTop + chartHeight} L ${points[0].x} ${paddingTop + chartHeight} Z`
      : "";

  // Step interval for X-axis labels to avoid overlapping
  const labelStep = data.length > 8 ? Math.ceil(data.length / 5) : 2;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-2xs space-y-4">
      {/* Header with Title and Quick Insights */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-[#123D3A]/10 text-[#123D3A]">
              <TrendingUp className="w-4 h-4" />
            </div>
            <h3 className="text-sm sm:text-base font-black text-slate-900">
              مخطط حركة تسجيل وطلبات الطلاب
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            توزيع إقبال الطلاب على الدورات {periodLabel} (أوقات الذروة والإقبال)
          </p>
        </div>

        {/* Insight Badges */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="px-3 py-1 rounded-xl bg-slate-50 border border-slate-200/80 text-right">
            <span className="block text-[10px] text-slate-500 font-medium">إجمالي الطلبات</span>
            <span className="block text-sm font-black text-slate-900 font-mono">
              {totalRegistrations} طالب
            </span>
          </div>

          {peakPoint && peakPoint.count > 0 && (
            <div className="px-3 py-1 rounded-xl bg-amber-50 border border-amber-200/80 text-right">
              <span className="block text-[10px] text-amber-800 font-medium flex items-center gap-1">
                <Award className="w-3 h-3 text-[#D58A38]" />
                أعلى ذروة
              </span>
              <span className="block text-xs font-black text-amber-950">
                {peakPoint.label}: {peakPoint.count} طالب
              </span>
            </div>
          )}
        </div>
      </div>

      {/* SVG Chart Container with Horizontal Scroll if needed */}
      <div className="relative w-full overflow-x-auto select-none pt-2">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-44 min-w-[500px]"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="talaqi-area-gradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#123D3A" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#123D3A" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid horizontal guidelines */}
          <line
            x1={paddingX}
            y1={paddingTop}
            x2={width - paddingX}
            y2={paddingTop}
            stroke="#f1f5f9"
            strokeDasharray="4 4"
            strokeWidth="1"
          />
          <line
            x1={paddingX}
            y1={paddingTop + chartHeight / 2}
            x2={width - paddingX}
            y2={paddingTop + chartHeight / 2}
            stroke="#f1f5f9"
            strokeDasharray="4 4"
            strokeWidth="1"
          />
          <line
            x1={paddingX}
            y1={paddingTop + chartHeight}
            x2={width - paddingX}
            y2={paddingTop + chartHeight}
            stroke="#e2e8f0"
            strokeWidth="1.5"
          />

          {/* Area Fill */}
          {areaD && <path d={areaD} fill="url(#talaqi-area-gradient)" />}

          {/* Line Stroke */}
          {pathD && (
            <path
              d={pathD}
              fill="none"
              stroke="#123D3A"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {/* Data Points and Interaction Circles */}
          {points.map((pt, i) => {
            const isHovered = hoveredPoint?.date === pt.date;
            const isPeak = pt.count === maxCount && pt.count > 0;

            return (
              <g key={i}>
                {/* Vertical helper line on hover */}
                {isHovered && (
                  <line
                    x1={pt.x}
                    y1={paddingTop}
                    x2={pt.x}
                    y2={paddingTop + chartHeight}
                    stroke="#D58A38"
                    strokeWidth="1.5"
                    strokeDasharray="3 3"
                  />
                )}

                {/* Visible Point */}
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={isHovered ? 6 : isPeak ? 4.5 : 3.5}
                  fill={isPeak ? "#D58A38" : isHovered ? "#123D3A" : "#ffffff"}
                  stroke={isPeak ? "#ffffff" : "#123D3A"}
                  strokeWidth={isHovered ? 2.5 : 2}
                  className="transition-all duration-150 cursor-pointer"
                />

                {/* X-axis Label: milestone-based to ensure no overlap */}
                {(i === 0 || i === data.length - 1 || (i % labelStep === 0 && data.length - 1 - i >= 2)) && (
                  <text
                    x={pt.x}
                    y={height - 8}
                    textAnchor="middle"
                    className="text-[11px] font-bold fill-slate-400 font-sans select-none"
                  >
                    {pt.label}
                  </text>
                )}

                {/* Invisible hover capture target */}
                <rect
                  x={pt.x - 14}
                  y={paddingTop}
                  width="28"
                  height={chartHeight + 10}
                  fill="transparent"
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredPoint(pt)}
                  onMouseLeave={() => setHoveredPoint(null)}
                />
              </g>
            );
          })}
        </svg>

        {/* Hover Tooltip Float */}
        {hoveredPoint && (
          <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-3 py-1.5 rounded-xl shadow-xl text-xs font-bold flex items-center gap-2 pointer-events-none transition-all duration-150 border border-slate-700">
            <Calendar className="w-3.5 h-3.5 text-[#D58A38]" />
            <span>{hoveredPoint.label}:</span>
            <span className="text-[#D58A38] font-mono text-sm">
              {hoveredPoint.count} طالب
            </span>
          </div>
        )}
      </div>

      {/* Legend & Summary Note */}
      <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-500 pt-1">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#123D3A]" />
            <span>تسجيلات يومية</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#D58A38]" />
            <span>يوم الذروة</span>
          </span>
        </div>
        <span>متوسط التسجيل: <strong>{avgCount}</strong> طالب / يوم</span>
      </div>
    </div>
  );
}
