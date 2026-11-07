import { Suspense } from 'react';
import { Metadata } from 'next';
import { connectToDatabase } from '@/lib/db';
import Organization from '@/models/Organization';
import Course from '@/models/Course';
import CentersDirectory, { CenterItem } from '@/components/centers/CentersDirectory';

export const metadata: Metadata = {
  title: 'المراكز والمعاهد التدريبية الشريكة | تلاقي',
  description: 'دليل المراكز والمعاهد والمنظمات التدريبية المعتمدة في إدلب والشمال السوري.',
};

async function AsyncCentersList() {
  let centers: CenterItem[] = [];

  try {
    await connectToDatabase();
    const rawOrgs = await Organization.find({ deleteState: { $ne: true } })
      .sort({ isVerified: -1, createdAt: -1 })
      .lean();

    // جلب عدد الدورات لكل مركز لربط البيانات بدقة
    const coursesCountMap: Record<string, number> = {};
    const rawCourses = await Course.find({ deleteState: { $ne: true } })
      .select('providingEntity')
      .lean();

    rawCourses.forEach((c: any) => {
      const orgId = c.providingEntity?.organizationId?.toString();
      const orgName = c.providingEntity?.name;
      if (orgId) {
        coursesCountMap[orgId] = (coursesCountMap[orgId] || 0) + 1;
      } else if (orgName) {
        coursesCountMap[orgName] = (coursesCountMap[orgName] || 0) + 1;
      }
    });

    centers = rawOrgs.map((org: any) => {
      const idStr = org._id.toString();
      return {
        _id: idStr,
        name: org.name || 'مركز تدريبي',
        orgType: org.orgType || 'institute',
        description: org.description || '',
        logo: org.logo || '',
        city: org.address?.city || 'إدلب',
        district: org.address?.district || '',
        contactPhone: org.contactPhone || '',
        contactEmail: org.contactEmail || '',
        website: org.website || '',
        isVerified: org.isVerified ?? true,
        coursesCount: coursesCountMap[idStr] || coursesCountMap[org.name] || 0,
      };
    });
  } catch (error) {
    console.error('Error loading centers from DB:', error);
  }

  return <CentersDirectory initialCenters={centers} />;
}

export default function CentersPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full max-w-6xl mx-auto px-4 py-16 text-center">
          <div className="h-44 w-full bg-slate-200/70 rounded-3xl animate-pulse mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="h-64 bg-slate-200/60 rounded-2xl animate-pulse" />
            <div className="h-64 bg-slate-200/60 rounded-2xl animate-pulse" />
            <div className="h-64 bg-slate-200/60 rounded-2xl animate-pulse" />
          </div>
        </div>
      }
    >
      <AsyncCentersList />
    </Suspense>
  );
}
