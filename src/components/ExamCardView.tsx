function formatDate(value: unknown) {
  if (!value) return '-';
  const date = new Date(String(value));
  if (Number.isNaN(date.getTime())) return String(value);
  return new Intl.DateTimeFormat('vi-VN', { dateStyle: 'short', timeStyle: 'short' }).format(date);
}

export function ExamCardView({ examCard }: { examCard: Record<string, unknown> | null }) {
  if (!examCard) return <Empty title="Chưa có giấy báo dự thi" />;
  const subjects = Array.isArray(examCard.lstPtMt) ? (examCard.lstPtMt as Record<string, unknown>[]) : [];

  return (
    <section className="rounded-card border border-hairline bg-surface p-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-blue">Giấy báo dự thi</p>
          <h3 className="mt-2 text-xl font-medium text-ink">{String(examCard.hoTen ?? 'Thí sinh')}</h3>
          <p className="mt-1 text-sm text-mute">SBD: <span className="text-yellow">{String(examCard.soBaoDanh ?? '-')}</span></p>
        </div>
        <div className="rounded-md border border-hairline bg-elevated px-3 py-2 text-sm text-body">{String(examCard.diemThi ?? 'Điểm thi chưa có')}</div>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-3">
        <Info label="Địa chỉ" value={examCard.diaChi} />
        <Info label="Tập trung" value={examCard.thoiGianTapTrung} />
        <Info label="Phòng tập trung" value={examCard.phongTapTrung} />
      </div>

      <div className="mt-5 overflow-x-auto rounded-md border border-hairline">
        <div className="min-w-[480px]">
          <div className="grid grid-cols-4 bg-elevated px-3 py-2 text-xs uppercase tracking-wider text-mute">
            <span>Môn</span><span>Phòng</span><span>Phát đề</span><span>Bắt đầu</span>
          </div>
          {subjects.length ? subjects.map((subject, index) => (
            <div key={index} className="grid grid-cols-4 border-t border-hairline px-3 py-3 text-sm text-body">
              <span className="text-ink truncate pr-2" title={String(subject.monThi ?? '-')}>{String(subject.monThi ?? '-')}</span>
              <span className="truncate pr-2">{String(subject.tenPhongThi ?? '-')}</span>
              <span className="truncate pr-2">{formatDate(subject.gioPhatDeThi)}</span>
              <span className="truncate">{formatDate(subject.gioBatDauLamBai)}</span>
            </div>
          )) : <p className="px-3 py-4 text-sm text-mute">Chưa có lịch thi.</p>}
        </div>
      </div>
    </section>
  );
}

function Info({ label, value }: { label: string; value: unknown }) {
  return <div className="rounded-md border border-hairline bg-elevated p-3"><p className="text-xs text-mute">{label}</p><p className="mt-1 text-sm text-ink">{String(value ?? '-')}</p></div>;
}

function Empty({ title }: { title: string }) {
  return <section className="rounded-card border border-hairline bg-surface p-5 text-sm text-mute">{title}</section>;
}
