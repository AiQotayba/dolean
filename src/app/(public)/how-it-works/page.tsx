import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import {
  Compass,
  ArrowLeft,
  Sparkles,
  Search,
  CheckCircle,
  ClipboardEdit,
  GraduationCap,
  HelpCircle,
  Building2,
  ChevronDown,
  MessageCircle,
  Share2,
  CheckCircle2,
  AlertCircle,
  FileCheck,
} from 'lucide-react';
import Logo from '@/components/theme/Logo';

export const metadata: Metadata = {
  title: 'كيف نعمل؟ | دليل المنصة الإجرائي | تلاقي',
  description:
    'دليل تفصيلي يوضح آلية عمل منصة تلاقي: خطوات التسجيل في التدريبات، طريقة طلب مهارات جديدة غير معروضة، وشروط نشر البرامج للمراكز والمدربين.',
};

export default function HowItWorksPage() {
  const faqs = [
    {
      q: 'هل جميع التدريبات المعروضة على المنصة مجانية؟',
      a: 'تختلف التدريبات باختلاف الجهة المنظمة؛ فبعضها مجاني تماماً (منح من منظمات ومؤسسات)، وبعضها برسوم تحددها المراكز والمعاهد الخاصة. نلتزم دائماً بتوضيح حالة التكلفة في صفحة تفاصيل كل تدريب بكل شفافية.',
    },
    {
      q: 'هل يمكنني طلب تدريب غير موجود حالياً في الموقع؟',
      a: 'نعم بالتأكيد؛ يمكنك تقديم طلب عبر صفحة «اطلب تدريباً» وتحديد المهارة أو المجال الذي ترغب في تعلمه ومستواك الحالي.',
    },
    {
      q: 'هل تضمن لي المنصة توفير التدريب الذي أطلبه؟',
      a: 'لا يمكننا تقديم ضمان حتمي بتوفير كل تدريب يُطلب؛ لأن إطلاق البرامج يرتبط بإمكانات المراكز والمدربين واكتمال النصاب المطلوب. ولكن طلبك يُسجل مباشرة ويُستخدم للبحث عن فرصة أو حث المراكز على افتتاح الدورة، ونقوم بإشعارك فور توفرها.',
    },
    {
      q: 'هل التدريبات حضورية أم عبر الإنترنت؟',
      a: 'تتوفر تدريبات حضورية في مدن وبلدات الشمال السوري، بالإضافة إلى تدريبات افتراضية عن بُعد. يُحدَّد نمط التدريب والموقع الجغرافي بوضوح داخل إعلان كل دورة.',
    },
    {
      q: 'كيف يمكن لمركز تدريبي أو مدرب نشر دوراته عبر المنصة؟',
      a: 'يمكن ملء استمارة «شارك تدريباً»، ليقوم فريق المنصة بمراجعة البيانات والتأكد من وضوح الشروط، ثم نشرها للمهتمين وتوجيه الراغبين إلى استمارة التسجيل الرسمية الخاصة بكم.',
    },
    {
      q: 'هل يمكنني التسجيل في أكثر من تدريب في الوقت ذاته؟',
      a: 'نعم، بإمكانك التقديم على أي تدريب يناسب جدولك واهتماماتك، مع مراعاة شروط القبول وأوقات الدوام المحددة من الجهة المنظمة.',
    },
  ];

  return (
    <div className="w-full flex flex-col items-center text-right text-slate-900 bg-white" dir="rtl">
      {/* 1. Hero: Operational Guide & How To Use */}
      <section className="w-full relative overflow-hidden bg-[#123D3A] text-white pt-16 pb-20 px-4 sm:px-6">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#D58A38]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-80 h-80 bg-[#A9B5B0]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto relative z-10 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#D58A38]/20 text-amber-300 border border-[#D58A38]/40 text-xs font-black mx-auto">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>الدليل الإجرائي والعمليات</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#F8F8F5] tracking-tight leading-tight max-w-3xl mx-auto">
            كيف تعمل منصة «تلاقي»؟
          </h1>

          <p className="text-base sm:text-lg text-[#A9B5B0] leading-relaxed max-w-2xl mx-auto font-normal">
            دليل إجرائي عملي يوضح خطوة بخطوة: مسار المتعلم للوصول إلى مقعده التدريبي، آلية معالجة طلبات المهارات غير المتوفرة، وكيفية نشر البرامج للمراكز والمدربين.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <a
              href="#learners-track"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-[#D58A38] hover:bg-[#BE772B] text-white font-black text-xs sm:text-sm shadow-xl shadow-[#D58A38]/30 transition active:scale-95"
            >
              <span>مسار الحصول على تدريب</span>
            </a>

            <a
              href="#custom-request-track"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs sm:text-sm border border-white/20 transition"
            >
              <span>طلب تدريب غير موجود</span>
            </a>

            <a
              href="#centers-track"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs sm:text-sm border border-white/20 transition"
            >
              <span>بوابة المراكز والمدربين</span>
            </a>
          </div>
        </div>
      </section>

      {/* Main Content Body */}
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-16 space-y-16">

        {/* Section 1: Learners Journey (مسار المتعلم) */}
        <section id="learners-track" className="space-y-6 scroll-mt-24">
          <div className="space-y-2 border-b border-slate-200/80 pb-4">
            <span className="text-xs font-black text-[#D58A38] uppercase tracking-wider">
              المسار الأول • للباحثين عن مهارة
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#123D3A]">
              أولاً: رحلة الحصول على تدريب متاح
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              أربع خطوات بسيطة تفصلك عن الالتحاق بدورتك التدريبية
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Step 1 */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-2xl bg-[#123D3A] text-white flex items-center justify-center font-bold">
                  <Search className="w-5 h-5 text-amber-300" />
                </div>
                <span className="text-xs font-mono font-black text-slate-300 text-lg">01</span>
              </div>
              <h3 className="text-base font-black text-slate-900">1. اكتشف وتصفح</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                استعرض الدورات والمنح المنشورة في المنصة، واستخدم فلاتر البحث حسب التخصص، المنطقة الجغرافية، أو نمط الدوام (حضوري / عن بُعد).
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-2xl bg-[#D58A38] text-white flex items-center justify-center font-bold">
                  <ClipboardEdit className="w-5 h-5" />
                </div>
                <span className="text-xs font-mono font-black text-slate-300 text-lg">02</span>
              </div>
              <h3 className="text-base font-black text-slate-900">2. راجع الشروط والمحتوى</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                تعرّف على كافة التفاصيل: محاور البرنامج، مدة الساعات التدريبية، مواعيد المحاضرات، مكان المركز، والرسوم إن وجدت.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-2xl bg-teal-800 text-white flex items-center justify-center font-bold">
                  <CheckCircle className="w-5 h-5 text-amber-300" />
                </div>
                <span className="text-xs font-mono font-black text-slate-300 text-lg">03</span>
              </div>
              <h3 className="text-base font-black text-slate-900">3. قدّم طلب التسجيل</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                اضغط على زر التسجيل ليتم توجيهك مباشرة وبلا وسيط إلى استمارة التقديم الرسمية المعتمدة لدى الجهة المنظمة للتدريب.
              </p>
            </div>

            {/* Step 4 */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-2xl bg-emerald-800 text-white flex items-center justify-center font-bold">
                  <GraduationCap className="w-5 h-5 text-amber-300" />
                </div>
                <span className="text-xs font-mono font-black text-slate-300 text-lg">04</span>
              </div>
              <h3 className="text-base font-black text-slate-900">4. تأكيد القبول والبدء</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                تقوم الجهة المنظمة بمراجعة طلبك وإشعارك بالقبول والتعليمات اللوجستية لتبدأ رحلتك التعليمية وتطوير مهاراتك.
              </p>
            </div>
          </div>

          <div className="pt-2">
            <Link
              href="/courses"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#123D3A] hover:bg-[#1a4f4b] text-white text-xs sm:text-sm font-black transition active:scale-95"
            >
              <Compass className="w-4 h-4 text-amber-300" />
              <span>تصفح التدريبات المفتوحة الآن</span>
            </Link>
          </div>
        </section>

        {/* Section 2: Missing Course Request (مسار طلب مهارة غير متوفرة) */}
        <section id="custom-request-track" className="space-y-6 scroll-mt-24">
          <div className="space-y-2 border-b border-slate-200/80 pb-4">
            <span className="text-xs font-black text-[#D58A38] uppercase tracking-wider">
              المسار الثاني • الاستماع للاحتياج
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#123D3A]">
              ثانياً: لم تجد التدريب الذي تبحث عنه؟
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              آلية رصد الاحتياج التدريبي غير المعروض ومشاركته مع الجهات القادرة على تنفيذه
            </p>
          </div>

          <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-9 shadow-xs space-y-6">
            <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
              ليس من الضروري أن تجد كل ما تبحث عنه ضمن الإعلانات الحالية. يمكنك تسجيل ما تحتاجه، لنقوم بفهم الطلب والعمل على بحث إمكانية توفيره بالتعاون مع المراكز والمدربين.
            </p>

            {/* Step-by-step breakdown */}
            <div className="space-y-4">
              <h4 className="text-sm font-black text-[#123D3A]">
                المسار الإجرائي لمعالجة طلبك:
              </h4>

              <div className="space-y-3 text-xs sm:text-sm text-slate-700">
                <div className="flex items-start gap-3 p-3.5 bg-[#F8F8F5] rounded-2xl border border-slate-200/70">
                  <span className="w-6 h-6 rounded-full bg-[#123D3A] text-white flex items-center justify-center text-xs font-black shrink-0 mt-0.5">1</span>
                  <div>
                    <strong className="text-slate-900 block mb-0.5">تسجيل الاحتياج والمهارة:</strong>
                    تحدد التخصص أو المهارة الدقيقة التي تحتاجها، مستواك الحالي، والنمط المفضل (حضوري في مدينتك أو أونلاين).
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 bg-[#F8F8F5] rounded-2xl border border-slate-200/70">
                  <span className="w-6 h-6 rounded-full bg-[#123D3A] text-white flex items-center justify-center text-xs font-black shrink-0 mt-0.5">2</span>
                  <div>
                    <strong className="text-slate-900 block mb-0.5">تصنيف وتحليل الطلبات المشابهة:</strong>
                    يراجع فريقنا الطلبات دورياً لتحديد الاحتياجات الأكثر إلحاحاً والتي تشهد طلباً مشتركاً من عدة شباب.
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 bg-[#F8F8F5] rounded-2xl border border-slate-200/70">
                  <span className="w-6 h-6 rounded-full bg-[#123D3A] text-white flex items-center justify-center text-xs font-black shrink-0 mt-0.5">3</span>
                  <div>
                    <strong className="text-slate-900 block mb-0.5">التنسيق مع شبكة المراكز والمدربين:</strong>
                    نعرض مؤشرات الاحتياج على المراكز والمدربين المعتمدين لتشجيعهم على إدراج هذه التدريبات ضمن خططهم القادمة.
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 bg-[#F8F8F5] rounded-2xl border border-slate-200/70">
                  <span className="w-6 h-6 rounded-full bg-[#123D3A] text-white flex items-center justify-center text-xs font-black shrink-0 mt-0.5">4</span>
                  <div>
                    <strong className="text-slate-900 block mb-0.5">الإشعار المباشر فور توفر مقعد:</strong>
                    عند افتتاح أي دورة تطابق رغبتك وموقعك، نرسل إليك رابط التقديم ومعلومات الدورة مباشرة.
                  </div>
                </div>
              </div>
            </div>

            {/* Transparency Note */}
            <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/80 text-xs sm:text-sm text-amber-950 font-bold leading-relaxed flex items-start gap-2.5">
              <AlertCircle className="w-5 h-5 text-[#D58A38] shrink-0 mt-0.5" />
              <span>
                تنويه للشفافية: إمكانية توفير التدريب ترتبط بجاهزية المراكز والمدربين وتوفر النصاب التدريبي الكافي، لذا فإن تسجيل الطلب لا يعد التزاماً حتمياً بالافتتاح، بل أداة عملية لصنع الفرص وفق ما يحتاجه الطلاب فعلاً.
              </span>
            </div>

            <div className="pt-2">
              <Link
                href="/apply"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#D58A38] hover:bg-[#BE772B] text-white text-xs sm:text-sm font-black transition shadow-sm active:scale-95"
              >
                <span>أخبرنا بما تريد تعلمه الآن</span>
                <ArrowLeft className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* Section 3: Centers & Trainers Gate (بوابة المراكز والمدربين) */}
        <section id="centers-track" className="space-y-6 scroll-mt-24">
          <div className="space-y-2 border-b border-slate-200/80 pb-4">
            <span className="text-xs font-black text-[#D58A38] uppercase tracking-wider">
              المسار الثالث • الشركاء التدريبيون
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#123D3A]">
              ثالثاً: كيف ننشر برامج المراكز والمدربين؟
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              خطوات انضمام المؤسسات والمدربين وشروط اعتماد إعلانات التدريب
            </p>
          </div>

          <div className="bg-[#F8F8F5] border border-slate-200/90 rounded-3xl p-6 sm:p-9 space-y-6">
            <div className="space-y-3">
              <h3 className="text-base font-black text-slate-900">
                خطوات نشر وتوزيع برنامج تدريبي:
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs sm:text-sm text-slate-700">
                <div className="bg-white p-4 rounded-2xl border border-slate-200/80 space-y-1.5">
                  <span className="font-mono font-bold text-xs text-[#D58A38]">خطوة 1</span>
                  <h4 className="font-black text-slate-900 text-xs sm:text-sm">إرسال تفاصيل الإعلان</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    عبر استمارة «شارك تدريباً» مع إرفاق الروابط ومكان الانعقاد ومواعيد التسجيل.
                  </p>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-200/80 space-y-1.5">
                  <span className="font-mono font-bold text-xs text-[#D58A38]">خطوة 2</span>
                  <h4 className="font-black text-slate-900 text-xs sm:text-sm">التدقيق والتحقق</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    مراجعة وضوح الشروط والتأكد من موثوقية الجهة المنظمة ومطابقتها لمعايير المنصة.
                  </p>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-200/80 space-y-1.5">
                  <span className="font-mono font-bold text-xs text-[#D58A38]">خطوة 3</span>
                  <h4 className="font-black text-slate-900 text-xs sm:text-sm">النشر والتوجيه</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    إدراج التدريب في قاعدة البيانات وتوجيه المهتمين مباشرة لاستمارة تسجيلكم الرسمية.
                  </p>
                </div>
              </div>
            </div>

            {/* Quality Guidelines */}
            <div className="p-4 sm:p-5 bg-white rounded-2xl border border-slate-200/80 space-y-2">
              <h4 className="text-xs sm:text-sm font-black text-[#123D3A] flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-emerald-600" />
                <span>معايير اعتماد إعلانات التدريب في «تلاقي»:</span>
              </h4>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>تحديد جهة منظمة معتمدة ومعروفة.</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>وضوح المحاور التدريبية وعدد الساعات.</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>الإفصاح الشفاف عن التكلفة (مجانية أو مأجورة).</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>تحديد الموقع الجغرافي أو المنصة الرقمية بدقة.</span>
                </li>
              </ul>
            </div>

            <div className="pt-2 flex flex-wrap gap-3">
              <Link
                href="/share"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#123D3A] hover:bg-[#1a4f4b] text-white text-xs sm:text-sm font-black transition active:scale-95"
              >
                <Share2 className="w-4 h-4 text-amber-300" />
                <span>شارك تدريباً أو برنامجاً</span>
              </Link>
            </div>
          </div>
        </section>

        {/* Section 4: Operational FAQ (الأسئلة الشائعة التشغيلية) */}
        <section className="space-y-6">
          <div className="space-y-2 border-b border-slate-200/80 pb-4">
            <span className="text-xs font-black text-[#D58A38] uppercase tracking-wider">
              إيضاحات عملية
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#123D3A]">
              الأسئلة الشائعة حول الاستخدام
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <details
                key={index}
                className="group rounded-2xl border border-slate-200/90 bg-white overflow-hidden transition-all shadow-2xs"
              >
                <summary className="w-full py-4 px-5 flex items-center justify-between text-right gap-3 cursor-pointer select-none font-bold text-sm text-[#123D3A] hover:bg-slate-50/80 transition-colors list-none [&::-webkit-details-marker]:hidden">
                  <span>{faq.q}</span>
                  <ChevronDown className="w-4 h-4 text-slate-400 group-open:rotate-180 group-open:text-[#D58A38] transition-transform duration-200 shrink-0" />
                </summary>
                <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </section>
      </div>

      {/* 5. Bottom Action Bar */}
      <section className="w-full py-16 px-4 sm:px-6 bg-[#123D3A] text-white mt-4">
        <div className="max-w-4xl mx-auto text-center space-y-5">
          <div className="flex justify-center mb-2">
            <Logo size="lg" />
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white">
            فرصتك تبدأ بخطوة
          </h2>

          <p className="text-sm sm:text-base text-amber-200/90 font-medium max-w-lg mx-auto leading-relaxed">
            سواء كنت تعرف ما تريد تعلمه، أو ما زلت تبحث عن المجال المناسب، نحن هنا لمساعدتك في الوصول إلى فرص أقرب إلى احتياجاتك.
          </p>

          <div className="pt-3 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/courses"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-[#D58A38] hover:bg-[#BE772B] text-white font-black text-sm shadow-xl transition active:scale-95"
            >
              <Compass className="w-4 h-4" />
              <span>اكتشف التدريبات المتاحة</span>
            </Link>

            <Link
              href="/apply"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm border border-white/20 transition"
            >
              <span>اطلب تدريباً</span>
              <ArrowLeft className="w-4 h-4" />
            </Link>

            <a
              href="https://wa.me/963951234001?text=%D9%85%D8%B1%D8%AD%D8%A8%D8%A7%D9%8B%20%D9%85%D9%86%D8%B5%D8%A9%20%D8%AA%D9%84%D8%A7%D9%82%D9%8A%D8%8C%20%D9%84%D8%AF%D9%8A%20%D8%A7%D8%B3%D8%AA%D9%81%D8%B3%D8%A7%D8%B1"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-white/5 hover:bg-white/10 text-white/90 font-bold text-sm border border-white/15 transition"
            >
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              <span>تواصل مع الدعم</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
