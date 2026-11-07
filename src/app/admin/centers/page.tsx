import Link from "next/link";
import Headers from "../config";
import { Header } from "../AdminHeader";
import { connectToDatabase } from "@/lib/db";
import Organization from "@/models/Organization";
import Course from "@/models/Course";
import {
  Building2,
  MapPin,
  Phone,
  Mail,
  Globe,
  CheckCircle2,
  BookOpen,
  ShieldCheck,
  Plus,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function AdminCentersPage() {
  await Headers();

  let centers: any[] = [];
  try {
    await connectToDatabase();
    centers = await Organization.find({ deleteState: { $ne: true } })
      .sort({ isVerified: -1, createdAt: -1 })
      .lean();

    // Map course count for each center
    for (let c of centers) {
      c.courseCount = await Course.countDocuments({
        $or: [
          { 'providingEntity.organizationId': c._id },
          { 'providingEntity.name': c.name },
        ],
        deleteState: { $ne: true },
      });
    }
  } catch (err) {
    console.error("Error loading centers:", err);
  }

  const typeLabels: Record<string, string> = {
    ngo: "منظمة إنسانية تنموية",
    institute: "معهد مهني / أكاديمي",
    company: "أكاديمية / شركة تقنية",
    governmental: "مؤسسة مهنية حكومية",
    initiative: "مبادرة شبابية رائدة",
    university: "جامعة / كلية",
  };

  return (
    <div className="space-y-6">
      <Header
        title="دليل المراكز والمنظمات التدريبية بإدلب"
        subtitle="إدارة الشركاء المعتمدين والمؤسسات التي تقدم الدورات والفرص المهنية للطلاب في إدلب والشمال السوري"
      />

      {/* Summary Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4 bg-white border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">إجمالي الشركاء</span>
            <Building2 className="w-4 h-4 text-[#123D3A]" />
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">{centers.length}</div>
        </Card>

        <Card className="p-4 bg-white border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">المراكز الموثقة</span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-600 mt-2">
            {centers.filter((c) => c.isVerified).length}
          </div>
        </Card>

        <Card className="p-4 bg-white border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">مناطق التغطية</span>
            <MapPin className="w-4 h-4 text-[#D58A38]" />
          </div>
          <div className="text-2xl font-black text-[#D58A38] mt-2">إدلب، سرمدا، الدانا، أريحا</div>
        </Card>
      </div>

      {/* Centers Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {centers.map((center: any) => {
          const typeName = typeLabels[center.orgType] || "جهة تدريبية";
          const districtText = center.address?.district ? `${center.address.district} - ` : "";
          const locationText = `${districtText}${center.address?.city || "إدلب"}`;

          return (
            <Card
              key={center._id.toString()}
              className="bg-white border-slate-200/90 hover:border-[#123D3A]/40 transition shadow-xs hover:shadow-md overflow-hidden flex flex-col justify-between"
            >
              <CardContent className="p-5 space-y-4">
                {/* Header with Logo and Title */}
                <div className="flex items-start gap-3.5">
                  <img
                    src={center.logo || "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=100"}
                    alt={center.name}
                    className="w-14 h-14 rounded-2xl object-cover bg-slate-100 border border-slate-100 shrink-0"
                  />
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#123D3A]/10 text-[#123D3A]">
                        {typeName}
                      </span>
                      {center.isVerified && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>موثق</span>
                        </span>
                      )}
                    </div>
                    <h3 className="text-sm sm:text-base font-black text-slate-900 truncate">
                      {center.name}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{locationText}</span>
                    </div>
                  </div>
                </div>

                {/* Description */}
                {center.description && (
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed bg-slate-50 p-2.5 rounded-xl">
                    {center.description}
                  </p>
                )}

                {/* Contact and Metadata */}
                <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-500 pt-2 border-t border-slate-100">
                  {center.contactPhone && (
                    <span className="flex items-center gap-1.5 truncate">
                      <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="font-mono">{center.contactPhone}</span>
                    </span>
                  )}
                  {center.contactEmail && (
                    <span className="flex items-center gap-1.5 truncate">
                      <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate font-mono">{center.contactEmail}</span>
                    </span>
                  )}
                </div>
              </CardContent>

              {/* Card Footer with course counts */}
              <div className="px-5 py-3 bg-slate-50/75 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="font-bold text-slate-600 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-[#D58A38]" />
                  <span>{center.courseCount || 0} دورات وتدريبات مسجلة</span>
                </span>
                <Link
                  href="/center"
                  target="_blank"
                  className="font-bold text-[#123D3A] hover:text-[#D58A38] transition"
                >
                  معاينة الملف العام
                </Link>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
