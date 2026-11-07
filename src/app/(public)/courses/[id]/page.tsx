import MarkdownIt from 'markdown-it';
import Link from 'next/link';
import { connectToDatabase } from '@/lib/db';
import Course from '@/models/Course';
import { 
  Building2, 
  MapPin, 
  Calendar, 
  Users, 
  DollarSign, 
  Bus, 
  Share2, 
  ArrowRight, 
  ExternalLink, 
  CheckCircle2, 
  Sparkles 
} from 'lucide-react';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    try {
        await connectToDatabase();
        const course = await Course.findById(id).lean();
        if (course) {
            return {
                title: `${course.title} | تلاقي`,
                description: course.summary || course.title,
                openGraph: {
                    title: course.title,
                    description: course.summary || course.title,
                },
            };
        }
    } catch (e) {}

    return {
        title: 'تفاصيل الدورة التدريبية | تلاقي',
    };
}

export default async function OneCourse({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const md = new MarkdownIt({ html: true, linkify: true });

    let course: any = null;
    try {
        await connectToDatabase();
        course = await Course.findById(id).lean();
    } catch (err) {
        console.error("Error loading course:", err);
    }

    if (!course) {
        return (
            <div className="w-full max-w-4xl mx-auto px-4 py-20 text-center">
                <div className="w-16 h-16 mx-auto rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mb-4">
                    <Sparkles className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-black text-slate-900 mb-2">الدورة غير موجودة أو انتهى موعدها</h2>
                <p className="text-slate-500 text-sm mb-6">قد تكون الدورة قد أُغلقت أو تم تحديث رابطها.</p>
                <Link
                    href="/courses"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary-600 text-white font-bold text-sm hover:bg-primary-700 transition"
                >
                    <ArrowRight className="w-4 h-4" />
                    <span>تصفح الدورات الأخرى المتاحة</span>
                </Link>
            </div>
        );
    }

    const {
        title,
        context,
        links,
        location,
        locationDetails,
        ageEligibility,
        age,
        nationality,
        price,
        pricing,
        image,
        providingEntity,
        publishingEntity,
        dates,
    } = course;

    const actualPrice = pricing?.cost ?? price;
    const isFree = pricing?.isFree ?? (actualPrice === 0);
    const priceText = isFree ? "مجانية 100%" : `${actualPrice} USD`;

    const displayLocation = location || locationDetails?.city || "أونلاين (عن بعد)";
    const startAge = ageEligibility?.start ?? age?.start;
    const endAge = ageEligibility?.end ?? age?.end;

    const providingName = providingEntity?.name || "";
    const publishingName = publishingEntity?.name || "";

    return (
        <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
            {/* Top Navigation */}
            <div>
                <Link
                    href="/courses"
                    className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-500 hover:text-primary-600 transition"
                >
                    <ArrowRight className="w-4 h-4" />
                    <span>العودة إلى دليل الدورات التدريبية</span>
                </Link>
            </div>

            {/* Course Header Banner */}
            <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-6 sm:p-8">
                    
                    {/* Thumbnail / Poster */}
                    <div className="lg:col-span-5 flex items-center justify-center">
                        {image && image.length > 5 ? (
                            <img
                                loading="lazy"
                                src={image}
                                alt={title}
                                className="w-full max-h-[380px] object-cover rounded-2xl shadow-md border border-slate-100"
                            />
                        ) : (
                            <div className="w-full min-h-[260px] bg-gradient-to-br from-primary-700 via-primary-600 to-blue-600 rounded-2xl flex flex-col items-center justify-center text-white p-6 text-center">
                                <Building2 className="w-12 h-12 mb-3 opacity-80" />
                                <span className="font-bold text-base opacity-95">{providingName || "دورة تدريبية معتمدة"}</span>
                            </div>
                        )}
                    </div>

                    {/* Meta Information */}
                    <div className="lg:col-span-7 flex flex-col justify-between space-y-5">
                        <div className="space-y-3">
                            {/* Entity & Status Badges */}
                            <div className="flex flex-wrap items-center gap-2">
                                {providingName && (
                                    <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-lg bg-primary-50 text-primary-800 border border-primary-200">
                                        <Building2 className="w-3.5 h-3.5" />
                                        <span>الجهة المقدمة: {providingName}</span>
                                    </span>
                                )}

                                {publishingName && publishingName !== providingName && (
                                    <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700">
                                        <span>نشر بواسطة: {publishingName}</span>
                                    </span>
                                )}

                                <span className={`text-xs font-bold px-3 py-1 rounded-lg ${
                                    isFree ? "bg-emerald-50 text-emerald-800 border border-emerald-200" : "bg-slate-100 text-slate-800"
                                }`}>
                                    {priceText}
                                </span>
                            </div>

                            {/* Title */}
                            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
                                {title}
                            </h1>
                        </div>

                        {/* Quick Spec Chips */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm font-semibold text-slate-700 pt-2 border-t border-slate-100">
                            <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                                <span>الموقع: {displayLocation}</span>
                            </div>

                            {(startAge || endAge) && (
                                <div className="flex items-center gap-2">
                                    <Users className="w-4 h-4 text-slate-400 shrink-0" />
                                    <span>الفئة العمرية: {startAge ? `من ${startAge}` : ''} {endAge ? `حتى ${endAge} سنة` : ''}</span>
                                </div>
                            )}

                            {nationality && (
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-slate-400 shrink-0" />
                                    <span>الجنسية: {nationality === 'All' ? 'متاح لجميع الجنسيات' : nationality}</span>
                                </div>
                            )}

                            {dates?.startDate && (
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                                    <span>تاريخ البدء: {new Date(dates.startDate).toLocaleDateString('ar-LB')}</span>
                                </div>
                            )}
                        </div>

                        {/* Quick Actions */}
                        <div className="flex flex-wrap items-center gap-3 pt-2">
                            {links && links.length > 0 ? (
                                <a
                                    href={links[0]}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex-1 min-w-[200px] py-3.5 px-6 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-extrabold text-sm text-center shadow-md shadow-primary-600/25 transition flex items-center justify-center gap-2"
                                >
                                    <span>التسجيل المباشر في الاستمارة</span>
                                    <ExternalLink className="w-4 h-4" />
                                </a>
                            ) : null}

                            <Link
                                href={`/apply?interest=${encodeURIComponent(title)}`}
                                className="flex-1 min-w-[200px] py-3.5 px-6 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-sm text-center shadow-md transition flex items-center justify-center gap-2"
                            >
                                <span>طلب الدورة وتسجيل اهتمامي</span>
                                <Sparkles className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>

                </div>
            </div>

            {/* Course Context / Body Details */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-sm space-y-6">
                <div className="border-b border-slate-100 pb-4">
                    <h2 className="text-xl font-black text-slate-900">تفاصيل ومحاور التدريب</h2>
                    <p className="text-xs sm:text-sm text-slate-500 mt-1">المعلومات والشروط الكاملة الصادرة عن الجهة التدريبية</p>
                </div>

                <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed text-sm sm:text-base space-y-4">
                    {context?.split("\\n").filter(Boolean).map((line: string, index: number) => (
                        <div key={index} dangerouslySetInnerHTML={{ __html: md.render(line) }} />
                    ))}
                </div>

                {/* Additional Links list */}
                {links && links.length > 0 && (
                    <div className="mt-8 pt-6 border-t border-slate-100 bg-slate-50 p-5 rounded-2xl">
                        <h4 className="text-sm font-bold text-slate-900 mb-2">روابط الاستمارات والتسجيل المرفقة:</h4>
                        <div className="space-y-1.5">
                            {links.map((link: string, index: number) => (
                                <a
                                    key={index}
                                    href={link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs sm:text-sm text-primary-700 hover:text-primary-800 font-semibold flex items-center gap-1.5 break-all"
                                >
                                    <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                                    <span>{link}</span>
                                </a>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}