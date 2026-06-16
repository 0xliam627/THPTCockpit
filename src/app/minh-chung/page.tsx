import { Metadata } from 'next';
import { MinhChungSection } from '@/components/MinhChungSection';

export const metadata: Metadata = {
  title: 'Hạn nộp Minh chứng & Thông tin Xét tuyển | THPT Cockpit',
  description: 'Tổng hợp đầy đủ thông tin phương thức xét tuyển, đường dẫn cổng đăng ký, đề án tuyển sinh và thời hạn nộp minh chứng của các trường Đại học khu vực Miền Nam.',
  openGraph: {
    title: 'Hạn nộp Minh chứng Xét tuyển Đại học 2026',
    description: 'Danh sách các trường Đại học yêu cầu nộp minh chứng xét tuyển sớm và thời hạn nộp.',
    url: 'https://thpt-cockpit.vercel.app/minh-chung',
  }
};

export default function MinhChungPage() {
  return (
    <div>
      <div className="mb-5">
        <p className="text-sm uppercase tracking-[0.35em] text-blue">Tra cứu</p>
        <h2 className="mt-2 text-2xl font-medium text-ink sm:text-3xl">Hạn nộp minh chứng</h2>
        <p className="mt-2 text-sm leading-6 text-mute">Tổng hợp thông tin phương thức xét tuyển và hạn nộp minh chứng các trường Đại học.</p>
      </div>
      <MinhChungSection />
    </div>
  );
}
