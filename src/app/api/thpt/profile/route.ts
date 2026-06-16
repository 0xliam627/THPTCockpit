import { NextResponse } from 'next/server';
import { toPublicError } from '@/lib/http';
import { getExamCard, getUserInfo } from '@/lib/thpt-api';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const token = String(body.token ?? '');
    if (!token) return NextResponse.json({ error: 'Thiếu token.' }, { status: 400 });

    const [userInfo, examCard] = await Promise.all([getUserInfo(token), getExamCard(token)]);
    return NextResponse.json({ userInfo, examCard: examCard.theDuThi ?? null });
  } catch (error) {
    const publicError = toPublicError(error, 'Không lấy được hồ sơ.');
    return NextResponse.json({ error: publicError.message }, { status: publicError.status });
  }
}
