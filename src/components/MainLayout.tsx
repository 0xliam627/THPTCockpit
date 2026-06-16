'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useSession } from './SessionContext';
import { ReactNode } from 'react';

export function MainLayout({ children }: { children: ReactNode }) {
  const { data, isLoaded } = useSession();
  const pathname = usePathname();
  const router = useRouter();

  return (
    <main className="flex min-h-screen flex-col bg-canvas text-ink">
      <header className="sticky top-0 z-50 flex h-[72px] items-center border-b border-hairline bg-surface px-4 py-3 sm:px-6 lg:px-10">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4">
          <div className="flex flex-1 items-center justify-start">
            <button onClick={() => router.push('/')} className="flex shrink-0 items-center gap-2.5 text-left transition hover:opacity-80">
              <img src="/img/graduation-hat.png" alt="THPT Cockpit" className="h-8 w-8 invert brightness-0 object-contain dark:invert" />
              <h1 className="text-lg font-bold leading-tight tracking-tight text-ink sm:text-xl">THPT Cockpit</h1>
            </button>
          </div>

          <div className="flex flex-1 items-center justify-end gap-2 sm:gap-3">
            <button onClick={() => router.push('/minh-chung')} className={`flex items-center rounded-full border px-3 py-1.5 text-xs font-medium transition sm:text-sm ${pathname === '/minh-chung' ? 'border-blue/30 bg-blue/10 text-blue' : 'border-transparent text-mute hover:border-hairline hover:bg-elevated hover:text-ink'}`}>
              <svg className="mr-1.5 h-3.5 w-3.5 sm:h-4 sm:w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              Hạn nộp minh chứng
            </button>
            {!isLoaded ? (
              <div className="hidden h-9 w-24 animate-pulse rounded-full bg-elevated sm:block"></div>
            ) : data ? (
              <button onClick={() => router.push('/tool')} className="flex items-center gap-2 rounded-full border border-hairline bg-canvas p-1 transition hover:border-blue/30 hover:shadow-sm sm:px-3 sm:py-1.5" title="Tài khoản">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded-full bg-blue text-xs font-bold text-white ring-1 ring-hairline/50">
                  {data.examCard?.imageData ? (
                    <img 
                      src={String(data.examCard.imageData).startsWith('data:image') ? String(data.examCard.imageData) : `data:image/jpeg;base64,${data.examCard.imageData}`} 
                      alt="Avatar" 
                      className="h-full w-full object-cover object-top" 
                    />
                  ) : (
                    String(data.userInfo?.fullname || data.userInfo?.FULLNAME || '?').charAt(0).toUpperCase()
                  )}
                </div>
                <span className="hidden max-w-[160px] truncate text-xs font-medium uppercase tracking-wide text-ink sm:inline">
                  {String(data.userInfo?.fullname || data.userInfo?.FULLNAME || data.soBaoDanh)}
                </span>
              </button>
            ) : (
              <button onClick={() => router.push('/tool')} className="rounded-full border border-hairline bg-canvas px-3 py-1.5 text-xs font-medium text-ink transition hover:bg-elevated sm:px-4 sm:text-sm">
                Đăng nhập
              </button>
            )}
          </div>
        </div>
      </header>

      <section className="px-4 py-5 sm:px-6 sm:py-7 lg:px-10">
        <div className="mx-auto max-w-7xl">
          {children}
        </div>
      </section>

      <footer className="mt-auto border-t border-hairline bg-surface py-6 text-center text-xs text-mute">
        <p>
          Made with ❤️ by{' '}
          <a
            href="https://www.facebook.com/harryitz.fb"
            target="_blank"
            rel="noopener noreferrer"
            className="text-ink transition hover:text-red"
          >
            harryitz
          </a>
        </p>
      </footer>
    </main>
  );
}
