import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Course from '@/models/Course';
import UserDetails from '@/models/UserDetails';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await connectToDatabase();
    const course: any = await Course.findById(id).select('-context -keys');
    if (!course) {
      return NextResponse.json({ message: 'الدورة غير موجودة' }, { status: 404 });
    }

    const query: any = { deleteState: { $ne: true } };

    // فلترة حسب الجنسية
    if (course.nationality && course.nationality !== 'All') {
      query.nationality = course.nationality;
    }

    // فلترة حسب السعر
    if (course.pricing?.isFree || course.price === 0) {
      query.freeCourses = true;
    } else if ((course.pricing?.cost && course.pricing.cost > 0) || (course.price && course.price > 0)) {
      const price = course.pricing?.cost || course.price;
      query.paidCourses = true;
      query.paidCoursesLimit = { $gte: price };
    }

    const filteredUsers = await UserDetails.find(query).sort({ _id: -1 });

    return NextResponse.json({ users: filteredUsers, course });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
