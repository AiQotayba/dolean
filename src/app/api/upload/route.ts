import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';

// الحد الأقصى لحجم الصورة المسموح برفعها: 10 ميغابايت
const MAX_FILE_SIZE = 10 * 1024 * 1024;

const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/svg+xml',
  'image/avif',
];

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'يرجى إرفاق ملف الصورة المطلوب رفعه' },
        { status: 400 }
      );
    }

    // التحقق من نوع الملف (يجب أن يكون صورة)
    if (!ALLOWED_MIME_TYPES.includes(file.type) && !file.type.startsWith('image/')) {
      return NextResponse.json(
        { success: false, error: 'نوع الملف غير مدعوم، يرجى اختيار صورة صالحة (PNG, JPG, WebP...)' },
        { status: 400 }
      );
    }

    // التحقق من الحجم
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { success: false, error: 'حجم الصورة كبير جداً، الحد الأقصى المسموح به هو 10 ميغابايت' },
        { status: 400 }
      );
    }

    // تنظيف اسم الملف وإنشاء مسار سحابي فريد داخل مجلد courses
    const originalName = file.name || 'image.jpg';
    const cleanName = originalName.replace(/[^a-zA-Z0-9.-]/g, '_');
    const pathname = `courses/${Date.now()}-${cleanName}`;

    // الرفع إلى Vercel Blob مع دعم المتاجر العامة والخاصة (Public & Private Stores)
    let blob;
    let isPrivate = false;

    try {
      blob = await put(pathname, file, {
        access: 'public',
        addRandomSuffix: true,
      });
    } catch (err: any) {
      if (err.message?.includes('private store') || err.message?.includes('private access')) {
        isPrivate = true;
        blob = await put(pathname, file, {
          access: 'private',
          addRandomSuffix: true,
        });
      } else {
        throw err;
      }
    }

    // إذا كان المتجر خاصاً (Private)، نُرجع رابط العرض السلس /api/blob لتعمل الصور في كافة المتصفحات دون 403
    const publicAccessibleUrl = isPrivate
      ? `/api/blob?url=${encodeURIComponent(blob.url)}`
      : blob.url;

    return NextResponse.json({
      success: true,
      url: publicAccessibleUrl,
      rawUrl: blob.url,
      pathname: blob.pathname,
      contentType: blob.contentType,
      isPrivate,
    });
  } catch (error: any) {
    console.error('Vercel Blob Upload Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'حدث خطأ أثناء رفع الصورة إلى Vercel Blob',
      },
      { status: 500 }
    );
  }
}
