import { NextResponse } from 'next/server';
import { getCaptcha } from '@/lib/thpt-api';
import { toPublicError } from '@/lib/http';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    return NextResponse.json(await getCaptcha());
  } catch (error) {
    const publicError = toPublicError(error, 'Không lấy được captcha.');
    return NextResponse.json({ error: publicError.message }, { status: publicError.status });
  }
}
