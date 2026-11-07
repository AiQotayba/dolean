"use client"
import React, { useEffect, useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import axios from 'axios';
import FormField from '@/components/Element/FormField';

const EditProfile: React.FC<{ token?: string; data?: any }> = ({ token, data }) => {
    const methods = useForm({ defaultValues: data });
    const [message, setMessage] = useState<{ message: string, type: 'success' | 'error' } | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    const url = `${process.env.NEXT_PUBLIC_API}/student/profile`;
    const onSubmit = async (formData: any) => {
        try {
            const { data } = await axios.put(url, formData, { headers: { Authorization: `Bearer ${token}` } });
            setMessage({ message: 'تم تحديث المعلومات بنجاح.', type: 'success' });
        } catch (error) {
            console.error('Error updating profile:', error);
            setMessage({ message: 'حدث خطأ أثناء تحديث الملف الشخصي. يرجى المحاولة مرة أخرى.', type: 'error' });
        }
    };

    return (
        <FormProvider {...methods}>
            <form
                onSubmit={methods.handleSubmit(onSubmit)}
                className="space-y-4 md:space-y-6 w-full flex flex-col items-center max-w-md mx-auto p-4 rtl text-slate-900"
            >
                <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl ddark:text-white text-center">
                    تعديل الملف الشخصي
                </h1>

                {loading ? (
                    <p className="text-center">جاري تحميل البيانات...</p>
                ) : (
                    <>
                        <FormField
                            label="الاسم الكامل"
                            name="name"
                            validation={{ required: 'الاسم مطلوب' }}
                            placeholder=""
                        />

                        <FormField
                            label="رقم الهاتف"
                            name="phone"
                            type="tel"
                            placeholder="رقم هاتفك"
                            validation={{
                                required: 'رقم الهاتف مطلوب',
                                minLength: {
                                    value: 6,
                                    message: 'رقم الهاتف يجب أن يكون 6 أرقام على الأقل',
                                },
                            }}
                        />

                        <FormField
                            name="email"
                            label="البريد الإلكتروني"
                            type="email"
                            placeholder="name@company.com"
                            validation={{
                                required: 'البريد الإلكتروني مطلوب',
                                pattern: {
                                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                    message: 'البريد الإلكتروني غير صالح',
                                },
                            }}
                        />

                        <button
                            type="submit"
                            className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center ddark:bg-primary-600 ddark:hover:bg-primary-700 ddark:focus:ring-primary-800"
                        >
                            تحديث المعلومات
                        </button>
                    </>
                )}

                {message && (
                    <p
                        className={`text-center mt-4 p-4 rounded-lg ${message.type === 'error' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}
                    >
                        {message.message}
                    </p>
                )}
            </form>
        </FormProvider>
    );
};

export default EditProfile;
