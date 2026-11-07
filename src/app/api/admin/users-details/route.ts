import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import UserDetails from '@/models/UserDetails';

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);

    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.max(1, parseInt(searchParams.get('limit') || '10', 10));
    const search = searchParams.get('search')?.trim();
    const sortField = searchParams.get('sort_field') || 'createdAt';
    const sortOrder = searchParams.get('sort_order') === 'asc' ? 1 : -1;

    const conditions: any[] = [{ deleteState: { $ne: true } }];

    // Search query over multiple relevant fields
    if (search) {
      const regex = new RegExp(search.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&'), 'i');
      conditions.push({
        $or: [
          { fullName: regex },
          { phone: regex },
          { city: regex },
          { District: regex },
          { specialization: regex },
          { interests: regex },
          { work: regex },
        ],
      });
    }

    const district = searchParams.get('district');
    if (district && district !== 'All') {
      conditions.push({ District: district });
    }

    const dateFilterParam = searchParams.get('date_filter');
    const fromParam = searchParams.get('from');
    const toParam = searchParams.get('to');
    const now = new Date();

    let dateRange: { $gte?: Date; $lte?: Date } | null = null;

    if (dateFilterParam === 'today') {
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
      const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
      dateRange = { $gte: todayStart, $lte: todayEnd };
    } else if (dateFilterParam === 'week') {
      const dayOfWeek = now.getDay();
      const weekStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - dayOfWeek, 0, 0, 0);
      const weekEnd = new Date(weekStart.getTime() + 7 * 24 * 60 * 60 * 1000 - 1);
      dateRange = { $gte: weekStart, $lte: weekEnd };
    } else if (dateFilterParam === 'month') {
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0);
      const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
      const monthEnd = new Date(now.getFullYear(), now.getMonth(), daysInMonth, 23, 59, 59, 999);
      dateRange = { $gte: monthStart, $lte: monthEnd };
    } else if (dateFilterParam === '30days') {
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      dateRange = { $gte: thirtyDaysAgo };
    } else if (dateFilterParam === 'custom' || fromParam || toParam) {
      const customRange: any = {};
      if (fromParam) customRange.$gte = new Date(fromParam);
      if (toParam) customRange.$lte = new Date(new Date(toParam).getTime() + 24 * 60 * 60 * 1000 - 1);
      if (Object.keys(customRange).length > 0) {
        dateRange = customRange;
      }
    }

    if (dateRange) {
      conditions.push({
        $or: [
          { createdAt: dateRange },
          { create_at: dateRange },
        ],
      });
    }

    const query = conditions.length === 1 ? conditions[0] : { $and: conditions };

    const sortOption: any = {};
    if (sortField === 'id' || sortField === '_id') {
      sortOption._id = sortOrder;
    } else {
      sortOption[sortField] = sortOrder;
    }

    const skip = (page - 1) * limit;

    const [total, data] = await Promise.all([
      UserDetails.countDocuments(query),
      UserDetails.find(query)
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
    return NextResponse.json(
      { isError: true, message: error.message || 'حدث خطأ في الخادم' },
      { status: 500 }
    );
  }
}
