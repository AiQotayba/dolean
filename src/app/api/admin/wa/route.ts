import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import UserDetails from '@/models/UserDetails';
import waSend from '@/lib/wa';

export async function POST(req: NextRequest) {
  try {
    const { list, msg } = await req.json();

    if (!list || !Array.isArray(list) || list.length === 0) {
      return NextResponse.json({ message: 'قائمة المستخدمين فارغة' }, { status: 400 });
    }

    if (!msg) {
      return NextResponse.json({ message: 'نص الرسالة مطلوب' }, { status: 400 });
    }

    await connectToDatabase();
    const users = await UserDetails.find({ _id: { $in: list } });

    const results: any[] = [];
    for (const user of users) {
      if (user.phone) {
        try {
          const res = await waSend(user.phone, msg);
          results.push({ phone: user.phone, status: 'sent', res });
        } catch (err: any) {
          results.push({ phone: user.phone, status: 'failed', error: err.message });
        }
      }
    }

    return NextResponse.json({
      message: `تمت معالجة إرسال الرسائل لـ ${results.length} مستخدم`,
      results,
    });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
