import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Course from '@/models/Course';
import { getAuthUser } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);

    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.max(1, parseInt(searchParams.get('limit') || '10', 10));
    const search = searchParams.get('search')?.trim();
    const pricingFilter = searchParams.get('pricing');
    const statusFilter = searchParams.get('status');
    const sortField = searchParams.get('sort_field') || 'createdAt';
    const sortOrder = searchParams.get('sort_order') === 'asc' ? 1 : -1;

    const query: any = { deleteState: { $ne: true } };

    // Search filter across title, summary, provider, and city
    if (search) {
      const regex = new RegExp(search.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&'), 'i');
      query.$or = [
        { title: regex },
        { summary: regex },
        { 'providingEntity.name': regex },
        { 'locationDetails.city': regex },
        { location: regex },
        { keys: regex },
      ];
    }

    // Pricing filter
    if (pricingFilter === 'free') {
      query.$or = [{ 'pricing.isFree': true }, { price: 0 }];
    } else if (pricingFilter === 'paid') {
      query.$and = [
        { 'pricing.isFree': false },
        { $or: [{ 'pricing.cost': { $gt: 0 } }, { price: { $gt: 0 } }] },
      ];
    }

    // Status filter
    if (statusFilter && statusFilter !== 'all') {
      query.status = statusFilter;
    }

    // Sort options
    const sortOption: any = {};
    if (sortField === 'id' || sortField === '_id') {
      sortOption._id = sortOrder;
    } else if (sortField === 'pricing') {
      sortOption['pricing.cost'] = sortOrder;
    } else {
      sortOption[sortField] = sortOrder;
      if (sortField !== '_id') {
        sortOption._id = -1;
      }
    }

    const skip = (page - 1) * limit;

    const [total, data] = await Promise.all([
      Course.countDocuments(query),
      Course.find(query)
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
    console.error('Admin Courses GET Error:', error);
    return NextResponse.json(
      { isError: true, message: error.message || 'حدث خطأ في الخادم' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const user = await getAuthUser(req);
    await connectToDatabase();

    // 1. تنظيف وتأمين حقل الصورة لمنع أخطاء Cast to string (مثل كائن FileList { '0': {} })
    if (typeof body.image !== 'string' || body.image.trim() === '[object Object]') {
      body.image = '';
    } else {
      body.image = body.image.trim();
    }

    // 2. معالجة الروابط
    if (typeof body.links === 'string') {
      body.links = body.links.split(/[\n,]+/).map((l: string) => l.trim()).filter(Boolean);
    } else if (!Array.isArray(body.links)) {
      body.links = [];
    }

    // 3. معالجة الكلمات المفتاحية
    if (typeof body.keys === 'string') {
      body.keys = body.keys.split(/[\n,]+/).map((k: string) => k.trim()).filter(Boolean);
    } else if (!Array.isArray(body.keys)) {
      body.keys = [];
    }

    // 4. مطابقة الفئة العمرية
    if (!body.ageEligibility && body.age) {
      body.ageEligibility = {
        start: Number(body.age.start) || 0,
        end: Number(body.age.end) || 100,
      };
    }

    // 5. مطابقة الجنسيات
    if (!body.nationalityEligibility && body.nationality) {
      body.nationalityEligibility = Array.isArray(body.nationality)
        ? body.nationality
        : [body.nationality];
    }

    // 6. إعداد الجهة الناشرة إن لم تكن محددة
    if (!body.publishingEntity) {
      body.publishingEntity = {
        publisherType: 'platform',
        publisherId: user?._id || null,
        name: user?.name || 'منصة تلاقي',
      };
    }

    // 7. إعداد الجهة المقدمة إن لم تكن محددة
    if (!body.providingEntity) {
      body.providingEntity = {
        name: body.center || 'جهة تدريبية',
        logo: '',
      };
    }

    const newCourse = await Course.create(body);
    return NextResponse.json({ isError: false, data: newCourse }, { status: 201 });
  } catch (error: any) {
    console.error('Course Creation Error:', error);
    return NextResponse.json({ isError: true, message: error.message }, { status: 400 });
  }
}
