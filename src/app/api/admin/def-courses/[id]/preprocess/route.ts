import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import DefCourse from '@/models/DefCourse';
import { extractCourseFromText } from '@/lib/gemini';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await connectToDatabase();
    const defCourse = await DefCourse.findById(id);

    if (!defCourse) {
      return NextResponse.json({ message: 'البيانات غير موجودة' }, { status: 404 });
    }

    const rawText = `
العنوان: ${defCourse.title || ''}
الموقع: ${defCourse.location || ''}
التفاصيل:
${defCourse.context || defCourse.rawText || ''}
    `.trim();

    try {
      const extracted = await extractCourseFromText(rawText);
      return NextResponse.json(extracted);
    } catch (aiErr: any) {
      // إذا لم يتوفر مفتاح الذكاء الاصطناعي، يتم إرجاع نموذج أولي بالبيانات المتوفرة
      console.warn('Gemini extraction warning, falling back to basic parse:', aiErr.message);
      return NextResponse.json({
        title: defCourse.title || '',
        context: defCourse.context || '',
        location: defCourse.location || '',
        locationType: defCourse.location ? 'in_person' : 'online',
        providingEntityName: defCourse.organizationName || 'جهة تدريبية',
        ageEligibility: { start: 0, end: 100 },
        nationalities: ['All'],
        genderEligibility: 'all',
        isFree: true,
        cost: 0,
        currency: 'USD',
        stipendProvided: false,
        schedule: { daysOfWeek: [] },
        requirements: [],
        topics: [],
        keys: [],
        links: defCourse.Source ? [defCourse.Source] : [],
        certificateProvided: true,
      });
    }
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
