import React, { useEffect, useRef } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import FormField from '@/components/Element/FormField';
import Link from 'next/link';

const Preferences = () => {
    const { register, formState: { errors }, control, setError, clearErrors }: any = useFormContext();
    const paidCourses = useWatch({ control, name: "paidCourses" });
    const freeCourses = useWatch({ control, name: "freeCourses" });

    // UseEffect to handle validation for paidCourses and freeCourses
    useEffect(() => {
        if (!paidCourses && !freeCourses) {
            setError('courseSelection', {
                type: 'manual',
                message: 'يجب اختيار إما دورات مجانية أو مدفوعة'
            });
        } else {
            clearErrors('courseSelection');
        }
    }, [paidCourses, freeCourses, setError, clearErrors]);

    return (
        <div>
            <h3 className="text-lg font-bold">طريقة الاقتراحات</h3>
            <PreferenceField
                label="هل تبحث عن دورات مجانية؟"
                name="freeCourses"
            />
            <PreferenceField
                label="هل تبحث عن دورات مدفوعة؟"
                name="paidCourses"
            />
            {paidCourses && (
                <FormField
                    label="كم مستعد ان تدفع للدورات المدفوعة ب$"
                    name="paidCoursesLimit"
                    validation={{ required: "سقف المدفوعات مطلوب" }}
                    type="number"
                />
            )}

            {/* Error message for course selection */}
            {errors.courseSelection && (
                <p className="text-red-500 text-sm my-4">{errors.courseSelection.message}</p>
            )}

            <div className="flex items-start flex-col">
                <div className="flex items-center h-5">
                    <input
                        id="terms"
                        aria-describedby="terms"
                        type="checkbox"
                        className="w-4 mx-2 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"
                        {...register('terms', { required: 'يجب الموافقة على الشروط والأحكام' })}
                    />
                    <div className="ml-3 text-sm">
                        <label htmlFor="terms" className="font-light text-gray-500 dark:text-gray-300">
                            أوافق على <Link className="font-medium text-primary-600 hover:underline dark:text-primary-500" href="/terms-conditions">الشروط والأحكام</Link>
                        </label>
                    </div>
                </div>
                {errors.terms && <p className="text-red-500 text-sm mt-1">{errors.terms.message}</p>}
            </div>
        </div>
    );
};

export default Preferences;

const PreferenceField = ({ label, name, validation }: { label: string, name: string, validation?: any }) => {
    const { register, formState: { errors }, setValue, getValues }: any = useFormContext();
    const init = useRef<any>(null);

    // ضبط كلاس الزر حسب ما إذا كان تم اختياره أم لا
    const getButtonClass = (isActive: Boolean) => {
        return isActive
            ? "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 border border-input bg-primary-600 text-white h-10 px-4 py-2 flex-1"
            : "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 flex-1";
    };

    // تحديث قيمة الحقل عند النقر على الزر
    const handleToggle = (value: Boolean) => {
        setValue(name, value)
    }

    return (
        <div className="space-y-2 my-4">
            <label className="text-sm font-medium leading-none">{label}</label>
            <input
                aria-describedby={name}
                type="checkbox"
                className="w-4 mx-2 h-4 border hidden border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 ddark:bg-gray-700 ddark:border-gray-600 ddark:focus:ring-primary-600 ddark:ring-offset-gray-800"
                {...register(name, validation)}
            // ref={init}
            />
            <div className="flex space-x-2 rtl">
                <button type="button" onClick={() => handleToggle(false)} className={getButtonClass(getValues(name) === false)}                >
                    لا
                </button>
                <button type="button" onClick={() => handleToggle(true)} className={getButtonClass(getValues(name) === true)}                >
                    نعم
                </button>
            </div>
            {errors[name] && <span className="text-red-500 text-sm">{errors[name].message}</span>}
        </div>
    );
};

