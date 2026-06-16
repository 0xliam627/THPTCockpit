'use client';

import { useEffect, useState, type FormEvent } from 'react';
import type { LoginResult } from './types';

type Captcha = { base64: string; captchaCode: string };

export function LoginCard({ onSuccess }: { onSuccess: (result: LoginResult) => void }) {
  const [captcha, setCaptcha] = useState<Captcha | null>(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [captchaText, setCaptchaText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function loadCaptcha() {
    const response = await fetch('/api/thpt/captcha', { cache: 'no-store' });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Không lấy được captcha.');
    setCaptcha(data);
    setCaptchaText('');
  }

  useEffect(() => {
    let active = true;
    async function init() {
      try {
        await loadCaptcha();
      } catch (err) {
        if (!active) return;
        console.warn('Không tải được captcha lần đầu, đang thử lại...', err);
        await new Promise((resolve) => setTimeout(resolve, 1500));
        if (active) {
          await loadCaptcha().catch((retryErr) => {
            setError(retryErr.message);
          });
        }
      }
    }
    init();
    return () => {
      active = false;
    };
  }, []);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/thpt/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, captcha: captchaText, captchaCode: captcha?.captchaCode }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Đăng nhập thất bại.');
      onSuccess(data);
      setPassword('');
      setCaptchaText('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Đăng nhập thất bại.');
      loadCaptcha().catch(() => undefined);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="rounded-card border border-hairline bg-surface p-6 shadow-card transition-all duration-200 hover:border-hairlineHover hover:shadow-hover">
      <div className="mb-6">
        <p className="text-sm uppercase tracking-[0.28em] text-blue">THPT Identity</p>
        <h2 className="mt-2 text-2xl font-medium text-ink">Đăng nhập tài khoản</h2>
        <p className="mt-2 text-sm leading-6 text-mute">Dữ liệu chỉ dùng trong request hiện tại, không lưu mật khẩu hoặc token.</p>
      </div>

      <label className="mb-4 block text-sm text-body">
        Số CCCD / tài khoản
        <input value={username} onChange={(e) => setUsername(e.target.value)} className="mt-2 h-[48px] w-full rounded-input border border-hairline bg-canvas px-4 text-ink outline-none transition focus:border-blue" autoComplete="username" />
      </label>

      <label className="mb-4 block text-sm text-body">
        Mật khẩu
        <div className="mt-2 flex h-[48px] overflow-hidden rounded-input border border-hairline bg-canvas transition focus-within:border-blue">
          <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} className="min-w-0 flex-1 bg-transparent px-4 text-ink outline-none" autoComplete="current-password" />
          <button type="button" onClick={() => setShowPassword((value) => !value)} className="border-l border-hairline px-4 text-sm text-mute transition hover:bg-surface hover:text-ink">
            {showPassword ? 'Ẩn' : 'Hiện'}
          </button>
        </div>
      </label>

      <div className="mb-5 grid gap-3 sm:grid-cols-[1fr_auto]">
        <label className="block text-sm text-body">
          Captcha
          <input value={captchaText} onChange={(e) => setCaptchaText(e.target.value)} className="mt-2 h-[48px] w-full rounded-input border border-hairline bg-canvas px-4 text-ink outline-none transition focus:border-blue" />
        </label>
        <div className="flex items-end gap-2">
          <div className="flex h-[48px] min-w-36 items-center justify-center rounded-input border border-hairline bg-white px-2">
            {captcha?.base64 ? <img src={`data:image/png;base64,${captcha.base64}`} alt="Captcha" className="max-h-10" /> : <span className="text-xs text-black">...</span>}
          </div>
          <button type="button" onClick={() => { setError(''); loadCaptcha().catch((err) => setError(err.message)); }} className="h-[48px] rounded-btn border border-hairline bg-surface px-4 text-sm text-body transition hover:bg-canvas hover:text-ink">Đổi</button>
        </div>
      </div>

      {error ? <p className="mb-5 rounded-input border border-red/30 bg-red/10 px-4 py-3 text-sm text-red">{error}</p> : null}

      <button type="submit" disabled={loading} className="h-[48px] w-full rounded-btn bg-blue px-4 text-sm font-medium text-white transition hover:bg-blue/90 disabled:cursor-not-allowed disabled:bg-hairline disabled:text-mute">
        {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
      </button>
    </form>
  );
}
