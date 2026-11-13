import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import {
  Compass,
  ArrowLeft,
  Sparkles,
  Search,
  FileText,
  CheckCircle2,
  HelpCircle,
  Building2,
  Share2,
} from 'lucide-react';
import Logo from '@/components/theme/Logo';

export const metadata: Metadata = {
  title: 'كيف تستفيد من تلاقي؟ | منصة تلاقي',
  description:
    'تعرف على كيفية الاستفادة من منصة تلاقي: اكتشف التدريبات والبرامج التعليمية، تعرّف على التفاصيل، قدّم طلب تدريب غير متوفر، وشارك فرصك التدريبية.',
};

export default function HowToBenefitPage() {
  return (
    <div className="w-full flex flex-col items-center text-right text-slate-900 bg-white" dir="rtl">
      {/* 1. Hero Section */}
      <section className="w-full relative overflow-hidden bg-[#123D3A] text-white pt-16 pb-20 px-4 sm:px-6">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#D58A38]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-80 h-80 bg-[#A9B5B0]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto relative z-10 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#D58A38]/20 text-amber-300 border border-[#D58A38]/40 text-xs font-black mx-auto">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>تجربة المستخدم في تلاقي</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#F8F8F5] tracking-tight leading-tight max-w-3xl mx-auto">
            كيف تستفيد من تلاقي؟
          </h1>

          <p className="text-lg sm:text-xl text-amber-200/90 font-bold max-w-2xl mx-auto leading-relaxed">
            فرص التعلم أقرب مما تتوقع!
          </p>

          <p className="text-sm sm:text-base text-[#A9B5B0] leading-relaxed max-w-2xl mx-auto font-normal">
            تلاقي مساحة تساعدك على اكتشاف الفرص التدريبية والتعليمية، والتعرف على البرامج التي تناسب اهتماماتك، والتعبير عن المهارات التي ترغب في تعلمها.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              href="/courses"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-[#D58A38] hover:bg-[#BE772B] text-white font-black text-sm shadow-xl shadow-[#D58A38]/30 transition active:scale-95"
            >
              <Compass className="w-4 h-4" />
              <span>اكتشف التدريبات</span>
            </Link>

            <Link
              href="/apply"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-bold text-sm border border-white/20 transition"
            >
              <span>اطلب تدريباً</span>
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Main Four Parts Container */}
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-16 space-y-12">
        
        {/* Intro Banner */}
        <div className="bg-[#F8F8F5] rounded-3xl p-6 sm:p-8 border border-slate-200/80 text-sm sm:text-base text-slate-700 leading-relaxed font-medium">
          سواء كنت تبحث عن تدريب محدد، أو ترغب في اكتشاف مجال جديد، يمكنك البدء من هنا بخطوات بسيطة وواضحة.
        </div>

        {/* 1. Discover Opportunities */}
        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col md:flex-row items-start gap-6">
          <div className="w-12 h-12 rounded-2xl bg-[#123D3A] text-white flex items-center justify-center shrink-0">
            <Search className="w-6 h-6 text-amber-300" />
          </div>
          <div className="space-y-2 flex-1">
            <span className="text-xs font-black text-[#D58A38] uppercase tracking-wider">
              الخطوة الأولى
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-[#123D3A]">
              1. اكتشف الفرص
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              تصفح التدريبات والبرامج التعليمية المنشورة على المنصة، واستكشف مجالات متنوعة تساعدك على تطوير مهاراتك ومعرفتك.
            </p>
            <div className="pt-2">
              <Link
                href="/courses"
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#D58A38] hover:underline"
              >
                <span>تصفح التدريبات والبرامج المتاحة الآن</span>
                <ArrowLeft className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* 2. Learn the Details */}
        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col md:flex-row items-start gap-6">
          <div className="w-12 h-12 rounded-2xl bg-[#D58A38] text-white flex items-center justify-center shrink-0">
            <FileText className="w-6 h-6" />
          </div>
          <div className="space-y-2 flex-1">
            <span className="text-xs font-black text-[#D58A38] uppercase tracking-wider">
              الخطوة الثانية
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-[#123D3A]">
              2. تعرّف على التفاصيل
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              اطّلع على تفاصيل كل تدريب، وتعرّف على محتواه والجهة المنظمة والمدة والمكان والتكلفة، حتى تتمكن من اختيار ما يناسبك بكل وضوح.
            </p>
          </div>
        </div>

        {/* 3. Choose Your Opportunity */}
        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col md:flex-row items-start gap-6">
          <div className="w-12 h-12 rounded-2xl bg-teal-800 text-white flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6 text-amber-300" />
          </div>
          <div className="space-y-2 flex-1">
            <span className="text-xs font-black text-[#D58A38] uppercase tracking-wider">
              الخطوة الثالثة
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-[#123D3A]">
              3. اختر فرصتك
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              عندما تجد التدريب المناسب، انتقل إلى تفاصيل التسجيل واتبع الخطوات الموضحة للتقديم مباشرة.
            </p>
          </div>
        </div>

        {/* 4. Didn't Find What You Need? */}
        <div className="bg-[#F8F8F5] border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col md:flex-row items-start gap-6">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-[#D58A38] flex items-center justify-center shrink-0 border border-amber-500/20">
            <HelpCircle className="w-6 h-6" />
          </div>
          <div className="space-y-3 flex-1">
            <span className="text-xs font-black text-[#D58A38] uppercase tracking-wider">
              صوتك واحتياجك
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-[#123D3A]">
              4. لم تجد ما تبحث عنه؟
            </h2>
            <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
              ربما تكون المهارة التي ترغب في تعلمها غير موجودة ضمن التدريبات المعروضة حالياً.
            </p>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              لا بأس! يمكنك إخبارنا بما تريد تعلمه من خلال تقديم طلب تدريبي. تساعدنا طلباتكم على فهم اهتماماتكم والاحتياجات التدريبية المختلفة، واستكشاف فرص تلبي هذه الاحتياجات.
            </p>
            <div className="pt-2">
              <Link
                href="/apply"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#D58A38] hover:bg-[#BE772B] text-white text-xs sm:text-sm font-black transition active:scale-95 shadow-sm"
              >
                <span>أخبرنا بما تريد تعلمه</span>
                <ArrowLeft className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Callout for Trainers & Centers */}
        <section className="bg-gradient-to-br from-[#123D3A]/5 to-[#D58A38]/10 rounded-3xl p-6 sm:p-8 border border-slate-200/90 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#123D3A] text-white flex items-center justify-center shrink-0">
              <Building2 className="w-5 h-5 text-amber-300" />
            </div>
            <h3 className="text-lg sm:text-xl font-black text-[#123D3A]">
              هل أنت مدرب أو تمتلك مركزاً تدريبياً؟
            </h3>
          </div>

          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
            يمكنك مشاركة التدريبات والبرامج التعليمية التي تقدمها، والتواصل معنا لاستكشاف فرص الوصول إلى المهتمين بها. نؤمن أن مشاركة المعرفة والخبرات تفتح المجال أمام فرص تعلم جديدة.
          </p>

          <div className="pt-1">
            <Link
              href="/share"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#123D3A] hover:bg-[#1a4f4b] text-white text-xs sm:text-sm font-black transition active:scale-95"
            >
              <Share2 className="w-4 h-4 text-amber-300" />
              <span>مشاركة تدريب أو برنامج</span>
            </Link>
          </div>
        </section>

      </div>

      {/* 5. Bottom Action Bar (ابدأ من هنا) */}
      <section className="w-full py-16 px-4 sm:px-6 bg-[#123D3A] text-white mt-4">
        <div className="max-w-4xl mx-auto text-center space-y-5">
          <div className="flex justify-center mb-2">
            <Logo size="lg" theme="dark" />
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white">
            ابدأ من هنا
          </h2>

          <p className="text-sm sm:text-base text-amber-200/90 font-medium max-w-lg mx-auto leading-relaxed">
            المهارة التي تريد تعلمها قد تكون بداية لفرصة جديدة.
          </p>

          <p className="text-xs sm:text-sm text-[#A9B5B0] max-w-md mx-auto">
            اكتشف التدريبات، أو أخبرنا بما ترغب في تعلمه.
          </p>

          <div className="pt-3 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/courses"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-[#D58A38] hover:bg-[#BE772B] text-white font-black text-sm shadow-xl transition active:scale-95"
            >
              <Compass className="w-4 h-4" />
              <span>اكتشف التدريبات</span>
            </Link>

            <Link
              href="/apply"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm border border-white/20 transition"
            >
              <span>اطلب تدريباً</span>
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
