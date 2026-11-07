import { Metadata } from 'next';
import Link from 'next/link';
import AddDefCourse from '@/components/forms-client/defcourse';
import { ArrowRight, Share2 } from 'lucide-react';

export const metadata: Metadata = {
    title: 'مشاركة فرصة تدريبية | تلاقي',
    description: 'شارك إعلانات وتفاصيل الدورات التدريبية المتاحة في منطقتك لنشرها للمتعلمين والباحثين عن مهارات.',
};

export default function ShareCoursePage() {
    return (
        <div className="w-full max-w-2xl mx-auto px-4 py-8 sm:py-12">
            {/* Top Navigation */}
            <div className="mb-6">
                <Link
                    href="/"
                    className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-500 hover:text-primary-600 transition"
                >
                    <ArrowRight className="w-4 h-4" />
                    <span>العودة للرئيسية</span>
                </Link>
            </div>

            {/* Subpage Form Card */}
            <AddDefCourse />
        </div>
    );
}
