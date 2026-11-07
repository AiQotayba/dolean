"use client";

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { Header } from '../../AdminHeader';
import Link from 'next/link';

export default function OneDefCourses() {
    const params = useParams();
    const router = useRouter();
    const id = params?.id as string;
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const token = Cookies.get("authorization");
    const headers = { Authorization: `Bearer ${token}` };

    useEffect(() => {
        if (id) {
            axios.get(`/api/admin/def-courses/${id}`, { headers })
                .then((res) => setData(res.data))
                .catch((err) => console.error("Error fetching def-course:", err))
                .finally(() => setLoading(false));
        }
    }, [id]);

    const deleteOne = async () => {
        if (!confirm("هل أنت متأكد من رغبتك في حذف هذا الإعلان؟")) return;
        try {
            await axios.delete(`/api/admin/def-courses/${id}`, { headers });
            router.push("/admin/def-courses");
        } catch (err) {
            alert("حدث خطأ أثناء الحذف");
        }
    };

    if (loading) {
        return <div className="p-8 text-center text-gray-500">جاري التحميل...</div>;
    }

    if (!data) {
        return (
            <main className="w-full p-4">
                <Header to="/admin/def-courses" title="مسودة الإعلان" />
                <p className="text-center text-gray-500 py-8">البيانات غير موجودة</p>
            </main>
        );
    }

    const { title, context, image, Source, location } = data;

    return (
        <main className="w-full p-4">
            <Header to="/admin/def-courses" title="مسودة الإعلان التدريبي" />
            <section className="py-6 bg-white rounded-xl border border-gray-200 p-6 mt-4 shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        {image && image.length > 1 ? (
                            <img loading='lazy' className="w-full rounded-xl object-contain max-h-96 bg-gray-50" src={image} alt={title} />
                        ) : (
                            <div className="h-64 rounded-xl bg-gray-100 flex items-center justify-center text-gray-400 font-bold">
                                لا توجد صورة مرفقة
                            </div>
                        )}
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">{title || "إعلان بدون عنوان"}</h1>
                        {location && (
                            <p className="text-gray-600 bg-slate-100 my-2 p-2 w-fit text-sm rounded-lg">📍 {location}</p>
                        )}
                        <div className="my-4 p-4 rounded-xl bg-gray-50 text-gray-700 text-sm whitespace-pre-wrap leading-relaxed">
                            {context}
                        </div>
                        {Source && (
                            <p className="text-xs text-primary-600 break-all mb-6">
                                المصدر: <a href={Source} target="_blank" rel="noreferrer" className="underline">{Source}</a>
                            </p>
                        )}
                        <div className="flex gap-4">
                            <Link
                                href={`/admin/ai-course?defId=${id}`}
                                className="bg-primary-600 text-white font-bold py-2.5 px-5 rounded-lg text-sm hover:bg-primary-700 transition"
                            >
                                تحويل إلى دورة عبر الذكاء الاصطناعي
                            </Link>
                            <button
                                onClick={deleteOne}
                                className="text-red-700 border border-red-700 hover:bg-red-50 font-medium rounded-lg text-sm px-5 py-2.5 transition"
                            >
                                حذف المسودة
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
