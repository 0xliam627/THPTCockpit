'use client';

import { useEffect, useState } from 'react';
import { ExamCardView } from './ExamCardView';
import { SchoolRecommendations } from './SchoolRecommendations';
import { TranscriptView } from './TranscriptView';
import { AspirationRecommendations } from './AspirationRecommendations';
import type { LoginResult, TranscriptBundle } from './types';

type LoadState<T> = { loading: boolean; data: T | null; error: string };

export function Dashboard({ data, onLogout }: { data: LoginResult; onLogout: () => void }) {
  const [transcriptBundle, setTranscriptBundle] = useState<LoadState<TranscriptBundle>>({ loading: true, data: null, error: '' });
  const [activeTab, setActiveTab] = useState<'exam' | 'transcript' | 'recommendation' | 'aspiration'>('exam');

  useEffect(() => {
    setTranscriptBundle({ loading: true, data: null, error: '' });
    Promise.all(['10', '11', '12'].map((lop) => fetch('/api/thpt/transcript', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: data.token, lop }),
    }).then(async (response) => {
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || `Không lấy được học bạ lớp ${lop}.`);
      return payload;
    })))
      .then((transcripts) => {
        const userScores = buildUserScores(transcripts);
        setTranscriptBundle({ loading: false, data: { transcripts, userScores }, error: '' });
      })
      .catch((error) => setTranscriptBundle({ loading: false, data: null, error: error.message }));
  }, [data.token]);

  return (
    <div className="space-y-6">
      <section className="rounded-card border border-hairline bg-surface p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-green">Đã kết nối</p>
            <h2 className="mt-2 text-2xl font-medium text-ink">{String(data.userInfo.fullname ?? data.userInfo.username ?? 'Thí sinh')}</h2>
            <p className="mt-2 text-sm text-mute">Các mục bên dưới sẽ được tải ngầm để tối ưu tốc độ. THPT Cockpit không lưu trữ dữ liệu của bạn.</p>
          </div>
          <button onClick={onLogout} className="h-10 rounded-md border border-hairline bg-elevated px-4 text-sm text-body transition hover:bg-canvas hover:text-ink">Đăng xuất</button>
        </div>
      </section>

      {/* Tabs */}
      <div className="flex border-b border-hairline overflow-x-auto hide-scrollbar">
        <button 
          onClick={() => setActiveTab('exam')} 
          className={`shrink-0 px-5 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'exam' ? 'border-blue text-ink' : 'border-transparent text-mute hover:text-ink'}`}
        >
          Giấy báo dự thi
        </button>
        <button 
          onClick={() => setActiveTab('transcript')} 
          className={`shrink-0 px-5 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'transcript' ? 'border-blue text-ink' : 'border-transparent text-mute hover:text-ink'}`}
        >
          Học bạ THPT
        </button>
        <button 
          onClick={() => setActiveTab('recommendation')} 
          className={`shrink-0 px-5 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'recommendation' ? 'border-blue text-ink' : 'border-transparent text-mute hover:text-ink'}`}
        >
          Tư vấn Xét học bạ
        </button>
        <button 
          onClick={() => setActiveTab('aspiration')} 
          className={`shrink-0 px-5 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'aspiration' ? 'border-blue text-ink' : 'border-transparent text-mute hover:text-ink'}`}
        >
          Chiến thuật Nguyện vọng
        </button>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'exam' && <ExamCardView examCard={data.examCard} />}
        {activeTab === 'transcript' && (
          transcriptBundle.loading ? <LoadingCard title="Đang tải học bạ lớp 10–12..." /> : transcriptBundle.error ? <ErrorCard message={transcriptBundle.error} /> : transcriptBundle.data ? <TranscriptView transcripts={transcriptBundle.data.transcripts} /> : null
        )}
        {activeTab === 'recommendation' && (
          transcriptBundle.data ? <SchoolRecommendations userScores={transcriptBundle.data.userScores} /> : <LoadingCard title="Gợi ý tuyển sinh sẽ mở sau khi học bạ tải xong." />
        )}
        {activeTab === 'aspiration' && (
          <AspirationRecommendations userScores={transcriptBundle.data?.userScores || {}} />
        )}
      </div>
    </div>
  );
}

function LoadingCard({ title }: { title: string }) {
  return <section className="rounded-card border border-hairline bg-surface p-5 text-sm text-mute">{title}</section>;
}

function ErrorCard({ message }: { message: string }) {
  return <section className="rounded-card border border-red/30 bg-red/10 p-5 text-sm text-red">{message}</section>;
}

function buildUserScores(transcripts: Record<string, unknown>[]) {
  const byLop = new Map(transcripts.map((transcript) => [String(transcript.lop), transcript]));
  const subjects: Record<string, string[]> = {
    TOAN: ['toaN'], VAN: ['vaN'], ANH: ['ngoaingU', 'cnnN'], SU: ['sU'], DIA: ['diA'], GDKTPL: ['ktpL', 'gdcD'], LI: ['lY'], HOA: ['hoA'], SINH: ['sinH'], TIN: ['tiN'], CONG_NGHE: ['cncN', 'cnnN'],
  };
  const terms: Record<string, string[]> = { HK_1: ['_HKI', '_KYI'], HK_2: ['_HKII', '_KYII'] };
  const scores: Record<string, number> = { sub_method: 5 };

  for (const lop of ['10', '11', '12']) {
    const transcript = byLop.get(lop);
    for (const [subject, prefixes] of Object.entries(subjects)) {
      for (const [term, suffixes] of Object.entries(terms)) {
        for (const prefix of prefixes) {
          for (const suffix of suffixes) {
            const value = transcript?.[`${prefix}${suffix}`];
            if (value !== null && value !== undefined && value !== '') {
              const numberValue = Number(value);
              if (Number.isFinite(numberValue)) scores[`${subject}_${lop}_${term}`] = numberValue;
              break;
            }
          }
        }
      }
    }
  }
  return scores;
}
