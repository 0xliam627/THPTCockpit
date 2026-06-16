'use client';

import { useSession } from '@/components/SessionContext';
import { Dashboard } from '@/components/Dashboard';
import { LoginCard } from '@/components/LoginCard';

export function ToolClient() {
  const { data, setData, isLoaded } = useSession();
  
  if (!isLoaded) return <div className="py-20 text-center text-sm text-mute">Đang tải phiên đăng nhập...</div>;

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-blue">Công cụ</p>
          <h2 className="mt-2 text-2xl font-medium text-ink sm:text-3xl">Tra cứu dữ liệu thí sinh</h2>
        </div>
        <p className="max-w-xl text-sm leading-6 text-mute">Dữ liệu phiên đăng nhập được lưu trữ cục bộ trên trình duyệt (localStorage) để bạn không cần đăng nhập lại nhiều lần.</p>
      </div>

      {data ? (
        <Dashboard data={data} onLogout={() => setData(null)} />
      ) : (
        <div className="grid gap-6 lg:grid-cols-[420px_1fr]">
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <LoginCard onSuccess={setData} />
          </aside>
          <EmptyState />
        </div>
      )}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="rounded-card border border-dashed border-hairline bg-surface/60 p-6 text-center sm:p-10">
      <div className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-2xl border border-hairline bg-elevated text-2xl">⌘</div>
      <h2 className="text-2xl font-medium text-ink">Công cụ đang chờ đăng nhập</h2>
      <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-mute">Sau khi đăng nhập thành công, cockpit sẽ hiện giấy báo dự thi, học bạ, gợi ý trường và hạn nộp minh chứng tại đây.</p>
    </div>
  );
}
