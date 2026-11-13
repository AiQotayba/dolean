import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import DefCourse from '@/models/DefCourse';

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);

    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.max(1, parseInt(searchParams.get('limit') || '10', 10));
    const search = searchParams.get('search')?.trim();
    const status = searchParams.get('status');
    const sortField = searchParams.get('sort_field') || 'createdAt';
    const sortOrder = searchParams.get('sort_order') === 'asc' ? 1 : -1;

    const query: any = { deleteState: { $ne: true } };

    if (search) {
      const regex = new RegExp(search.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&'), 'i');
      query.$or = [
        { title: regex },
        { context: regex },
        { rawText: regex },
        { Source: regex },
        { location: regex },
        { organizationName: regex },
      ];
    }

    if (status && status !== 'all') {
      query.status = status;
    }

    const sortOption: any = {};
    if (sortField === 'id' || sortField === '_id') {
      sortOption._id = sortOrder;
    } else {
      sortOption[sortField] = sortOrder;
    }

    const skip = (page - 1) * limit;

    const [total, data] = await Promise.all([
      DefCourse.countDocuments(query),
      DefCourse.find(query)
        .sort(sortOption)
        .skip(skip)
        .limit(limit)
        .lean(),
    ]);

    return NextResponse.json({
      isError: false,
      data,
      meta: {
        current_page: page,
        last_page: Math.ceil(total / limit) || 1,
        per_page: limit,
        total,
      },
    });
  } catch (error: any) {
    console.error('Admin DefCourses GET Error:', error);
    return NextResponse.json(
      { isError: true, message: error.message || 'حدث خطأ في الخادم' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    await connectToDatabase();

    if (typeof body.image !== 'string' || body.image.trim() === '[object Object]') {
      body.image = '';
    } else {
      body.image = body.image.trim();
    }

    const newDefCourse = await DefCourse.create(body);
    return NextResponse.json({ isError: false, data: newDefCourse }, { status: 201 });
  } catch (error: any) {
    console.error('DefCourse Creation Error:', error);
    return NextResponse.json({ isError: true, message: error.message }, { status: 400 });
  }
}
