import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import User from '@/models/User';
import UserDetails from '@/models/UserDetails';
import Course from '@/models/Course';
import DefCourse from '@/models/DefCourse';

import Slider from '@/models/Slider';
import Section from '@/models/Section';
import Organization from '@/models/Organization';

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const [users, userDetails, courses, defCourses, sliders, sections, organizations] = await Promise.all([
      User.countDocuments({ deleteState: { $ne: true } }),
      UserDetails.countDocuments({ deleteState: { $ne: true } }),
      Course.countDocuments({ deleteState: { $ne: true } }),
      DefCourse.countDocuments({ deleteState: { $ne: true } }),
      Slider.countDocuments({ deleteState: { $ne: true } }),
      Section.countDocuments({ deleteState: { $ne: true } }),
      Organization.countDocuments({ deleteState: { $ne: true } }),
    ]);

    return NextResponse.json({
      users,
      userDetails,
      courses,
      defCourses,
      sliders,
      sections,
      organizations,
    });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
