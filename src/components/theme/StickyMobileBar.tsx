"use client";

import React, { useState, useEffect } from 'react';
import { ArrowLeft, Sparkles } from 'lucide-react';

export default function StickyMobileBar() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let heroFormVisible = false;

    // Check intersection with quick-request-card
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        heroFormVisible = entry.isIntersecting;
        updateVisibility();
      },
      { threshold: 0.1 }
    );

    const formEl = document.getElementById('quick-request-card');
    if (formEl) {
      observer.observe(formEl);
    }

    const handleScroll = () => {
      updateVisibility();
    };

    const updateVisibility = () => {
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;

      // Show if scrolled more than 20% and hero form is NOT in viewport
      if (scrollPercent > 20 && !heroFormVisible) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    updateVisibility();

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const input = document.getElementById('course-input');
    const formCard = document.getElementById('quick-request-card');
    if (formCard) {
      formCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setTimeout(() => {
        if (input) input.focus();
      }, 400);
    }
  };

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-40 p-3 sm:hidden transition-all duration-300 ease-in-out ${
        isVisible
          ? 'translate-y-0 opacity-100 pointer-events-auto'
          : 'translate-y-full opacity-0 pointer-events-none'
      }`}
    >
      <div className="bg-[#123D3A]/95 backdrop-blur-md rounded-2xl p-2 border border-[#D58A38]/40 shadow-2xl shadow-black/40">
        <button
          type="button"
          onClick={handleClick}
          className="w-full py-3 px-4 rounded-xl bg-[#D58A38] hover:bg-[#BE772B] active:scale-98 text-white font-black text-sm shadow-lg shadow-[#D58A38]/30 transition flex items-center justify-between cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
            <span>اطلب دورتك مجاناً</span>
          </div>
          <div className="flex items-center gap-1 text-xs">
            <span>بدقيقة واحدة</span>
            <ArrowLeft className="w-4 h-4" />
          </div>
        </button>
      </div>
    </div>
  );
}
