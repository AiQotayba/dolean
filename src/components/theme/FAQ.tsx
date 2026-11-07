"use client";

import React, { useState } from "react";
import { ChevronDown, HelpCircle, MessageCircle } from "lucide-react";

interface Props {
  path?: string;
}

export default function FAQAccordion({ path = "/" }: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="w-full py-12 px-4 sm:px-6 max-w-4xl mx-auto" id="faq">
      <div className="bg-white rounded-3xl border border-[#A9B5B0]/30 shadow-xs p-6 sm:p-8">
        <div className="flex items-center gap-2 pb-4 mb-5 border-b border-[#A9B5B0]/20">
          <HelpCircle className="w-5 h-5 text-[#D58A38]" />
          <h2 className="text-xl sm:text-2xl font-black text-[#123D3A]">
            الأسئلة الشائعة
          </h2>
        </div>

        <div className="space-y-3">
          {faqItems.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="rounded-2xl border border-[#A9B5B0]/30 bg-[#F8F8F5]/70 overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => toggle(index)}
                  className="w-full py-4 px-5 flex items-center justify-between text-right gap-3 cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <span className="text-sm font-bold text-[#123D3A]">
                    {item.question}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-[#A9B5B0] shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180 text-[#D58A38]" : ""
                      }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-4 text-xs sm:text-sm text-slate-700 leading-relaxed border-t border-slate-200/60 pt-3">
                    <p>{item.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* WhatsApp Support CTA */}
        <div className="mt-8 pt-6 border-t border-[#A9B5B0]/20 flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#F8F8F5] p-4 rounded-2xl">
          <span className="text-xs sm:text-sm font-bold text-slate-700">
            ما لقيت جواباً لسؤالك؟
          </span>
          <a
            href="https://wa.me/963945036513?text=%D9%85%D8%B1%D8%AD%D8%A8%D8%A7%D9%8B%20%D9%85%D9%86%D8%B5%D8%A9%20%D8%AA%D9%84%D8%A7%D9%82%D9%8A%D8%8C%20%D9%84%D8%AF%D9%8A%20%D8%A7%D8%B3%D8%AA%D9%81%D8%B3%D8%A7%D8%B1"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#206C63] hover:bg-[#184E4A] text-white text-xs sm:text-sm font-bold transition shadow-xs active:scale-95 shrink-0"
          >
            <MessageCircle className="w-4 h-4" />
            <span>اسألنا على واتساب</span>
          </a>
        </div>
      </div>
    </section>
  );
}

const faqItems = [
  {
    question: "هل الخدمة مجانية فعلاً؟",
    answer: "نعم، للطلاب مجانية بالكامل. المراكز هي التي تتعاون معنا.",
  },
  {
    question: "كيف أعرف بالدورات المناسبة لي؟",
    answer: "نرسل لك رسالة على واتساب فور تطابق طلبك مع دورة متاحة.",
  },
  {
    question: "هل أحصل على شهادة؟",
    answer: "نعم، تمنحها الجهة المنظمة للدورة. تفاصيل الشهادة تظهر في صفحة كل دورة.",
  },
  {
    question: "ماذا لو ما لقيت الدورة اللي بدي إياها؟",
    answer: "اطلبها. كلما زاد عدد الطلبات على مهارة، زادت فرصة أن يفتحها أحد المراكز.",
  },
  {
    question: "كيف ينضم مركزنا؟",
    answer: "من «بوابة المراكز»: تعبئ نموذجاً قصيراً ونتواصل معك خلال 24 ساعة.",
  },
  {
    question: "هل بياناتي بأمان؟",
    answer: "نستخدم رقمك لغرض واحد فقط: إرسال تفاصيل دورتك.",
  },
];
