import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import {
  ShieldCheck,
  Scale,
  FileText,
  Lock,
  Sparkles,
  AlertTriangle,
  RefreshCw,
  Mail,
  ExternalLink,
  ChevronLeft,
} from 'lucide-react';
import Logo from '@/components/theme/Logo';

export const metadata: Metadata = {
  title: 'شروط الاستخدام | منصة تلاقي',
  description:
    'شروط وقواعد استخدام منصة تلاقي وإرسال طلبات التدريب، وحماية البيانات والمسؤوليات القانونية.',
};

export default function TermsPage() {
  return (
    <div className="w-full flex flex-col items-center text-right text-slate-900 bg-white" dir="rtl">
      {/* 1. Header Section */}
      <section className="w-full relative overflow-hidden bg-[#123D3A] text-white pt-16 pb-20 px-4 sm:px-6">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#D58A38]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-80 h-80 bg-[#A9B5B0]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto relative z-10 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#D58A38]/20 text-amber-300 border border-[#D58A38]/40 text-xs font-black mx-auto">
            <Scale className="w-3.5 h-3.5 text-amber-300" />
            <span>اتفاقية وقواعد الاستخدام</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#F8F8F5] tracking-tight leading-tight max-w-3xl mx-auto">
            شروط الاستخدام – منصة تلاقي
          </h1>

          <p className="text-xs sm:text-sm text-[#A9B5B0] font-mono">
            آخر تحديث: نوفمبر 2026
          </p>
        </div>
      </section>

      {/* Main Legal Content Container */}
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16 space-y-10">

        {/* Introduction */}
        <div className="bg-[#F8F8F5] border border-slate-200/90 rounded-3xl p-6 sm:p-8 space-y-3 text-sm sm:text-base text-slate-700 leading-relaxed font-normal">
          <h2 className="text-lg font-black text-[#123D3A]">
            مرحباً بك في منصة تلاقي
          </h2>
          <p>
            تلاقي منصة تهدف إلى مساعدة الأفراد على اكتشاف احتياجاتهم التدريبية والتعبير عن المهارات والموضوعات التي يرغبون في تعلمها، بما يساهم في فهم الاحتياجات التعليمية والتدريبية وتطوير فرص مناسبة لها.
          </p>
          <p>
            توضح هذه الشروط القواعد الأساسية لاستخدام المنصة وإرسال الطلبات من خلالها.
          </p>
        </div>

        {/* 1. Agreement */}
        <section className="space-y-3 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-2xs">
          <h3 className="text-lg sm:text-xl font-black text-[#123D3A] flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-xl bg-[#123D3A] text-white flex items-center justify-center text-xs font-black shrink-0">1</span>
            <span>الموافقة على شروط الاستخدام</span>
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            باستخدامك المنصة وإرسال طلب من خلالها، فإنك تقر بأنك قرأت شروط الاستخدام ووافقت عليها.
          </p>
          <p className="text-xs sm:text-sm text-amber-900 font-bold bg-amber-50/70 p-3 rounded-xl border border-amber-200/60">
            إذا كنت لا توافق على هذه الشروط، يرجى عدم إرسال الطلب.
          </p>
        </section>

        {/* 2. Nature of Services */}
        <section className="space-y-4 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-2xs">
          <h3 className="text-lg sm:text-xl font-black text-[#123D3A] flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-xl bg-[#123D3A] text-white flex items-center justify-center text-xs font-black shrink-0">2</span>
            <span>طبيعة خدمات تلاقي</span>
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            تتيح المنصة للمستخدمين:
          </p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm text-slate-700">
            <li className="p-3 bg-[#F8F8F5] rounded-xl border border-slate-200/60 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#D58A38] shrink-0" />
              <span>التعبير عن التدريبات والمهارات التي يرغبون في تعلمها.</span>
            </li>
            <li className="p-3 bg-[#F8F8F5] rounded-xl border border-slate-200/60 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#D58A38] shrink-0" />
              <span>تحديد المجالات والموضوعات التدريبية التي تهمهم.</span>
            </li>
            <li className="p-3 bg-[#F8F8F5] rounded-xl border border-slate-200/60 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#D58A38] shrink-0" />
              <span>توضيح المكان المناسب لحضور التدريب.</span>
            </li>
            <li className="p-3 bg-[#F8F8F5] rounded-xl border border-slate-200/60 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#D58A38] shrink-0" />
              <span>توضيح ما إذا كانوا مستعدين للدفع مقابل التدريب المطلوب.</span>
            </li>
            <li className="p-3 bg-[#F8F8F5] rounded-xl border border-slate-200/60 flex items-center gap-2 sm:col-span-2">
              <span className="w-2 h-2 rounded-full bg-[#D58A38] shrink-0" />
              <span>الاستفادة من الخدمات والميزات المتاحة على المنصة.</span>
            </li>
          </ul>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pt-1">
            تعمل تلاقي على فهم احتياجات المستخدمين واستكشاف فرص تساعد في تلبيتها، ولا يعني إرسال الطلب ضمان توفير التدريب أو تحديد موعد لإطلاقه.
          </p>
        </section>

        {/* 3. User Responsibilities */}
        <section className="space-y-4 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-2xs">
          <h3 className="text-lg sm:text-xl font-black text-[#123D3A] flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-xl bg-[#123D3A] text-white flex items-center justify-center text-xs font-black shrink-0">3</span>
            <span>مسؤوليات المستخدم</span>
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            عند استخدام المنصة، يلتزم المستخدم بما يلي:
          </p>
          <ol className="space-y-2 text-xs sm:text-sm text-slate-700">
            <li className="flex items-start gap-2.5 p-2.5 rounded-xl hover:bg-slate-50 transition">
              <span className="font-bold text-[#123D3A] shrink-0">1.</span>
              <span>تقديم معلومات صحيحة ودقيقة عند إرسال الطلب.</span>
            </li>
            <li className="flex items-start gap-2.5 p-2.5 rounded-xl hover:bg-slate-50 transition">
              <span className="font-bold text-[#123D3A] shrink-0">2.</span>
              <span>عدم استخدام المنصة لأغراض غير قانونية أو مضللة.</span>
            </li>
            <li className="flex items-start gap-2.5 p-2.5 rounded-xl hover:bg-slate-50 transition">
              <span className="font-bold text-[#123D3A] shrink-0">3.</span>
              <span>عدم انتحال شخصية أشخاص آخرين أو تقديم بيانات تخصهم دون إذن.</span>
            </li>
            <li className="flex items-start gap-2.5 p-2.5 rounded-xl hover:bg-slate-50 transition">
              <span className="font-bold text-[#123D3A] shrink-0">4.</span>
              <span>عدم إرسال محتوى مسيء أو مخالف للقوانين.</span>
            </li>
            <li className="flex items-start gap-2.5 p-2.5 rounded-xl hover:bg-slate-50 transition">
              <span className="font-bold text-[#123D3A] shrink-0">5.</span>
              <span>عدم محاولة تعطيل المنصة أو الوصول غير المصرح به إلى أنظمتها.</span>
            </li>
            <li className="flex items-start gap-2.5 p-2.5 rounded-xl hover:bg-slate-50 transition">
              <span className="font-bold text-[#123D3A] shrink-0">6.</span>
              <span>استخدام الخدمات المتاحة بطريقة مسؤولة ومشروعة.</span>
            </li>
          </ol>
          <p className="text-xs font-bold text-slate-800 pt-1">
            يتحمل المستخدم مسؤولية صحة المعلومات التي يقدمها من خلال المنصة.
          </p>
        </section>

        {/* 4. Training Requests */}
        <section className="space-y-4 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-2xs">
          <h3 className="text-lg sm:text-xl font-black text-[#123D3A] flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-xl bg-[#123D3A] text-white flex items-center justify-center text-xs font-black shrink-0">4</span>
            <span>طلبات التدريب</span>
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            يمكن للمستخدم إرسال طلب يوضح فيه التدريب أو المهارة التي يرغب في تعلمها، والمكان المناسب له، ومدى استعداده للدفع مقابل هذا التدريب. تُستخدم هذه الطلبات لفهم اهتمامات المستخدمين والاحتياجات التدريبية، ودراسة إمكانية تطوير فرص أو خدمات مناسبة لها.
          </p>

          <div className="p-4 rounded-2xl bg-[#F8F8F5] border border-slate-200/80 space-y-2 text-xs sm:text-sm text-slate-700">
            <span className="font-black text-[#123D3A] block">يرجى الانتباه إلى أن:</span>
            <ul className="space-y-1.5 pr-2">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D58A38]" />
                <span>إرسال الطلب لا يعني التسجيل في دورة تدريبية قائمة.</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D58A38]" />
                <span>إرسال الطلب لا يضمن توفير التدريب أو انعقاده.</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D58A38]" />
                <span>لا يمثل تحديد الاستعداد للدفع التزاماً مالياً على المستخدم.</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D58A38]" />
                <span>لا يترتب على إرسال الطلب أي رسوم على المستخدم في الوقت الحالي.</span>
              </li>
            </ul>
          </div>
        </section>

        {/* 5. Data, Privacy & Statistics */}
        <section className="space-y-4 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-2xs">
          <h3 className="text-lg sm:text-xl font-black text-[#123D3A] flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-xl bg-[#123D3A] text-white flex items-center justify-center text-xs font-black shrink-0">5</span>
            <span>البيانات والمعلومات المقدمة</span>
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            يتحمل المستخدم مسؤولية تقديم بيانات صحيحة تخصه، ويوافق على استخدام المعلومات التي يقدمها للأغراض المرتبطة بتشغيل المنصة وفهم الاحتياجات التدريبية وتطوير خدماتها، وفق الإشعار المتعلق بالخصوصية المعروض عند إرسال الطلب.
          </p>

          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/70 space-y-2 text-xs sm:text-sm text-emerald-950 font-medium leading-relaxed">
            <div className="flex items-center gap-2 font-black text-emerald-900">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              <span>حماية هويتك وبياناتك الشخصية:</span>
            </div>
            <p>
              لا تبيع تلاقي البيانات الشخصية للمستخدمين، ولا تشارك بياناتهم التعريفية، مثل الأسماء وأرقام الهواتف والبريد الإلكتروني، مع الجهات التدريبية أو أطراف أخرى.
            </p>
            <p className="text-emerald-900 font-bold pt-1">
              يجوز استخدام معلومات مجمّعة وغير معرّفة لأغراض التحليل والإحصائيات ودراسة الاحتياجات والاهتمامات التدريبية، بما لا يكشف هوية المستخدم مطلقاً.
            </p>
          </div>
        </section>

        {/* 6. Fees & Future Services */}
        <section className="space-y-3 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-2xs">
          <h3 className="text-lg sm:text-xl font-black text-[#123D3A] flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-xl bg-[#123D3A] text-white flex items-center justify-center text-xs font-black shrink-0">6</span>
            <span>الرسوم والخدمات</span>
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            استخدام المنصة وإرسال طلبات التدريب مجانيان في الوقت الحالي.
          </p>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            قد تتطور خدمات المنصة مستقبلاً، وقد تُضاف خدمات أو خيارات جديدة. وفي حال تقديم خدمات مدفوعة، سيتم توضيح طبيعتها ورسومها وشروطها للمستخدم قبل إتاحة استخدامها، ولن يُعد إرسال طلب التدريب الحالي موافقة على أي التزام مالي مستقبلي.
          </p>
        </section>

        {/* 7. Content & IP */}
        <section className="space-y-3 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-2xs">
          <h3 className="text-lg sm:text-xl font-black text-[#123D3A] flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-xl bg-[#123D3A] text-white flex items-center justify-center text-xs font-black shrink-0">7</span>
            <span>المحتوى والملكية الفكرية</span>
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            تعود حقوق العلامات التجارية والتصاميم والمحتوى الخاص بمنصة تلاقي إلى أصحابها أو الجهات المرخصة باستخدامها.
          </p>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            لا يجوز نسخ محتوى المنصة أو إعادة نشره أو استغلاله تجارياً دون إذن مناسب، ما لم يكن ذلك مسموحاً به قانوناً.
          </p>
        </section>

        {/* 8. Availability & Development */}
        <section className="space-y-3 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-2xs">
          <h3 className="text-lg sm:text-xl font-black text-[#123D3A] flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-xl bg-[#123D3A] text-white flex items-center justify-center text-xs font-black shrink-0">8</span>
            <span>توفر الخدمات وتطويرها</span>
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            تعمل تلاقي على تطوير خدماتها وتحسينها بصورة مستمرة. قد تتغير الميزات المتاحة أو تُضاف خدمات جديدة أو تتوقف بعض الخدمات مؤقتاً لأسباب تقنية أو تشغيلية.
          </p>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            لا تضمن المنصة توفر جميع الخدمات دون انقطاع أو أخطاء في جميع الأوقات.
          </p>
        </section>

        {/* 9. Misuse */}
        <section className="space-y-3 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-2xs">
          <h3 className="text-lg sm:text-xl font-black text-[#123D3A] flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-xl bg-[#123D3A] text-white flex items-center justify-center text-xs font-black shrink-0">9</span>
            <span>إساءة الاستخدام</span>
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            تحتفظ تلاقي بحق اتخاذ الإجراءات المناسبة عند استخدام المنصة بصورة مخالفة لهذه الشروط، بما في ذلك رفض الطلبات غير المناسبة أو تقييد الوصول إلى الخدمات عند الضرورة.
          </p>
        </section>

        {/* 10. Modifications */}
        <section className="space-y-3 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-2xs">
          <h3 className="text-lg sm:text-xl font-black text-[#123D3A] flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-xl bg-[#123D3A] text-white flex items-center justify-center text-xs font-black shrink-0">10</span>
            <span>التعديلات على شروط الاستخدام</span>
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            قد يتم تحديث هذه الشروط بما يتناسب مع تطوير المنصة وخدماتها والمتطلبات القانونية. سيتم نشر النسخة المحدثة على هذه الصفحة مع تعديل تاريخ آخر تحديث.
          </p>
        </section>

        {/* 11. Contact */}
        <section className="space-y-4 bg-gradient-to-br from-[#123D3A]/5 to-[#D58A38]/10 p-6 sm:p-8 rounded-3xl border border-slate-200/90">
          <h3 className="text-lg sm:text-xl font-black text-[#123D3A] flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-xl bg-[#123D3A] text-white flex items-center justify-center text-xs font-black shrink-0">11</span>
            <span>التواصل معنا</span>
          </h3>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
            للاستفسارات المتعلقة بشروط الاستخدام وسياسة المنصة، يمكن التواصل معنا عبر:
          </p>
          <div className="flex flex-col sm:flex-row gap-3 pt-1 text-xs sm:text-sm">
            <a
              href="mailto:aiqotayba@gmail.com"
              className="inline-flex items-center gap-2 p-3 bg-white rounded-xl border border-slate-200 text-slate-800 font-bold hover:border-[#D58A38] transition"
            >
              <Mail className="w-4 h-4 text-[#D58A38]" />
              <span>aiqotayba@gmail.com</span>
            </a>
            <Link
              href="/"
              className="inline-flex items-center gap-2 p-3 bg-white rounded-xl border border-slate-200 text-slate-800 font-bold hover:border-[#D58A38] transition"
            >
              <ExternalLink className="w-4 h-4 text-[#123D3A]" />
              <span>منصة تلاقي الرئيسية</span>
            </Link>
          </div>

          <div className="pt-4 border-t border-slate-200/60 text-center font-bold text-sm text-[#123D3A]">
            تلاقي – فرص أقرب إلى طموحك.
          </div>
        </section>

      </div>
    </div>
  );
}

