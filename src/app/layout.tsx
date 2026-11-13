import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "@/components/index.css";

import type { Metadata } from 'next';
import ProgressBarProvider from '@/components/theme/ProgressBarProvider';
import { Providers } from '@/components/providers/Providers';

export const metadata: Metadata = {
    title: 'تلاقي | اطلب دورتك التدريبية مجاناً في إدلب والشمال السوري',
    description: 'سجّل المهارة التي تريد تعلّمها، ونحن نصلك بمراكز معتمدة. مجاني، وتصلك التفاصيل على واتساب.',
    applicationName: 'تلاقي',
    manifest: '/manifest.json',
    icons: [
        {
            rel: 'icon',
            url: '/favicon.png',
            sizes: 'any',
            type: 'image/x-icon',
        },
    ],
    openGraph: {
        title: 'تلاقي | اطلب دورتك التدريبية مجاناً في إدلب والشمال السوري',
        description: 'سجّل المهارة التي تريد تعلّمها، ونحن نصلك بمراكز معتمدة. مجاني، وتصلك التفاصيل على واتساب.',
        type: 'website',
        siteName: 'تلاقي',
    },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang='ar' dir='rtl'>
            <head>
                <link rel="icon" href="/favicon.ico" sizes="any" />
            </head>
            <body className="bg-[#f8f9fc] text-slate-900 antialiased min-h-screen flex flex-col">
                <ProgressBarProvider />
                <Analytics />
                <SpeedInsights />
                <Providers>
                    {children}
                </Providers>
            </body>
        </html>
    );
}
