"use client";

import React, { useState } from 'react';
import { useForm, FormProvider, SubmitHandler } from 'react-hook-form';
import axios from 'axios';
import FormField from '@/components/Element/FormField';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

interface SignupFormInputs {
    name: string;
    phone: string;
    email: string;
    password: string;
    confirmPassword: string;
    terms: boolean;
}

const Signup: React.FC = () => {
    const methods = useForm<SignupFormInputs>();
    const { handleSubmit, watch } = methods;
    const [message, setMessage] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const router = useRouter();

    const onSubmit: SubmitHandler<SignupFormInputs> = async (data) => {
        setLoading(true);
        try {
            const url = '/api/auth/signup';
            const response = await axios.post(url, data);
            if (response.data?.token) {
                Cookies.set('authorization', response.data.token, { expires: 7, path: '/' });
                Cookies.set('isAdmin', response.data.isAdmin ? 'true' : 'false', { expires: 7, path: '/' });
                router.push('/');
            } else {
                setMessage(response.data?.message || 'تعذر استلام رمز الدخول.');
            }
        } catch (error: any) {
            console.error('حدث خطأ أثناء إنشاء الحساب:', error);
            setMessage(error.response?.data?.message || 'حدث خطأ أثناء إنشاء الحساب. يرجى المحاولة مرة أخرى.');
        } finally {
            setLoading(false);
        }
    };

    // التحقق من تطابق كلمات المرور
    const validatePassword = (value: string) => {
        if (value !== watch('password')) {
            return 'كلمات المرور غير متطابقة';
        }
        return true;
    };

    return (
        <FormProvider {...methods}>
            <div className="max-w-md mx-auto p-4">
                <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit(onSubmit)}>
                    <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl text-center">
                        تسجيل
                    </h1>

                    <FormField
                        label="الاسم"
                        name="name"
                        placeholder="اسمك"
                        validation={{ required: 'الاسم مطلوب' }}
                    />

                    <FormField
                        label="رقم الهاتف"
                        name="phone"
                        type="tel"
                        placeholder="رقم هاتفك"
                        validation={{ required: 'رقم الهاتف مطلوب' }}
                    />

                    <FormField
                        label="البريد الإلكتروني"
                        name="email"
                        type="email"
                        placeholder="name@company.com"
                        validation={{
                            required: 'البريد الإلكتروني مطلوب',
                            pattern: {
                                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                message: 'البريد الإلكتروني غير صالح'
                            }
                        }}
                    />

                    <FormField
                        label="كلمة المرور"
                        name="password"
                        type="password"
                        placeholder="••••••••"
                        validation={{
                            required: 'كلمة المرور مطلوبة',
                            minLength: {
                                value: 8,
                                message: 'كلمة المرور يجب أن تكون 8 أحرف على الأقل'
                            }
                        }}
                    />

                    <FormField
                        label="تأكيد كلمة المرور"
                        name="confirmPassword"
                        type="password"
                        placeholder="••••••••"
                        validation={{
                            required: 'تأكيد كلمة المرور مطلوب',
                            validate: validatePassword
                        }}
                    />

                    <div className="flex items-center">
                        <input
                            id="terms"
                            type="checkbox"
                            className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300"
                            {...methods.register('terms', { required: 'يجب الموافقة على الشروط والأحكام' })}
                        />
                        <label htmlFor="terms" className="ml-2 text-sm text-gray-500">
                            أوافق على <a href="/p/terms-conditions" className="font-medium text-primary-600 hover:underline">الشروط والأحكام</a>
                        </label>
                        {methods.formState.errors.terms && <p className="text-red-500 text-sm mt-1">{methods.formState.errors.terms.message}</p>}
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                    >
                        {loading ? 'جاري التسجيل...' : 'إنشاء حساب'}
                    </button>

                    <p className="text-sm font-light text-gray-500 text-center mt-4">
                        لديك حساب بالفعل؟ <a href="/auth?route=login" className="font-medium text-primary-600 hover:underline">تسجيل الدخول</a>
                    </p>

                    {message && <p className="text-center mt-4 p-4 rounded-lg bg-red-100 text-red-600">{message}</p>}
                </form>
            </div>
        </FormProvider>
    );
};

export default Signup;
