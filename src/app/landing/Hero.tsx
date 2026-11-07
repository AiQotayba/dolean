"use client";

import Link from "next/link";
import HeroQuickRequest from "@/components/forms-client/HeroQuickRequest";
import { Zap, ArrowLeft } from "lucide-react";

export default function Hero() {
  const scrollToRequestInput = () => {
    const input = document.getElementById("course-input");
    if (input) {
      input.focus();
      input.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  return (
    <section className="w-full relative overflow-hidden bg-[#123D3A] text-white pt-10 pb-16 md:pt-14 md:pb-20 px-4 sm:px-6">
      {/* Brand Ambient Glow Orbs using official palette (#D58A38 warm orange and #A9B5B0 soft gray) */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#D58A38]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-80 h-80 bg-[#A9B5B0]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -top-20 left-1/3 w-72 h-72 bg-[#206C63]/30 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Right Column: Hero Pitch & Value Props with Logo Watermark Graphic behind texts */}
          <div className="lg:col-span-6 flex flex-col items-start text-right space-y-5 relative">
            
            {/* Translucent Brand Logo Graphic behind text */}
            <svg
              viewBox="0 0 88 56"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="absolute -top-12 -right-8 w-80 h-56 sm:w-[420px] sm:h-[280px] pointer-events-none opacity-15 select-none -z-10"
              aria-hidden="true"
            >
              <defs>
                <clipPath id="hero-watermark-clip">
                  <path d="M 38 12 C 52 8, 72 9, 80 19 C 89 29, 87 43, 76 48 C 65 53, 47 52, 36 43 C 27 35, 29 19, 38 12 Z" />
                </clipPath>
              </defs>
              <path
                d="M 10 30 C 10 17, 24 13, 37 16 C 48 19, 52 30, 50 41 C 48 49, 35 52, 23 50 C 14 48, 10 40, 10 30 Z"
                fill="#A9B5B0"
              />
              <path
                d="M 38 12 C 52 8, 72 9, 80 19 C 89 29, 87 43, 76 48 C 65 53, 47 52, 36 43 C 27 35, 29 19, 38 12 Z"
                fill="#F8F8F5"
              />
              <path
                d="M 10 30 C 10 17, 24 13, 37 16 C 48 19, 52 30, 50 41 C 48 49, 35 52, 23 50 C 14 48, 10 40, 10 30 Z"
                clipPath="url(#hero-watermark-clip)"
                fill="#D58A38"
              />
            </svg>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#F8F8F5] tracking-tight leading-tight">
              تعلّم المهارة التي تفتح لك باب العمل،{' '}
              <span className="text-[#D58A38]">
                ونحن نصلك بالمكان المناسب
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base text-[#A9B5B0] leading-relaxed font-normal max-w-lg">
              قلّنا شو بدك تتعلم. منطابق طلبك مع مراكز معتمدة في إدلب، وبتوصلك التفاصيل على واتساب. مجاناً، بدون ما تدور وتضيّع وقتك.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-1">
              <button
                type="button"
                onClick={scrollToRequestInput}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#D58A38] hover:bg-[#BE772B] text-white font-black text-sm transition-all active:scale-95 shadow-lg shadow-[#D58A38]/25 cursor-pointer"
              >
                <Zap className="w-4 h-4 fill-white text-white" />
                <span>ابدأ طلبك بدقيقة</span>
              </button>

              <a
                href="#courses"
                className="inline-flex items-center gap-1.5 text-sm font-bold text-[#F8F8F5] hover:text-[#D58A38] underline underline-offset-4 transition"
              >
                <span>شوف الدورات المتاحة الآن</span>
                <ArrowLeft className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Left Column: The Interactive Hero Request Card */}
          <div className="lg:col-span-6 w-full">
            <HeroQuickRequest />
          </div>

        </div>
      </div>
    </section>
  );
}
