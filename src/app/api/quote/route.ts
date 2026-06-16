import { NextResponse } from 'next/server';

const VIETNAMESE_QUOTES = [
  { content: 'Học, học nữa, học mãi.', author: 'V.I. Lenin' },
  { content: 'Không có việc gì khó, chỉ sợ lòng không bền.', author: 'Hồ Chí Minh' },
  { content: 'Thành công là tổng hòa của những nỗ lực nhỏ được lặp lại mỗi ngày.', author: 'Robert Collier' },
  { content: 'Tương lai thuộc về những người chuẩn bị cho nó từ hôm nay.', author: 'Malcolm X' },
  { content: 'Điều tưởng như không thể sẽ trở thành có thể khi ta bắt đầu làm.', author: 'Nelson Mandela' },
  { content: 'Kỷ luật là cây cầu nối giữa mục tiêu và thành tựu.', author: 'Jim Rohn' },
  { content: 'Mỗi ngày học thêm một chút là mỗi ngày tiến gần hơn đến cánh cửa mình muốn mở.', author: 'THPT 2026 Cockpit' },
  { content: 'Bình tĩnh đọc đề, chắc từng câu dễ, rồi mới chinh phục câu khó.', author: 'THPT 2026 Cockpit' },
];

export const dynamic = 'force-dynamic';

export async function GET() {
  const quote = VIETNAMESE_QUOTES[new Date().getDate() % VIETNAMESE_QUOTES.length];
  return NextResponse.json({ ...quote, source: 'curated-vi' });
}
