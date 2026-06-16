import { NextResponse } from 'next/server';
import { toPublicError } from '@/lib/http';
import { findSchool } from '@/lib/tuyensinh247-api';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.user_scores) {
      return NextResponse.json({ error: 'Thiếu dữ liệu điểm học bạ.' }, { status: 400 });
    }
    return NextResponse.json(await findSchool(body));
  } catch (error) {
    const publicError = toPublicError(error, 'Không lấy được gợi ý trường.');
    return NextResponse.json({ error: publicError.message }, { status: publicError.status });
  }
}
