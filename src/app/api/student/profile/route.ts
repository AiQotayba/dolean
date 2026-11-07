import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import UserDetails from '@/models/UserDetails';
import { getAuthUser } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthUser(req);
    if (!user) {
      return NextResponse.json({ message: 'غير مصرح' }, { status: 401 });
    }

    await connectToDatabase();
    const details = await UserDetails.findOne({
      $or: [{ user_id: user._id }, { phone: user.phone }, { fullName: user.name }],
      deleteState: false,
    });

    return NextResponse.json(details || {});
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const user = await getAuthUser(req);
    if (!user) {
      return NextResponse.json({ message: 'غير مصرح' }, { status: 401 });
    }

    const body = await req.json();
    await connectToDatabase();

    const updated = await UserDetails.findOneAndUpdate(
      {
        $or: [{ user_id: user._id }, { phone: user.phone }],
      },
      { ...body, user_id: user._id },
      { new: true, upsert: true }
    );

    return NextResponse.json({ message: 'تم تحديث الملف الشخصي بنجاح', data: updated });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
