import { NextResponse } from 'next/server';
import { toPublicError } from '@/lib/http';
import { extractSoBaoDanh } from '@/lib/mappers';
import { getExamCard, getUserInfo, signIn } from '@/lib/thpt-api';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const username = String(body.username ?? '').trim();
    const password = String(body.password ?? '');
    const captcha = String(body.captcha ?? '').trim();
    const captchaCode = body.captchaCode ? String(body.captchaCode) : undefined;

    if (!username || !password || !captcha) {
      return NextResponse.json({ error: 'Vui lòng nhập đủ tài khoản, mật khẩu và captcha.' }, { status: 400 });
    }

    const login = await signIn({ username, password, captcha, captchaCode });
    const token = login.token!;
    const [userInfo, examCardResponse] = await Promise.all([getUserInfo(token), getExamCard(token)]);
    const soBaoDanh = extractSoBaoDanh(examCardResponse);

    return NextResponse.json({
      token,
      userInfo,
      examCard: examCardResponse.theDuThi ?? null,
      soBaoDanh,
    });
  } catch (error) {
    const publicError = toPublicError(error, 'Không thể đăng nhập hoặc lấy dữ liệu cơ bản.');
    return NextResponse.json({ error: publicError.message }, { status: publicError.status });
  }
}
