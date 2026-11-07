import Nav from '@/components/theme/Nav';
import Footer from '@/components/theme/Footer';

export default function PublicLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex flex-col min-h-screen w-full">
            <Nav />
            <main className="flex-1 w-full pt-16 md:pt-20">
                {children}
            </main>
            <Footer />
        </div>
    );
}
