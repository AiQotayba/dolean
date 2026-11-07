"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronRight, ChevronLeft, Sparkles, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SliderData {
  _id: string;
  title: string;
  subtitle?: string;
  image: string;
  badge?: string;
  link?: string;
  buttonText?: string;
}

export default function FeaturedSliders({ sliders }: { sliders: SliderData[] }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!sliders || sliders.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % sliders.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [sliders]);

  if (!sliders || sliders.length === 0) return null;

  const prevSlide = () => {
    setCurrent((prev) => (prev - 1 + sliders.length) % sliders.length);
  };

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % sliders.length);
  };

  return (
    <section className="w-full py-8 px-4 sm:px-6 max-w-6xl mx-auto">
      <div className="relative rounded-3xl overflow-hidden shadow-xl border border-slate-200/90 bg-slate-900 min-h-[300px] sm:min-h-[380px] flex items-center">
        {/* Sliders Layer */}
        {sliders.map((slider, index) => {
          const isActive = index === current;
          return (
            <div
              key={slider._id}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                isActive ? "opacity-100 z-10 pointer-events-auto" : "opacity-0 z-0 pointer-events-none"
              }`}
            >
              {/* Background Image */}
              <img
                src={slider.image}
                alt={slider.title}
                className="absolute inset-0 w-full h-full object-cover"
              />
              {/* Gradient Dark Overlay for Arabic RTL readability */}
              <div className="absolute inset-0 bg-gradient-to-l from-black/90 via-black/65 to-black/30" />
              <div className="absolute inset-0 bg-[#123D3A]/30 mix-blend-multiply" />

              {/* Slider Content */}
              <div className="relative h-full flex flex-col justify-center px-6 sm:px-12 md:px-16 max-w-2xl text-right space-y-3.5 z-10 py-10">
                {slider.badge && (
                  <div>
                    <span className="inline-flex items-center gap-1.5 text-xs font-black px-3.5 py-1 rounded-full bg-[#D58A38] text-white shadow-md shadow-[#D58A38]/30">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{slider.badge}</span>
                    </span>
                  </div>
                )}

                <h2 className="text-xl sm:text-3xl md:text-4xl font-black text-white leading-snug tracking-tight">
                  {slider.title}
                </h2>

                {slider.subtitle && (
                  <p className="text-xs sm:text-sm md:text-base text-slate-200 leading-relaxed font-normal">
                    {slider.subtitle}
                  </p>
                )}

                <div className="pt-2">
                  <Link
                    href={slider.link || "/courses"}
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white hover:bg-slate-100 text-[#123D3A] font-black text-xs sm:text-sm shadow-lg transition active:scale-95"
                  >
                    <span>{slider.buttonText || "استكشف الفرصة"}</span>
                    <ArrowLeft className="w-4 h-4 text-[#D58A38]" />
                  </Link>
                </div>
              </div>
            </div>
          );
        })}

        {/* Navigation Arrows (if more than 1 slider) */}
        {sliders.length > 1 && (
          <>
            <button
              onClick={nextSlide}
              aria-label="Next slide"
              className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-md flex items-center justify-center transition border border-white/20 active:scale-90"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <button
              onClick={prevSlide}
              aria-label="Previous slide"
              className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-md flex items-center justify-center transition border border-white/20 active:scale-90"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* Dots Indicator */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
              {sliders.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    i === current ? "w-7 bg-[#D58A38]" : "w-2 bg-white/50 hover:bg-white"
                  }`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
