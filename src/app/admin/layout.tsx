import { redirect } from 'next/navigation';
import Headers from './config';
import { Header } from './AdminHeader';
import { AdminSidebar } from './AdminSidebar';
import { AdminTopNav } from './AdminTopNav';

export { Header };

export default async function Layout({ children }: { children: React.ReactNode }) {
    const headers: any = await Headers();

    if (!headers?.Authorization) {
        redirect('/auth?route=login');
    }

    return (
        <div className="min-h-screen bg-slate-50/60 flex flex-row w-full text-right" dir="rtl">
            {/* Sidebar */}
            <AdminSidebar />

            {/* Main Workspace Area */}
            <div className="flex-1 flex flex-col min-w-0 min-h-screen">
                <AdminTopNav />
                <main className="flex-1 w-full p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}