import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export default function Logo({ className = '', size = 'md', showText = true }: LogoProps) {
  const iconSizes = {
    sm: 'w-8 h-5',
    md: 'w-11 h-7',
    lg: 'w-14 h-9',
  };

  const textSizes = {
    sm: 'text-base font-extrabold',
    md: 'text-xl font-black',
    lg: 'text-2xl font-black',
  };

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {/* 
        شعار تلاقي الرسمي:
        شكلان عضويان بيضاويان انسيابيان يلتقيان (تلاقي)
        الشكل الأيمن: الأخضر الداكن #123D3A
        الشكل الأيسر: الرمادي الناعم #A9B5B0
        منطقة التقاطع والالتقاء: البرتقالي الدافئ #D58A38
      */}
      <div className={`${iconSizes[size]} shrink-0 flex items-center justify-center relative`}>
        <svg
          viewBox="0 0 88 56"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          <defs>
            {/* كليب باث للشكل الأيمن لاقتطاع منطقة التلاقي بدقة هندسية تامة */}
            <clipPath id="talaqi-right-pebble">
              <path d="M 38 12 C 52 8, 72 9, 80 19 C 89 29, 87 43, 76 48 C 65 53, 47 52, 36 43 C 27 35, 29 19, 38 12 Z" />
            </clipPath>
          </defs>

          {/* الشكل الأيسر (الرمادي الناعم #A9B5B0) */}
          <path
            d="M 10 30 C 10 17, 24 13, 37 16 C 48 19, 52 30, 50 41 C 48 49, 35 52, 23 50 C 14 48, 10 40, 10 30 Z"
            fill="#A9B5B0"
          />

          {/* الشكل الأيمن الأساسي (الأخضر الداكن #123D3A) */}
          <path
            d="M 38 12 C 52 8, 72 9, 80 19 C 89 29, 87 43, 76 48 C 65 53, 47 52, 36 43 C 27 35, 29 19, 38 12 Z"
            fill="#123D3A"
          />

          {/* منطقة التلاقي والتقاطع (البرتقالي الدافئ #D58A38) */}
          <path
            d="M 10 30 C 10 17, 24 13, 37 16 C 48 19, 52 30, 50 41 C 48 49, 35 52, 23 50 C 14 48, 10 40, 10 30 Z"
            clipPath="url(#talaqi-right-pebble)"
            fill="#D58A38"
          />
        </svg>
      </div>

      {showText && (
        <span
          className={`${textSizes[size]} tracking-tight text-[#123D3A] font-black`}
          style={{ fontFamily: 'var(--font-heading), system-ui, sans-serif' }}
        >
          تلاقـي
        </span>
      )}
    </div>
  );
}
