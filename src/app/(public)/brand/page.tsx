
"use client";

import React, { useCallback, useEffect, useState } from "react";
import {
  Sparkles,
  Copy,
  Check,
  Palette,
  Type,
  LayoutGrid,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Eye,
  Layers,
  ArrowLeft,
  Compass,
  Code2,
  Ruler,
  Smartphone,
  Accessibility,
  MousePointer2,
  Sun,
  Moon,
  Download,
  Info,
  Shapes,
  Fingerprint,
  HeartHandshake,
} from "lucide-react";
import Logo from "@/components/theme/Logo";

// ==========================================
// 1. BRAND DESIGN TOKENS
// ==========================================

type ColorToken = {
  name: string;
  english: string;
  role: string;
  hex: string;
  rgb: string;
  variable: string;
  group: "primary" | "secondary" | "neutral";
  textLight?: boolean;
  border?: boolean;
  usage: string;
};

const colors: ColorToken[] = [
  {
    name: "الأخضر الداكن",
    english: "Brand Dark",
    role: "اللون الأساسي للهوية",
    hex: "#123D3A",
    rgb: "18, 61, 58",
    variable: "--color-brand-dark",
    group: "primary",
    textLight: true,
    usage: "الشعار، الترويسات، العناوين الرئيسية والخلفيات الداكنة.",
  },
  {
    name: "البرتقالي الدافئ",
    english: "Brand Orange",
    role: "لون التمييز والإجراء",
    hex: "#D58A38",
    rgb: "213, 138, 56",
    variable: "--color-brand-orange",
    group: "primary",
    usage: "الأزرار، الدعوات لاتخاذ إجراء، العناصر النشطة والتفاصيل البصرية.",
  },
  {
    name: "برتقالي التفاعل",
    english: "Orange Hover",
    role: "حالة التفاعل",
    hex: "#BE772B",
    rgb: "190, 119, 43",
    variable: "--color-brand-orange-hover",
    group: "primary",
    textLight: true,
    usage: "حالة Hover وActive للعناصر البرتقالية.",
  },
  {
    name: "التيل المساند",
    english: "Supportive Teal",
    role: "لون الثقة والتأكيد",
    hex: "#206C63",
    rgb: "32, 108, 99",
    variable: "--color-brand-teal",
    group: "secondary",
    textLight: true,
    usage: "حالات النجاح، التواصل، الإجراءات الثانوية والشارات.",
  },
  {
    name: "الرمادي الناعم",
    english: "Soft Neutral",
    role: "لون مساعد",
    hex: "#A9B5B0",
    rgb: "169, 181, 176",
    variable: "--color-brand-gray",
    group: "neutral",
    usage: "العناصر الثانوية، الحدود والزخارف.",
  },
  {
    name: "خلفية الكانفاس",
    english: "Natural Canvas",
    role: "الخلفية الأساسية",
    hex: "#F8F8F5",
    rgb: "248, 248, 245",
    variable: "--color-brand-canvas",
    group: "neutral",
    usage: "خلفيات الصفحات والأقسام والبطاقات الهادئة.",
  },
  {
    name: "الأبيض",
    english: "Pure White",
    role: "سطح المحتوى",
    hex: "#FFFFFF",
    rgb: "255, 255, 255",
    variable: "--color-brand-white",
    group: "neutral",
    border: true,
    usage: "النماذج، البطاقات والأسطح المرتفعة.",
  },
  {
    name: "الداكن المقروء",
    english: "Slate Dark",
    role: "لون النصوص",
    hex: "#0F172A",
    rgb: "15, 23, 42",
    variable: "--color-slate-900",
    group: "neutral",
    textLight: true,
    usage: "النصوص الأساسية والعناوين فوق الخلفيات الفاتحة.",
  },
];

const spacingTokens = [
  { name: "2XS", value: "4px", usage: "تفاصيل صغيرة" },
  { name: "XS", value: "8px", usage: "مسافة داخلية صغيرة" },
  { name: "SM", value: "12px", usage: "عناصر متقاربة" },
  { name: "MD", value: "16px", usage: "المسافة القياسية" },
  { name: "LG", value: "24px", usage: "داخل البطاقات" },
  { name: "XL", value: "32px", usage: "بين المكونات" },
  { name: "2XL", value: "48px", usage: "بين الأقسام" },
  { name: "3XL", value: "64px", usage: "المساحات الكبرى" },
];

const radiusTokens = [
  { name: "Small", value: "8px", className: "rounded-lg" },
  { name: "Medium", value: "12px", className: "rounded-xl" },
  { name: "Large", value: "16px", className: "rounded-2xl" },
  { name: "XLarge", value: "24px", className: "rounded-3xl" },
  { name: "Full", value: "9999px", className: "rounded-full" },
];

// ==========================================
// 2. REUSABLE COMPONENTS
// ==========================================

