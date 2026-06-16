import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import './globals.css';

export const viewport: Viewport = {
  themeColor: '#0a0a0b',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: 'THPT Cockpit | Tra cứu Học bạ & Tư vấn Tuyển sinh Đại học',
  description: 'Công cụ tra cứu hồ sơ thi THPT, xem học bạ 3 năm, lịch thi và hệ thống tư vấn tuyển sinh đại học thông minh. Tổng hợp hạn nộp minh chứng xét tuyển các trường ĐH nhanh và chính xác nhất.',
  keywords: ['THPT Cockpit', 'điểm thi thpt', 'tra cứu học bạ', 'tư vấn tuyển sinh', 'xét tuyển đại học', 'nộp minh chứng', 'điểm chuẩn đại học', 'lịch thi thpt quốc gia'],
  authors: [{ name: 'harryitz' }],
  openGraph: {
    title: 'THPT Cockpit | Hệ thống Tra cứu & Tư vấn Tuyển sinh',
    description: 'Quản lý hồ sơ thi, xem học bạ, và gợi ý ngành học phù hợp với điểm số hoàn toàn tự động.',
    url: 'https://thpt-cockpit.vercel.app',
    siteName: 'THPT Cockpit',
    images: [
      {
        url: '/img/graduation-hat.png',
        width: 800,
        height: 800,
        alt: 'THPT Cockpit',
      },
    ],
    locale: 'vi_VN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'THPT Cockpit | Tư vấn Tuyển sinh Đại học',
    description: 'Hệ thống tra cứu học bạ và gợi ý trường đại học phù hợp.',
    images: ['/img/graduation-hat.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/img/graduation-hat.png',
    shortcut: '/img/graduation-hat.png',
    apple: '/img/graduation-hat.png',
  },
};

import { SessionProvider } from '@/components/SessionContext';
import { MainLayout } from '@/components/MainLayout';

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="vi">
      <body className="font-sans antialiased">
        <SessionProvider>
          <MainLayout>
            {children}
          </MainLayout>
        </SessionProvider>
      </body>
    </html>
  );
}
