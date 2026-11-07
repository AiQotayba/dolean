import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Course from '@/models/Course';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await connectToDatabase();
    const course = await Course.findOne({ _id: id, deleteState: { $ne: true } }).lean();

    if (!course) {
      return NextResponse.json({ message: 'الدورة غير موجودة' }, { status: 404 });
    }

    return NextResponse.json(course);
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'خطأ في جلب بيانات الدورة' }, { status: 500 });
  }
}
