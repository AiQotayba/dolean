import data from '@/static/data.json';
import { Header } from '../../AdminHeader';
import Headers from '../../config';
import { redirect } from 'next/navigation';
import { connectToDatabase } from '@/lib/db';
import UserDetails from '@/models/UserDetails';

export default async function OneUsersDetails({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const headers: any = await Headers();

    if (!headers?.Authorization) {
        redirect('/auth?route=login');
    }

    let user: any = null;
    try {
        await connectToDatabase();
        user = await UserDetails.findById(id).lean();
    } catch (err) {
        console.error("Error loading user-details:", err);
    }

    if (!user) {
        return (
            <main className="w-full p-4">
                <Header to="/admin/users-details" title="تفاصيل المستخدم" />
                <p className="text-center text-gray-500 py-8">لم يتم العثور على بيانات هذا الطالب</p>
            </main>
        );
    }

    return (
        <main className="w-full">
            <Header to="/admin/users-details" title="تفاصيل الطالب" />
            <ProfileCard {...user} />
        </main>
    );
}

function ProfileCard({ District, city, nationality, educationLevel, specialization, graduationYear, englishLevel, computerUsage, phone, fullName, interests, freeCourses, paidCourses }: any) {
    const dataMap: any = data;
    const formatField = (key: string, value: any) => dataMap[key]?.find((a: any) => a.value === value)?.label || value || 'غير محدد';
    const cleanPhone = phone ? phone.replace(/\s+/g, '') : '';

    return (
        <div className="flex flex-wrap items-center justify-center p-4">
            <div className="bg-white m-4 rounded-2xl shadow-sm border border-gray-200 w-full max-w-xl p-6">
                <div className="text-center pb-6 border-b border-gray-100">
                    <h2 className='text-2xl font-extrabold text-gray-900'>{fullName}</h2>
                    <p className='text-gray-500 text-sm mt-1'>{phone}</p>
                    <a className='inline-flex items-center gap-2 mt-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-6 rounded-xl transition shadow' href={`https://wa.me/${cleanPhone}`}>
                        <span>مراسلة عبر واتساب</span>
                    </a>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-6 text-sm">
                    <div className="p-3 bg-gray-50 rounded-xl">
                        <span className="text-gray-500 block text-xs mb-1">المنطقة والمدينة</span>
                        <span className="font-bold text-gray-800">{District || ''} - {city || ''}</span>
                    </div>

                    <div className="p-3 bg-gray-50 rounded-xl">
                        <span className="text-gray-500 block text-xs mb-1">الجنسية</span>
                        <span className="font-bold text-gray-800">{formatField("nationality", nationality)}</span>
                    </div>

                    <div className="p-3 bg-gray-50 rounded-xl">
                        <span className="text-gray-500 block text-xs mb-1">المستوى التعليمي</span>
                        <span className="font-bold text-gray-800">{formatField("educationOptions", educationLevel)}</span>
                    </div>

                    <div className="p-3 bg-gray-50 rounded-xl">
                        <span className="text-gray-500 block text-xs mb-1">التخصص</span>
                        <span className="font-bold text-gray-800">{specialization || 'غير محدد'}</span>
                    </div>

                    <div className="p-3 bg-gray-50 rounded-xl">
                        <span className="text-gray-500 block text-xs mb-1">اللغة الإنجليزية</span>
                        <span className="font-bold text-gray-800">{englishLevel || 'متوسط'}</span>
                    </div>

                    <div className="p-3 bg-gray-50 rounded-xl">
                        <span className="text-gray-500 block text-xs mb-1">استخدام الحاسوب</span>
                        <span className="font-bold text-gray-800">{computerUsage || 'متوسط'}</span>
                    </div>
                </div>

                {interests && (
                    <div className="mt-4 p-3 bg-primary-50 rounded-xl text-sm">
                        <span className="text-primary-800 font-bold block text-xs mb-1">الاهتمامات التدريبية:</span>
                        <span className="text-primary-900 font-semibold">{interests}</span>
                    </div>
                )}
            </div>
        </div>
    );
}