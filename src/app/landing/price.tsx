import Link from "next/link";
import { CheckCircle2, GraduationCap, Building2, ArrowLeft, ShieldCheck } from "lucide-react";

export default function PricingSection() {
    return (
        <section className="w-full py-16 px-4 sm:px-6 bg-[#123D3A] text-white relative overflow-hidden" id="ecosystem">
            {/* Background ambient lighting in brand colors */}
            <div className="absolute top-1/2 left-0 w-80 h-80 bg-[#D58A38]/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute top-10 right-10 w-96 h-96 bg-[#206C63]/30 rounded-full blur-3xl pointer-events-none" />

            <div className="max-w-5xl mx-auto relative z-10">
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/10 border border-[#A9B5B0]/30 text-[#F8F8F5] text-xs font-bold mb-3 backdrop-blur-sm">
                        <ShieldCheck className="w-3.5 h-3.5 text-[#D58A38]" />
                        <span>منظومة متكاملة لتمكين الشمال السوري</span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-black text-[#F8F8F5] tracking-tight">
                        مصممة لخدمة الطلاب والمراكز معاً
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                    {/* 6. قسم الطلاب */}
                    <div className="flex flex-col justify-between bg-gradient-to-b from-[#184E4A] to-[#0E2F2D] rounded-3xl p-6 sm:p-8 border border-[#D58A38]/50 shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-4 left-4 bg-[#D58A38]/20 text-[#D58A38] text-xs font-extrabold px-3 py-1 rounded-full border border-[#D58A38]/40">
                            مجاني دائماً
                        </div>

                        <div>
                            <div className="w-12 h-12 rounded-2xl bg-[#D58A38] text-white flex items-center justify-center mb-5 shadow-lg shadow-[#D58A38]/30">
                                <GraduationCap className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl sm:text-2xl font-black text-[#F8F8F5] mb-1.5">
                                مهارتك الجاية على بعد طلب واحد
                            </h3>
                            <p className="text-xs text-[#A9B5B0] mb-6 leading-relaxed">
                                مجاني دائماً. لا رسوم تسجيل ولا رسوم وساطة.
                            </p>

                            <ul className="space-y-3.5 mb-8 text-right">
                                {[
                                    "اطلب أي مهارة حتى لو ما كانت معروضة. نحن نشتغل على توفيرها",
                                    "إشعار فوري على واتساب أول ما يفتح باب التسجيل",
                                    "شهادة من المركز المنظّم للدورة",
                                    "نصيحة بالمسار الأكثر طلباً في سوق العمل",
                                ].map((feature, idx) => (
                                    <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm font-medium text-[#F8F8F5]/90">
                                        <CheckCircle2 className="w-4 h-4 text-[#D58A38] shrink-0 mt-0.5" />
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <Link
                            href="/apply"
                            className="w-full py-3.5 px-4 rounded-xl bg-[#D58A38] hover:bg-[#BE772B] text-white font-black text-xs sm:text-sm text-center shadow-lg shadow-[#D58A38]/25 transition active:scale-98 flex items-center justify-center gap-2"
                        >
                            <span>اطلب دورتي مجاناً</span>
                            <ArrowLeft className="w-4 h-4" />
                        </Link>
                    </div>

                    {/* 7. قسم المراكز */}
                    <div className="flex flex-col justify-between bg-gradient-to-b from-[#143F3C] to-[#0E2F2D] rounded-3xl p-6 sm:p-8 border border-[#A9B5B0]/30 shadow-xl relative overflow-hidden group">
                        <div className="absolute top-4 left-4 bg-[#A9B5B0]/15 text-[#F8F8F5] text-xs font-extrabold px-3 py-1 rounded-full border border-[#A9B5B0]/30">
                            بوابة المراكز
                        </div>

                        <div>
                            <div className="w-12 h-12 rounded-2xl bg-[#206C63] text-white flex items-center justify-center mb-5 shadow-lg shadow-[#206C63]/30">
                                <Building2 className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl sm:text-2xl font-black text-[#F8F8F5] mb-1.5">
                                عندك مقاعد فارغة؟ لقينا لك طلاباً جاهزين
                            </h3>
                            <p className="text-xs text-[#A9B5B0] mb-6 leading-relaxed">
                                اعرض دورتك أمام طلاب سجّلوا فعلاً رغبتهم بالتدريب.
                            </p>

                            <ul className="space-y-3.5 mb-8 text-right">
                                {[
                                    "طلاب مهتمون بتخصصك، وليس مجرد مشاهدات",
                                    "معرفة المهارات الأكثر طلباً قبل أن تفتح الدورة",
                                    "صفحة خاصة بمركزك وشارة «شريك موثّق»",
                                    "قوائم تسجيل وانتظار مرتبة",
                                ].map((feature, idx) => (
                                    <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm font-medium text-[#F8F8F5]/90">
                                        <ShieldCheck className="w-4 h-4 text-[#A9B5B0] shrink-0 mt-0.5" />
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <Link
                            href="/center"
                            className="w-full py-3.5 px-4 rounded-xl bg-white/10 hover:bg-white/15 border border-[#A9B5B0]/40 text-[#F8F8F5] font-black text-xs sm:text-sm text-center transition active:scale-98 flex items-center justify-center gap-2"
                        >
                            <span>سجّل مركزك</span>
                            <ArrowLeft className="w-4 h-4 text-[#A9B5B0]" />
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
