import { NextRequest, NextResponse } from 'next/server';
import { extractCourseFromText } from '@/lib/gemini';

export async function POST(req: NextRequest) {
  try {
    const { rawText } = await req.json();

    if (!rawText || typeof rawText !== 'string' || rawText.trim().length < 10) {
      return NextResponse.json({ error: 'يرجى إدخال نص إعلان كافٍ للتحليل' }, { status: 400 });
    }

    const data = await extractCourseFromText(rawText);
    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error('Gemini Parse Text Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'حدث خطأ أثناء معالجة النص بواسطة الذكاء الاصطناعي' },
      { status: 500 }
    );
  }
}
