import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import DefCourse from '@/models/DefCourse';

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const data = await DefCourse.find({ deleteState: { $ne: true } }).sort({ createdAt: -1 });
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    await connectToDatabase();

    const newDefCourse = await DefCourse.create({
      title: body.title || '',
      context: body.context || body.rawText || '',
      rawText: body.rawText || body.context || '',
      image: body.image || '',
      Source: body.Source || body.sourceUrl || '',
      location: body.location || '',
      organizationName: body.organizationName || '',
    });

    return NextResponse.json(newDefCourse, { status: 201 });
  } catch (error: any) {
    console.error('DefCourse Error:', error);
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}
