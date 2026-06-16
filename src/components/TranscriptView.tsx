'use client';

import { useState } from 'react';

const SUBJECTS = [
  ['Toán', 'toaN'], ['Văn', 'vaN'], ['Lý', 'lY'], ['Hóa', 'hoA'], ['Sinh', 'sinH'], ['Sử', 'sU'], ['Địa', 'diA'], ['KTPL/GDCD', 'ktpL'], ['Tin', 'tiN'], ['Ngoại ngữ', 'ngoaingU'],
];

export function TranscriptView({ transcripts }: { transcripts: Record<string, unknown>[] }) {
  const [activeLop, setActiveLop] = useState(String(transcripts[0]?.lop ?? '10'));
  if (!transcripts.length) return null;

  const transcript = transcripts.find((item) => String(item.lop) === activeLop) ?? transcripts[0];

  return (
    <section className="rounded-card border border-hairline bg-surface p-5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-red">Học bạ</p>
          <h3 className="mt-2 text-xl font-medium text-ink">Bảng điểm lớp {String(transcript.lop ?? '-')}</h3>
        </div>
        <div className="flex rounded-lg border border-hairline bg-elevated p-1">
          {transcripts.map((item) => {
            const lop = String(item.lop ?? '');
            return <button key={lop} onClick={() => setActiveLop(lop)} className={`rounded-md px-3 py-2 text-sm ${activeLop === lop ? 'bg-white text-black' : 'text-mute hover:text-ink'}`}>Lớp {lop}</button>;
          })}
        </div>
      </div>

      <div className="mt-5 overflow-x-auto rounded-md border border-hairline">
        <div className="min-w-[400px]">
          <div className="grid grid-cols-[1.4fr_80px_80px_80px] bg-elevated px-4 py-3 text-xs uppercase tracking-wider text-mute">
            <span>Môn</span><span>HKI</span><span>HKII</span><span>Cả năm</span>
          </div>
          {SUBJECTS.map(([label, prefix]) => (
            <div key={prefix} className="grid grid-cols-[1.4fr_80px_80px_80px] border-t border-hairline px-4 py-3 text-sm">
              <span className="text-body">{label}</span>
              <span className="text-ink">{formatScore(transcript[`${prefix}_HKI`])}</span>
              <span className="text-ink">{formatScore(transcript[`${prefix}_HKII`])}</span>
              <span className="font-medium text-yellow">{formatScore(transcript[`${prefix}_CN`])}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2 text-xs text-mute">
        <span className="rounded-full border border-hairline bg-elevated px-3 py-1">TB năm: {formatScore(transcript.dieM_TB_NAM)}</span>
        <span className="rounded-full border border-hairline bg-elevated px-3 py-1">Trạng thái: {String(transcript.tranG_THAI_HB ?? '-')}</span>
      </div>
    </section>
  );
}

function formatScore(value: unknown) {
  return value === null || value === undefined || value === '' ? '-' : String(value);
}
