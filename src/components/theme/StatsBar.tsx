import React from 'react';
import { Users, Building2, BookOpen, Clock } from 'lucide-react';

interface StatsProps {
  studentsCount?: number;
  centersCount?: number;
  coursesCount?: number;
  lastRequestHoursAgo?: number;
}

export default function StatsBar({
  studentsCount = 480,
  centersCount = 9,
  coursesCount = 9,
  lastRequestHoursAgo = 1,
}: StatsProps) {
  return (
    <div className="w-full bg-[#0E2F2D] border-y border-[#D58A38]/20 py-4 px-4 sm:px-6 relative z-20">
      <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-center md:justify-between gap-y-3 gap-x-6 text-xs sm:text-sm text-[#F8F8F5]">
        
        {/* Main Stats Line */}
        <div className="flex flex-wrap items-center justify-center gap-x-4 sm:gap-x-8 gap-y-2 font-medium">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#D58A38]" />
            <span>
              <strong className="text-[#D58A38] font-black text-base sm:text-lg">
                +{studentsCount}
              </strong>{' '}
              طالب سجّل طلبه
            </span>
          </div>

          <span className="text-[#A9B5B0]/40 hidden sm:inline">·</span>

          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#D58A38]" />
            <span>
              <strong className="text-[#D58A38] font-black text-base sm:text-lg">
                {centersCount}
              </strong>{' '}
              مراكز معتمدة في إدلب
            </span>
          </div>

          <span className="text-[#A9B5B0]/40 hidden sm:inline">·</span>

          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#D58A38]" />
            <span>
              <strong className="text-[#D58A38] font-black text-base sm:text-lg">
                {coursesCount}
              </strong>{' '}
              دورات متاحة هذا الشهر
            </span>
          </div>
        </div>

        {/* Live Pulse Indicator */}
        <div className="flex items-center gap-2 text-xs text-[#A9B5B0] bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span>آخر طلب وصلنا قبل ساعة</span>
        </div>

      </div>
    </div>
  );
}
