"use client"
import Link from 'next/link';
import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';

export default function FormStepper({ children }: any) {
    const [currentStep, setCurrentStep] = useState<any>(0);
    const { trigger } = useFormContext();
    const steps = React.Children.toArray(children);

    let [submit, setApp] = useState("تقديم")
    const nextStep = async () => {
        // تحقق من صحة البيانات للمرحلة الحالية
        const isValidStep = await trigger();

        if (isValidStep) setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
         
        console.log({ isValidStep, currentStep });
    };

    const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 0));
    let classnames = "bg-primary-700 btn btn-primary ddark:focus:ring-primary-900 focus:ring-4 focus:ring-primary-300 font-medium hover:bg-primary-800 inline-flex items-center justify-center px-5 py-3 rounded-lg text-base text-center text-white w-full"
    console.log({ currentStep });

    return (
        <div>
            <div>{steps[currentStep]}</div>
            {currentStep < steps.length ? (
                <div className="flex justify-between mt-4">
                    {currentStep > 0 && (
                        <button type="button" onClick={prevStep} className={`${classnames} !text-primary-700 border border-primary-700 !bg-white `} >
                            السابق
                        </button>
                    )}
                    <button type={currentStep === steps.length - 1 ? "submit" : "button"} onClick={nextStep} className={classnames}    >
                        {currentStep === steps.length - 1 ? submit : 'التالي'}
                    </button>
                </div>
            ) : (
                <>
                    <button type="button" onClick={prevStep} className={`${classnames} !text-primary-700 border border-primary-700 !bg-white `} >
                        السابق
                    </button>
                    <Link href="/" className={classnames} >
                        العودة للصفحة الرئيسية
                    </Link>
                </>
            )}
        </div>
    );
} 