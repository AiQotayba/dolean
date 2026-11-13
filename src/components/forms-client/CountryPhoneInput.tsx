"use client";

import React, { useState, useEffect } from "react";
import { ChevronDown, Phone } from "lucide-react";

export interface CountryInfo {
  code: string;
  name: string;
  dialCode: string;
  flag: string;
  formatPlaceholder: string;
}

export const COUNTRIES: CountryInfo[] = [
  { code: "SY", name: "سورية", dialCode: "+963", flag: "🇸🇾", formatPlaceholder: "9XX XXX XXX" },
  { code: "TR", name: "تركيا", dialCode: "+90", flag: "🇹🇷", formatPlaceholder: "5XX XXX XXXX" },
  { code: "LB", name: "لبنان", dialCode: "+961", flag: "🇱🇧", formatPlaceholder: "XX XXX XXX" },
  { code: "JO", name: "الأردن", dialCode: "+962", flag: "🇯🇴", formatPlaceholder: "7X XXX XXXX" },
  { code: "IQ", name: "العراق", dialCode: "+964", flag: "🇮🇶", formatPlaceholder: "7XX XXX XXXX" },
  { code: "SA", name: "السعودية", dialCode: "+966", flag: "🇸🇦", formatPlaceholder: "5X XXX XXXX" },
  { code: "AE", name: "الإمارات", dialCode: "+971", flag: "🇦🇪", formatPlaceholder: "5X XXX XXXX" },
  { code: "EG", name: "مصر", dialCode: "+20", flag: "🇪🇬", formatPlaceholder: "1X XXXX XXXX" },
  { code: "QA", name: "قطر", dialCode: "+974", flag: "🇶🇦", formatPlaceholder: "XX XXX XXX" },
  { code: "KW", name: "الكويت", dialCode: "+965", flag: "🇰🇼", formatPlaceholder: "X XXX XXXX" },
  { code: "DE", name: "ألمانيا", dialCode: "+49", flag: "🇩🇪", formatPlaceholder: "1XX XXXXXXX" },
  { code: "NL", name: "هولندا", dialCode: "+31", flag: "🇳🇱", formatPlaceholder: "6 XXXXXXXX" },
  { code: "SE", name: "السويد", dialCode: "+46", flag: "🇸🇪", formatPlaceholder: "7X XXX XX XX" },
  { code: "OTHER", name: "رمز دولي آخر", dialCode: "+", flag: "🌐", formatPlaceholder: "رقم دولي كامل" },
];

interface CountryPhoneInputProps {
  value: string;
  onChange: (fullNumber: string) => void;
  required?: boolean;
  className?: string;
  id?: string;
}

export default function CountryPhoneInput({
  value,
  onChange,
  required = false,
  className = "",
  id = "phone-input",
}: CountryPhoneInputProps) {
  const [selectedCountry, setSelectedCountry] = useState<CountryInfo>(COUNTRIES[0]); // default Syria
  const [phoneNumber, setPhoneNumber] = useState("");

  // Parse initial or incoming full value
  useEffect(() => {
    if (!value) {
      setPhoneNumber("");
      return;
    }

    // Check if starts with a known dial code
    const matched = COUNTRIES.find(
      (c) => c.code !== "OTHER" && value.startsWith(c.dialCode)
    );

    if (matched) {
      setSelectedCountry(matched);
      setPhoneNumber(value.slice(matched.dialCode.length).trim());
    } else if (value.startsWith("+")) {
      setSelectedCountry(COUNTRIES.find((c) => c.code === "OTHER") || COUNTRIES[0]);
      setPhoneNumber(value.slice(1).trim());
    } else {
      // Local number, default Syria unless Turkish prefix
      if (value.startsWith("05") || value.startsWith("5")) {
        setSelectedCountry(COUNTRIES[1]); // Turkey
        setPhoneNumber(value.replace(/^0/, ""));
      } else {
        setSelectedCountry(COUNTRIES[0]); // Syria
        setPhoneNumber(value.replace(/^0/, ""));
      }
    }
  }, []);

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const country = COUNTRIES.find((c) => c.code === e.target.value) || COUNTRIES[0];
    setSelectedCountry(country);
    combineAndPropagate(country, phoneNumber);
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let raw = e.target.value.replace(/[^0-9]/g, "");

    // Smart auto-detection: if user enters 09... in Syria, strip leading 0
    if (selectedCountry.code === "SY" && raw.startsWith("09")) {
      raw = raw.substring(1);
    }
    // If user enters 05... while Turkey is selected, strip leading 0
    if (selectedCountry.code === "TR" && raw.startsWith("05")) {
      raw = raw.substring(1);
    }
    // If user pastes a Turkish number starting with 05 while Syria is selected, auto-switch to Turkey
    if (selectedCountry.code === "SY" && raw.startsWith("05") && raw.length >= 10) {
      const turkey = COUNTRIES[1];
      setSelectedCountry(turkey);
      const cleaned = raw.substring(1);
      setPhoneNumber(cleaned);
      combineAndPropagate(turkey, cleaned);
      return;
    }

    setPhoneNumber(raw);
    combineAndPropagate(selectedCountry, raw);
  };

  const combineAndPropagate = (country: CountryInfo, num: string) => {
    const cleanNum = num.replace(/^0+/, "");
    if (!cleanNum) {
      onChange("");
      return;
    }
    const combined = `${country.dialCode}${cleanNum}`;
    onChange(combined);
  };

  return (
    <div
      className={`flex items-center rounded-xl border border-slate-200 bg-white shadow-2xs overflow-hidden focus-within:ring-2 focus-within:ring-[#123D3A]/20 focus-within:border-[#123D3A] transition ${className}`}
    >
      {/* Country Flag & Dial Code Select */}
      <div className="relative flex items-center bg-slate-50 border-l border-slate-200 px-2 py-2 shrink-0 select-none hover:bg-slate-100 transition cursor-pointer">
        <span className="text-base mr-1">{selectedCountry.flag}</span>
        <span className="text-xs font-mono font-bold text-slate-700 ml-1" dir="ltr">
          {selectedCountry.dialCode}
        </span>
        <ChevronDown className="w-3.5 h-3.5 text-slate-400 mr-1" />

        <select
          value={selectedCountry.code}
          onChange={handleCountryChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer text-xs"
          title="اختر الدولة"
        >
          {COUNTRIES.map((c) => (
            <option key={c.code} value={c.code}>
              {c.flag} {c.name} ({c.dialCode})
            </option>
          ))}
        </select>
      </div>

      {/* Phone Number Input */}
      <input
        id={id}
        type="tel"
        dir="ltr"
        required={required}
        value={phoneNumber}
        onChange={handleNumberChange}
        placeholder={selectedCountry.formatPlaceholder}
        className="w-full text-xs sm:text-sm font-mono font-semibold px-3 py-2.5 bg-transparent text-slate-900 placeholder:text-slate-400 focus:outline-none"
      />
    </div>
  );
}
