"use client";

import React, { useState } from 'react';
import axios from 'axios';
import { CheckCircle2, AlertCircle, Send, Share2 } from 'lucide-react';

export default function AddDefCourse() {
    const [title, setTitle] = useState('');
    const [context, setContext] = useState('');
    const [res, setRes] = useState('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrorMessage('');

        try {
            let imageBase64 = '';
            if (imageFile) {
                imageBase64 = await new Promise((resolve) => {
                    const reader = new FileReader();
                    reader.onloadend = () => resolve(reader.result as string);
                    reader.readAsDataURL(imageFile);
                });
            }

            await axios.post('/api/student/def-courses', {
                title,
                context,
                res,
                image: imageBase64,
            });

            setSubmitted(true);
        } catch (error: any) {
            console.error('Error submitting community course:', error);
            setErrorMessage('تعذر الإرسال حالياً. يرجى المحاولة لاحقاً.');
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setTitle('');
        setContext('');
        setRes('');
        setImageFile(null);
        setSubmitted(false);
        setErrorMessage('');
    };

    if (submitted) {
        return (
            <div className="w-full bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 text-center shadow-xs">
                <div className="w-12 h-12 mx-auto rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
                    <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-1">
                    شكراً لمشاركتك
                </h3>
                <p className="text-xs text-slate-500 mb-4">
                    تم استلام تفاصيل الدورة وسيتم مراجعتها ونشرها.
                </p>
                <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-2 rounded-xl bg-slate-900 text-white font-semibold text-xs hover:bg-slate-800 transition"
                >
                    مشاركة دورة أخرى
                </button>
            </div>
        );
    }

    return (
        <div className="w-full bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 sm:p-8">
            <div className="text-center mb-6">
                <h3 className="text-xl font-black text-slate-900">
                    مشاركة فرصة تدريبية
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                    إذا كان لديك إعلان عن دورة في منطقتك، شارك تفاصيلها معنا لننشرها
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="عنوان أو موضوع التدريب *"
                        className="w-full py-3 px-4 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-primary-600 outline-none text-slate-900 text-sm font-medium transition"
                        required
                    />
                </div>

                <div>
                    <textarea
                        rows={3}
                        value={context}
                        onChange={(e) => setContext(e.target.value)}
                        placeholder="نص الإعلان أو التفاصيل (المكان، الشروط، الرابط)... *"
                        className="w-full py-3 px-4 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-primary-600 outline-none text-slate-900 text-sm font-medium transition resize-none"
                        required
                    />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                        type="text"
                        value={res}
                        onChange={(e) => setRes(e.target.value)}
                        placeholder="الجهة المنظمة (اختياري)"
                        className="w-full py-2.5 px-3.5 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-primary-600 outline-none text-slate-900 text-xs font-medium transition"
                    />

                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                        className="w-full py-2 px-3 rounded-xl border border-slate-200 bg-slate-50/50 text-xs text-slate-600 file:ml-2 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:bg-primary-50 file:text-primary-700 file:font-semibold cursor-pointer"
                    />
                </div>

                {errorMessage && (
                    <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs font-medium">
                        {errorMessage}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 px-6 rounded-2xl bg-primary-600 hover:bg-primary-700 disabled:bg-slate-300 text-white font-bold text-sm shadow-xs transition active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
                >
                    {loading ? (
                        <span>جارٍ الإرسال...</span>
                    ) : (
                        <>
                            <span>إرسال الدورة</span>
                            <Send className="w-4 h-4" />
                        </>
                    )}
                </button>
            </form>
        </div>
    );
}
