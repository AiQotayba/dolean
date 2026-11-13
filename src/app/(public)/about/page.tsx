import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import {
  Compass,
  ArrowLeft,
  Search,
  Ear,
  Eye,
  Target,
  Users2,
  HeartHandshake,
  Lock,
  Sparkles,
  Building2,
  HelpCircle,
  FileCheck2,
} from 'lucide-react';
import Logo from '@/components/theme/Logo';

export const metadata: Metadata = {
  title: 'من نحن | منصة تلاقي',
  description:
    'تعرف على منصة تلاقي: مبادرة رقمية تجمع الفرص التدريبية والتعليمية في مكان واحد، وتسهل على الشباب اكتشاف المهارات والتواصل مع الجهات والمدربين المشاركين.',
};

export default function AboutPage() {
  return (
    <div className="w-full flex flex-col items-center text-right text-slate-900 bg-white" dir="rtl">
      {/* 1. Hero: Product Identity & Focus */}
      <section className="w-full relative overflow-hidden bg-[#123D3A] text-white pt-16 pb-20 px-4 sm:px-6">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#D58A38]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-80 h-80 bg-[#A9B5B0]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto relative z-10 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#D58A38]/20 text-amber-300 border border-[#D58A38]/40 text-xs font-black mx-auto">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>منصة بناء المهارات والفرص</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#F8F8F5] tracking-tight leading-tight max-w-3xl mx-auto">
            تلاقي.. مساحة تجمع فرص التعلم وتقرّب المسافة نحو مهاراتك القادمة
          </h1>

          <p className="text-base sm:text-lg text-[#A9B5B0] leading-relaxed max-w-2xl mx-auto font-normal">
            مبادرة رقمية انطلقت لمعالجة تشتت الفرص التدريبية والتعليمية، ومساعدة الشباب على اكتشاف ما يناسب طموحاتهم، والتواصل الفاعل مع الجهات والمدربين المشاركين.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              href="/how-it-works"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-[#D58A38] hover:bg-[#BE772B] text-white font-black text-sm shadow-xl shadow-[#D58A38]/30 transition active:scale-95"
            >
              <HelpCircle className="w-4 h-4" />
              <span>كيف تستفيد من تلاقي؟</span>
            </Link>

            <Link
              href="/courses"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-bold text-sm border border-white/20 transition"
            >
              <Compass className="w-4 h-4 text-amber-300" />
              <span>استكشف التدريبات</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Main Container */}
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-16 space-y-16">
        
        {/* 2. What Is Talaqi & The Problem (التعريف بالمنتج والمشكلة) */}
        <section className="space-y-4">
          <div className="space-y-1">
            <span className="text-xs font-black text-[#D58A38] uppercase tracking-wider">
              المشكلة والحل
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#123D3A]">
              ما هي منصة «تلاقي»؟
            </h2>
          </div>

          <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-9 shadow-xs space-y-5 text-sm sm:text-base text-slate-700 leading-relaxed">
            <p>
              «تلاقي» هي <strong>مساحة رقمية تفاعلية</strong> صُممت لتسهيل الوصول إلى التدريبات والبرامج التعليمية في المنطقة. نعمل كحلقة وصل تجمع الفرص المتاحة في مكان واحد، وتساعد المتعلمين على استكشاف المجالات التي تهمهم والتعبير عن احتياجاتهم التدريبية.
            </p>
            <p>
              انطلقت الفكرة استجابة لحالة التشتت التي يواجهها الشباب؛ حيث تتوزع الإعلانات على عشرات المجموعات والصفحات، مما يجعل متابعة التدريبات أمراً مرهقاً. وفي المقابل، تسعى المراكز والجهات التعليمية والمدربون للوصول إلى الأشخاص المهتمين فعلاً بما يقدمونه.
            </p>
            <div className="p-4 rounded-2xl bg-[#F8F8F5] border border-slate-200/80 font-medium text-slate-800 text-xs sm:text-sm">
              دورنا هو <strong>تبسيط هذه التجربة</strong>: مساعدة المتعلم في الوصول إلى فرصة تناسبه بوضوح، ومساعدة الجهات التدريبية على إيصال برامجها لمن يبحث عنها.
            </div>
          </div>
        </section>

        {/* 3. Vision & Mission (الرؤية والرسالة) */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Vision */}
          <div className="bg-[#F8F8F5] border border-slate-200/90 rounded-3xl p-6 sm:p-8 space-y-3">
            <div className="w-11 h-11 rounded-2xl bg-[#123D3A] text-white flex items-center justify-center">
              <Eye className="w-5 h-5 text-amber-300" />
            </div>
            <h3 className="text-lg font-black text-[#123D3A]">رؤيتنا</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
              أن تصبح «تلاقي» الوجهة الأولى لاكتشاف فرص التعلم وتطوير المهارات، وبيئة تربط بين من يريد أن يتعلم والجهات القادرة على تقديم التدريب بأسهل وسيلة ممكنة.
            </p>
          </div>

          {/* Mission */}
          <div className="bg-[#F8F8F5] border border-slate-200/90 rounded-3xl p-6 sm:p-8 space-y-3">
            <div className="w-11 h-11 rounded-2xl bg-[#D58A38] text-white flex items-center justify-center">
              <Target className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-black text-[#123D3A]">رسالتنا</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
              جعل الوصول إلى التدريب أكثر وضوحاً وسهولة، والاستماع إلى احتياجات المتعلمين ومشاركتها مع الجهات والمدربين للمساهمة في توفير فرص تدريبية تلبي متطلبات الشباب الفعلية.
            </p>
          </div>
        </section>

        {/* 4. Core Values (المبادئ التي توجه عملنا) */}
        <section className="space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-black text-[#D58A38] uppercase tracking-wider">
              المبادئ والتوجهات
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#123D3A]">
              ما الذي نؤمن به؟
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              الأسس التي نبني عليها تجربة المنصة وتطويرها المستمر
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Value 1 */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-2xs space-y-2.5">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-[#D58A38] flex items-center justify-center font-bold">
                <Ear className="w-5 h-5" />
              </div>
              <h3 className="text-base font-black text-slate-900">الاستماع للاحتياجات</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                نبدأ من معرفة ما يحتاجه المتعلمون فعلاً، ونتيح لهم التعبير عما يرغبون في تعلمه لاستكشاف إمكانية توفيره مع الشركاء.
              </p>
            </div>

            {/* Value 2 */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-2xs space-y-2.5">
              <div className="w-10 h-10 rounded-2xl bg-[#123D3A]/10 text-[#123D3A] flex items-center justify-center font-bold">
                <Search className="w-5 h-5" />
              </div>
              <h3 className="text-base font-black text-slate-900">تسهيل الوصول</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                نؤمن أن التعلم وتطوير المهارات يجب ألا يكونا معقدين؛ نجمع الفرص في مكان واحد لنوفر وقت وجهد البحث.
              </p>
            </div>

            {/* Value 3 */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-2xs space-y-2.5">
              <div className="w-10 h-10 rounded-2xl bg-teal-500/10 text-teal-700 flex items-center justify-center font-bold">
                <FileCheck2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-black text-slate-900">الوضوح والشفافية</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                نحرص على عرض المعلومات الأساسية لكل تدريب: المحتوى، المدة، المكان، والرسوم إن وجدت، حتى يختار المستخدم بوعي.
              </p>
            </div>

            {/* Value 4 */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-2xs space-y-2.5">
              <div className="w-10 h-10 rounded-2xl bg-blue-500/10 text-blue-700 flex items-center justify-center font-bold">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <h3 className="text-base font-black text-slate-900">التعاون والشراكة</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                نؤمن أن فتح آفاق أوسع للتعلم يحتاج إلى تعاون مستمر بين المتعلمين والمراكز والمدربين المشاركين.
              </p>
            </div>
          </div>
        </section>

        {/* 5. The Team (فريق المنصة) */}
        <section className="bg-gradient-to-br from-[#123D3A]/5 to-[#D58A38]/10 rounded-3xl p-6 sm:p-9 border border-slate-200/90 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#123D3A] text-white flex items-center justify-center">
              <Users2 className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h3 className="text-lg font-black text-[#123D3A]">
                من يقف وراء «تلاقي»؟
              </h3>
              <p className="text-xs text-slate-500">
                فريق شغوف بالتقنية وتطوير المهارات
              </p>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
            يقف خلف المنصة فريق يجمع بين مهارات التطوير التقني، وتصميم تجربة المستخدم، والاهتمام بتطوير التعليم والمهارات في مجتمعنا. نعمل باستمرار على اختبار أفكار جديدة، والاستماع لآراء المستخدمين، وتطوير المنصة لتصبح أكثر فائدة وقرباً من احتياجات الجميع.
          </p>
        </section>

        {/* 6. Call to Trainers and Centers (دعوة للجهات والمدربين) */}
        <section className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xs">
          <div className="space-y-1.5 text-right">
            <h3 className="text-base font-black text-[#123D3A]">
              هل تقدم تدريبات أو برامج تعليمية؟
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-xl">
              نرحب بالتعاون مع المراكز والمدربين المشاركين للوصول إلى المهتمين بما تقدمونه من برامج ومشاركتها مع المجتمع.
            </p>
          </div>

          <Link
            href="/share"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#123D3A] hover:bg-[#1b4e4a] text-white text-xs sm:text-sm font-black transition shadow-sm shrink-0 active:scale-95"
          >
            <Building2 className="w-4 h-4 text-amber-300" />
            <span>شارك تدريباتك معنا</span>
          </Link>
        </section>

      </div>

      {/* 7. Bottom Navigation & Next Step */}
      <section className="w-full py-16 px-4 sm:px-6 bg-[#123D3A] text-white mt-4">
        <div className="max-w-4xl mx-auto text-center space-y-5">
          <div className="flex justify-center mb-2">
            <Logo size="lg" theme="dark" />
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white">
            مستعد للبدء؟
          </h2>

          <p className="text-sm sm:text-base text-amber-200/90 font-medium max-w-lg mx-auto leading-relaxed">
            تعرّف على كيفية الاستفادة من المنصة، أو ابدأ مباشرة باستكشاف التدريبات المتاحة.
          </p>

          <div className="pt-3 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/how-it-works"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-[#D58A38] hover:bg-[#BE772B] text-white font-black text-sm shadow-xl transition active:scale-95"
            >
              <HelpCircle className="w-4 h-4" />
              <span>كيف تستفيد من تلاقي؟</span>
            </Link>

            <Link
              href="/courses"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm border border-white/20 transition"
            >
              <Compass className="w-4 h-4 text-amber-300" />
              <span>استكشف التدريبات المتاحة</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
