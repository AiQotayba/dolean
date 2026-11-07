import { NextRequest } from 'next/server';
import { POST as handlePost } from '../details/route';

export async function POST(req: NextRequest) {
  return handlePost(req);
}
