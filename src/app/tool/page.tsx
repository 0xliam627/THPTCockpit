import { Metadata } from 'next';
import { ToolClient } from './ToolClient';

export const metadata: Metadata = {
  title: 'Tra cứu Học bạ & Điểm thi | THPT Cockpit',
  description: 'Đăng nhập THPT Cockpit để tra cứu điểm thi, xem học bạ 3 năm cấp 3 và nhận danh sách gợi ý chọn trường đại học thông minh.',
  openGraph: {
    title: 'Tra cứu Học bạ & Điểm thi | THPT Cockpit',
    description: 'Đăng nhập THPT Cockpit để tra cứu điểm thi, xem học bạ 3 năm cấp 3 và nhận danh sách gợi ý chọn trường đại học thông minh.',
    url: 'https://thpt-cockpit.vercel.app/tool',
  }
};

export default function ToolPage() {
  return <ToolClient />;
}
