export class PublicApiError extends Error {
  _isPublicApiError = true;
  constructor(message: string, public status = 500) {
    super(message);
    Object.setPrototypeOf(this, PublicApiError.prototype);
  }
}

export async function fetchWithTimeout(input: RequestInfo | URL, init: RequestInit = {}, timeoutMs = 55000, maxRetries = 3) {
  let lastError: unknown;
  for (let i = 0; i < maxRetries; i++) {
    try {
      const signal = AbortSignal.timeout(timeoutMs);
      return await fetch(input, { ...init, signal });
    } catch (error) {
      lastError = error;
      if (error instanceof Error && error.name === 'TimeoutError') {
        throw error; // Don't retry on timeout to prevent exceeding Vercel maxDuration
      }
      // Wait a bit before retrying (exponential backoff)
      await new Promise(res => setTimeout(res, 1000 * (i + 1)));
    }
  }
  throw lastError;
}

export async function parseJsonResponse<T>(response: Response, fallbackMessage: string): Promise<T> {
  const text = await response.text();
  let data: unknown = null;

  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  if (!response.ok) {
    let errMsg = fallbackMessage;
    if (data && typeof data === 'object') {
      const body = data as Record<string, unknown>;
      if (typeof body.message === 'string' && body.message.trim()) {
        errMsg = body.message;
      } else if (typeof body.error === 'string' && body.error.trim()) {
        errMsg = body.error;
      }
    }
    throw new PublicApiError(errMsg, response.status);
  }

  return data as T;
}

export function jsonHeaders(extra?: HeadersInit): HeadersInit {
  return {
    Accept: 'application/json, text/plain, */*',
    'Accept-Language': 'en-US,en;q=0.9',
    'Content-Type': 'application/json',
    Origin: 'https://thisinh.thitotnghiepthpt.edu.vn',
    Referer: 'https://thisinh.thitotnghiepthpt.edu.vn/',
    'User-Agent': 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:151.0) Gecko/20100101 Firefox/151.0',
    ...extra,
  };
}

export function toPublicError(error: unknown, fallback = 'Có lỗi xảy ra. Vui lòng thử lại.') {
  if (error && typeof error === 'object' && ('_isPublicApiError' in error || 'status' in error)) {
    const err = error as { message?: string; status?: number };
    return { message: err.message || fallback, status: err.status || 500 };
  }

  if (error instanceof Error) {
    return { message: error.message, status: 500 };
  }

  return { message: fallback, status: 500 };
}
