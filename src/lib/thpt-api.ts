import { fetchWithTimeout, jsonHeaders, parseJsonResponse, PublicApiError } from './http';

const IDENTITY_BASE = Buffer.from('aHR0cHM6Ly9hcGktaWRlbnRpdHkudGhpdG90bmdoaWVwdGhwdC5lZHUudm4vYXBp', 'base64').toString('utf8');
const DANG_KY_THI_BASE = Buffer.from('aHR0cHM6Ly9hcGktZGFuZ2t5dGhpLnRoaXRvdG5naGllcHRocHQuZWR1LnZuL2FwaQ==', 'base64').toString('utf8');

export type CaptchaResponse = {
  base64: string;
  captchaCode: string;
};

export type SignInResponse = {
  token?: string;
  status?: number;
  message?: string | null;
  mfaToken?: string | null;
  qrCode?: string | null;
};

export type UserInfo = Record<string, unknown> & {
  userid?: number;
  username?: string;
  fullname?: string;
  lop?: string;
};

export type ExamSubject = {
  tenPhongThi?: string;
  monThi?: string;
  ngayThi?: string;
  thoiGianThi?: number;
  gioPhatDeThi?: string;
  gioBatDauLamBai?: string;
};

export type ExamCard = Record<string, unknown> & {
  hoTen?: string;
  soBaoDanh?: string;
  diemThi?: string;
  diaChi?: string;
  thoiGianTapTrung?: string;
  phongTapTrung?: string;
  lstPtMt?: ExamSubject[];
};

export type ExamCardResponse = {
  status?: number;
  message?: string;
  theDuThi?: ExamCard;
};

export type Lop = '10' | '11' | '12';
export type Transcript = Record<string, unknown> & {
  lop?: string;
  hO_TEN?: string;
  sO_CMND?: string;
  dieM_TB_NAM?: number;
};

export async function getCaptcha(): Promise<CaptchaResponse> {
  const response = await fetchWithTimeout(`${IDENTITY_BASE}/Captcha/GetCaptchaImage?choose=1`, {
    method: 'GET',
    headers: {
      Accept: 'application/json, text/plain, */*',
      'Accept-Language': 'en-US,en;q=0.9',
      Origin: 'https://thisinh.thitotnghiepthpt.edu.vn',
      Referer: 'https://thisinh.thitotnghiepthpt.edu.vn/',
      'User-Agent': 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:151.0) Gecko/20100101 Firefox/151.0',
    },
    cache: 'no-store',
  });

  const data = await parseJsonResponse<CaptchaResponse>(response, 'Không lấy được captcha.');
  const cookie = response.headers.get('set-cookie')?.match(/xacthucthithpt=([^;]+)/)?.[1];
  return { ...data, captchaCode: cookie ?? data.captchaCode };
}

export async function signIn(input: {
  username: string;
  password: string;
  captcha: string;
  captchaCode?: string;
}): Promise<SignInResponse> {
  const response = await fetchWithTimeout(`${IDENTITY_BASE}/Account/SignIn`, {
    method: 'POST',
    headers: jsonHeaders(input.captchaCode ? { Cookie: `xacthucthithpt=${input.captchaCode}` } : undefined),
    body: JSON.stringify({
      username: input.username,
      password: input.password,
      captcha: input.captcha,
    }),
    cache: 'no-store',
  });

  const data = await parseJsonResponse<SignInResponse>(response, 'Đăng nhập thất bại.');
  if (!data.token) {
    throw new PublicApiError(data.message || 'Đăng nhập chưa thành công. Vui lòng kiểm tra captcha hoặc tài khoản.', 401);
  }
  return data;
}

export async function getUserInfo(token: string): Promise<UserInfo> {
  const response = await fetchWithTimeout(`${IDENTITY_BASE}/User/GetUserInfo`, {
    method: 'GET',
    headers: jsonHeaders({ Authorization: `Bearer ${token}` }),
    cache: 'no-store',
  });

  return parseJsonResponse<UserInfo>(response, 'Không lấy được thông tin tài khoản.');
}

export async function getExamCard(token: string): Promise<ExamCardResponse> {
  const response = await fetchWithTimeout(`${DANG_KY_THI_BASE}/TheDuThi/Index`, {
    method: 'GET',
    headers: jsonHeaders({ Authorization: `Bearer ${token}` }),
    cache: 'no-store',
  });

  return parseJsonResponse<ExamCardResponse>(response, 'Không lấy được giấy báo dự thi.');
}

export async function getTranscript(token: string, lop: Lop): Promise<Transcript> {
  const response = await fetchWithTimeout(`${DANG_KY_THI_BASE}/TSHocBa/GetHocBa?lop=${lop}`, {
    method: 'GET',
    headers: jsonHeaders({ Authorization: `Bearer ${token}` }),
    cache: 'no-store',
  });

  return parseJsonResponse<Transcript>(response, `Không lấy được học bạ lớp ${lop}.`);
}
