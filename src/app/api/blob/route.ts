import { NextRequest, NextResponse } from 'next/server';
import { get } from '@vercel/blob';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const url = searchParams.get('url');

    if (!url) {
      return new NextResponse('Missing url parameter', { status: 400 });
    }

    const result = await get(url, { access: 'private' });
    if (!result || !result.stream) {
      return new NextResponse('File not found in Vercel Blob', { status: 404 });
    }

    const responseHeaders = new Headers();
    const contentType = result.headers?.get('content-type') || 'application/octet-stream';
    responseHeaders.set('Content-Type', contentType);
    responseHeaders.set('Cache-Control', 'public, max-age=31536000, immutable');

    return new NextResponse(result.stream as any, {
      status: 200,
      headers: responseHeaders,
    });
  } catch (err: any) {
    console.error('Blob Serve Error:', err);
    return new NextResponse(err.message || 'Error serving blob', { status: 500 });
  }
}
