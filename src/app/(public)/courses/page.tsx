import { Suspense } from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { connectToDatabase } from '@/lib/db';
import Course from '@/models/Course';
import CourseFeedWithFilter from '@/components/courses/CourseFeedWithFilter';
import { PlusCircle } from 'lucide-react';
import { CoursesSkeletonGrid } from '@/components/ui/skeleton';

export const metadata: Metadata = {
    title: 'استكشف الدورات والبرامج التدريبية | تلاقي',
    description: 'تصفح جميع الدورات التدريبية المتاحة وسجل في الدورة المناسبة لك',
};

async function AsyncCourseList() {
    let courses: any[] = [];
    try {
        await connectToDatabase();
        const rawCourses = await Course.find({ deleteState: { $ne: true } })
            .sort({ createdAt: -1 })
            .lean();

        courses = rawCourses.map((c: any) => ({
            _id: c._id.toString(),
            title: c.title || "",
            image: c.image || "",
            location: c.location || "",
            locationDetails: c.locationDetails || null,
            pricing: {
                isFree: c.pricing?.isFree ?? (c.price === 0),
                cost: c.pricing?.cost ?? c.price ?? 0,
            },
            providingEntity: {
                name: c.providingEntity?.name || "",
            },
        }));
    } catch (error) {
        console.error("Error loading courses:", error);
    }

    return <CourseFeedWithFilter initialCourses={courses} />;
}

export default function CoursesPage() {
    return (
        <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-6 border-b border-slate-100">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                        جميع الدورات التدريبية
                    </h1>
                </div>

                <Link
                    href="/apply"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-xs sm:text-sm font-bold shadow-xs transition active:scale-95 w-fit"
                >
                    <PlusCircle className="w-4 h-4" />
                    <span>اطلب دورتك الخاصة</span>
                </Link>
            </div>

            {/* Filterable Feed with Skeleton fallback */}
            <Suspense fallback={<CoursesSkeletonGrid />}>
                <AsyncCourseList />
            </Suspense>
        </div>
    );
}