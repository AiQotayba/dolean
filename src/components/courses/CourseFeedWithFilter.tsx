"use client";

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  Compass, 
  MapPin, 
  Building2, 
  Laptop, 
  ArrowLeft,
  Search,
  BookOpen,
  GraduationCap,
  Clock
} from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface CourseItem {
  _id: string;
  title: string;
  summary?: string;
  image?: string;
  location?: string;
  locationType?: 'online' | 'in_person' | 'hybrid';
  durationHours?: number;
  locationDetails?: {
    city?: string;
    address?: string;
    isOnline?: boolean;
  };
  pricing?: {
    isFree?: boolean;
    cost?: number;
  };
  providingEntity?: {
    name?: string;
  };
}

interface Props {
  initialCourses: CourseItem[];
}

export default function CourseFeedWithFilter({ initialCourses }: Props) {
  const [activeFilter, setActiveFilter] = useState<'all' | 'inPerson' | 'online'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCourses = useMemo(() => {
    if (!initialCourses || initialCourses.length === 0) return [];
    
    return initialCourses.filter((course) => {
      const isOnline = 
        course.locationType === 'online' ||
        course.location?.includes('عن بعد') || 
        course.location?.includes('أونلاين') || 
        course.locationDetails?.isOnline;

      const matchesFilter =
        activeFilter === 'all'
          ? true
          : activeFilter === 'online'
          ? isOnline
          : !isOnline;

      const matchesSearch =
        !searchQuery.trim() ||
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (course.summary && course.summary.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (course.providingEntity?.name &&
          course.providingEntity.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (course.location && course.location.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchesFilter && matchesSearch;
    });
  }, [initialCourses, activeFilter, searchQuery]);

  return (
    <div id="courses" className="w-full space-y-6">
      {/* Search and Tabs Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:max-w-xs">
          <Input
            id="courses-search"
            name="search"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث عن دورة أو مهارة..."
            className="pr-9 h-11 text-xs sm:text-sm"
          />
          <Search className="w-4 h-4 text-slate-400 absolute right-3 top-3.5" />
        </div>

        <Tabs value={activeFilter} onValueChange={(val: any) => setActiveFilter(val)} className="w-full sm:w-auto">
          <TabsList className="w-full sm:w-auto justify-start">
            <TabsTrigger value="all" className="gap-1.5">
              <Compass className="w-3.5 h-3.5" />
              <span>جميع الدورات</span>
            </TabsTrigger>
            <TabsTrigger value="inPerson" className="gap-1.5">
              <MapPin className="w-3.5 h-3.5" />
              <span>في مراكز إدلب</span>
            </TabsTrigger>
            <TabsTrigger value="online" className="gap-1.5">
              <Laptop className="w-3.5 h-3.5" />
              <span>أونلاين</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Courses Grid */}
      {filteredCourses.length === 0 ? (
        <div className="text-center py-12 px-4 bg-slate-50 rounded-3xl border border-slate-200/80">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800 mb-1">
            لم نجد دورات تطابق بحثك حالياً
          </h3>
          <p className="text-xs text-slate-500 mb-5 max-w-sm mx-auto leading-relaxed">
            المراكز في إدلب تعلن عن دورات جديدة باستمرار! اطلب دورتك الآن وسنكون أول من يرسل لك إشعاراً على واتساب فور افتتاح التسجيل.
          </p>
          <Link href="/apply">
            <Button
              variant="primary"
              size="default"
              className="gap-2 font-bold bg-[#123D3A] hover:bg-[#206C63] text-white"
            >
              <span>اطلب دورتك الآن مجاناً</span>
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredCourses.map((course) => (
            <CourseCard key={course._id} course={course} />
          ))}
        </div>
      )}
    </div>
  );
}

function CourseCard({ course }: { course: CourseItem }) {
  const {
    _id,
    title,
    summary,
    image,
    location,
    locationType,
    locationDetails,
    durationHours,
    pricing,
    providingEntity,
  } = course;

  const isOnline =
    locationType === 'online' ||
    location?.includes('عن بعد') ||
    location?.includes('أونلاين') ||
    locationDetails?.isOnline;

  const displayLocation = isOnline ? 'أونلاين' : (location || locationDetails?.city || 'إدلب');
  const isFree = pricing?.isFree ?? (!pricing?.cost || pricing.cost === 0);
  const priceDisplay = isFree ? 'مجانية' : `${pricing?.cost} $`;
  const entityName = providingEntity?.name || '';
  const durationText = durationHours ? `${durationHours} ساعة` : 'مكثف';

  return (
    <Link
      href={`/courses/${_id}`}
      className="group flex flex-col bg-white rounded-2xl border border-slate-200 hover:border-[#123D3A] overflow-hidden shadow-xs hover:shadow-xl hover:shadow-slate-200/60 transition-all duration-200"
    >
      {/* Thumbnail */}
      <div className="relative h-44 w-full overflow-hidden bg-slate-100">
        {image && image.length > 5 ? (
          <img
            loading="lazy"
            src={image}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-tr from-slate-100 to-slate-200 flex items-center justify-center text-slate-400">
            <Building2 className="w-10 h-10 opacity-40" />
          </div>
        )}

        {entityName && (
          <div className="absolute top-2.5 right-2.5 z-10">
            <span className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-white/95 text-slate-800 shadow-sm backdrop-blur-sm flex items-center gap-1 border border-slate-100">
              <Building2 className="w-3 h-3 text-[#206C63]" />
              <span className="truncate max-w-[130px]">{entityName}</span>
            </span>
          </div>
        )}

        <div className="absolute bottom-2.5 left-2.5 z-10">
          <span className={`text-[11px] font-black px-2.5 py-0.5 rounded-lg shadow-sm border ${
            isFree 
              ? 'bg-emerald-600 text-white border-emerald-700' 
              : 'bg-[#D58A38] text-white border-[#BE772B]'
          }`}>
            {priceDisplay}
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div className="space-y-2">
          {/* 1. Title (Once only!) */}
          <h3 className="text-sm sm:text-base font-black text-slate-900 group-hover:text-[#123D3A] transition-colors line-clamp-2 leading-snug">
            {title}
          </h3>

          {/* 2. Specs line: 📍 الموقع · 🎓 السعر · ⏱ المدة */}
          <div className="flex flex-wrap items-center gap-2 text-[11px] font-bold text-slate-600">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
              <MapPin className="w-3 h-3 text-[#206C63]" />
              <span>{displayLocation}</span>
            </span>
            <span>·</span>
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md ${
              isFree ? 'bg-emerald-50 text-emerald-800' : 'bg-amber-50 text-amber-800'
            }`}>
              <GraduationCap className="w-3 h-3" />
              <span>{priceDisplay}</span>
            </span>
            <span>·</span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
              <Clock className="w-3 h-3 text-slate-400" />
              <span>{durationText}</span>
            </span>
          </div>

          {/* 3. One line summary: ماذا ستتعلم */}
          {summary && (
            <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
              {summary}
            </p>
          )}
        </div>

        {/* 4. Action button: [ احجز مقعدك ] */}
        <div className="pt-2">
          <div className="w-full py-2.5 px-3 rounded-xl bg-[#123D3A] group-hover:bg-[#D58A38] text-white text-xs font-black flex items-center justify-center gap-1.5 transition-colors shadow-xs">
            <span>احجز مقعدك</span>
            <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
          </div>
        </div>
      </div>
    </Link>
  );
}
