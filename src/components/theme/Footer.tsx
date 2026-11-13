import Link from "next/link";
import Logo from "./Logo";

export default function Footer() {
    return (
        <footer className="w-full bg-[#F8F8F5] border-t border-[#A9B5B0]/30 pt-12 pb-10 sm:pt-16 sm:pb-12 px-4 sm:px-8 mt-16 sm:mt-24 text-right" dir="rtl">
            <div className="max-w-6xl mx-auto space-y-8 sm:space-y-10">

                {/* Upper Section: Brand, Brief & Main Navigation */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-slate-200/80">
                    <div className="space-y-2.5 max-w-sm">
                        <Link href="/" className="inline-block group">
                            <Logo size="md" />
                        </Link>
                        <p className="text-xs text-slate-500 leading-relaxed font-normal">
                            مساحة تجمع الفرص التدريبية والتعليمية في مكان واحد، وتساعدك على اكتشاف ما يناسبك والتعبير عما ترغب في تعلمه.
                        </p>
                    </div>

                    {/* Navigation Links with comfortable spacing */}
                    <nav aria-label="روابط سريعة" className="flex flex-wrap items-center gap-x-6 sm:gap-x-8 gap-y-3 text-xs sm:text-sm font-bold text-[#123D3A]">
                        <Link href="/" className="hover:text-[#D58A38] transition-colors py-1">
                            الرئيسية
                        </Link>
                        <Link href="/courses" className="hover:text-[#D58A38] transition-colors py-1">
                            استكشف التدريبات
                        </Link>
                        <Link href="/how-it-works" className="hover:text-[#D58A38] transition-colors py-1">
                            كيف تستفيد؟
                        </Link>
                        <Link href="/about" className="hover:text-[#D58A38] transition-colors py-1">
                            من نحن
                        </Link>
                        <Link href="/apply" className="hover:text-[#D58A38] transition-colors py-1">
                            اطلب تدريباً
                        </Link>
                        <Link href="/share" className="hover:text-[#D58A38] transition-colors py-1">
                            شارك تدريباً
                        </Link>
                    </nav>
                </div>

                {/* Lower Section: Copyright & Legal */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 font-medium">
                    <p className="text-center sm:text-right">
                        © {new Date().getFullYear()} منصة تلاقي. جميع الحقوق محفوظة.
                    </p>

                    <div className="flex items-center gap-6">
                        <Link href="/terms" className="hover:text-[#123D3A] underline underline-offset-4 transition-colors">
                            شروط الاستخدام
                        </Link>
                        <a
                            href="mailto:aiqotayba@gmail.com"
                            className="hover:text-[#123D3A] transition-colors"
                        >
                            تواصل معنا
                        </a>
                    </div>
                </div>

            </div>
        </footer>
    );
}
