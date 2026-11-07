import Link from "next/link";
import Headers from "../config";
import { Header } from "../AdminHeader";
import { connectToDatabase } from "@/lib/db";
import User from "@/models/User";
import { User as UserIcon, Shield, Phone, Mail } from "lucide-react";

export default async function AdminUsers() {
    await Headers();

    let users: any[] = [];
    try {
        await connectToDatabase();
        users = await User.find({ deleteState: { $ne: true } })
            .sort({ createdAt: -1 })
            .select('-password')
            .lean();
    } catch (err) {
        console.error("Error loading users directly for admin:", err);
    }

    return (
        <div className="flex flex-col min-h-screen bg-white p-4 sm:p-6 w-full">
            <Header title={"إدارة المستخدمين والمسؤولين"} />

            <div className="my-4 pb-2 border-b border-slate-100 flex items-center justify-between">
                <span className="text-xs sm:text-sm font-semibold text-slate-500">
                    إجمالي المستخدمين: {users.length}
                </span>
            </div>

            {users.length === 0 ? (
                <div className="text-center py-12 text-slate-400 text-sm">
                    لا يوجد مستخدمون مسجلون حالياً
                </div>
            ) : (
                <div className="space-y-3">
                    {users.map((user: any) => (
                        <UserItem key={user._id.toString()} {...user} />
                    ))}
                </div>
            )}
        </div>
    );
}

const UserItem = ({ name, phone, email, roles, role, _id }: any) => {
    const idStr = _id.toString();
    const userRoles = roles || (role ? [role] : ['student']);
    const isAdmin = userRoles.includes('admin') || userRoles.includes('super_admin');

    return (
        <Link
            href={`/admin/users/${idStr}`}
            className="flex items-center gap-4 bg-white p-3 sm:p-4 rounded-xl border border-slate-200 hover:border-primary-400 hover:shadow-xs transition group"
        >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                isAdmin ? "bg-amber-100 text-amber-800" : "bg-slate-100 text-slate-600"
            }`}>
                {isAdmin ? <Shield className="w-5 h-5 text-amber-700" /> : <UserIcon className="w-5 h-5" />}
            </div>

            <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center gap-2">
                    <h3 className="text-slate-900 text-sm sm:text-base font-bold group-hover:text-primary-700 transition truncate">
                        {name}
                    </h3>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                        isAdmin ? "bg-amber-50 text-amber-700 border border-amber-200" : "bg-slate-100 text-slate-600"
                    }`}>
                        {isAdmin ? "مسؤول (Admin)" : "طالب (User)"}
                    </span>
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                    {phone && (
                        <span className="flex items-center gap-1">
                            <Phone className="w-3 h-3 text-slate-400" />
                            <span>{phone}</span>
                        </span>
                    )}
                    {email && (
                        <span className="flex items-center gap-1">
                            <Mail className="w-3 h-3 text-slate-400" />
                            <span>{email}</span>
                        </span>
                    )}
                </div>
            </div>

            <div className="hidden sm:flex text-xs font-bold text-primary-600 group-hover:translate-x-1 transition-transform">
                عرض الملف
            </div>
        </Link>
    );
};
