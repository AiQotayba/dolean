import Link from 'next/link';

const NotFoundPage = ({ to = "/" }: { to?: string }) => {
    return (
        <section className="bg-white ddark:bg-gray-900">
            <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
                <div className="mx-auto max-w-screen-sm text-center">
                    <h1 className="mb-4 text-7xl tracking-tight font-extrabold lg:text-9xl text-primary-600 ddark:text-primary-500">404</h1>
                    <p className="mb-4 text-3xl tracking-tight font-bold text-gray-900 md:text-4xl ddark:text-white">هناك خطأ ما.</p>
                    <p className="mb-4 text-lg font-light text-gray-500 ddark:text-gray-400">عذرًا، لا يمكننا العثور على هذه الصفحة. ستجد الكثير لتستكشفه في الصفحة الرئيسية.</p>
                    <Link href={to} className="inline-flex text-white bg-primary-600 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center ddark:focus:ring-primary-900 my-4">العودة إلى الصفحة الرئيسية</Link>
                </div>
            </div>
        </section>
    );
};

export default NotFoundPage;
