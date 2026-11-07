import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import UserDetails from '@/models/UserDetails';
import { getAuthUser } from '@/lib/auth';
import waSend from '@/lib/wa';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const authUser = await getAuthUser(req);

    // Format birth year if provided, otherwise default to 2000
    if (body.births) {
      const birthDate = new Date(body.births);
      if (!isNaN(birthDate.getTime())) {
        const formatted = birthDate.toJSON().split('T')[0].replaceAll('-', '');
        body.births = Number(formatted);
      } else {
        body.births = Number(body.births) || 2000;
      }
    } else {
      body.births = 2000;
    }

    // Connect user_id and profile data if authenticated
    if (authUser) {
      body.user_id = authUser._id;
      body.fullName = body.fullName || authUser.name || 'طالب مسجل';
      body.phone = body.phone || authUser.phone || '';
    } else {
      body.fullName = body.fullName || 'طالب جديد';
      body.phone = body.phone || '';
    }

    body.District = body.District || 'إدلب';
    body.city = body.city || body.District;

    await connectToDatabase();
    const newUserDetails = await UserDetails.create(body);

    // Optional WhatsApp notification
    try {
      await waSend(
        '96170723177',
        `> تم تسجيل رغبة تدريبية جديدة *${(newUserDetails.fullName || '').trim()}*\n📞 ${newUserDetails.phone}\n🎯 الدورة المطلوبة: ${newUserDetails.interests || 'غير محدد'}\n📍 المنطقة: ${newUserDetails.District || ''}`
      );
    } catch (waErr) {
      console.warn('WhatsApp notify failed:', waErr);
    }

    return NextResponse.json(
      {
        message: 'تم تسجيل طلبك بنجاح',
        data: newUserDetails,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating user details:', error);
    const isIpWhitelistError = error.message?.includes('whitelisted') || error.message?.includes('serverSelectionTimeoutMS') || error.message?.includes('Could not connect');
    const userMessage = isIpWhitelistError
      ? 'تعذر الاتصال بقاعدة البيانات (MongoDB Atlas). يرجى التأكد من إضافة عنوان IP الحالي (أو 0.0.0.0/0) في لوحة MongoDB Atlas -> Network Access.'
      : (error.message || 'حدث خطأ أثناء تسجيل الطلب');

    return NextResponse.json(
      { message: userMessage, error: error.message },
      { status: 500 }
    );
  }
}
