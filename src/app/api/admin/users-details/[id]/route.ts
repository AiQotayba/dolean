import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import UserDetails from '@/models/UserDetails';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await connectToDatabase();
    const data = await UserDetails.findById(id);
    if (!data) return NextResponse.json({ message: 'البيانات غير موجودة' }, { status: 404 });
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    await connectToDatabase();
    const data = await UserDetails.findByIdAndUpdate(id, body, { new: true });
    if (!data) return NextResponse.json({ message: 'البيانات غير موجودة' }, { status: 404 });
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await connectToDatabase();
    const data = await UserDetails.findByIdAndUpdate(id, { deleteState: true });
    if (!data) return NextResponse.json({ message: 'البيانات غير موجودة' }, { status: 404 });
    return NextResponse.json({ message: 'تم الحذف بنجاح' });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
