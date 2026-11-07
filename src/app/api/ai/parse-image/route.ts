import { NextRequest, NextResponse } from 'next/server';
import { extractCourseFromImage } from '@/lib/gemini';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const additionalNotes = (formData.get('notes') as string) || '';

    if (!file) {
      return NextResponse.json({ error: 'يرجى إرفاق صورة البوستر الإعلاني' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const mimeType = file.type || 'image/jpeg';

    const data = await extractCourseFromImage(buffer, mimeType, additionalNotes);
    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error('Gemini Parse Image Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'حدث خطأ أثناء معالجة صورة البوستر بواسطة الذكاء الاصطناعي' },
      { status: 500 }
    );
  }
}
