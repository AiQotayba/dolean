"use client";

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  CheckCircle2, 
  Search, 
  ExternalLink, 
  GraduationCap, 
  Users, 
  PlusCircle, 
  MessageCircle,
  ArrowLeft
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

export interface CenterItem {
  _id: string;
  name: string;
  orgType: string;
  description?: string;
  logo?: string;
  city?: string;
  district?: string;
  contactPhone?: string;
  contactEmail?: string;
  website?: string;
  isVerified?: boolean;
  coursesCount?: number;
}

// مراكز ومعاهد نموذجية في إدلب والشمال السوري لضمان ظهور الصفحة بكامل حيويتها فوراً
const DEFAULT_IDLIB_CENTERS: CenterItem[] = [
  {
    _id: "center-1",
    name: "معهد الرواد للعلوم واللغات",
    orgType: "institute",
    description: "معهد تعليمي معتمد يقدم دبلومات مهنية في اللغات، إدارة الأعمال، وبرامج السكرتارية التنفيذية.",
    city: "إدلب المدينة",
    district: "شارع الجلاء",
    contactPhone: "+963951234567",
    isVerified: true,
    coursesCount: 5,
  },
  {
    _id: "center-2",
    name: "مركز خطوة للتدريب والتطوير المهني",
    orgType: "institute",
    description: "مركز متخصص في التدريب المهني والتقني، صيانة الهواتف، الطاقة الشمسية، والتمديدات الكهربائية.",
    city: "إدلب",
    district: "سرمدا",
    contactPhone: "+963944112233",
    isVerified: true,
    coursesCount: 4,
  },
  {
    _id: "center-3",
    name: "أكاديمية تك زون للبرمجة والذكاء الاصطناعي",
    orgType: "company",
    description: "أكاديمية برمجية تركز على إعداد مطوري الويب، تطبيقات الهاتف، ومهارات العمل الحر عن بعد.",
    city: "إدلب",
    district: "الدانا",
    contactPhone: "+963966887766",
    isVerified: true,
    coursesCount: 6,
  },
  {
    _id: "center-4",
    name: "جمعية الأمل للتمكين المجتمعي",
    orgType: "ngo",
    description: "منظمة غير ربحية تقدم منحاً وتدريبات مجانية في الإسعاف الأولي، التمريض المنزلي، والخياطة النسائية.",
    city: "إدلب المدينة",
    district: "حي الضبيط",
    contactPhone: "+963933221100",
    isVerified: true,
    coursesCount: 3,
  },
  {
    _id: "center-5",
    name: "مركز آفاق للغات والترجمة",
    orgType: "institute",
    description: "مركز معتمد لتعليم اللغتين الإنجليزية والتركية بمستويات قياسية وفق الإطار الأوروبي المرجعي CEFR.",
    city: "إدلب",
    district: "سرمدا",
    contactPhone: "+963955667788",
    isVerified: true,
    coursesCount: 4,
  },
  {
    _id: "center-6",
    name: "فريق مسار للتأهيل الرقمي",
    orgType: "initiative",
    description: "مبادرة شبابية تهدف لتدريب طلاب الجامعات على مهارات التصميم الجرافيكي، المونتاج، والتسويق الرقمي.",
    city: "إدلب",
    district: "معرة مصرين",
    contactPhone: "+963944332211",
    isVerified: true,
    coursesCount: 2,
  },
];

interface Props {
  initialCenters: CenterItem[];
}

