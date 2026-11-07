import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Organization from '@/models/Organization';
import { getAuthUser } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const organizations = await Organization.find({ deleteState: { $ne: true } }).sort({ name: 1 });
    return NextResponse.json(organizations);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const user = await getAuthUser(req);
    await connectToDatabase();

    const newOrg = await Organization.create(body);
    return NextResponse.json(newOrg, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}
