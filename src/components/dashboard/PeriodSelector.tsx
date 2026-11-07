"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface PeriodSelectorProps {
  currentPeriod: string;
  initialFrom?: string;
  initialTo?: string;
}

export default function PeriodSelector({
  currentPeriod = "month",
  initialFrom = "",
  initialTo = "",
}: PeriodSelectorProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [selectedPeriod, setSelectedPeriod] = useState<string>(currentPeriod);
  const [showCustomRange, setShowCustomRange] = useState<boolean>(currentPeriod === "custom");
  const [fromDate, setFromDate] = useState<string>(initialFrom);
  const [toDate, setToDate] = useState<string>(initialTo);

  const handlePeriodChange = (value: string) => {
    setSelectedPeriod(value);
    if (value === "custom") {
      setShowCustomRange(true);
      return;
    }
    setShowCustomRange(false);
    const params = new URLSearchParams(searchParams?.toString() || "");
    params.set("period", value);
    params.delete("from");
    params.delete("to");
    router.push(`/admin?${params.toString()}`);
  };

  const handleApplyCustomRange = () => {
    if (!fromDate && !toDate) return;
    const params = new URLSearchParams(searchParams?.toString() || "");
    params.set("period", "custom");
    if (fromDate) params.set("from", fromDate);
    if (toDate) params.set("to", toDate);
    router.push(`/admin?${params.toString()}`);
  };

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
      <div className="flex items-center gap-2">
        <span className="text-xs font-bold text-slate-500 whitespace-nowrap hidden sm:inline">
          نطاق المؤشرات:
        </span>
        <Select value={selectedPeriod} onValueChange={handlePeriodChange}>
          <SelectTrigger className="w-[170px] h-9 text-xs font-bold bg-white rounded-xl border-slate-200">
            <SelectValue placeholder="اختر النطاق الزمني" />
          </SelectTrigger>
          <SelectContent className="text-right">
            <SelectItem value="day">يومي (اليوم)</SelectItem>
            <SelectItem value="week">أسبوعي (هذا الأسبوع)</SelectItem>
            <SelectItem value="month">شهري (هذا الشهر)</SelectItem>
            <SelectItem value="30days">آخر 30 يوماً</SelectItem>
            <SelectItem value="custom">نطاق مخصص (تاريخ)</SelectItem>
            <SelectItem value="all">جميع الفترات (شامل)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Custom Date Range Picker inputs if custom selected */}
      {showCustomRange && (
        <div className="flex items-center gap-1.5 p-1.5 bg-slate-50 border border-slate-200/90 rounded-xl text-xs">
          <Calendar className="w-3.5 h-3.5 text-[#123D3A] mr-1" />
          <Input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="h-7 text-xs px-2 py-0.5 w-[115px] bg-white rounded-lg border-slate-200"
            title="من تاريخ"
          />
          <span className="text-slate-400 text-xs">إلى</span>
          <Input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="h-7 text-xs px-2 py-0.5 w-[115px] bg-white rounded-lg border-slate-200"
            title="إلى تاريخ"
          />
          <Button
            type="button"
            size="sm"
            onClick={handleApplyCustomRange}
            className="h-7 text-xs px-2.5 rounded-lg bg-[#123D3A] text-white hover:bg-[#0E2F2D]"
          >
            تطبيق
          </Button>
        </div>
      )}
    </div>
  );
}
