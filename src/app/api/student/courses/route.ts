import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Course from '@/models/Course';

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);

    const query: any = { deleteState: { $ne: true } };

    const search = searchParams.get('q');
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { context: { $regex: search, $options: 'i' } },
        { 'providingEntity.name': { $regex: search, $options: 'i' } },
        { keys: { $in: [new RegExp(search, 'i')] } },
      ];
    }

    const city = searchParams.get('city');
    if (city && city !== 'all') {
      query.$or = [
        { location: { $regex: city, $options: 'i' } },
        { 'locationDetails.city': { $regex: city, $options: 'i' } },
      ];
    }

    const isOnline = searchParams.get('isOnline');
    if (isOnline !== null) {
      if (isOnline === 'true') {
        query.locationType = 'online';
      } else if (isOnline === 'false') {
        query.locationType = { $in: ['in_person', 'hybrid'] };
      }
    }

    const courses = await Course.find(query).sort({ createdAt: -1 }).lean();
    return NextResponse.json(courses);
  } catch (error: any) {
    console.error('Fetch Courses Error:', error);
    return NextResponse.json({ message: error.message || 'فشل جلب الدورات' }, { status: 500 });
  }
}
