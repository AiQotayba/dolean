import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  theme?: 'light' | 'dark';
  variant?: 'light' | 'dark';
}

export default function Logo({
  className = '',
  size = 'md',
  showText = true,
  theme,
  variant,
}: LogoProps) {
  const isDark = theme === 'dark' || variant === 'dark';

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

  // الألوان وفقاً لقواعد التباين مع الخلفية
  // على الخلفيات الخضراء الداكنة: يتحول الشكل الأيمن والنص إلى الأبيض الصريح #FFFFFF للتمييز
  const rightPebbleColor = isDark ? '#FFFFFF' : '#123D3A';
  const leftPebbleColor = isDark ? '#A9B5B0' : '#A9B5B0';
  const intersectionColor = '#D58A38';
  const textColor = isDark ? 'text-white' : 'text-[#123D3A]';

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {/* 
        شعار تلاقي الرسمي:
        شكلان عضويان بيضاويان انسيابيان يلتقيان (تلاقي)
        على الفاتح: الأيمن #123D3A، الأيسر #A9B5B0، والتقاطع #D58A38
        على الداكن والأخضر: الأيمن #FFFFFF (أبيض للتمييز)، الأيسر #A9B5B0، والتقاطع #D58A38
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
            fill={leftPebbleColor}
          />

          {/* الشكل الأيمن (الأخضر الداكن #123D3A على الفاتح، والأبيض #FFFFFF على الداكن والأخضر) */}
          <path
            d="M 38 12 C 52 8, 72 9, 80 19 C 89 29, 87 43, 76 48 C 65 53, 47 52, 36 43 C 27 35, 29 19, 38 12 Z"
            fill={rightPebbleColor}
          />

          {/* منطقة التلاقي والتقاطع (البرتقالي الدافئ #D58A38) */}
          <path
            d="M 10 30 C 10 17, 24 13, 37 16 C 48 19, 52 30, 50 41 C 48 49, 35 52, 23 50 C 14 48, 10 40, 10 30 Z"
            clipPath="url(#talaqi-right-pebble)"
            fill={intersectionColor}
          />
        </svg>
      </div>

      {showText && (
        <span
          className={`${textSizes[size]} tracking-tight ${textColor} font-black`}
          style={{ fontFamily: 'var(--font-heading), system-ui, sans-serif' }}
        >
          تلاقـي
        </span>
      )}
    </div>
  );
}
