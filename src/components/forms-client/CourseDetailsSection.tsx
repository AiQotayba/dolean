
// مكون لإضافة تفاصيل الدورة
const CourseDetailsSection = ({ formData, handleInputChange }: any) => {
    return (
        <section className="space-y-4">
            <h3 className="text-lg font-bold">تفاصيل الدورة</h3>
            <div className="space-y-2">
                <label htmlFor="courseDetails" className="text-sm font-medium leading-none">
                    هل لديك تفاصيل إضافية عن الدورة التي تبحث عنها؟
                </label>
                <textarea
                    id="courseDetails"
                    placeholder="أدخل تفاصيل الدورة هنا"
                    value={formData.courseDetails}
                    onChange={handleInputChange}
                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    rows={4}
                />
            </div>
        </section>
    );
};

export default CourseDetailsSection;
