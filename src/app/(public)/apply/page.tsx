"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Cookies from 'js-cookie';
import axios from 'axios';
import {
  GraduationCap,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
  User,
  Phone,
  Mail,
  MapPin,
  Check,
  Sparkles,
  DollarSign,
  Gift,
  BookOpen,
  ShieldCheck,
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import CountryPhoneInput, { isValidPhoneNumber } from '@/components/forms-client/CountryPhoneInput';

// 4 مهارات رئيسية شائعة للاختيار التفاعلي المتعدد (حد أقصى 4 مقترحات تطبيقاً لفلسفة المنصة)
const POPULAR_SKILLS = [
  'اللغة الإنجليزية',
  'الحاسوب و ICDL',
  'التمريض والإسعافات الأولية',
  'التصميم والمونتاج',
];

// المناطق والتجمعات السكانية في إدلب والشمال السوري
const POPULAR_LOCATIONS = [
  'مدينة إدلب',
  'سرمدا',
  'الدانا',
  'أريحا',
  'معرة مصرين',
  'سلقين وحارم',
  'أطمة والمخيمات',
  'عن بعد (أونلاين)',
];

function ApplyForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialInterest = searchParams?.get('interest') || '';
  const initialPricing = searchParams?.get('pricing');

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // 1. Multi-select skills + custom courses
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [customCourseQuery, setCustomCourseQuery] = useState('');

  // 2. Location
  const [selectedLocation, setSelectedLocation] = useState('مدينة إدلب');
  const [customLocation, setCustomLocation] = useState('');

  // 3. Pricing Preference & Budget
  const [pricingPreference, setPricingPreference] = useState<'free' | 'paid' | 'both'>('free');
  const [paidLimit, setPaidLimit] = useState<number>(20);

  // 4. Contact Info
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  // 5. Terms acceptance
  const [termsAccepted, setTermsAccepted] = useState(false);

  // State management
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const token = Cookies.get('authorization');
    if (token && token.length > 10) {
      setIsLoggedIn(true);
    }
    if (initialInterest) {
      if (POPULAR_SKILLS.includes(initialInterest)) {
        setSelectedSkills([initialInterest]);
      } else {
        setCustomCourseQuery(initialInterest);
      }
    }
    if (initialPricing) {
      setPricingPreference(initialPricing === 'paid' ? 'paid' : initialPricing === 'both' ? 'both' : 'free');
    }
  }, [initialInterest, initialPricing]);

  // Toggle multi-select skill
  const toggleSkill = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  // Build combined interests
  const getCombinedInterests = () => {
    const parts = [...selectedSkills];
    if (customCourseQuery.trim()) {
      parts.push(customCourseQuery.trim());
    }
    return parts.join('، ');
  };

  const finalLocation =
    selectedLocation === 'أخرى' && customLocation.trim()
      ? customLocation.trim()
      : selectedLocation;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const combinedInterests = getCombinedInterests();
    if (!combinedInterests) {
      setErrorMsg('يرجى اختيار مهارة واحدة على الأقل أو كتابة ما تريد تعلمه في الحقل المخصص.');
      return;
    }

    if (!isLoggedIn) {
      if (!fullName.trim()) {
        setErrorMsg('يرجى إدخال اسمك الكريم.');
        return;
      }
      if (!phone.trim() || !isValidPhoneNumber(phone.trim())) {
        setErrorMsg('يرجى إدخال رقم واتساب صحيح ومتكامل مع رمز الدولة.');
        return;
      }
    }

    if (!termsAccepted) {
      setErrorMsg('يرجى الموافقة على شروط الاستخدام للمتابعة وإرسال الطلب.');
      return;
    }

    setLoading(true);

    try {
      const payload: any = {
        interests: combinedInterests,
        requiredCourses: selectedSkills,
        District: finalLocation,
        city: finalLocation,
        freeCourses: pricingPreference === 'free' || pricingPreference === 'both',
        paidCourses: pricingPreference === 'paid' || pricingPreference === 'both',
        paidCoursesLimit: pricingPreference === 'free' ? 0 : Math.max(5, Number(paidLimit) || 5),
      };

      if (!isLoggedIn) {
        payload.fullName = fullName.trim();
        payload.phone = phone.trim();
        if (email.trim()) {
          payload.email = email.trim();
        }
      }

      await axios.post('/api/student/apply', payload);
      setSuccess(true);
    } catch (err: any) {
      console.error('Error submitting application:', err);
      setErrorMsg('حدث خطأ أثناء إرسال البيانات. يرجى التأكد من ملء الحقول والمحاولة مجدداً.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    const registeredInterests = getCombinedInterests();
    return (
      <div className="w-full max-w-lg mx-auto bg-white rounded-3xl border border-[#A9B5B0]/30 shadow-2xl p-8 text-center my-12 animate-in fade-in">
        <div className="w-16 h-16 mx-auto rounded-3xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4 border border-emerald-200">
          <CheckCircle2 className="w-9 h-9" />
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-[#123D3A] mb-2">
          تم تسجيل طلبك التدريبي بنجاح!
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 mb-6 max-w-md mx-auto leading-relaxed">
          طلبك لكافة التدريبات: <strong className="text-[#D58A38]">"{registeredInterests}"</strong> في <strong className="text-slate-800">{finalLocation}</strong> تم تسجيله لفهم احتياجك والمساهمة في استكشاف فرص تدريبية مناسبة.
        </p>

        <div className="p-4 rounded-2xl bg-[#F8F8F5] border border-slate-200/80 mb-6 text-right space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-slate-500 font-medium">نوع التدريب المفضل:</span>
            <span className="font-bold text-[#123D3A]">
              {pricingPreference === 'free'
                ? 'تدريب مجاني بالكامل'
                : pricingPreference === 'paid'
                  ? `مدفوع (سقف ${paidLimit}$)`
                  : `مجاني أو مدفوع (سقف ${paidLimit}$)`}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-500 font-medium">المنطقة المحددة:</span>
            <span className="font-bold text-slate-800">{finalLocation}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-500 font-medium">وسيلة الإشعار:</span>
            <span className="font-bold text-emerald-700">رسالة واتساب فور اعتماد المركز</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/courses" className="w-full sm:w-auto">
            <Button
              variant="default"
              size="default"
              className="w-full bg-[#123D3A] hover:bg-[#0E2F2D] text-white font-bold rounded-xl px-6 py-3"
            >
              تصفح الدورات المتاحة حالياً
            </Button>
          </Link>
          <Button
            type="button"
            variant="outline"
            size="default"
            onClick={() => {
              setSuccess(false);
              setSelectedSkills([]);
              setCustomCourseQuery('');
            }}
            className="w-full sm:w-auto font-bold rounded-xl border-slate-300"
          >
            طلب تدريب آخر
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-8 sm:py-12">
      <div className="mb-4">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-[#123D3A] transition"
        >
          <ArrowRight className="w-4 h-4" />
          <span>العودة للرئيسية</span>
        </Link>
      </div>

      <div className="bg-[#F8F8F5] rounded-3xl border border-[#A9B5B0]/40 shadow-2xl p-6 sm:p-9 text-right relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-[#D58A38]/5 rounded-bl-full pointer-events-none" />

        {/* Header */}
        <div className="pb-5 mb-6 border-b border-[#A9B5B0]/25 flex items-center justify-between relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <Badge variant="brand" className="font-black bg-[#D58A38] text-white">
                طلب تدريب مخصص
              </Badge>
              <span className="text-[11px] font-bold text-[#123D3A]/70">الشمال السوري</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-[#123D3A]">
              اطلب كافة تدريباتك في استمارة واحدة
            </h1>
            <p className="text-xs text-slate-600 mt-1 max-w-md">
              {isLoggedIn
                ? 'أنت مسجل الدخول، اختر المهارات التي تبحث عنها وسنربطك بالمراكز فوراً'
                : 'اختر المهارات المقترحة واكتب أي تخصصات إضافية، وسنصلك بأفضل المراكز المعتمدة مجاناً'}
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[#123D3A]/10 text-[#123D3A] flex items-center justify-center shrink-0 border border-[#123D3A]/15 shadow-xs">
            <GraduationCap className="w-6 h-6 text-[#123D3A]" />
          </div>
        </div>

        {errorMsg && (
          <div className="mb-5 p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
          {/* Section 1: 4 Suggested Skills Chips (Multi-Select) */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-slate-800">
                التدريبات المقترحة الشائعة (يمكنك اختيار أكثر من تخصص):
              </label>
              {selectedSkills.length > 0 && (
                <span className="text-[11px] font-bold text-[#D58A38]">
                  تم اختيار {selectedSkills.length} مهارات
                </span>
              )}
            </div>

            {/* Exactly 4 skills chips */}
            <div className="flex flex-wrap gap-2">
              {POPULAR_SKILLS.map((skill) => {
                const isSelected = selectedSkills.includes(skill);
                return (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => toggleSkill(skill)}
                    className={`inline-flex items-center gap-1.5 text-xs sm:text-sm px-4 py-2.5 rounded-xl border transition-all cursor-pointer font-bold active:scale-95 ${isSelected
                      ? 'bg-[#123D3A] text-white border-[#123D3A] shadow-xs'
                      : 'bg-white hover:bg-slate-100/90 text-slate-700 border-[#A9B5B0]/50'
                      }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 text-amber-300 stroke-[3]" />}
                    <span>{skill}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 2: Unified Input for all other courses */}
          <div className="space-y-1.5">
            <label htmlFor="apply-custom-courses" className="block text-xs font-bold text-slate-800">
              اكتب كافة التدريبات التي تحتاجها في طلب واحد:
            </label>
            <textarea
              id="apply-custom-courses"
              rows={3}
              value={customCourseQuery}
              onChange={(e) => setCustomCourseQuery(e.target.value)}
              placeholder="اكتب هنا جميع التخصصات أو المهارات الإضافية (مثال: تسويق إلكتروني، حلاقة، محادثة ألماني، إكسل مالي، صيانة طاقة شمسية...)"
              className="w-full p-3.5 text-xs sm:text-sm bg-white border border-[#A9B5B0]/60 focus:border-[#123D3A] focus:ring-2 focus:ring-[#123D3A]/10 rounded-2xl leading-relaxed outline-none transition resize-none shadow-2xs"
            />
            <p className="text-[11px] text-slate-500">
              يمكنك كتابة عدة تدريبات مفصولة بفواصل، وسنقوم بتوجيه طلبك إلى كافة المراكز المناسبة.
            </p>
          </div>

          {/* Section 3: Region / Location Selection */}
          <div className="space-y-2 pt-2 border-t border-[#A9B5B0]/20">
            <label className="block text-xs font-bold text-slate-800">
              المنطقة أو المدينة المفضلة للتدريب:
            </label>
            <div className="flex flex-wrap gap-1.5">
              {POPULAR_LOCATIONS.map((loc) => {
                const isSelected = selectedLocation === loc;
                return (
                  <button
                    key={loc}
                    type="button"
                    onClick={() => {
                      setSelectedLocation(loc);
                      if (loc !== 'أخرى') setCustomLocation('');
                    }}
                    className={`text-xs px-3 py-1.5 rounded-xl border transition-all cursor-pointer font-bold ${isSelected
                      ? 'bg-[#123D3A] text-white border-[#123D3A] shadow-2xs'
                      : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                  >
                    {loc}
                  </button>
                );
              })}
              <button
                type="button"
                onClick={() => setSelectedLocation('أخرى')}
                className={`text-xs px-3 py-1.5 rounded-xl border transition-all cursor-pointer font-bold ${selectedLocation === 'أخرى'
                  ? 'bg-[#123D3A] text-white border-[#123D3A] shadow-2xs'
                  : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
                  }`}
              >
                منطقة أخرى...
              </button>
            </div>

            {selectedLocation === 'أخرى' && (
              <div className="mt-2 animate-in fade-in">
                <Input
                  type="text"
                  value={customLocation}
                  onChange={(e) => setCustomLocation(e.target.value)}
                  placeholder="اكتب اسم بلدتك، قريتك، أو المخيم..."
                  className="bg-white rounded-xl text-xs py-2 border-[#A9B5B0]/60"
                  required
                />
              </div>
            )}
          </div>

          {/* Section 4: Free vs Paid Preferences + Budget Limit */}
          <div className="space-y-3 pt-2 border-t border-[#A9B5B0]/20">
            <label className="block text-xs font-bold text-slate-800">
              نوع التدريب والميزانية المقبولة:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setPricingPreference('free')}
                className={`p-3 rounded-2xl border text-right transition cursor-pointer flex flex-col justify-between gap-1.5 ${pricingPreference === 'free'
                  ? 'bg-[#123D3A] text-white border-[#123D3A] shadow-xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100/70'
                  }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black">مجاني بالكامل</span>
                  <Gift className={`w-4 h-4 ${pricingPreference === 'free' ? 'text-amber-300' : 'text-slate-400'}`} />
                </div>
                <span className={`text-[10px] ${pricingPreference === 'free' ? 'text-slate-200' : 'text-slate-500'}`}>
                  أبحث عن منحة أو كورس مجاني
                </span>
              </button>

              <button
                type="button"
                onClick={() => setPricingPreference('paid')}
                className={`p-3 rounded-2xl border text-right transition cursor-pointer flex flex-col justify-between gap-1.5 ${pricingPreference === 'paid'
                  ? 'bg-[#123D3A] text-white border-[#123D3A] shadow-xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100/70'
                  }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black">مستعد للدفع (مدفوع)</span>
                  <DollarSign className={`w-4 h-4 ${pricingPreference === 'paid' ? 'text-amber-300' : 'text-slate-400'}`} />
                </div>
                <span className={`text-[10px] ${pricingPreference === 'paid' ? 'text-slate-200' : 'text-slate-500'}`}>
                  أبحث عن سرعة وجودة احترافية
                </span>
              </button>

              <button
                type="button"
                onClick={() => setPricingPreference('both')}
                className={`p-3 rounded-2xl border text-right transition cursor-pointer flex flex-col justify-between gap-1.5 ${pricingPreference === 'both'
                  ? 'bg-[#123D3A] text-white border-[#123D3A] shadow-xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100/70'
                  }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black">الخياران متاحان</span>
                  <Sparkles className={`w-4 h-4 ${pricingPreference === 'both' ? 'text-amber-300' : 'text-slate-400'}`} />
                </div>
                <span className={`text-[10px] ${pricingPreference === 'both' ? 'text-slate-200' : 'text-slate-500'}`}>
                  الأهم توفر المقعد والمحتوى
                </span>
              </button>
            </div>

            {/* Willingness to Pay Limit if Paid or Both */}
            {pricingPreference !== 'free' && (
              <div className="p-3.5 rounded-2xl bg-white border border-[#A9B5B0]/50 space-y-2 animate-in fade-in">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">
                    الحد الأقصى للسعر المستعد لدفعه للدورة:
                  </span>
                  <span className="text-xs font-black text-[#D58A38] font-mono">
                    {paidLimit > 0 ? `${paidLimit} دولار أمريكي` : 'غير محدد'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {[5, 10, 20, 50].map((amount) => (
                    <button
                      key={amount}
                      type="button"
                      onClick={() => setPaidLimit(amount)}
                      className={`flex-1 py-1.5 rounded-xl text-xs font-bold border transition ${paidLimit === amount
                        ? 'bg-[#123D3A] text-white border-[#123D3A]'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                        }`}
                    >
                      {amount}$
                    </button>
                  ))}
                  <div className="w-24">
                    <Input
                      type="number"
                      min={5}
                      max={500}
                      value={paidLimit || ''}
                      onChange={(e) => setPaidLimit(Math.max(5, Number(e.target.value) || 5))}
                      placeholder="مخصص $"
                      className="h-8 text-xs bg-white text-center rounded-xl border-slate-200"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Section 5: Contact Info (if guest) */}
          {!isLoggedIn && (
            <div className="space-y-3 pt-2 border-t border-[#A9B5B0]/20">
              <label className="block text-xs font-bold text-slate-800">
                بيانات التواصل (للتواصل معك ومتابعة طلبك):
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    الاسم الكامل <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="أدخل اسمك الكامل"
                      className="pr-10 bg-white rounded-xl border-[#A9B5B0]/60 text-xs sm:text-sm py-2"
                      required
                    />
                    <User className="w-4 h-4 text-slate-400 absolute right-3.5 top-3" />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    رقم الهاتف / واتساب والدولة <span className="text-red-500">*</span>
                  </label>
                  <CountryPhoneInput
                    id="apply-phone"
                    value={phone}
                    onChange={setPhone}
                    required
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    البريد الإلكتروني <span className="text-slate-400 font-normal">(اختياري)</span>
                  </label>
                  <div className="relative">
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="pr-10 dir-ltr text-left bg-white rounded-xl border-[#A9B5B0]/60 text-xs sm:text-sm py-2"
                    />
                    <Mail className="w-4 h-4 text-slate-400 absolute right-3.5 top-3" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Terms Agreement Checkbox */}
          <div className="pt-1">
            <label className="flex items-start gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-[#D58A38] focus:ring-[#D58A38] mt-0.5 shrink-0 cursor-pointer accent-[#D58A38]"
                required
              />
              <span className="text-xs text-slate-700 leading-relaxed font-medium">
                أوافق على{' '}
                <Link
                  href="/terms"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-[#123D3A] underline hover:text-[#D58A38] transition"
                >
                  شروط الاستخدام
                </Link>
                ، وأقر بصحة المعلومات التي قدمتها.
              </span>
            </label>
          </div>

          {/* Section 6: Action Button with Generous, Prominent Padding */}
          <div className="pt-2">
            <Button
              type="submit"
              disabled={loading}
              className="w-full py-4 sm:py-5 px-8 min-h-[54px] rounded-2xl font-black text-sm sm:text-base gap-3 bg-[#D58A38] hover:bg-[#BE772B] text-white shadow-xl shadow-[#D58A38]/30 active:scale-98 transition-all cursor-pointer flex items-center justify-center border-none"
            >
              {loading ? (
                <span>جارٍ تسجيل طلبك التدريبي...</span>
              ) : (
                <>
                  <span>{isLoggedIn ? 'إرسال رغبة التدريب المخصصة' : 'سجّل طلبك الآن مجاناً'}</span>
                  <ArrowLeft className="w-4 h-4 shrink-0" />
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function ApplyPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-sm text-slate-400">جارٍ التحميل...</div>}>
      <ApplyForm />
    </Suspense>
  );
}
