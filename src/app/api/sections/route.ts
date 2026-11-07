import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Section from '@/models/Section';

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const sections = await Section.find({ deleteState: { $ne: true }, isActive: true }).sort({ order: 1, createdAt: -1 });
    return NextResponse.json(sections);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
