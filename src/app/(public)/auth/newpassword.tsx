"use client";

import React, { useState } from 'react';
import { FormProvider, useForm, SubmitHandler } from 'react-hook-form';
import axios from 'axios';
import FormField from '@/components/Element/FormField';
import { useRouter, useSearchParams } from 'next/navigation';

interface NewPasswordFormInputs {
    newPassword: string;
    confirmNewPassword: string;
}

interface NewPasswordProps {
    searchParams?: {
        token?: string;
    };
}

const NewPassword: React.FC<NewPasswordProps> = ({ searchParams }) => {
    const clientSearchParams = useSearchParams();
    const token = searchParams?.token || (clientSearchParams ? clientSearchParams.get('token') : '') || '';

    const methods = useForm<NewPasswordFormInputs>();
    const { handleSubmit, watch } = methods;
    const [message, setMessage] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const router = useRouter();

    const onSubmit: SubmitHandler<NewPasswordFormInputs> = async (data) => {
        if (!token) {
            setMessage("رمز إعادة التعيين مفقود أو غير صالح. يرجى طلب رابط جديد.");
            return;
        }

        setLoading(true);
        setMessage(null);
        try {
            const url = '/api/auth/new-password';
            const response = await axios.post(url, { newPassword: data.newPassword, token });
            setMessage(response.data?.message || "كلمة المرور تم تعيينها بنجاح");
            setTimeout(() => {
                router.push('/auth?route=login');
            }, 2000); // Redirect after 2 seconds to login page
        } catch (error: any) {
            setMessage(error.response?.data?.message || "حدث خطأ أثناء تعيين كلمة المرور");
        } finally {
            setLoading(false);
        }
    };

    return (
        <FormProvider {...methods}>
            <div className="max-w-md mx-auto p-4">
                <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit(onSubmit)}>
                    <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl text-center">
                        تعيين كلمة مرور جديدة
                    </h1>

                    <FormField
                        label="كلمة المرور الجديدة"
                        name="newPassword"
                        type="password"
                        placeholder="••••••••"
                        validation={{
                            required: 'كلمة المرور الجديدة مطلوبة',
                            minLength: {
                                value: 8,
                                message: 'كلمة المرور يجب أن تكون 8 أحرف على الأقل'
                            }
                        }}
                    />

                    <FormField
                        label="تأكيد كلمة المرور الجديدة"
                        name="confirmNewPassword"
                        type="password"
                        placeholder="••••••••"
                        validation={{
                            required: 'تأكيد كلمة المرور الجديدة مطلوب',
                            validate: value => value === watch('newPassword') || 'كلمة المرور لا تتطابق'
                        }}
                    />

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                    >
                        {loading ? 'جاري التعيين...' : 'تعيين كلمة المرور'}
                    </button>
                </form>

                {message && (
                    <p className={`text-center mt-4 p-4 rounded-lg ${message.includes('خطأ') ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                        {message}
                    </p>
                )}

                <p className="text-sm font-light text-gray-500 my-4 text-center">
                    لديك حساب بالفعل؟ <a href="/auth?route=login" className="font-medium text-primary-600 hover:underline">تسجيل الدخول</a>
                </p>
            </div>
        </FormProvider>
    );
};

export default NewPassword;
