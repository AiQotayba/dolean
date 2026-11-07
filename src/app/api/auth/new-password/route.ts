import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import User from '@/models/User';
import { hashPassword } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { newPassword, token } = await req.json();

    if (!token || typeof token !== 'string') {
      return NextResponse.json(
        { success: false, message: 'رمز إعادة التعيين مطلوب أو غير صالح' },
        { status: 400 }
      );
    }

    if (!newPassword || typeof newPassword !== 'string' || newPassword.length < 8) {
      return NextResponse.json(
        { success: false, message: 'كلمة المرور يجب أن تكون 8 أحرف على الأقل' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // البحث عن المستخدم الذي يملك هذا الرمز ولم تنتهِ صلاحيته بعد
    const user = await User.findOne({
      resetPasswordToken: token.trim(),
      resetPasswordExpires: { $gt: new Date() },
      deleteState: false,
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'رابط إعادة التعيين غير صالح أو انتهت صلاحيته' },
        { status: 400 }
      );
    }

    // تشفير كلمة المرور الجديدة وتحديث المستخدم
    const hashedPassword = await hashPassword(newPassword);

    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    console.log(`[AUTH] Password successfully updated for user: ${user.email}`);

    return NextResponse.json({
      success: true,
      message: 'تم تعيين كلمة المرور بنجاح، يمكنك الآن تسجيل الدخول',
    });
  } catch (error: any) {
    console.error('[AUTH] New Password Error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'حدث خطأ في الخادم' },
      { status: 500 }
    );
  }
}
