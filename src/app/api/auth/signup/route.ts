import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import User from '@/models/User';
import { hashPassword, signToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { name, email, phone, password, role } = await req.json();

    if (!name || !email || !phone || !password) {
      return NextResponse.json({ message: 'جميع الحقول مطلوبة' }, { status: 400 });
    }

    await connectToDatabase();
    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return NextResponse.json({ message: 'البريد الإلكتروني مسجل بالفعل' }, { status: 400 });
    }

    const hashedPassword = await hashPassword(password);
    const initialRoles = role ? [role] : ['student'];

    const newUser = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      phone: phone.trim(),
      password: hashedPassword,
      roles: initialRoles,
    });

    const primaryRole = initialRoles.includes('admin') ? 'admin' : 'user';

    const token = signToken({
      userId: newUser._id.toString(),
      email: newUser.email,
      roles: newUser.roles,
      role: primaryRole,
    });

    const response = NextResponse.json(
      {
        message: 'تم إنشاء الحساب بنجاح',
        token,
        isAdmin: primaryRole === 'admin',
        user: {
          _id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          phone: newUser.phone,
          roles: newUser.roles,
        },
      },
      { status: 201 }
    );

    response.cookies.set('authorization', token, {
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    response.cookies.set('isAdmin', primaryRole === 'admin' ? 'true' : 'false', {
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error: any) {
    console.error('Signup Error:', error);
    return NextResponse.json({ message: error.message || 'حدث خطأ أثناء التسجيل' }, { status: 500 });
  }
}