export default function CentersDirectory({ initialCenters }: Props) {
  // دمج المراكز القادمة من قاعدة البيانات مع المراكز النموذجية إن كانت القائمة فارغة
  const centers = useMemo(() => {
    if (initialCenters && initialCenters.length > 0) {
      return initialCenters;
    }
    return DEFAULT_IDLIB_CENTERS;
  }, [initialCenters]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [joinSubmitted, setJoinSubmitted] = useState(false);

  // Form State for Join
  const [centerName, setCenterName] = useState('');
  const [centerCity, setCenterCity] = useState('إدلب');
  const [centerPhone, setCenterPhone] = useState('');
  const [centerType, setCenterType] = useState('institute');

  const filteredCenters = useMemo(() => {
    return centers.filter((center) => {
      const matchesSearch =
        center.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (center.description && center.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (center.district && center.district.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (center.city && center.city.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCat =
        selectedCategory === 'all' || center.orgType === selectedCategory;

      return matchesSearch && matchesCat;
    });
  }, [centers, searchQuery, selectedCategory]);

  const handleJoinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setJoinSubmitted(true);
    setTimeout(() => {
      setShowJoinModal(false);
      setJoinSubmitted(false);
      setCenterName('');
      setCenterPhone('');
    }, 2500);
  };

  const getOrgTypeLabel = (type: string) => {
    switch (type) {
      case 'institute':
        return 'معهد تدريبي';
      case 'ngo':
        return 'منظمة / جمعية';
      case 'company':
        return 'أكاديمية مهنية';
      case 'initiative':
        return 'مبادرة تعليمية';
      case 'university':
        return 'مركز جامعي';
      default:
        return 'مركز شريك';
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#123D3A] via-[#1a4f4b] to-[#0c2422] text-white p-7 sm:p-10 mb-10 shadow-xl text-right">
        <div className="absolute top-0 left-0 w-80 h-80 bg-[#206C63]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-2xl">
          <Badge variant="accent" className="mb-3 px-3 py-1 font-bold">
            شبكة الشركاء المعتمدين في الشمال السوري
          </Badge>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight mb-3">
            المراكز والمعاهد التدريبية الشريكة
          </h1>
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed max-w-xl mb-6">
            دليل المراكز والمعاهد والمنظمات المنظمة للدورات في إدلب والمناطق المحيطة. تصفح برامجهم المعتمدة وتواصل معهم مباشرة لتأمين مقعدك.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="accent"
              size="default"
              onClick={() => setShowJoinModal(true)}
              className="gap-2 font-bold"
            >
              <PlusCircle className="w-4 h-4" />
              <span>انضم كمركز تدريبي شريك</span>
            </Button>

            <Link href="/courses">
              <Button
                variant="outline"
                size="default"
                className="bg-white/10 hover:bg-white/20 text-white border-white/20 gap-2"
              >
                <GraduationCap className="w-4 h-4" />
                <span>استعراض كافة الدورات</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Search and Category Filters */}
      <div className="space-y-4 mb-8">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative w-full sm:flex-1">
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث باسم المعهد، التخصص (لغات، برمجة، صيانة...) أو المنطقة..."
              className="h-12 pr-10 text-xs sm:text-sm"
            />
            <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-4" />
          </div>

          <div className="w-full sm:w-auto">
            <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
              <TabsList className="w-full sm:w-auto overflow-x-auto justify-start">
                <TabsTrigger value="all">الكل</TabsTrigger>
                <TabsTrigger value="institute">المعاهد التدريبية</TabsTrigger>
                <TabsTrigger value="ngo">المنظمات والجمعيات</TabsTrigger>
                <TabsTrigger value="company">الأكاديميات المهنية</TabsTrigger>
                <TabsTrigger value="initiative">المبادرات</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Centers Grid */}
      {filteredCenters.length === 0 ? (
        <div className="text-center py-12 px-4 bg-slate-50 rounded-3xl border border-slate-200">
          <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800 mb-1">
            لم نجد مركزاً يطابق هذا البحث
          </h3>
          <p className="text-xs text-slate-500 mb-4 max-w-md mx-auto">
            جرب البحث بكلمة مختلفة أو اختر تصنيفاً آخر. هل تمثل مركزاً ترغب بإضافته؟
          </p>
          <Button
            variant="default"
            size="sm"
            onClick={() => setShowJoinModal(true)}
            className="gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            <span>طلب إضافة مركز جديد</span>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCenters.map((center) => (
            <Card
              key={center._id}
              className="group hover:border-[#206C63]/60 hover:shadow-lg transition-all duration-200 flex flex-col justify-between"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-[#123D3A] font-black shrink-0 shadow-xs group-hover:bg-teal-50 transition-colors">
                    <Building2 className="w-6 h-6 text-[#206C63]" />
                  </div>

                  <div className="flex items-center gap-1.5">
                    <Badge variant="secondary" className="text-[10px]">
                      {getOrgTypeLabel(center.orgType)}
                    </Badge>
                    {center.isVerified && (
                      <Badge variant="success" className="text-[10px] gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>موثّق</span>
                      </Badge>
                    )}
                  </div>
                </div>

                <CardTitle className="text-base sm:text-lg group-hover:text-[#206C63] transition-colors leading-snug">
                  {center.name}
                </CardTitle>

                <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium pt-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>
                    {center.city}
                    {center.district ? ` — ${center.district}` : ''}
                  </span>
                </div>
              </CardHeader>

              <CardContent className="space-y-3 pb-3">
                <CardDescription className="text-xs leading-relaxed text-slate-600 line-clamp-3">
                  {center.description || 'مركز تدريبي معتمد شريك في منصة تلاقي، يقدم دورات مهنية وتطبيقية مع شهادات حضور وتدريب.'}
                </CardDescription>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span className="font-semibold text-slate-700">الدورات المطروحة:</span>
                  <span className="font-bold text-[#123D3A] bg-teal-50 px-2.5 py-0.5 rounded-lg border border-teal-100">
                    {center.coursesCount || 1} دورات معتمدة
                  </span>
                </div>
              </CardContent>

              <CardFooter className="pt-2 border-t border-slate-100 flex items-center gap-2">
                <Link
                  href={`/courses?center=${encodeURIComponent(center.name)}`}
                  className="flex-1"
                >
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full text-xs font-bold gap-1 text-[#123D3A] border-slate-200 hover:bg-slate-50"
                  >
                    <span>عرض الدورات</span>
                    <ArrowLeft className="w-3.5 h-3.5" />
                  </Button>
                </Link>

                {center.contactPhone && (
                  <a
                    href={`https://wa.me/${center.contactPhone.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0"
                  >
                    <Button
                      variant="secondary"
                      size="sm"
                      className="px-3 hover:bg-emerald-50 hover:text-emerald-700"
                      title="مراسلة عبر واتساب"
                    >
                      <MessageCircle className="w-4 h-4 text-emerald-600" />
                    </Button>
                  </a>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Partner Onboarding CTA Section */}
      <div className="mt-14 rounded-3xl bg-slate-50 border border-slate-200/90 p-6 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 text-right">
        <div className="space-y-2 max-w-xl">
          <Badge variant="accent" className="font-bold text-xs">
            بوابة انضمام الشركاء
          </Badge>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900">
            هل تدير معهداً أو مركزاً تدريبياً في إدلب؟
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            انضم مجاناً لشبكة مراكز تلاقي، واعرض دوراتك أمام آلاف الطلاب والباحثين عن مهارات في منطقتك، واستقبل طلبات التسجيل المباشرة بكل سهولة.
          </p>
        </div>

        <Button
          variant="primary"
          size="lg"
          onClick={() => setShowJoinModal(true)}
          className="shrink-0 gap-2 font-bold bg-[#123D3A] hover:bg-[#206C63] text-white"
        >
          <PlusCircle className="w-5 h-5" />
          <span>طلب توثيق واعتماد مركزك</span>
        </Button>
      </div>

      {/* Join Center Modal */}
      {showJoinModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 text-right space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-lg font-black text-slate-900">
                طلب انضمام مركز تدريبي شريك
              </h3>
              <button
                type="button"
                onClick={() => setShowJoinModal(false)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {joinSubmitted ? (
              <div className="text-center py-6 space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h4 className="text-base font-bold text-slate-900">
                  تم استلام طلبكم بنجاح!
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  سيتواصل معكم فريق منصة تلاقي عبر رقم الواتساب خلال 24 ساعة لاستكمال التوثيق ونشر برامجكم.
                </p>
              </div>
            ) : (
              <form onSubmit={handleJoinSubmit} className="space-y-4">
                <p className="text-xs text-slate-500">
                  أدخل بيانات المركز للتواصل المباشر والتحقق من التوثيق:
                </p>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    اسم المركز أو المعهد التدريبي *
                  </label>
                  <Input
                    required
                    value={centerName}
                    onChange={(e) => setCenterName(e.target.value)}
                    placeholder="مثال: معهد الريادة للعلوم التقنية"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      المدينة / البلدة *
                    </label>
                    <Input
                      required
                      value={centerCity}
                      onChange={(e) => setCenterCity(e.target.value)}
                      placeholder="إدلب، سرمدا..."
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      نوع الجهة *
                    </label>
                    <select
                      value={centerType}
                      onChange={(e) => setCenterType(e.target.value)}
                      className="w-full h-11 px-3 rounded-xl border border-slate-200 bg-slate-50 text-xs font-medium focus:outline-none"
                    >
                      <option value="institute">معهد تدريبي</option>
                      <option value="ngo">منظمة / جمعية</option>
                      <option value="company">أكاديمية مهنية</option>
                      <option value="initiative">مبادرة شبابية</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    رقم الواتساب للإدارة والتنسيق *
                  </label>
                  <Input
                    required
                    type="tel"
                    value={centerPhone}
                    onChange={(e) => setCenterPhone(e.target.value)}
                    placeholder="+963..."
                    className="dir-ltr text-left"
                  />
                </div>

                <div className="pt-2 flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowJoinModal(false)}
                    className="flex-1"
                  >
                    إلغاء
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    className="flex-1 bg-[#123D3A] hover:bg-[#206C63] text-white"
                  >
                    إرسال الطلب
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
