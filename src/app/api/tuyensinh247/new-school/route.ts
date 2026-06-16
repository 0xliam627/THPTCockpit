import { NextResponse } from 'next/server';
import { toPublicError } from '@/lib/http';
import { getNewSchools } from '@/lib/tuyensinh247-api';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    return NextResponse.json(await getNewSchools());
  } catch (error) {
    const publicError = toPublicError(error, 'Không lấy được danh sách ngành mới.');
    return NextResponse.json({ error: publicError.message }, { status: publicError.status });
  }
}
