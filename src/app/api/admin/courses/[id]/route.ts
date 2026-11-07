import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Course from '@/models/Course';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await connectToDatabase();
    const course = await Course.findById(id);
    if (!course) return NextResponse.json({ message: 'الدورة غير موجودة' }, { status: 404 });
    return NextResponse.json(course);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    await connectToDatabase();
    const updated = await Course.findByIdAndUpdate(id, body, { new: true });
    if (!updated) return NextResponse.json({ message: 'الدورة غير موجودة' }, { status: 404 });
    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await connectToDatabase();
    const course = await Course.findByIdAndUpdate(id, { deleteState: true }, { new: true });
    if (!course) return NextResponse.json({ message: 'الدورة غير موجودة' }, { status: 404 });
    return NextResponse.json({ message: 'تم حذف الدورة بنجاح' });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
