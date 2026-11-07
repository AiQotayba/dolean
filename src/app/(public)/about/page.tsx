import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import {
  Compass,
  ArrowLeft,
  ShieldCheck,
  Target,
  Eye,
  Users2,
  HeartHandshake,
  Lock,
  MapPin,
  Sparkles,
  Building2,
  HelpCircle,
  FileCheck2,
} from 'lucide-react';
import Logo from '@/components/theme/Logo';

export const metadata: Metadata = {
  title: 'من نحن | مبادرة تلاقي',
  description:
    'تعرف على مبادرة تلاقي: الهوية الاعتبارية، الرؤية والرسالة المؤسسية، ميثاق النزاهة المجتمعية، والفريق المستقل القائم على المنصة في الشمال السوري.',
};

export default function AboutPage() {
  return (
    <div className="w-full flex flex-col items-center text-right text-slate-900 bg-white" dir="rtl">
      {/* 1. Hero: Entity & Institutional Persona */}
      <section className="w-full relative overflow-hidden bg-[#123D3A] text-white pt-16 pb-20 px-4 sm:px-6">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#D58A38]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-80 h-80 bg-[#A9B5B0]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto relative z-10 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#D58A38]/20 text-amber-300 border border-[#D58A38]/40 text-xs font-black mx-auto">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>مبادرة رقمية مجتمعية مستقلة</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#F8F8F5] tracking-tight leading-tight max-w-3xl mx-auto">
            مبادرة «تلاقي».. منصة بناء الجسور المعرفية والتمكين المهني
          </h1>

          <p className="text-base sm:text-lg text-[#A9B5B0] leading-relaxed max-w-2xl mx-auto font-normal">
            مشروع رقمي غير ربحي في منطلقاته وأهدافه، انطلق من قلب الشمال السوري لإنهاء تشتت الفرص التعليمية، وتوفير مظلة رقمية موثوقة تجمع الساعين إلى التعلم مع صنّاع المعرفة والتدريب.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              href="/how-it-works"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-[#D58A38] hover:bg-[#BE772B] text-white font-black text-sm shadow-xl shadow-[#D58A38]/30 transition active:scale-95"
            >
              <HelpCircle className="w-4 h-4" />
              <span>دليل كيف نعمل</span>
            </Link>

            <Link
              href="/courses"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-bold text-sm border border-white/20 transition"
            >
              <Compass className="w-4 h-4 text-amber-300" />
              <span>تصفح التدريبات</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Main Container */}
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-16 space-y-16">
        
        {/* 2. Who We Are (التعريف الاعتباري للمشروع) */}
        <section className="space-y-4">
          <div className="space-y-1">
            <span className="text-xs font-black text-[#D58A38] uppercase tracking-wider">
              الهوية والصفة
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#123D3A]">
              من هي مبادرة «تلاقي»؟
            </h2>
          </div>

          <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-9 shadow-xs space-y-5 text-sm sm:text-base text-slate-700 leading-relaxed">
            <p>
              «تلاقي» ليست مركزاً تدريبياً تجارياً، وليست جهة مانحة أو مانحة للشهادات، بل هي <strong>بنية تحتية رقمية ومبادرة مجتمعية وسيطة</strong>، صُممت لتنظيم وتسهيل الوصول إلى بيئة التدريب والتطوير المهني في محافظة إدلب والشمال السوري.
            </p>
            <p>
              جاءت المبادرة استجابة لواقع يعيشه مجتمعنا؛ حيث تتوزع المنح والدورات التدريبية بين عشرات القنوات والصفحات المبعثرة، ما يُهدر فرصاً حقيقية على شباب يبحثون عن بداية مهنية، وفي الوقت ذاته يُصعّب على المراكز والمدربين الوصول إلى الكفاءات الشابة الراغبة فعلاً في التعلم.
            </p>
            <div className="p-4 rounded-2xl bg-[#F8F8F5] border border-slate-200/80 font-medium text-slate-800 text-xs sm:text-sm">
              دورنا الاعتباري يتركز في كوننا <strong>«المساحة المشتركة»</strong> التي تلتقي فيها الاحتياجات الحقيقية للمتعلمين مع إمكانات المراكز والمدربين، بكل حيادية وشفافية وبلا أي قيود تجارية على المستفيدين.
            </div>
          </div>
        </section>

        {/* 3. Vision & Mission (الرؤية والرسالة المؤسسية) */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Vision */}
          <div className="bg-[#F8F8F5] border border-slate-200/90 rounded-3xl p-6 sm:p-8 space-y-3">
            <div className="w-11 h-11 rounded-2xl bg-[#123D3A] text-white flex items-center justify-center">
              <Eye className="w-5 h-5 text-amber-300" />
            </div>
            <h3 className="text-lg font-black text-[#123D3A]">رؤيتنا</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
              أن يمتلك كل شاب وشابة في مجتمعنا مساراً سهلاً ومباشراً لامتلاك مهارة عملية منتجة، وأن تصبح «تلاقي» المرجع الرقمي الأول الموثوق للفرص المهنية وبناء القدرات محلياً.
            </p>
          </div>

          {/* Mission */}
          <div className="bg-[#F8F8F5] border border-slate-200/90 rounded-3xl p-6 sm:p-8 space-y-3">
            <div className="w-11 h-11 rounded-2xl bg-[#D58A38] text-white flex items-center justify-center">
              <Target className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-black text-[#123D3A]">رسالتنا</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
              تمكين الشباب والمجتمع من خلال إنهاء تشتت الفرص التدريبية، والعمل كمنصة مستقلة تصغي لصوت المتعلم وتنقل احتياجه إلى المؤسسات والمدربين الأكفاء لبناء فرص جديدة تستجيب للواقع.
            </p>
          </div>
        </section>

        {/* 4. Ethical & Operating Charter (ميثاق العمل والنزاهة) */}
        <section className="space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-black text-[#D58A38] uppercase tracking-wider">
              المبادئ والمسؤولية
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#123D3A]">
              ميثاق عملنا المؤسسي
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              قواعد النزاهة والمهنية التي تحكم وجود المنصة وعلاقتها بالمجتمع
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Charter 1 */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-2xs space-y-2.5">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-[#D58A38] flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-black text-slate-900">المجانية الدائمة للمتعلم</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                خدمات البحث والتوجيه وتسجيل الاحتياج عبر المنصة مجانية تماماً وبلا أي رسوم خفية أو وسطاء على الطلاب والباحثين عن مهارات.
              </p>
            </div>

            {/* Charter 2 */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-2xs space-y-2.5">
              <div className="w-10 h-10 rounded-2xl bg-teal-500/10 text-teal-700 flex items-center justify-center font-bold">
                <FileCheck2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-black text-slate-900">الحيادية والمصداقية المهنية</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                المنصة مفتوحة لجميع المراكز والمعاهد المرخصة والمدربين المستقلين دون تحيز، ونلتزم بنشر بيانات التدريب بشفافية وأمانة.
              </p>
            </div>

            {/* Charter 3 */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-2xs space-y-2.5">
              <div className="w-10 h-10 rounded-2xl bg-blue-500/10 text-blue-700 flex items-center justify-center font-bold">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="text-base font-black text-slate-900">حماية الخصوصية والأمان</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                بيانات المستخدمين وطلباتهم مصانة ومحمية؛ لا نشارك بيانات التواصل مع أي طرف إلا بهدف إتمام التنسيق التدريبي بموافقة صاحب الطلب.
              </p>
            </div>

            {/* Charter 4 */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-2xs space-y-2.5">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-700 flex items-center justify-center font-bold">
                <MapPin className="w-5 h-5" />
              </div>
              <h3 className="text-base font-black text-slate-900">الارتباط الوثيق بالواقع المحلي</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                ننطلق من معايشة يومية لاحتياجات سوق العمل والتحديات المعيشية في منطقتنا، لنعمل على جسر الهوة بين مهارات الشباب ومتطلبات التشغيل.
              </p>
            </div>
          </div>
        </section>

        {/* 5. The Team & The Drive (الفريق المستقل وراء المشروع) */}
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
                فريق شبابي تقني ومجتمعي مستقل
              </p>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
            يقف خلف المنصة فريق من الكفاءات الشابة المستقلة في مجالات هندسة البرمجيات، وتصميم تجربة المستخدم، والعمل المجتمعي والتطوير المهني. يجمعنا الإيمان بأن تسخير التقنية لخدمة التعليم ليس مجرد رفاهية، بل هو حاجة أساسية ملحة لتمكين مجتمعنا وإتاحة الفرص العادلة أمام كل راغب في تطوير ذاته.
          </p>

          <div className="pt-2 flex items-center gap-2 text-xs font-bold text-[#123D3A]">
            <HeartHandshake className="w-4 h-4 text-[#D58A38]" />
            <span>نعمل بشراكة مستمرة مع المراكز والمدربين والناشطين في قطاع التعليم والتدريب.</span>
          </div>
        </section>

        {/* 6. Institutional Call to Collaboration (دعوة للشراكة المجتمعية) */}
        <section className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xs">
          <div className="space-y-1.5 text-right">
            <h3 className="text-base font-black text-[#123D3A]">
              هل تمثل مركزاً تدريبياً، مؤسسة، أو تعمل كمدرب مستقل؟
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-xl">
              نرحب دائماً بالتعاون والشراكات المجتمعية الهادفة إلى إثراء الفرص التدريبية وتوسيع أثرها في مجتمعنا.
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

      {/* 7. Bottom Navigation & Transition */}
      <section className="w-full py-16 px-4 sm:px-6 bg-[#123D3A] text-white mt-4">
        <div className="max-w-4xl mx-auto text-center space-y-5">
          <div className="flex justify-center mb-2">
            <Logo size="lg" />
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white">
            مستعد لمعرفة تفاصيل رحلتك التدريبية؟
          </h2>

          <p className="text-sm sm:text-base text-amber-200/90 font-medium max-w-lg mx-auto leading-relaxed">
            تعرّف بالتفصيل على خطوات الوصول للتدريب، أو آلية طلب مهارة غير موجودة، وكيف ننسق مع المراكز.
          </p>

          <div className="pt-3 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/how-it-works"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-[#D58A38] hover:bg-[#BE772B] text-white font-black text-sm shadow-xl transition active:scale-95"
            >
              <HelpCircle className="w-4 h-4" />
              <span>دليل: كيف تعمل المنصة؟</span>
            </Link>

            <Link
              href="/courses"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm border border-white/20 transition"
            >
              <Compass className="w-4 h-4 text-amber-300" />
              <span>استكشف الدورات المتاحة</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
