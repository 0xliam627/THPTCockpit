import { NextResponse } from 'next/server';
import { toPublicError } from '@/lib/http';
import { getProvinces } from '@/lib/tuyensinh247-api';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    return NextResponse.json(await getProvinces());
  } catch (error) {
    const publicError = toPublicError(error, 'Không lấy được danh sách tỉnh thành.');
    return NextResponse.json({ error: publicError.message }, { status: publicError.status });
  }
}
