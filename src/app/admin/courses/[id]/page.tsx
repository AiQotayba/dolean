"use client";

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { Header } from '../../AdminHeader';
import Link from 'next/link';
import {
  BookOpen,
  MapPin,
  Calendar,
  Building2,
  DollarSign,
  Award,
  Trash2,
  ExternalLink,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function OneCourses() {
    const params = useParams();
    const router = useRouter();
    const id = params?.id as string;
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const token = Cookies.get("authorization");
    const headers = { Authorization: `Bearer ${token}` };

    useEffect(() => {
        if (id) {
            axios.get(`/api/admin/courses/${id}`, { headers })
                .then((res) => setData(res.data))
                .catch((err) => console.error("Error fetching course:", err))
                .finally(() => setLoading(false));
        }
    }, [id]);

    const deleteOne = async () => {
        if (!confirm("هل أنت متأكد من رغبتك في حذف هذه الدورة نهائياً؟")) return;
        try {
            await axios.delete(`/api/admin/courses/${id}`, { headers });
            router.push("/admin/courses");
        } catch (err) {
            alert("حدث خطأ أثناء الحذف");
        }
    };

    if (loading) {
        return (
            <div className="p-16 text-center text-slate-500 text-sm">
                جاري تحميل تفاصيل الدورة...
            </div>
        );
    }

    if (!data) {
        return (
            <div className="space-y-4">
                <Header title={"الدورة غير موجودة"} to="/admin/courses" />
                <Card className="p-12 text-center text-slate-400">
                    لم يتم العثور على بيانات هذه الدورة أو تم حذفها
                </Card>
            </div>
        );
    }

    const isFree = data.pricing?.isFree ?? (data.price === 0);
    const cost = data.pricing?.cost ?? data.price ?? 0;
    const locationName = data.location || data.locationDetails?.city || "إدلب";
    const entityName = data.providingEntity?.name || data.center || "جهة تدريبية";

    return (
        <div className="space-y-6">
            <Header
                title={data.title}
                subtitle={`المقدمة بواسطة: ${entityName}`}
                to="/admin/courses"
                action={
                    <div className="flex items-center gap-2">
                        <Link
                            href={`/courses/${id}`}
                            target="_blank"
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold transition"
                        >
                            <ExternalLink className="w-3.5 h-3.5" />
                            <span>معاينة في الموقع للطلاب</span>
                        </Link>
                        <Button
                            variant="destructive"
                            onClick={deleteOne}
                            className="bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 text-xs font-bold rounded-xl"
                        >
                            <Trash2 className="w-3.5 h-3.5 ml-1" />
                            <span>حذف الدورة</span>
                        </Button>
                    </div>
                }
            />

            {/* Course Summary Card */}
            <Card className="bg-white border-slate-200/90 overflow-hidden shadow-xs">
                {data.image && (
                    <div className="relative h-60 w-full bg-slate-900">
                        <img
                            src={data.image}
                            alt={data.title}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                        <div className="absolute bottom-4 right-4 left-4 text-right">
                            <div className="flex flex-wrap items-center gap-2 mb-2">
                                <span className={`text-[11px] font-bold px-3 py-1 rounded-full ${
                                    isFree ? "bg-emerald-500 text-white" : "bg-[#D58A38] text-white"
                                }`}>
                                    {isFree ? "منحة مجانية بالكامل" : `${cost} USD`}
                                </span>
                                <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-white/20 text-white backdrop-blur-xs">
                                    {data.locationType === 'in_person' ? 'حضوري' : data.locationType === 'hybrid' ? 'هجين (حضوري + عن بعد)' : 'عن بعد (Online)'}
                                </span>
                            </div>
                            <h2 className="text-xl sm:text-2xl font-black text-white">{data.title}</h2>
                        </div>
                    </div>
                )}

                <CardContent className="p-6 space-y-6 text-right">
                    {/* Quick Metadata Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-slate-50/80 border border-slate-100 text-xs">
                        <div>
                            <span className="text-slate-400 block mb-1">الجهة المنظمة</span>
                            <span className="font-bold text-slate-800">{entityName}</span>
                        </div>
                        <div>
                            <span className="text-slate-400 block mb-1">الموقع الجغرافي</span>
                            <span className="font-bold text-slate-800 flex items-center gap-1">
                                <MapPin className="w-3 h-3 text-slate-400" />
                                {locationName}
                            </span>
                        </div>
                        <div>
                            <span className="text-slate-400 block mb-1">الساعات التدريبية</span>
                            <span className="font-bold text-slate-800">
                                {data.schedule?.durationHours ? `${data.schedule.durationHours} ساعة` : "غير محدد"}
                            </span>
                        </div>
                        <div>
                            <span className="text-slate-400 block mb-1">الشهادة</span>
                            <span className="font-bold text-slate-800">
                                {data.certificateProvided ? "شهادة إتمام معتمدة" : "بدون شهادة"}
                            </span>
                        </div>
                    </div>

                    {/* Summary */}
                    {data.summary && (
                        <div>
                            <h3 className="text-xs font-black text-slate-400 mb-2">الملخص التنفيذي</h3>
                            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl">
                                {data.summary}
                            </p>
                        </div>
                    )}

                    {/* Topics */}
                    {data.topics && data.topics.length > 0 && (
                        <div>
                            <h3 className="text-xs font-black text-slate-400 mb-2">محاور التدريب (Topics)</h3>
                            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
                                {data.topics.map((t: string, i: number) => (
                                    <li key={i} className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 border border-slate-100">
                                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                        <span>{t}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Context / Details */}
                    {data.context && (
                        <div>
                            <h3 className="text-xs font-black text-slate-400 mb-2">التفاصيل الكاملة والمنهجية</h3>
                            <div className="p-4 rounded-xl bg-slate-50 text-xs sm:text-sm text-slate-700 whitespace-pre-wrap leading-relaxed border border-slate-100">
                                {data.context}
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}