"use client";

import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';
import { 
  CheckCircle2, 
  ArrowLeft, 
  ArrowRight, 
  Phone, 
  User, 
  BookOpen, 
  MapPin, 
  DollarSign, 
  Sparkles, 
  RefreshCw,
  Gift,
  Check,
  Mail,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import CountryPhoneInput, { isValidPhoneNumber } from '@/components/forms-client/CountryPhoneInput';

// 4 مهارات رئيسية شائعة للاختيار التفاعلي المتعدد (حد أقصى 4 مقترحات)
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

export default function HeroQuickRequest() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Step 1: Multi-select skills + custom courses input
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [customCourseQuery, setCustomCourseQuery] = useState('');

  // Step 2: Location, Pricing Preferences & Contact
  const [selectedLocation, setSelectedLocation] = useState('مدينة إدلب');
  const [customLocation, setCustomLocation] = useState('');
  const [pricingPreference, setPricingPreference] = useState<'free' | 'paid' | 'both'>('free');
  const [paidLimit, setPaidLimit] = useState<number>(20);

  // Contact Info
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  // Status
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const token = Cookies.get('authorization');
    if (token && token.length > 10) {
      setIsLoggedIn(true);
    }
  }, []);

  // Toggle multi-select skill
  const toggleSkill = (skill: string) => {
    setSelectedSkills((prev) => {
      if (prev.includes(skill)) {
        return prev.filter((s) => s !== skill);
      } else {
        return [...prev, skill];
      }
    });
  };

  // Build combined interests string
  const getCombinedInterests = () => {
    const parts = [...selectedSkills];
    if (customCourseQuery.trim()) {
      parts.push(customCourseQuery.trim());
    }
    return parts.join('، ');
  };

  const handleNextToStep2 = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedSkills.length === 0 && !customCourseQuery.trim()) {
      setErrorMessage('يرجى اختيار مهارة واحدة على الأقل أو كتابة ما تريد تعلمه للمتابعة.');
      return;
    }
    setErrorMessage('');
    setStep(2);
  };

  const submitRequest = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isLoggedIn) {
      if (!fullName.trim() || !phone.trim()) {
        setErrorMessage('يرجى إدخال اسمك الكامل ورقم الواتساب للتواصل معك فور افتتاح الدورة.');
        return;
      }
      if (!isValidPhoneNumber(phone.trim())) {
        setErrorMessage('يرجى التأكد من كتابة رقم الواتساب بشكل صحيح ومكتمل مع رمز الدولة.');
        return;
      }
    }

    setLoading(true);
    setErrorMessage('');

    try {
      const cityToSave = customLocation.trim() || selectedLocation || 'مدينة إدلب';
      const combined = getCombinedInterests();

      const payload: any = {
        fullName: fullName.trim(),
        phone: phone.trim(),
        email: email.trim(),
        District: 'إدلب',
        city: cityToSave,
        interests: combined,
        requiredCourses: selectedSkills,
        freeCourses: pricingPreference === 'free' || pricingPreference === 'both',
        paidCourses: pricingPreference === 'paid' || pricingPreference === 'both',
        paidCoursesLimit: pricingPreference !== 'free' ? Math.max(5, Number(paidLimit) || 5) : 0,
      };

      await axios.post('/api/student/apply', payload);
      setStep(3);
    } catch (err: any) {
      console.error('Request failed:', err);
      setErrorMessage(
        err.response?.data?.message || 'تعذر إرسال الطلب حالياً. يرجى المحاولة بعد قليل.'
      );
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSelectedSkills([]);
    setCustomCourseQuery('');
    setSelectedLocation('مدينة إدلب');
    setCustomLocation('');
    setPricingPreference('free');
    setPaidLimit(20);
    setFullName('');
    setPhone('');
    setEmail('');
    setErrorMessage('');
    setStep(1);
  };

  return (
    <div id="quick-request-card" className="w-full bg-[#F8F8F5] rounded-3xl border border-[#A9B5B0]/40 shadow-2xl p-6 sm:p-8 text-right text-slate-900 transition-all relative overflow-hidden">
      {/* Ambient decorative glow */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-[#D58A38]/5 rounded-bl-full pointer-events-none" />

      {/* Header */}
      <div className="pb-4 mb-5 border-b border-[#A9B5B0]/20 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#123D3A]/10 text-[#123D3A] flex items-center justify-center shrink-0 border border-[#123D3A]/15 shadow-xs">
            <BookOpen className="w-5 h-5 text-[#123D3A]" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-black text-[#123D3A]">
              {step === 1 && 'شو المهارة اللي بدك تتعلمها؟'}
              {step === 2 && 'المنطقة وتفضيلات الدورة'}
              {step === 3 && 'وصل طلبك بنجاح ✓'}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {step === 1 && 'اختر مهارة أو أكثر، ونحن نربطك بالمراكز المعتمدة مجاناً'}
              {step === 2 && 'حدد مدينتك ونوع الدورة المفضل لتوجيه طلبك بدقة'}
              {step === 3 && 'سنراسلك عبر واتساب فور توفر مقعد مناسب لك'}
            </p>
          </div>
        </div>

        {/* Step pill */}
        <span className="px-3 py-1 rounded-full text-[11px] font-black bg-white border border-[#A9B5B0]/40 text-slate-700 shadow-2xs">
          {step === 1 ? '1 / 2' : step === 2 ? '2 / 2' : 'مكتمل ✓'}
        </span>
      </div>

      {errorMessage && (
        <div className="mb-4 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold relative z-10">
          {errorMessage}
        </div>
      )}

      {/* STEP 1: Multi-select Skills + Custom input for all requests in one */}
      {step === 1 && (
        <form onSubmit={handleNextToStep2} className="space-y-5 relative z-10">
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-2">
              اختر المهارات المطلوبة (يمكنك اختيار أكثر من مهارة):
            </label>

            {/* Interactive multi-select chips */}
            <div className="flex flex-wrap gap-2">
              {POPULAR_SKILLS.map((skill) => {
                const isSelected = selectedSkills.includes(skill);
                return (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => toggleSkill(skill)}
                    className={`inline-flex items-center gap-1.5 text-xs sm:text-sm px-3.5 py-2 rounded-xl border transition-all cursor-pointer font-bold active:scale-95 ${
                      isSelected
                        ? 'bg-[#123D3A] text-white border-[#123D3A] shadow-xs'
                        : 'bg-white hover:bg-slate-100/80 text-slate-700 border-[#A9B5B0]/50'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 text-amber-300 stroke-[3]" />}
                    <span>{skill}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom Courses Text Input */}
          <div>
            <label htmlFor="custom-course-input" className="block text-xs font-bold text-slate-800 mb-1.5">
              أو اكتب كافة التدريبات والمهارات التي تحتاجها بطلب واحد:
            </label>
            <textarea
              id="custom-course-input"
              value={customCourseQuery}
              onChange={(e) => setCustomCourseQuery(e.target.value)}
              rows={3}
              placeholder="اكتب هنا أي تخصصات أو مهارات إضافية (مثال: ذكاء اصطناعي، محادثة تركية، تسويق رقمي، حلاقة رجالية، صيانة طاقة شمسية...)"
              className="w-full p-3.5 text-xs sm:text-sm bg-white border border-[#A9B5B0]/60 focus:border-[#123D3A] focus:ring-2 focus:ring-[#123D3A]/10 rounded-2xl leading-relaxed outline-none transition"
            />
          </div>

          {/* Generous Submit / Next Step Button */}
          <div className="pt-2">
            <Button
              type="submit"
              className="w-full py-4 sm:py-5 px-8 h-auto min-h-[54px] font-black text-sm sm:text-base gap-3 bg-[#D58A38] hover:bg-[#BE772B] text-white shadow-xl shadow-[#D58A38]/30 active:scale-98 transition-all cursor-pointer rounded-2xl flex items-center justify-center"
            >
              <span>متابعة إدخال بيانات التواصل والمنطقة</span>
              <ArrowLeft className="w-4 h-4 shrink-0" />
            </Button>
          </div>
        </form>
      )}

      {/* STEP 2: Location + Free/Paid + Willingness to pay + Contact */}
      {step === 2 && (
        <form onSubmit={submitRequest} className="space-y-4 sm:space-y-5 relative z-10">
          {/* Summary of chosen courses */}
          <div className="p-3.5 rounded-2xl bg-white border border-[#A9B5B0]/40 text-xs text-slate-700 flex items-center justify-between">
            <div className="min-w-0 pr-1">
              <span className="text-slate-400 font-medium block text-[11px]">التدريبات المطلوبة:</span>
              <strong className="text-[#123D3A] text-xs sm:text-sm truncate block mt-0.5">
                {getCombinedInterests() || 'غير محدد'}
              </strong>
            </div>
            <button
              type="button"
              onClick={() => setStep(1)}
              className="text-[#D58A38] hover:underline font-bold text-xs shrink-0 mr-2"
            >
              تعديل المهارات
            </button>
          </div>

          {/* 1. Location Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#D58A38]" />
              <span>المنطقة أو المدينة في إدلب والشمال السوري:</span>
            </label>

            <div className="flex flex-wrap gap-1.5 mb-2">
              {POPULAR_LOCATIONS.map((loc) => (
                <button
                  key={loc}
                  type="button"
                  onClick={() => {
                    setSelectedLocation(loc);
                    setCustomLocation('');
                  }}
                  className={`text-xs px-2.5 py-1.5 rounded-xl border transition cursor-pointer font-bold ${
                    selectedLocation === loc && !customLocation
                      ? 'bg-[#123D3A] text-white border-[#123D3A]'
                      : 'bg-white hover:bg-slate-100 text-slate-700 border-[#A9B5B0]/40'
                  }`}
                >
                  {loc}
                </button>
              ))}
            </div>

            <Input
              type="text"
              value={customLocation}
              onChange={(e) => setCustomLocation(e.target.value)}
              placeholder="أو اكتب اسم بلدتك / مخيمك بالتفصيل..."
              className="h-11 bg-white border-[#A9B5B0]/50 focus:border-[#123D3A] rounded-xl text-xs sm:text-sm"
            />
          </div>

          {/* 2. Free vs Paid Preference & Willingness to Pay */}
          <div className="p-4 rounded-2xl bg-white border border-[#A9B5B0]/40 space-y-3">
            <label className="block text-xs font-bold text-slate-800">
              نوع التدريب والتكلفة:
            </label>

            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setPricingPreference('free')}
                className={`py-2 px-2 rounded-xl text-xs font-bold border transition text-center ${
                  pricingPreference === 'free'
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                مجاني 100% (منح)
              </button>

              <button
                type="button"
                onClick={() => setPricingPreference('both')}
                className={`py-2 px-2 rounded-xl text-xs font-bold border transition text-center ${
                  pricingPreference === 'both'
                    ? 'bg-[#123D3A] text-white border-[#123D3A] shadow-2xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                مجاني أو مأجور
              </button>

              <button
                type="button"
                onClick={() => setPricingPreference('paid')}
                className={`py-2 px-2 rounded-xl text-xs font-bold border transition text-center ${
                  pricingPreference === 'paid'
                    ? 'bg-[#D58A38] text-white border-[#D58A38] shadow-2xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                مأجور (رسوم رمزية)
              </button>
            </div>

            {/* Price Limit Input (if willing to pay) */}
            {pricingPreference !== 'free' && (
              <div className="pt-2 border-t border-slate-100 space-y-2 animate-in fade-in duration-200">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700">
                    الحد الأقصى للسعر المستعد لدفعه:
                  </span>
                  <span className="text-xs font-black text-[#D58A38] font-mono">
                    {paidLimit} $ دولار
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {[5, 10, 20, 50].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setPaidLimit(amt)}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-bold border font-mono transition ${
                        paidLimit === amt
                          ? 'bg-[#D58A38] text-white border-[#D58A38]'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {amt} $
                    </button>
                  ))}
                </div>

                <Input
                  type="number"
                  min="5"
                  max="500"
                  value={paidLimit || ''}
                  onChange={(e) => setPaidLimit(Math.max(5, Number(e.target.value) || 5))}
                  placeholder="أو اكتب المبلغ المالي بالدولار (الحد الأدنى 5$)..."
                  className="h-10 bg-slate-50 border-[#A9B5B0]/40 rounded-xl text-xs font-mono"
                />
              </div>
            )}
          </div>

          {/* 3. Name, Phone with Country Code, & Email */}
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label htmlFor="quick-fullname" className="block text-xs font-bold text-slate-700 mb-1">
                  الاسم الكامل <span className="text-[#D58A38]">*</span>
                </label>
                <div className="relative">
                  <Input
                    id="quick-fullname"
                    name="fullName"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="أدخل اسمك الكامل"
                    className="pr-10 h-11 bg-white border-[#A9B5B0]/50 focus:border-[#123D3A] rounded-xl text-xs sm:text-sm"
                    required
                  />
                  <User className="w-4 h-4 text-[#A9B5B0] absolute right-3.5 top-3.5" />
                </div>
              </div>

              <div>
                <label htmlFor="quick-phone" className="block text-xs font-bold text-slate-700 mb-1">
                  رقم الواتساب والدولة <span className="text-[#D58A38]">*</span>
                </label>
                <CountryPhoneInput
                  id="quick-phone"
                  value={phone}
                  onChange={setPhone}
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="quick-email" className="block text-xs font-bold text-slate-700 mb-1">
                البريد الإلكتروني (اختياري)
              </label>
              <div className="relative">
                <Input
                  id="quick-email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="pr-10 h-10 bg-white border-[#A9B5B0]/50 focus:border-[#123D3A] rounded-xl text-xs sm:text-sm font-mono"
                  dir="ltr"
                />
                <Mail className="w-4 h-4 text-[#A9B5B0] absolute right-3.5 top-3" />
              </div>
            </div>
          </div>

          {/* Action Buttons: Back + Generously padded Submit */}
          <div className="flex items-center gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              size="default"
              onClick={() => setStep(1)}
              className="px-4 py-4 h-auto min-h-[54px] rounded-2xl border-[#A9B5B0]/50 bg-white hover:bg-slate-50 text-slate-700"
            >
              <ArrowRight className="w-4 h-4" />
            </Button>

            <Button
              type="submit"
              disabled={loading}
              className="flex-1 py-4 sm:py-5 px-8 h-auto min-h-[54px] font-black text-sm sm:text-base gap-3 bg-[#D58A38] hover:bg-[#BE772B] text-white shadow-xl shadow-[#D58A38]/30 active:scale-98 transition-all cursor-pointer rounded-2xl flex items-center justify-center"
            >
              {loading ? (
                <span>جارٍ إرسال طلبك...</span>
              ) : (
                <>
                  <span>إرسال طلب الدورة وتأكيد التسجيل</span>
                  <CheckCircle2 className="w-5 h-5 shrink-0" />
                </>
              )}
            </Button>
          </div>
        </form>
      )}

      {/* STEP 3: Success Screen */}
      {step === 3 && (
        <div className="py-4 text-center space-y-4 animate-in fade-in zoom-in-95 duration-200 relative z-10">
          <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shadow-inner">
            <CheckCircle2 className="w-9 h-9 text-emerald-700" />
          </div>

          <div>
            <h3 className="text-xl sm:text-2xl font-black text-[#123D3A]">
              وصل طلبك بنجاح ✓
            </h3>
            <p className="text-xs sm:text-sm text-slate-700 mt-2 leading-relaxed max-w-sm mx-auto">
              سجلنا رغبتك بالتدريب لفهم احتياجك والمساعدة في استكشاف فرص تدريبية مناسبة.
            </p>
            <p className="text-xs text-emerald-700 font-bold mt-1.5">
              يمكنك متابعة المستجدات والفرص المنشورة باستمرار عبر المنصة.
            </p>
          </div>

          <div className="pt-3 flex flex-col gap-2.5">
            <a href="#courses" onClick={() => setStep(1)} className="w-full">
              <Button
                type="button"
                className="w-full py-4 h-auto min-h-[50px] bg-[#123D3A] hover:bg-[#0E2F2D] text-white font-black text-sm gap-2 rounded-2xl shadow-md"
              >
                <span>استكشف التدريبات والبرامج المنشورة ←</span>
              </Button>
            </a>

            <Button
              type="button"
              variant="outline"
              onClick={resetForm}
              className="w-full py-3 h-auto min-h-[46px] text-slate-700 border-[#A9B5B0]/50 hover:bg-white font-bold gap-2 rounded-2xl text-xs"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>إرسال طلب تدريب آخر أو لشخص آخر</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
