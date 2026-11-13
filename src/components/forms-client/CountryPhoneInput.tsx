"use client";

import React, { useState, useEffect } from "react";
import PhoneInput, {
  isValidPhoneNumber,
  isPossiblePhoneNumber,
  formatPhoneNumber,
  formatPhoneNumberIntl,
  type Country,
} from "react-phone-number-input";
import ar from "react-phone-number-input/locale/ar.json";
import "react-phone-number-input/style.css";
import { Check, AlertCircle } from "lucide-react";

export {
  isValidPhoneNumber,
  isPossiblePhoneNumber,
  formatPhoneNumber,
  formatPhoneNumberIntl,
};

export interface CountryPhoneInputProps {
  value: string;
  onChange: (fullNumber: string) => void;
  required?: boolean;
  className?: string;
  id?: string;
  name?: string;
  placeholder?: string;
  defaultCountry?: Country;
  showValidationHint?: boolean;
  onValidationChange?: (isValid: boolean) => void;
}

export default function CountryPhoneInput({
  value,
  onChange,
  required = false,
  className = "",
  id = "phone-input",
  name = "phone",
  placeholder = "مثال: 0944 112 233",
  defaultCountry = "SY",
  showValidationHint = true,
  onValidationChange,
}: CountryPhoneInputProps) {
  const [touched, setTouched] = useState(false);

  const cleanValue = value || "";
  const isValid = cleanValue ? isValidPhoneNumber(cleanValue) : !required;
  const isTooShort = cleanValue.length > 0 && cleanValue.length < 8;

  useEffect(() => {
    if (onValidationChange) {
      onValidationChange(isValid);
    }
  }, [isValid, onValidationChange]);

  const handleChange = (val?: string) => {
    setTouched(true);
    onChange(val || "");
  };

  return (
    <div className={`space-y-1.5 talaqi-phone-input ${className}`}>
      <div
        className={`relative flex items-center rounded-xl border bg-white shadow-2xs overflow-hidden transition-all duration-150 ${
          touched && cleanValue && !isValid
            ? "border-amber-400 focus-within:ring-2 focus-within:ring-amber-400/20 focus-within:border-amber-500"
            : touched && cleanValue && isValid
            ? "border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/20 focus-within:border-emerald-600"
            : "border-slate-200 focus-within:ring-2 focus-within:ring-[#123D3A]/20 focus-within:border-[#123D3A]"
        }`}
      >
        <PhoneInput
          id={id}
          name={name}
          international
          withCountryCallingCode
          defaultCountry={defaultCountry}
          labels={ar}
          value={cleanValue}
          onChange={handleChange}
          onBlur={() => setTouched(true)}
          placeholder={placeholder}
          className="w-full flex items-center text-xs sm:text-sm"
        />

        {/* Validation Icon Badge */}
        {touched && cleanValue && (
          <div className="pl-3 pr-1 flex items-center shrink-0">
            {isValid ? (
              <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs">
                <Check className="w-3 h-3 stroke-[3]" />
              </span>
            ) : (
              <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-xs">
                <AlertCircle className="w-3 h-3" />
              </span>
            )}
          </div>
        )}
      </div>

      {/* Validation Feedback Messages */}
      {showValidationHint && touched && cleanValue && !isValid && (
        <p className="text-[11px] font-medium text-amber-600 flex items-center gap-1">
          <AlertCircle className="w-3 h-3 shrink-0" />
          <span>
            {isTooShort
              ? "رقم الهاتف غير مكتمل، يرجى كتابة الرقم كاملاً"
              : "يرجى التحقق من صحة الرقم ورمز الدولة المحدد"}
          </span>
        </p>
      )}
    </div>
  );
}
