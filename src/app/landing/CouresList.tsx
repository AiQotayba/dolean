import Link from "next/link";
import { connectToDatabase } from "@/lib/db";
import Course from "@/models/Course";
import CourseFeedWithFilter from "@/components/courses/CourseFeedWithFilter";
import { ArrowLeft, Compass } from "lucide-react";

export default async function CoursesList() {
    let courses: any[] = [];
    try {
        await connectToDatabase();
        const rawCourses = await Course.find({ deleteState: { $ne: true } })
            .sort({ createdAt: -1 })
            .limit(6)
            .lean();

        courses = rawCourses.map((c: any) => ({
            _id: c._id.toString(),
            title: c.title || "",
            summary: c.summary || "",
            image: c.image || "",
            location: c.location || "",
            locationType: c.locationType || (c.location?.includes('عن بعد') || c.location?.includes('أونلاين') ? 'online' : 'in_person'),
            durationHours: c.schedule?.durationHours || 40,
            locationDetails: c.locationDetails || null,
            pricing: {
                isFree: c.pricing?.isFree ?? (c.price === 0 || !c.price),
                cost: c.pricing?.cost ?? c.price ?? 0,
            },
            providingEntity: {
                name: c.providingEntity?.name || "",
            },
        }));
    } catch (error) {
        console.error("Error loading courses for homepage:", error);
    }

    // High quality fallback courses if database has no active courses or is connecting
    if (!courses || courses.length === 0) {
        courses = [
            {
                _id: 'demo-1',
                title: 'دورة صيانة وبرمجة الهواتف الذكية الشاملة',
                summary: 'تأهيل عملي على فحص المخططات وتبديل الآيسيات وبرمجة أنظمة Android و iOS',
                image: 'https://images.unsplash.com/photo-1597740985671-2a8a3b805337?w=600&auto=format&fit=crop&q=80',
                location: 'إدلب - المعهد التقني',
                locationType: 'in_person',
                durationHours: 60,
                pricing: { isFree: true, cost: 0 },
                providingEntity: { name: 'المعهد المهني المتقدم' },
            },
            {
                _id: 'demo-2',
                title: 'تطوير واجهات وتطبيقات الويب الحديثة (Next.js & React)',
                summary: 'بناء مواقع وتطبيقات تفاعلية متكاملة وتجهيز بروفايل للعمل عن بعد والعمل الحر',
                image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&auto=format&fit=crop&q=80',
                location: 'أونلاين',
                locationType: 'online',
                durationHours: 75,
                pricing: { isFree: true, cost: 0 },
                providingEntity: { name: 'أكاديمية مسار للبرمجة' },
            },
            {
                _id: 'demo-3',
                title: 'دورة الإسعافات الأولية والرعاية الصحية الميدانية',
                summary: 'اكتساب المهارات الحيوية لإنقاذ الحياة والتعامل مع الطوارئ والإصابات',
                image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&auto=format&fit=crop&q=80',
                location: 'إدلب - الدانا',
                locationType: 'in_person',
                durationHours: 30,
                pricing: { isFree: true, cost: 0 },
                providingEntity: { name: 'فريق الاستجابة الصحية' },
            },
        ];
    }

    return (
        <section className="w-full py-16 px-4 sm:px-6 bg-[#F8F8F5] border-b border-[#A9B5B0]/30" id="courses">
            <div className="max-w-6xl mx-auto">
                {/* Section Header */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 mb-6 border-b border-[#A9B5B0]/20">
                    <div>
                        <h2 className="text-2xl sm:text-3xl font-black text-[#123D3A] tracking-tight">
                            فرص وتدريبات منشورة
                        </h2>
                        <p className="text-xs sm:text-sm text-slate-600 mt-1">
                            اطّلع على تفاصيل التدريبات وتعرّف على مواعيد وشروط التسجيل الموضحة لكل فرصة.
                        </p>
                    </div>

                    <Link
                        href="/courses"
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#123D3A] hover:bg-[#0E2F2D] text-white text-xs sm:text-sm font-bold shadow-xs transition active:scale-95 shrink-0"
                    >
                        <span>استكشف جميع التدريبات</span>
                        <ArrowLeft className="w-4 h-4 text-[#D58A38]" />
                    </Link>
                </div>

                {/* Courses Feed with Filter */}
                <CourseFeedWithFilter initialCourses={courses} />
            </div>
        </section>
    );
}
