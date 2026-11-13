/**
 * مساعد رفع الصور إلى Vercel Blob عبر واجهة الخادم الآمنة
 */
export async function uploadImageToBlob(file: File): Promise<string> {
  if (!file) {
    throw new Error('لم يتم تحديد أي ملف للرفع');
  }

  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch('/api/upload', {
    method: 'POST',
    body: formData,
  });

  const data = await response.json().catch(() => null);

  if (!response.ok || !data?.success || !data?.url) {
    throw new Error(data?.error || 'فشل رفع الصورة إلى Vercel Blob');
  }

  return data.url as string;
}