function SectionHeading({
  eyebrow,
  title,
  description,
  icon: Icon,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  icon?: React.ElementType;
}) {
  return (
    <div className="space-y-2 border-b border-slate-200 pb-5">
      <div className="flex items-center gap-2 text-xs font-black tracking-wide text-[#BE772B]">
        {Icon && <Icon className="h-4 w-4" />}
        <span>{eyebrow}</span>
      </div>
      <h2 className="text-2xl font-black leading-tight text-[#123D3A] sm:text-3xl">
        {title}
      </h2>
      {description && (
        <p className="max-w-3xl text-sm leading-7 text-slate-500">
          {description}
        </p>
      )}
    </div>
  );
}

function MiniLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
      {children}
    </span>
  );
}

function ExampleCard({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-4 rounded-3xl border border-slate-200 bg-white p-5 sm:p-6">
      <div>
        <h3 className="text-sm font-black text-[#123D3A]">{title}</h3>
        {description && (
          <p className="mt-1 text-xs leading-6 text-slate-500">
            {description}
          </p>
        )}
      </div>
      {children}
    </div>
  );
}

// ==========================================
// 3. MAIN PAGE
// ==========================================

export default function BrandGuidelinesPage() {
  const [copied, setCopied] = useState<string | null>(null);
  const [copyMessage, setCopyMessage] = useState("");
  const [logoBg, setLogoBg] = useState<"dark" | "canvas" | "white">("dark");
  const [activeGroup, setActiveGroup] = useState("all");

  useEffect(() => {
    if (!copied) return;

    const timer = window.setTimeout(() => setCopied(null), 1800);
    return () => window.clearTimeout(timer);
  }, [copied]);

  const copyText = useCallback(async (value: string, label: string) => {
    try {
      if (!navigator.clipboard?.writeText) {
        throw new Error("Clipboard unavailable");
      }

      await navigator.clipboard.writeText(value);
      setCopied(label);
      setCopyMessage(`تم نسخ ${label} بنجاح`);
    } catch {
      setCopyMessage("تعذر النسخ. تحقق من صلاحية الحافظة في المتصفح.");
    }
  }, []);

  const copyAllTokens = () => {
    const css = `:root {\n${colors
      .map((c) => `  ${c.variable}: ${c.hex};`)
      .join("\n")}\n\n  --radius-sm: 8px;\n  --radius-md: 12px;\n  --radius-lg: 16px;\n  --radius-xl: 24px;\n}`;

    copyText(css, "متغيرات CSS");
  };

  const filteredColors =
    activeGroup === "all"
      ? colors
      : colors.filter((c) => c.group === activeGroup);

  const previewClasses = {
    dark: "bg-[#123D3A] text-white",
    canvas: "bg-[#F8F8F5] text-[#123D3A]",
    white: "bg-white text-[#123D3A]",
  };

  return (
    <main
      dir="rtl"
      className="min-h-screen w-full overflow-hidden bg-white text-right text-slate-900"
    >
      <div className="sr-only" role="status" aria-live="polite">
        {copyMessage}
      </div>

      {/* =====================================
          HERO
      ====================================== */}

      <header className="relative overflow-hidden bg-[#123D3A] px-4 pb-20 pt-16 text-white sm:px-8 sm:pt-24">
        <div className="pointer-events-none absolute -right-20 -top-32 h-96 w-96 rounded-full bg-[#D58A38]/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-40 -left-20 h-96 w-96 rounded-full bg-[#A9B5B0]/10 blur-3xl" />

        <div className="relative z-10 mx-auto max-w-5xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#D58A38]/40 bg-[#D58A38]/15 px-4 py-2 text-xs font-bold text-amber-200">
            <Sparkles className="h-4 w-4" />
            دليل الهوية البصرية ونظام التصميم
          </div>

          <h1 className="mx-auto max-w-4xl text-3xl font-black leading-tight tracking-tight text-[#F8F8F5] sm:text-5xl md:text-6xl">
            هوية تلاقي
            <span className="mt-2 block text-[#D58A38]">
              نظام بصري يجمع الفرص بالمهارات
            </span>
          </h1>

          <p className="mx-auto mt-7 max-w-2xl text-sm leading-8 text-[#A9B5B0] sm:text-base">
            المرجع الرسمي لتطبيق الهوية البصرية لمنصة تلاقي، ويحدد
            الألوان والخطوط والمكونات والقواعد التي تضمن تجربة موحدة
            في الموقع والتطبيق ووسائل التواصل والمواد التسويقية.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-2">
            {["Brand Guidelines v2.0", "Lama Sans", "RTL First", "Mobile First"].map(
              (item) => (
                <span
                  key={item}
                  className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-[11px] font-medium text-white/80"
                >
                  {item}
                </span>
              )
            )}
          </div>

          <div className="mt-12 flex justify-center">
            <div className="rounded-3xl border border-white/10 bg-white/5 px-12 py-8 backdrop-blur-sm">
              <Logo size="lg" theme="dark" />
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl space-y-24 px-4 py-16 sm:px-8">

        {/* =====================================
            BRAND FOUNDATION
        ====================================== */}

        <section className="space-y-7">
          <SectionHeading
            eyebrow="01 / BRAND FOUNDATION"
            title="أساس العلامة التجارية"
            description="المبادئ التي تنطلق منها الهوية، وكيف يجب أن تظهر شخصية تلاقي في جميع نقاط التواصل."
            icon={Fingerprint}
          />

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: HeartHandshake,
                title: "الربط",
                desc: "نربط المتعلمين بالجهات التي تمتلك المعرفة والفرص.",
              },
              {
                icon: Compass,
                title: "الوصول",
                desc: "نجعل الوصول إلى التدريب المناسب أبسط وأوضح.",
              },
              {
                icon: Sparkles,
                title: "الفرصة",
                desc: "نساعد المهارات والاحتياجات على الالتقاء.",
              },
              {
                icon: ShieldCheck,
                title: "الثقة",
                desc: "نقدم تجربة صادقة وواضحة تحترم المستخدم.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-3xl border border-slate-200 bg-[#F8F8F5] p-6"
              >
                <item.icon className="mb-5 h-7 w-7 text-[#D58A38]" />
                <h3 className="font-black text-[#123D3A]">{item.title}</h3>
                <p className="mt-2 text-xs leading-7 text-slate-600">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <ExampleCard title="شخصية العلامة التجارية">
              <div className="flex flex-wrap gap-2">
                {["قريبة من الناس", "عملية", "موثوقة", "بسيطة", "متفائلة"].map(
                  (item) => (
                    <span
                      key={item}
                      className="rounded-full bg-[#123D3A]/10 px-4 py-2 text-xs font-bold text-[#123D3A]"
                    >
                      {item}
                    </span>
                  )
                )}
              </div>
            </ExampleCard>

            <ExampleCard title="نبرة التواصل">
              <div className="space-y-3 text-sm leading-7 text-slate-600">
                <p>
                  <strong className="text-[#123D3A]">نقول:</strong>{" "}
                  اكتشف التدريبات المناسبة لك.
                </p>
                <p>
                  <strong className="text-[#123D3A]">نتجنب:</strong>{" "}
                  نضمن لك الحصول على وظيفة بعد التدريب.
                </p>
                <p>
                  <strong className="text-[#123D3A]">القاعدة:</strong>{" "}
                  لغة بسيطة، ودودة، واقعية، بعيدة عن المبالغة.
                </p>
              </div>
            </ExampleCard>
          </div>
        </section>

        {/* =====================================
            LOGO
        ====================================== */}

        <section className="space-y-7">
          <SectionHeading
            eyebrow="02 / LOGO SYSTEM"
            title="الشعار الرسمي وتكوين العلامة"
            description="الشعار هو العنصر الأكثر ثباتاً في الهوية. يجب المحافظة على نسبه وألوانه ومساحته الآمنة."
            icon={Shapes}
          />

          <div className="grid items-stretch gap-6 md:grid-cols-12">
            <div className="space-y-4 md:col-span-7">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h3 className="text-sm font-black text-[#123D3A]">
                  معاينة الشعار
                </h3>

                <div className="flex flex-wrap gap-1 rounded-xl bg-slate-100 p-1">
                  {[
                    { id: "dark", label: "داكن" },
                    { id: "canvas", label: "كانفاس" },
                    { id: "white", label: "أبيض" },
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      aria-pressed={logoBg === item.id}
                      onClick={() => setLogoBg(item.id as typeof logoBg)}
                      className={`rounded-lg px-4 py-2 text-xs font-bold transition ${logoBg === item.id
                        ? "bg-[#123D3A] text-white"
                        : "text-slate-600 hover:bg-white"
                        }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              <div
                className={`flex min-h-72 items-center justify-center rounded-3xl border border-slate-200 p-8 transition-colors ${previewClasses[logoBg]}`}
              >
                <Logo size="lg" theme={logoBg === "dark" ? "dark" : "light"} />
              </div>
            </div>

            <div className="flex flex-col justify-center space-y-5 md:col-span-5">
              <div>
                <MiniLabel>LOGO CONCEPT</MiniLabel>
                <h3 className="mt-2 text-xl font-black text-[#123D3A]">
                  حيث تلتقي الرغبة بالفرصة
                </h3>
                <p className="mt-3 text-sm leading-8 text-slate-600">
                  يتكون الرمز من شكلين عضويين متداخلين، يعبران عن طرفي
                  المنظومة: المتعلم من جهة، والجهة التي تقدم المعرفة
                  والتدريب من جهة أخرى. أما منطقة التقاطع فتمثل نقطة
                  التلاقي بين الاحتياج والفرصة.
                </p>
              </div>

              {[
                {
                  color: "#123D3A",
                  title: "الطرف الأول",
                  desc: "المعرفة والجهات التدريبية.",
                },
                {
                  color: "#A9B5B0",
                  title: "الطرف الثاني",
                  desc: "المتعلم والباحث عن المهارة.",
                },
                {
                  color: "#D58A38",
                  title: "نقطة الالتقاء",
                  desc: "الفرصة والتواصل والتعاون.",
                },
              ].map((item) => (
                <div key={item.title} className="flex items-center gap-3">
                  <span
                    className="h-10 w-10 shrink-0 rounded-xl"
                    style={{ background: item.color }}
                  />
                  <div>
                    <h4 className="text-xs font-black text-slate-900">
                      {item.title}
                    </h4>
                    <p className="mt-1 text-xs text-slate-500">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl border border-slate-200 p-5">
              <CheckCircle2 className="mb-3 h-5 w-5 text-emerald-600" />
              <h4 className="text-sm font-black">الاستخدام الصحيح</h4>
              <p className="mt-2 text-xs leading-7 text-slate-600">
                المحافظة على نسب الشعار، استخدام الخلفيات المناسبة،
                وترك مساحة فارغة كافية حول العلامة.
              </p>
            </div>
            <div className="rounded-3xl border border-slate-200 p-5">
              <XCircle className="mb-3 h-5 w-5 text-rose-600" />
              <h4 className="text-sm font-black">الاستخدام الخاطئ</h4>
              <p className="mt-2 text-xs leading-7 text-slate-600">
                عدم تمديد الشعار أو تدويره أو تغيير ألوانه أو إضافة
                تأثيرات وظلال غير معتمدة.
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200 p-5 sm:col-span-2 bg-[#F8F8F5]">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-4 w-4 text-[#D58A38]" />
                <h4 className="text-sm font-black text-[#123D3A]">قاعدة التباين على الخلفيات الخضراء والداكنة (Contrast Rule)</h4>
              </div>
              <p className="text-xs leading-7 text-slate-700">
                عند وضع الشعار فوق خلفية خضراء داكنة (<code className="font-mono text-emerald-800">#123D3A</code>) أو أي خلفية داكنة، يتحول الطرف الأول (الأخضر الداكن) والاسم اللفظي تلقائياً إلى <strong>اللون الأبيض الصريح (#FFFFFF)</strong> لضمان أعلى درجات التباين والتمييز، بينما يحافظ الطرف الثاني على لونه الرمادي الناعم ونقطة الالتقاء على لونها البرتقالي الدافئ.
              </p>
            </div>
          </div>
        </section>

        {/* =====================================
            COLORS
        ====================================== */}

        <section className="space-y-7">
          <SectionHeading
            eyebrow="03 / COLOR SYSTEM"
            title="نظام الألوان"
            description="لوحة الألوان الوظيفية المعتمدة، مع تحديد وظيفة كل لون واستخداماته في الواجهة."
            icon={Palette}
          />

          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-2">
              {[
                { id: "all", label: "الكل" },
                { id: "primary", label: "أساسية" },
                { id: "secondary", label: "مساندة" },
                { id: "neutral", label: "محايدة" },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveGroup(item.id)}
                  aria-pressed={activeGroup === item.id}
                  className={`rounded-full px-4 py-2 text-xs font-bold transition ${activeGroup === item.id
                    ? "bg-[#123D3A] text-white"
                    : "border border-slate-200 bg-white text-slate-600 hover:border-[#123D3A]"
                    }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={copyAllTokens}
              className="flex items-center gap-2 rounded-xl bg-[#123D3A] px-4 py-2.5 text-xs font-bold text-white transition hover:bg-[#206C63]"
            >
              <Code2 className="h-4 w-4" />
              نسخ CSS Variables
            </button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {filteredColors.map((color) => (
              <button
                key={color.variable}
                type="button"
                onClick={() => copyText(color.hex, color.hex)}
                aria-label={`نسخ اللون ${color.name}: ${color.hex}`}
                className="group overflow-hidden rounded-3xl border border-slate-200 text-right transition duration-200 hover:-translate-y-1 hover:shadow-xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#123D3A]"
              >
                <div
                  className="flex h-36 flex-col justify-between p-4"
                  style={{ backgroundColor: color.hex }}
                >
                  <div className="flex justify-between">
                    <span
                      className={`rounded-lg px-2 py-1 text-[10px] font-mono ${color.textLight
                        ? "bg-white/20 text-white"
                        : "bg-black/10 text-slate-900"
                        }`}
                    >
                      RGB {color.rgb}
                    </span>
                    {copied === color.hex ? (
                      <Check className="h-5 w-5 text-emerald-500" />
                    ) : (
                      <Copy
                        className={`h-4 w-4 ${color.textLight ? "text-white" : "text-slate-700"
                          }`}
                      />
                    )}
                  </div>

                  <span
                    className={`font-mono text-sm font-black ${color.textLight ? "text-white" : "text-slate-900"
                      }`}
                  >
                    {color.hex}
                  </span>
                </div>

                <div className="space-y-2 bg-white p-4">
                  <h3 className="text-sm font-black text-[#123D3A]">
                    {color.name}
                  </h3>
                  <p className="text-[10px] font-bold text-slate-400">
                    {color.english}
                  </p>
                  <p className="text-xs leading-6 text-slate-500">
                    {color.usage}
                  </p>
                  <p className="border-t border-slate-100 pt-2 text-[10px] font-mono text-slate-400">
                    {color.variable}
                  </p>
                </div>
              </button>
            ))}
          </div>

          <div className="rounded-3xl border border-amber-200 bg-amber-50 p-5">
            <div className="flex items-start gap-3">
              <Info className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" />
              <div>
                <h3 className="text-sm font-black text-amber-950">
                  ملاحظة مهمة حول التباين
                </h3>
                <p className="mt-2 text-xs leading-7 text-amber-900">
                  يستخدم البرتقالي كلون إبراز وخلفية للأزرار مع نص داكن
                  مثل #123D3A أو #0F172A. لا يُعتمد النص الأبيض فوق
                  البرتقالي للنصوص العادية قبل التحقق من نسبة التباين.
                  كذلك يجب عدم استخدام الرمادي الناعم كنص صغير فوق
                  الخلفيات الفاتحة.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <MiniLabel>COLOR COMBINATIONS</MiniLabel>
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl bg-[#123D3A] p-5 text-white">
                <span className="text-xs font-bold">Primary Combination</span>
                <p className="mt-2 text-lg font-black">تلاقي الفرص</p>
                <p className="mt-1 text-xs text-white/70">
                  أخضر داكن + أبيض
                </p>
              </div>
              <div className="rounded-2xl bg-[#F8F8F5] p-5 text-[#123D3A]">
                <span className="text-xs font-bold">Natural Combination</span>
                <p className="mt-2 text-lg font-black">ابدأ رحلتك</p>
                <p className="mt-1 text-xs text-slate-600">
                  كانفاس + أخضر
                </p>
              </div>
              <div className="rounded-2xl bg-[#D58A38] p-5 text-[#123D3A]">
                <span className="text-xs font-bold">Action Combination</span>
                <p className="mt-2 text-lg font-black">اكتشف الآن</p>
                <p className="mt-1 text-xs text-[#123D3A]/80">
                  برتقالي + أخضر داكن
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================
            TYPOGRAPHY
        ====================================== */}

        <section className="space-y-7">
          <SectionHeading
            eyebrow="04 / TYPOGRAPHY"
            title="الخطوط والسلم الطباعي"
            description="نظام موحد للأحجام والأوزان والتباعد لضمان سهولة القراءة باللغة العربية."
            icon={Type}
          />

          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-[#F8F8F5] p-5 sm:p-9">
            <div className="space-y-8">
              {[
                {
                  label: "Display / H1",
                  size: "text-3xl sm:text-5xl",
                  weight: "Black 900",
                  text: "لكل شخص مهارة يريد تعلمها.",
                  color: "text-[#123D3A]",
                },
                {
                  label: "Heading / H2",
                  size: "text-2xl sm:text-3xl",
                  weight: "Bold 800",
                  text: "اكتشف التدريبات المناسبة لك.",
                  color: "text-[#123D3A]",
                },
                {
                  label: "Subheading / H3",
                  size: "text-xl",
                  weight: "Bold 700",
                  text: "فرص جديدة تبدأ من هنا.",
                  color: "text-[#BE772B]",
                },
                {
                  label: "Body / Regular",
                  size: "text-base",
                  weight: "Regular 400",
                  text: "تلاقي منصة تساعدك في الوصول إلى الفرص التدريبية والتعليمية، وتسهّل على الجهات نشر برامجها والوصول إلى الأشخاص المهتمين بها.",
                  color: "text-slate-700",
                },
                {
                  label: "Caption / Small",
                  size: "text-xs",
                  weight: "Regular 400",
                  text: "تفاصيل التدريب والمعلومات الإضافية تظهر هنا.",
                  color: "text-slate-500",
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="space-y-3 border-b border-slate-200 pb-7 last:border-0 last:pb-0"
                >
                  <div className="flex flex-wrap justify-between gap-2">
                    <MiniLabel>{item.label}</MiniLabel>
                    <MiniLabel>{item.weight}</MiniLabel>
                  </div>
                  <p
                    className={`${item.size} ${item.color} font-bold leading-relaxed`}
                  >
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <ExampleCard title="الخط الأساسي">
              <p className="text-sm text-slate-600">
                Lama Sans
              </p>
              <p className="mt-2 text-xs leading-7 text-slate-500">
                يجب التأكد من تحميل ملفات الخط الفعلية في المشروع،
                وتحديد الأوزان المتاحة بدقة.
              </p>
            </ExampleCard>
            <ExampleCard title="قواعد النص">
              <ul className="space-y-2 text-xs leading-7 text-slate-600">
                <li>• استخدام وزن واضح للعناوين.</li>
                <li>• تجنب الفقرات الطويلة دون تقسيم.</li>
                <li>• المحافظة على ارتفاع سطر مريح.</li>
                <li>• عدم استخدام أكثر من عائلة خطوط دون حاجة.</li>
              </ul>
            </ExampleCard>
          </div>
        </section>

        {/* =====================================
            DESIGN TOKENS
        ====================================== */}

        <section className="space-y-7">
          <SectionHeading
            eyebrow="05 / DESIGN TOKENS"
            title="نظام المسافات والأبعاد"
            description="القواعد الهندسية التي تضبط توزيع العناصر وتضمن الاتساق بين مختلف صفحات المنصة."
            icon={Ruler}
          />

          <ExampleCard title="Spacing Scale" description="سلم المسافات المعتمد">
            <div className="space-y-4">
              {spacingTokens.map((token) => (
                <div
                  key={token.name}
                  className="flex items-center gap-4"
                >
                  <div className="w-12 shrink-0 font-mono text-xs font-bold text-[#123D3A]">
                    {token.name}
                  </div>
                  <div className="h-3 rounded-full bg-[#D58A38]" style={{ width: token.value }} />
                  <div className="min-w-12 font-mono text-xs text-slate-500">
                    {token.value}
                  </div>
                  <div className="text-xs text-slate-500">
                    {token.usage}
                  </div>
                </div>
              ))}
            </div>
          </ExampleCard>

          <ExampleCard title="Border Radius" description="زوايا العناصر">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
              {radiusTokens.map((item) => (
                <div key={item.name} className="space-y-3 text-center">
                  <div
                    className={`mx-auto h-20 w-20 border-2 border-[#123D3A] bg-[#D58A38]/20 ${item.className}`}
                  />
                  <p className="text-xs font-black text-slate-800">
                    {item.name}
                  </p>
                  <p className="font-mono text-xs text-slate-400">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </ExampleCard>

          <ExampleCard title="Elevation & Shadows">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {[
                { name: "None", shadow: "shadow-none" },
                { name: "Small", shadow: "shadow-sm" },
                { name: "Medium", shadow: "shadow-md" },
                { name: "Large", shadow: "shadow-xl" },
              ].map((item) => (
                <div
                  key={item.name}
                  className={`flex h-24 items-center justify-center rounded-2xl border border-slate-100 bg-white ${item.shadow}`}
                >
                  <span className="text-xs font-bold text-slate-600">
                    {item.name}
                  </span>
                </div>
              ))}
            </div>
          </ExampleCard>
        </section>

        {/* =====================================
            COMPONENTS
        ====================================== */}

        <section className="space-y-7">
          <SectionHeading
            eyebrow="06 / UI COMPONENTS"
            title="مكتبة مكونات الواجهة"
            description="أمثلة مرجعية للمكونات التي ينبغي أن تتبعها صفحات الموقع والتطبيق."
            icon={LayoutGrid}
          />

          <div className="grid gap-5 md:grid-cols-2">
            <ExampleCard title="Buttons">
              <div className="space-y-3">
                <button
                  type="button"
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#D58A38] px-5 py-4 text-sm font-black text-[#123D3A] transition hover:bg-[#BE772B] active:scale-[0.98]"
                >
                  <Compass className="h-4 w-4" />
                  اكتشف التدريبات
                </button>

                <button
                  type="button"
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#123D3A] px-5 py-4 text-sm font-black text-white transition hover:bg-[#206C63] active:scale-[0.98]"
                >
                  تسجيل الدخول
                  <ArrowLeft className="h-4 w-4" />
                </button>

                <button
                  type="button"
                  className="w-full rounded-2xl border border-[#123D3A] px-5 py-4 text-sm font-bold text-[#123D3A] transition hover:bg-[#123D3A]/5"
                >
                  معرفة المزيد
                </button>
              </div>
            </ExampleCard>

            <ExampleCard title="Badges & Status">
              <div className="flex flex-wrap gap-2">
                {[
                  ["مجاني بالكامل", "bg-emerald-50 text-emerald-800 border-emerald-200"],
                  ["مدفوع", "bg-amber-50 text-amber-900 border-amber-200"],
                  ["حضوري", "bg-slate-100 text-slate-700 border-slate-200"],
                  ["متاح للتسجيل", "bg-teal-50 text-teal-800 border-teal-200"],
                  ["قريباً", "bg-orange-50 text-orange-900 border-orange-200"],
                ].map(([label, style]) => (
                  <span
                    key={label}
                    className={`rounded-full border px-3 py-2 text-xs font-bold ${style}`}
                  >
                    {label}
                  </span>
                ))}
              </div>
            </ExampleCard>

            <ExampleCard title="Input Fields">
              <div className="space-y-3">
                <label className="block text-xs font-bold text-slate-700">
                  اسم التدريب
                </label>
                <input
                  type="text"
                  placeholder="مثلاً: تطوير الويب"
                  className="w-full rounded-2xl border border-slate-200 bg-[#F8F8F5] px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-[#206C63] focus:ring-2 focus:ring-[#206C63]/15"
                />
                <label className="block text-xs font-bold text-slate-700">
                  المجال التدريبي
                </label>
                <select className="w-full rounded-2xl border border-slate-200 bg-[#F8F8F5] px-4 py-3 text-sm outline-none focus:border-[#206C63]">
                  <option>اختر المجال</option>
                  <option>البرمجة</option>
                  <option>التصميم</option>
                  <option>اللغات</option>
                </select>
              </div>
            </ExampleCard>

            <ExampleCard title="Training Card">
              <div className="overflow-hidden rounded-2xl border border-slate-200">
                <div className="h-24 bg-[#123D3A] p-4">
                  <span className="rounded-full bg-white/15 px-3 py-1 text-[10px] font-bold text-white">
                    تدريب متاح
                  </span>
                </div>
                <div className="space-y-3 p-4">
                  <div className="flex justify-between gap-2">
                    <h4 className="text-sm font-black text-[#123D3A]">
                      أساسيات تطوير الويب
                    </h4>
                    <span className="text-[10px] text-slate-400">
                      حضوري
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    تعلّم أساسيات HTML وCSS وJavaScript.
                  </p>
                  <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                    <span className="text-xs font-bold text-[#206C63]">
                      مجاني
                    </span>
                    <span className="text-xs font-bold text-[#BE772B]">
                      التفاصيل ←
                    </span>
                  </div>
                </div>
              </div>
            </ExampleCard>
          </div>
        </section>

        {/* =====================================
            UX & ACCESSIBILITY
        ====================================== */}

        <section className="space-y-7">
          <SectionHeading
            eyebrow="07 / UX & ACCESSIBILITY"
            title="معايير تجربة الاستخدام"
            description="الهوية ليست مجرد شكل؛ يجب أن تكون سهلة الاستخدام على مختلف الأجهزة والظروف."
            icon={Accessibility}
          />

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: Smartphone,
                title: "Mobile First",
                desc: "تصميم يبدأ من الهاتف ثم يتوسع إلى الأجهزة الأكبر.",
              },
              {
                icon: Eye,
                title: "Readability",
                desc: "نصوص واضحة وتباين مناسب للقراءة.",
              },
              {
                icon: MousePointer2,
                title: "Touch Targets",
                desc: "أهداف تفاعلية لا تقل عن 44×44px حيثما أمكن.",
              },
              {
                icon: Layers,
                title: "Visual Hierarchy",
                desc: "تسلسل واضح يوجه المستخدم إلى أهم المعلومات.",
              },
              {
                icon: ShieldCheck,
                title: "Trust & Privacy",
                desc: "شرح واضح لكيفية استخدام البيانات ومشاركتها.",
              },
              {
                icon: Sun,
                title: "Low Bandwidth",
                desc: "صور محسّنة وواجهات خفيفة تناسب الإنترنت الضعيف.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-3xl border border-slate-200 p-5"
              >
                <item.icon className="mb-4 h-6 w-6 text-[#D58A38]" />
                <h3 className="text-sm font-black text-[#123D3A]">
                  {item.title}
                </h3>
                <p className="mt-2 text-xs leading-7 text-slate-500">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="rounded-3xl border border-slate-200 bg-[#F8F8F5] p-6">
            <h3 className="flex items-center gap-2 text-sm font-black text-[#123D3A]">
              <ShieldCheck className="h-5 w-5 text-[#206C63]" />
              الخصوصية والشفافية
            </h3>
            <p className="mt-3 text-xs leading-8 text-slate-600">
              يجب أن توضح المنصة للمستخدم ما البيانات التي تجمعها،
              ولماذا تجمعها، وكيف تستخدمها، ومع من تشاركها. لا تستخدم
              أي صياغة تتجاوز ممارسات الخصوصية الفعلية للمنصة.
            </p>
          </div>
        </section>

        {/* =====================================
            DO & DON'T
        ====================================== */}

        <section className="space-y-7">
          <SectionHeading
            eyebrow="08 / BRAND CONSISTENCY"
            title="قواعد الحفاظ على الهوية"
            description="قواعد يجب الالتزام بها في جميع المواد الرقمية والتسويقية."
            icon={ShieldCheck}
          />

          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-4 rounded-3xl border border-emerald-200 bg-emerald-50/60 p-6">
              <h3 className="flex items-center gap-2 font-black text-emerald-950">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                ما نلتزم به
              </h3>
              {[
                "استخدام ألوان الهوية المعتمدة.",
                "المحافظة على الشعار ونسبه.",
                "توحيد الخطوط والأوزان.",
                "استخدام مساحات بيضاء مريحة.",
                "التصميم وفق أولوية الهاتف.",
                "استخدام صور حقيقية وموثوقة عند الحاجة.",
                "الالتزام بالمعلومات والوعود الواقعية.",
              ].map((item) => (
                <p key={item} className="flex gap-2 text-xs leading-6 text-emerald-950">
                  <Check className="h-4 w-4 shrink-0" />
                  {item}
                </p>
              ))}
            </div>

            <div className="space-y-4 rounded-3xl border border-rose-200 bg-rose-50/60 p-6">
              <h3 className="flex items-center gap-2 font-black text-rose-950">
                <XCircle className="h-5 w-5 text-rose-600" />
                ما نتجنبه
              </h3>
              {[
                "تغيير ألوان الشعار أو تشويهه.",
                "استخدام ألوان فسفورية غير معتمدة.",
                "استخدام خطوط كثيرة دون مبرر.",
                "ازدحام التصميم بالعناصر.",
                "استخدام إحصائيات أو أرقام وهمية.",
                "استخدام صور مضللة أو غير مرتبطة بالمحتوى.",
                "تقديم وعود غير مضمونة للمستخدم.",
              ].map((item) => (
                <p key={item} className="flex gap-2 text-xs leading-6 text-rose-950">
                  <XCircle className="h-4 w-4 shrink-0" />
                  {item}
                </p>
              ))}
            </div>
          </div>
        </section>

        {/* =====================================
            DEVELOPER HANDOFF
        ====================================== */}

        <section className="space-y-7">
          <SectionHeading
            eyebrow="09 / DEVELOPER HANDOFF"
            title="مرجع المطورين"
            description="قيم قابلة للاستخدام المباشر في ملفات CSS وTailwind."
            icon={Code2}
          />

          <div className="overflow-hidden rounded-3xl bg-[#123D3A] p-6 text-white sm:p-8">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="font-black">CSS Design Tokens</h3>
                <p className="mt-1 text-xs text-white/60">
                  Global brand variables
                </p>
              </div>
              <button
                type="button"
                onClick={copyAllTokens}
                className="flex items-center gap-2 rounded-xl bg-[#D58A38] px-4 py-2.5 text-xs font-black text-[#123D3A] hover:bg-[#BE772B]"
              >
                <Copy className="h-4 w-4" />
                نسخ الكود
              </button>
            </div>

            <pre dir="ltr" className="overflow-x-auto rounded-2xl bg-[#0B2927] p-5 text-left text-xs leading-8 text-[#C9DCD5]">
              {`:root {
  --color-brand-dark: #123D3A;
  --color-brand-orange: #D58A38;
  --color-brand-orange-hover: #BE772B;
  --color-brand-teal: #206C63;
  --color-brand-gray: #A9B5B0;
  --color-brand-canvas: #F8F8F5;
  --color-brand-white: #FFFFFF;
  --color-slate-900: #0F172A;

  --font-brand: "Lama Sans", sans-serif;

  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-xl: 24px;

  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-6: 24px;
  --space-8: 32px;
  --space-12: 48px;
}`}
            </pre>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { label: "Framework", value: "Next.js / React" },
              { label: "Styling", value: "Tailwind CSS" },
              { label: "Direction", value: "RTL / Arabic First" },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-slate-200 p-5"
              >
                <MiniLabel>{item.label}</MiniLabel>
                <p className="mt-2 text-sm font-black text-[#123D3A]">
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </section>

      </div>

      {/* =====================================
          FOOTER
      ====================================== */}

      <footer className="bg-[#123D3A] px-4 py-12 rounded-2xl text-center text-white max-w-7xl mx-auto">
        <div className="mx-auto max-w-3xl">
          <div className="mb-5 flex justify-center">
            <Logo size="lg" theme="dark" />
          </div>

          <h2 className="text-xl font-black">
            هوية واحدة. فرص أكثر. تلاقي أفضل.
          </h2>

          <p className="mt-3 text-xs leading-7 text-white/60">
            هذا الدليل هو المرجع البصري المعتمد لمنصة تلاقي،
            ويُستخدم لضمان الاتساق في جميع المنتجات والقنوات.
          </p>
        </div>
      </footer>
    </main>
  );
}
