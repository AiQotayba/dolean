import React, { useState } from 'react';
import FormField from '@/components/Element/FormField';
import { useFormContext } from 'react-hook-form';
import data from '@/static/data.json';

const Education = () => {
    const { register, formState: { errors } } = useFormContext() // retrieve all hook methods
    const [selectedOption, setSelectedOption] = useState<any>(null);

    let { englishLevel, computerUsage, educationOptions }: any = data

    const handleEducationChange = (event: any) => {
        const selectedValue = event.target.value;
        const selected = educationOptions.find((option: any) => option.value === selectedValue);
        setSelectedOption(selected);
    };
    return (
        <div>
            <h3 className="text-lg font-bold">التعليم</h3>
            <FormField
                label="المستوى التعليمي"
                name="educationLevel"
                validation={{
                    required: "المستوى التعليمي مطلوب",
                    validate: (value) => {
                        const validValues = ["Primary", "Intermediate", "Secondary", "Bachelors", "Masters", "PhD", "Diploma", "Institute", "Other"];
                        return validValues.includes(value) || "القيمة المختارة غير صالحة";
                    }
                }}
                as="select"
                options={educationOptions.map((option: any) => ({ value: option.value, label: option.label }))}
                onChange={handleEducationChange}
            />
            {selectedOption?.isSpecialization && (
                <FormField
                    label="الاختصاص"
                    name="specialization"
                    validation={{ required: "الاختصاص مطلوب" }}
                    placeholder="حدد الاختصاص"
                />
            )}
            {selectedOption?.isClass && (
                <FormField
                    label="الصف الدراسي"
                    name="classes"
                    validation={{ required: "الصف الدراسي مطلوبة" }}
                    placeholder="الخامس"
                />
            )}
            {selectedOption?.graduationYear && (
                <FormField
                    label="سنة التخرج"
                    name="graduationYear"
                    type="number"
                    validation={{
                        required: "سنة التخرج مطلوبة",
                        min: { value: 1950, message: "السنة يجب أن تكون بعد 1950" },
                        max: { value: 2030, message: "السنة يجب أن تكون قبل 2030" }
                    }}
                    placeholder="حدد السنة"
                />
            )}
            <FormField
                label="العمل"
                name="work"
                validation={{ required: " العمل مطلوب" }}
            />
            <FormField
                label="لغتك الإنجليزية"
                name="englishLevel"
                as="select"
                validation={{ required: "مستوى اللغة الإنجليزية مطلوب" }}
                options={englishLevel}
            />
            <FormField
                label="استخدامك للحاسوب"
                name="computerUsage"
                as="select"
                validation={{ required: "استخدامك للحاسوب مطلوب" }}
                options={computerUsage}
            />
        </div>
    );
};

export default Education;
