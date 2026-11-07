import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Slider from '@/models/Slider';

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const sliders = await Slider.find({ deleteState: { $ne: true }, isActive: true }).sort({ order: 1, createdAt: -1 });
    return NextResponse.json(sliders);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
