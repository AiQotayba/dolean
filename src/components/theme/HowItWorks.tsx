import React from 'react';
import { Search, Building2, BellRing, ArrowLeft, Zap } from 'lucide-react';

export default function HowItWorks() {
  const steps = [
    {
      num: '1',
      title: 'قلّنا شو بدك',
      desc: 'اكتب المهارة، وهذا كل شيء.',
      iconBg: 'bg-[#123D3A] text-white shadow-lg shadow-[#123D3A]/20',
      cardBorder: 'border-[#123D3A]/20 hover:border-[#123D3A]',
      icon: <Search className="w-5 h-5" />,
    },
    {
      num: '2',
      title: 'نلاقي لك المكان',
      desc: 'نطابق طلبك مع جداول المراكز المعتمدة ونختار الأنسب.',
      iconBg: 'bg-[#D58A38] text-white shadow-lg shadow-[#D58A38]/25',
      cardBorder: 'border-[#D58A38]/30 hover:border-[#D58A38]',
      icon: <Building2 className="w-5 h-5" />,
    },
    {
      num: '3',
      title: 'تصلك الرسالة',
      desc: 'تفاصيل الدورة والمدرب ورابط التسجيل على واتساب، وأنت تقرر.',
      iconBg: 'bg-[#206C63] text-white shadow-lg shadow-[#206C63]/20',
      cardBorder: 'border-[#206C63]/20 hover:border-[#206C63]',
      icon: <BellRing className="w-5 h-5" />,
    },
  ];

  return (
    <section className="w-full py-16 px-4 sm:px-6 bg-[#F8F8F5] border-b border-[#A9B5B0]/30" id="how-it-works">
      <div className="max-w-6xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-black text-[#123D3A] tracking-tight">
            من الفكرة للمقعد التدريبي بثلاث خطوات
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
            بلا بحث بين الإعلانات، ولا مجموعات واتساب بلا نهاية.
          </p>
        </div>

        {/* 3 Step Cards without clutter */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((s, idx) => (
            <div
              key={idx}
              className={`rounded-3xl border ${s.cardBorder} bg-white p-6 sm:p-7 flex flex-col justify-between text-right relative overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 group`}
            >
              {/* Header with Icon and Clean Number */}
              <div className="flex items-center justify-between w-full mb-5">
                <div className={`w-11 h-11 rounded-2xl ${s.iconBg} flex items-center justify-center group-hover:scale-105 transition-transform`}>
                  {s.icon}
                </div>
                <span className="text-3xl font-black text-slate-300 tracking-tighter">
                  0{s.num}
                </span>
              </div>

              {/* Step Content */}
              <div>
                <h3 className="text-lg font-black text-[#123D3A] mb-2">
                  {s.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                  {s.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Closing CTA */}
        <div className="text-center mt-10">
          <a
            href="#quick-request-card"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-[#D58A38] hover:bg-[#BE772B] text-white font-black text-sm shadow-lg shadow-[#D58A38]/25 transition active:scale-95"
          >
            <Zap className="w-4 h-4 fill-white" />
            <span>جرّب الآن، يأخذ دقيقة</span>
            <ArrowLeft className="w-4 h-4" />
          </a>
        </div>

      </div>
    </section>
  );
}
