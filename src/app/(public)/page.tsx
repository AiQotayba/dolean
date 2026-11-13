import { Suspense } from 'react';
import Link from 'next/link';
import Hero from '@/app/landing/Hero';
import HowItWorks from '@/components/theme/HowItWorks';
import Coureslist from '@/app/landing/CouresList';
import PricingSection from '@/app/landing/price';
import FAQAccordion from '@/components/theme/FAQ';
import FeaturedSliders from '@/components/theme/FeaturedSliders';
import CategorySections from '@/components/theme/CategorySections';
import StickyMobileBar from '@/components/theme/StickyMobileBar';
import { CoursesSkeletonGrid } from '@/components/ui/skeleton';
import { Share2, ArrowLeft } from 'lucide-react';
import { connectToDatabase } from '@/lib/db';
import Slider from '@/models/Slider';
import Section from '@/models/Section';

export default async function Home() {
    let sliders: any[] = [];
    let sections: any[] = [];

    try {
        await connectToDatabase();
        const [slidersData, sectionsData] = await Promise.all([
            Slider.find({ deleteState: { $ne: true }, isActive: { $ne: false } }).sort({ order: 1 }).lean(),
            Section.find({ deleteState: { $ne: true }, isActive: { $ne: false } }).sort({ order: 1 }).lean(),
        ]);
        sliders = JSON.parse(JSON.stringify(slidersData));
        sections = JSON.parse(JSON.stringify(sectionsData));
    } catch (e) {
        console.error("Error fetching sliders/sections for home:", e);
    }

    return (
        <div className="w-full flex flex-col items-center relative">
            {/* 1. Immediate Instant SSR Hero */}
            <Hero />

            {/* 2. Featured Dynamic Sliders (Admin Managed) */}
            {sliders.length > 0 && <FeaturedSliders sliders={sliders} />}

            {/* 3. Courses Feed immediately under Sliders with Zero-Delay Streaming */}
            <Suspense fallback={
                <div className="w-full py-8 px-4 sm:px-6 max-w-6xl mx-auto">
                    <div className="h-8 w-48 bg-slate-200/70 rounded-xl mb-6 animate-pulse" />
                    <CoursesSkeletonGrid />
                </div>
            }>
                <Coureslist />
            </Suspense>

            {/* 4. Training Category Sections under Courses */}
            {/* {sections.length > 0 && <CategorySections sections={sections} />} */}

            {/* 5. How It Works (Explaining the 3 Simple Steps) */}
            <HowItWorks />

            {/* 6. Students and Opportunities Ecosystem */}
            <PricingSection />

            {/* 7. Community Share Callout */}
            <section className="w-full py-12 px-4 sm:px-6 max-w-5xl mx-auto">
                <div className="bg-[#123D3A] rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 text-right shadow-2xl text-white relative overflow-hidden border border-[#D58A38]/30">
                    <div className="absolute -top-10 -left-10 w-48 h-48 bg-[#D58A38]/15 rounded-full blur-2xl pointer-events-none" />
                    <div className="absolute bottom-0 right-1/3 w-40 h-40 bg-[#206C63]/30 rounded-full blur-2xl pointer-events-none" />

                    <div className="flex items-center gap-4 relative z-10">
                        <div className="w-12 h-12 rounded-2xl bg-[#D58A38]/20 border border-[#D58A38]/30 text-[#D58A38] flex items-center justify-center shrink-0 shadow-inner">
                            <Share2 className="w-6 h-6 text-[#D58A38]" />
                        </div>
                        <div>
                            <span className="inline-block text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#D58A38]/20 text-[#D58A38] border border-[#D58A38]/40 mb-1">
                                مساهمة مجتمعية
                            </span>
                            <h3 className="text-base sm:text-lg font-black text-[#F8F8F5]">
                                شفت إعلان دورة؟ ساعد غيرك يلاقيها
                            </h3>
                            <p className="text-xs text-[#A9B5B0] mt-1 max-w-md leading-relaxed">
                                أرسل لنا التفاصيل، وبعد المراجعة ننشرها لكل من يبحث عن فرصة.
                            </p>
                        </div>
                    </div>

                    <Link
                        href="/share"
                        className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#D58A38] hover:bg-[#BE772B] text-white font-black text-xs sm:text-sm shadow-lg shadow-[#D58A38]/25 transition active:scale-95 shrink-0 relative z-10"
                    >
                        <span>شارك الفرصة</span>
                        <ArrowLeft className="w-4 h-4 text-white" />
                    </Link>
                </div>
            </section>

            {/* 8. FAQ */}
            <FAQAccordion path="/" />

            {/* 9. Floating Sticky Mobile CTA */}
            <StickyMobileBar />
        </div>
    );
}