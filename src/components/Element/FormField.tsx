import { useFormContext, RegisterOptions } from 'react-hook-form';

interface Option {
    value: string | number;
    label: string;
}

interface FormFieldProps {
    label: string;
    name: string;
    description?: string;
    validation?: RegisterOptions;
    as?: React.ElementType;
    options?: Option[];
    placeholder?: string;
    [key: string]: any; // لإضافة خصائص إضافية إذا لزم الأمر
}

const FormField: React.FC<FormFieldProps> = ({
    label,
    name,
    description,
    validation,
    as: Component = 'input',
    options,
    placeholder,
    ...props
}) => {
    const { register, formState: { errors } }: any = useFormContext();

    return (
        <div className="space-y-2 my-4">
            <label htmlFor={name} className="text-lg font-medium leading-none">
                {label} {validation?.required && <span className="text-red-500">*</span>}
            </label>
            {description && <p className='text-sm'>{description}</p>}
            <Component
                id={name}
                {...register(name, validation)}
                className={`flex w-full rounded-md border px-3 py-2 text-sm ${errors[name] ? 'border-red-500' : 'border-input'} 
                    bg-slate-100 ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2`}
                placeholder={placeholder}
                {...props}
            >
                {options && options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </Component>
            {errors[name] && <span className="text-red-500 text-sm">{errors[name]?.message}</span>}
        </div>
    );
};

export default FormField;
