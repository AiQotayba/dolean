import { NextRequest, NextResponse } from 'next/server';
import { suggestTrainingKeywords } from '@/lib/gemini';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, summary, context } = body;

    if (!title || typeof title !== 'string') {
      return NextResponse.json(
        { isError: true, message: 'عنوان التدريب مطلوب لاقتراح الكلمات المفتاحية' },
        { status: 400 }
      );
    }

    const result = await suggestTrainingKeywords({
      title: title.trim(),
      summary: summary || '',
      context: context || '',
    });

    return NextResponse.json({
      isError: false,
      data: result,
    });
  } catch (error: any) {
    console.error('Error suggesting keywords:', error);
    return NextResponse.json(
      {
        isError: true,
        message: error.message || 'فشل في استخراج الكلمات المفتاحية عبر الذكاء الاصطناعي',
      },
      { status: 500 }
    );
  }
}
