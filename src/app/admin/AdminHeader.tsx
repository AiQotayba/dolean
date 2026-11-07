import React from 'react';
import Link from 'next/link';
import { ArrowRight, Plus } from 'lucide-react';

interface HeaderProps {
    title: string;
    subtitle?: string;
    to?: string;
    add?: string;
    addLabel?: string;
    action?: React.ReactNode;
}

export const Header = ({ to = "/admin", title, subtitle, add, addLabel = "إضافة جديدة", action }: HeaderProps) => {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 mb-6 border-b border-slate-200">
            <div className="flex items-center gap-3">
                {to && (
                    <Link
                        href={to}
                        className="p-2 rounded-xl border border-slate-200 hover:border-slate-300 bg-white text-slate-600 hover:text-slate-900 transition shadow-2xs"
                        aria-label="Back"
                    >
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                )}
                <div>
                    <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">{title}</h1>
                    {subtitle && <p className="text-xs text-slate-500 mt-1">{subtitle}</p>}
                </div>
            </div>

            <div className="flex items-center gap-2">
                {action}
                {add && (
                    <Link
                        href={add}
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#123D3A] hover:bg-[#0E2F2D] text-white text-xs sm:text-sm font-bold shadow-sm transition active:scale-95"
                    >
                        <Plus className="w-4 h-4" />
                        <span>{addLabel}</span>
                    </Link>
                )}
            </div>
        </div>
    );
};

export default Header;
