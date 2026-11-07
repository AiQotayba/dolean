import { useEffect, useState } from 'react';
import FormField from '@/components/Element/FormField';
import { useFormContext } from 'react-hook-form';
import data from '@/static/data.json';
import District from '@/static/District.json';

interface TypeDistrictData {
    District: string;
    name: string;
}

interface Option {
    value: string;
    label: string;
}

const BasicInfo: React.FC = () => {
    const { watch, formState: { errors } } = useFormContext();

    const [district, setDistrict] = useState<Option[]>(() => {
        const list = Array.from(new Set(District.map((a: TypeDistrictData) => a.District)));
        const all = list.map((a) => ({ value: a, label: a }));
        return [{ value: "", label: "حدد المحافظة" }, ...all];
    });

    const inputDistrict = watch("District");

    const Cities = (): Option[] => {
        if (!inputDistrict) {
            return [{ value: "", label: "حدد المدينة" }, ...District.map((a: TypeDistrictData) => ({ value: a.name, label: `${a.District} - ${a.name}` }))];
        } else {
            return [{ value: "", label: "حدد المدينة" }, ...District.filter((a: TypeDistrictData) => a.District === inputDistrict).map((a) => ({ value: a.name, label: `${a.District} / ${a.name}` }))];
        }
    };

    const [cities, setCities] = useState<Option[]>(Cities);

    useEffect(() => {
        const cityOptions = Cities();
        if (inputDistrict) setCities(cityOptions);
    }, [inputDistrict]);
    // console.log(errors);

    return (
        <div>
            <h3 className="text-lg font-bold">المعلومات الأساسية</h3>
            <FormField
                label="الاسم الكامل"
                name="fullName"
                validation={{ required: "الاسم الكامل مطلوب" }}
                placeholder=""
            />
            <FormField
                label="رقم الهاتف"
                name="phone"
                validation={{ required: "رقم الهاتف مطلوب" }}
                placeholder=""
                type="tel"
            />
            <FormField
                label="سنة الميلاد"
                name="births"
                validation={{
                    required: "سنة الميلاد مطلوبة",
                    validate: {
                        validYear: (value: string) => {
                            const selectedYear = new Date(value).getFullYear();
                            const currentYear = new Date().getFullYear();
                            const minYear = 1900;
                            const minValidYear = currentYear - 3;

                            if (selectedYear > currentYear) return "سنة الميلاد لا يمكن أن تكون في المستقبل";
                            if (selectedYear < minYear) return `سنة الميلاد يجب أن تكون بعد ${minYear}`;
                            if (selectedYear > minValidYear) return `العمر يجب أن يكون أكبر من 3 سنوات`;
                            return true;
                        }
                    }
                }}
                placeholder="حدد السنة"
                type="date"
            />
            <FormField
                label="المحافظة"
                name="District"
                validation={{ required: "مكان السكن الحالي مطلوب" }}
                as="select"
                options={district}
            />
            {inputDistrict && <FormField
                label="المدينة"
                name="city"
                validation={{ required: "المدينة مطلوبة" }}
                as="select"
                options={cities}
                placeholder="حدد المدينة"
            />}
            <FormField
                label="الجنسية"
                name="nationality"
                validation={{ required: "الجنسية مطلوبة" }}
                as="select"
                options={data.nationality}
            />
            <FormField
                label="الدورات المطلوبة"
                name="interests"
                validation={{ required: "الدورات المطلوبة مطلوبة" }}
                placeholder="حدد الدورات التي ترغب في الحصول عليها"
                as="textarea"
                rows={4}
                description="استخدم هذا الحقل لتوضيح الدورات التدريبية التي تحتاجها أو ترغب في الحصول عليها. يمكنك ذكر المجالات أو المواضيع التي تهمك."
            />
        </div>
    );
};

export default BasicInfo;
