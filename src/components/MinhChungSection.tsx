'use client';

import { useState, useEffect } from 'react';

type MinhChungSchool = {
  schoolName: string;
  code: string;
  tuition: string;
  admissionRules: string;
  registrationLink: string | null;
  fanpageLink: string | null;
  admissionPlanLink: string | null;
  guideLink: string | null;
  note: string | null;
  region?: string;
};

export function MinhChungSection() {
  const [data, setData] = useState<MinhChungSchool[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetch('/api/thpt/minh-chung')
      .then((res) => {
        if (!res.ok) throw new Error('Không lấy được dữ liệu');
        return res.json();
      })
      .then((payload) => {
        if (payload.error) throw new Error(payload.error);
        setData(payload.data);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <section className="rounded-card border border-hairline bg-surface p-5 text-sm text-mute">Đang đồng bộ dữ liệu các trường yêu cầu minh chứng...</section>;
  }

  if (error) {
    return <section className="rounded-card border border-red-500/20 bg-red-500/5 p-5 text-sm text-red-500">{error}</section>;
  }

  if (!data || data.length === 0) {
    return <section className="rounded-card border border-hairline bg-surface p-5 text-sm text-mute">Hiện chưa có trường nào yêu cầu nộp minh chứng.</section>;
  }

  const filteredData = data.filter(
    (school) =>
      school.schoolName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      school.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const groupedData = filteredData.reduce((acc, school) => {
    const region = school.region || 'Khu vực Miền Nam';
    if (!acc[region]) acc[region] = [];
    acc[region].push(school);
    return acc;
  }, {} as Record<string, MinhChungSchool[]>);

  return (
    <div className="space-y-6">
      <div className="relative">
        <input
          type="text"
          placeholder="Tìm kiếm trường đại học hoặc mã trường (VD: UEH, Khoa học tự nhiên)..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full rounded-md border border-hairline bg-surface px-4 py-2.5 text-sm text-ink placeholder:text-mute focus:border-blue focus:outline-none focus:ring-1 focus:ring-blue"
        />
        <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-mute">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        </div>
      </div>

      {Object.keys(groupedData).length === 0 ? (
        <div className="rounded-card border border-hairline bg-surface p-5 text-center text-sm text-mute">Không tìm thấy trường phù hợp.</div>
      ) : (
        <div className="space-y-8">
          {Object.entries(groupedData).map(([region, schools]) => (
            <div key={region} className="space-y-4">
              <h3 className="sticky top-[72px] z-10 w-full bg-canvas py-2 text-lg font-bold uppercase tracking-wide text-ink">{region}</h3>
              <div className="space-y-4">
                {schools.map((school, i) => (
                  <section key={i} className="rounded-card border border-hairline bg-surface p-5 transition-shadow hover:shadow-sm">
                    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-lg font-bold text-ink">{school.schoolName}</h4>
                          <span className="rounded bg-blue/10 px-2 py-0.5 text-xs font-semibold text-blue">{school.code}</span>
                        </div>
                        <p className="mt-1 text-sm font-medium text-mute">Học phí: <span className="text-body">{school.tuition}</span></p>
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-2">
                        {school.registrationLink && <a href={school.registrationLink} target="_blank" rel="noreferrer" className="rounded-full bg-blue px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-blue/80">Cổng đăng ký</a>}
                        {school.fanpageLink && <a href={school.fanpageLink} target="_blank" rel="noreferrer" className="rounded-full border border-hairline bg-canvas px-3 py-1.5 text-xs font-medium text-ink transition hover:bg-elevated">Fanpage</a>}
                        {school.admissionPlanLink && <a href={school.admissionPlanLink} target="_blank" rel="noreferrer" className="rounded-full border border-hairline bg-canvas px-3 py-1.5 text-xs font-medium text-ink transition hover:bg-elevated">Đề án</a>}
                      </div>
                    </div>
                    
                    <div className="mt-4 rounded-md border border-hairline bg-elevated p-3">
                      <h5 className="mb-1.5 text-xs uppercase tracking-wide text-green">Thông tin xét tuyển & Nộp minh chứng</h5>
                      <p className="whitespace-pre-wrap text-sm leading-relaxed text-ink">{school.admissionRules}</p>
                    </div>
                    
                    {school.note && (
                      <p className="mt-3 text-xs italic text-yellow">Lưu ý: {school.note}</p>
                    )}
                  </section>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
