import Link from "next/link";
import Logo from "./Logo";

export default function Footer() {
    return (
        <footer className="w-full bg-[#F8F8F5] border-t border-[#A9B5B0]/30 py-8 px-4 sm:px-6 mt-12">
            <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
                
                {/* Brand */}
                <Link href="/" className="group">
                    <Logo size="sm" />
                </Link>

                {/* Nav Links */}
                <div className="flex flex-wrap items-center justify-center gap-5 text-xs font-semibold text-[#123D3A]">
                    <Link href="/" className="hover:text-[#D58A38] transition">الرئيسية</Link>
                    <Link href="/courses" className="hover:text-[#D58A38] transition">استكشف الدورات</Link>
                    <Link href="/how-it-works" className="hover:text-[#D58A38] transition">كيف نعمل؟</Link>
                    <Link href="/about" className="hover:text-[#D58A38] transition">من نحن</Link>
                    <Link href="/apply" className="hover:text-[#D58A38] transition">اطلب تدريباً</Link>
                    <Link href="/share" className="hover:text-[#D58A38] transition">شارك تدريباً</Link>
                </div>

                {/* Copyright */}
                <p className="text-[11px] text-[#A9B5B0]">
                    © 2026 تلاقي. جميع الحقوق محفوظة.
                </p>

            </div>
        </footer>
    );
}
