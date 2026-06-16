import { NextResponse } from 'next/server';
import { toPublicError } from '@/lib/http';
import { getTranscript, type Lop } from '@/lib/thpt-api';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const token = String(body.token ?? '');
    const lop = String(body.lop ?? '') as Lop;

    if (!token || !['10', '11', '12'].includes(lop)) {
      return NextResponse.json({ error: 'Thiếu token hoặc lớp không hợp lệ.' }, { status: 400 });
    }

    return NextResponse.json(await getTranscript(token, lop));
  } catch (error) {
    const publicError = toPublicError(error, 'Không lấy được học bạ.');
    return NextResponse.json({ error: publicError.message }, { status: publicError.status });
  }
}
