import { fetchWithTimeout, parseJsonResponse } from './http';

const USER_BASE = 'https://diemthi.tuyensinh247.com/api/user';
const API_BASE = 'https://diemthi.tuyensinh247.com/api';

function headers(): HeadersInit {
  return {
    accept: '*/*',
    'accept-language': 'vi,en-US;q=0.9,en;q=0.8',
    'content-type': 'application/json',
    origin: 'https://diemthi.tuyensinh247.com',
    referer: 'https://diemthi.tuyensinh247.com/tu-van-chon-truong/xet-hoc-ba.html',
    'user-agent': 'Mozilla/5.0',
  };
}

export type FindSchoolPayload = {
  method_id?: number;
  priority_score?: number;
  user_scores: Record<string, number>;
  filter?: {
    province_id?: number;
    major_ids?: number[];
  };
};

export async function findSchool(payload: FindSchoolPayload) {
  const response = await fetchWithTimeout(`${USER_BASE}/find-school`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({ method_id: 3, priority_score: 1, ...payload }),
    cache: 'no-store',
  });

  return parseJsonResponse<unknown>(response, 'Không lấy được gợi ý trường.');
}

export async function getNewSchools() {
  const response = await fetchWithTimeout(`${USER_BASE}/new-school-xhb`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({ method_id: 3 }),
    cache: 'no-store',
  });

  return parseJsonResponse<unknown>(response, 'Không lấy được danh sách ngành mới.');
}

export async function getProvinces() {
  const response = await fetchWithTimeout(`${API_BASE}/common/provinces?ptype=undefined`, {
    method: 'GET',
    headers: headers(),
    cache: 'no-store',
  });

  return parseJsonResponse<unknown>(response, 'Không lấy được danh sách tỉnh thành.');
}

export async function searchMajors(query = '') {
  const response = await fetchWithTimeout(`${API_BASE}/major/search?q=${encodeURIComponent(query)}`, {
    method: 'GET',
    headers: headers(),
    cache: 'no-store',
  });

  return parseJsonResponse<unknown>(response, 'Không lấy được danh sách ngành.');
}
