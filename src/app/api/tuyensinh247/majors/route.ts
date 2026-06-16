import { NextResponse } from 'next/server';
import { toPublicError } from '@/lib/http';
import { searchMajors } from '@/lib/tuyensinh247-api';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    return NextResponse.json(await searchMajors(searchParams.get('q') ?? ''));
  } catch (error) {
    const publicError = toPublicError(error, 'Không lấy được danh sách ngành.');
    return NextResponse.json({ error: publicError.message }, { status: publicError.status });
  }
}
