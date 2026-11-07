import Login from "./login";
import Signup from "./signup";
import ResetPassword from "./repassword";
import NewPassword from "./newpassword";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Logo from "@/components/theme/Logo";
import Link from "next/link";

interface AuthProps {
    searchParams?: Promise<{
        route?: string;
        token?: string;
    }>;
}

export default async function Auth({ searchParams }: AuthProps) {
    const params = searchParams ? await searchParams : {};
    const route = params?.route || 'login';

    const cookieStore = await cookies();
    const token = cookieStore.get('authorization')?.value;

    if (token) {
        redirect("/admin");
    }

    return (
        <section className="w-full min-h-[calc(100vh-140px)] flex flex-col items-center justify-center py-12 px-4 sm:px-6">
            <div className="w-full max-w-md">
                <div className="flex flex-col items-center mb-6">
                    <Link href="/" className="inline-block transition-transform hover:scale-105">
                        <Logo />
                    </Link>
                    <p className="text-xs text-slate-500 mt-2 font-medium">
                        بوابة الدخول الموحدة للطلاب والمراكز
                    </p>
                </div>

                <div className="w-full bg-white rounded-3xl border border-slate-200/90 shadow-xl shadow-slate-100/60 p-6 sm:p-8">
                    {route === "login" && <Login />}
                    {route === "signup" && <Signup />}
                    {route === "resetpassword" && <ResetPassword />}
                    {route === "newPassword" && <NewPassword searchParams={params} />}
                    {!["login", "signup", "resetpassword", "newPassword"].includes(route) && <Login />}
                </div>
            </div>
        </section>
    );
}
