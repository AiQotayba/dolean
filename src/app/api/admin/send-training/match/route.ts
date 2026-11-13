import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import UserDetails from '@/models/UserDetails';

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);

    const rawKeywords = searchParams.get('keywords')?.trim() || '';
    const district = searchParams.get('district')?.trim();
    const pricing = searchParams.get('pricing')?.trim();
    const search = searchParams.get('search')?.trim();
    const countOnly = searchParams.get('countOnly') === 'true';
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.max(1, parseInt(searchParams.get('limit') || '100', 10));

    // Parse keywords by comma, Arabic comma, semicolon, or newline
    const parsedKeywords = rawKeywords
      ? rawKeywords
          .split(/[,،;\n]+/)
          .map((k) => k.trim())
          .filter((k) => k.length > 0)
      : [];

    const conditions: any[] = [{ deleteState: { $ne: true } }];

    // Optional district filter
    if (district && district !== 'All' && district !== 'الكل') {
      conditions.push({ District: district });
    }

    // Optional pricing filter
    if (pricing === 'free') {
      conditions.push({ freeCourses: true });
    } else if (pricing === 'paid') {
      conditions.push({ paidCourses: true });
    }

    // Optional text search by student name or phone
    if (search) {
      const searchRegex = new RegExp(search.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&'), 'i');
      conditions.push({
        $or: [{ fullName: searchRegex }, { phone: searchRegex }, { city: searchRegex }],
      });
    }

    // Keywords matching condition
    if (parsedKeywords.length > 0) {
      const keywordOrConditions = parsedKeywords.map((kw) => {
        const escaped = kw.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
        const regex = new RegExp(escaped, 'i');
        return {
          $or: [
            { interests: regex },
            { specialization: regex },
            { requiredCourses: regex },
            { work: regex },
          ],
        };
      });

      conditions.push({ $or: keywordOrConditions });
    }

    const query = conditions.length === 1 ? conditions[0] : { $and: conditions };

    // If only count is requested (for live counter in Step 2)
    if (countOnly) {
      const [total, sample] = await Promise.all([
        UserDetails.countDocuments(query),
        UserDetails.find(query)
          .select('fullName interests specialization District city')
          .sort({ createdAt: -1 })
          .limit(4)
          .lean(),
      ]);

      return NextResponse.json({
        isError: false,
        total,
        parsedKeywords,
        sample,
      });
    }

    const skip = (page - 1) * limit;

    const [total, rawStudents] = await Promise.all([
      UserDetails.countDocuments(query),
      UserDetails.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
    ]);

    // Enrich each student with matched keywords and relevance score
    const enriched = (rawStudents as any[]).map((student) => {
      const matched = parsedKeywords.filter((kw) => {
        const lower = kw.toLowerCase();
        return (
          (student.interests && student.interests.toLowerCase().includes(lower)) ||
          (student.specialization && student.specialization.toLowerCase().includes(lower)) ||
          (Array.isArray(student.requiredCourses) &&
            student.requiredCourses.some((rc: string) => rc && rc.toLowerCase().includes(lower))) ||
          (student.work && student.work.toLowerCase().includes(lower))
        );
      });

      return {
        ...student,
        matchedKeywords: matched,
      };
    });

    // If keywords were specified, sort highest matches first
    if (parsedKeywords.length > 0) {
      enriched.sort((a, b) => b.matchedKeywords.length - a.matchedKeywords.length);
    }

    return NextResponse.json({
      isError: false,
      data: enriched,
      total,
      page,
      limit,
      parsedKeywords,
    });
  } catch (error: any) {
    console.error('Error matching students:', error);
    return NextResponse.json(
      { isError: true, message: error.message || 'حدث خطأ أثناء البحث عن الطلاب' },
      { status: 500 }
    );
  }
}
