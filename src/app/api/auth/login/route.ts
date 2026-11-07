import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import User from '@/models/User';
import { comparePassword, signToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ message: 'البريد الإلكتروني وكلمة المرور مطلوبان' }, { status: 400 });
    }

    await connectToDatabase();
    const user = await User.findOne({ email: email.toLowerCase().trim(), deleteState: { $ne: true } });

    if (!user || !user.password) {
      return NextResponse.json({ message: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' }, { status: 401 });
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ message: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' }, { status: 401 });
    }

    const roles = user.roles || [];
    const primaryRole = roles.includes('admin') || roles.includes('super_admin') ? 'admin' : 'user';

    const token = signToken({
      userId: user._id.toString(),
      email: user.email,
      roles: user.roles,
      role: primaryRole,
    });

    const response = NextResponse.json({
      success: true,
      token,
      isAdmin: primaryRole === 'admin',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: primaryRole,
        roles: user.roles,
        organizationId: user.organizationId,
      },
    });

    response.cookies.set('authorization', token, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    response.cookies.set('isAdmin', primaryRole === 'admin' ? 'true' : 'false', {
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error: any) {
    console.error('Login Error:', error);
    return NextResponse.json({ message: error.message || 'حدث خطأ في الخادم' }, { status: 500 });
  }
}
