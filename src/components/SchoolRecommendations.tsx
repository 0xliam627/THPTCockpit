'use client';

import { useEffect, useRef, useState } from 'react';

type RecommendationResult = { ok: boolean; data: unknown };
type Province = { id: number; name: string; code?: string; alias?: string };
type MajorItem = { id: number; name: string; code?: string | null };
type MajorGroup = { id: number; title: string; code?: string; majors?: MajorItem[] };

type NewSchoolItem = {
  id: number;
  school_id: number;
  name: string;
  code: string;
  block: string;
  quota: number;
  year: number;
  school_name: string;
  school_code: string;
};

const GROUP_META: Record<string, { label: string; border: string; bg: string; text: string }> = {
  fit: {
    label: 'Phù hợp',
    border: 'border-green/30',
    bg: 'bg-green/5',
    text: 'text-green',
  },
  consideration: {
    label: 'Cân nhắc',
    border: 'border-yellow/30',
    bg: 'bg-yellow/5',
    text: 'text-yellow',
  },
  'no-fit': {
    label: 'Không phù hợp',
    border: 'border-red/30',
    bg: 'bg-red/5',
    text: 'text-red',
  },
};

export function SchoolRecommendations({ userScores }: { userScores: Record<string, number> }) {
  const [result, setResult] = useState<RecommendationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [majors, setMajors] = useState<MajorGroup[]>([]);
  const [provinceId, setProvinceId] = useState(57);
  const [majorIds, setMajorIds] = useState<number[]>([]);
  const [priorityObject, setPriorityObject] = useState('none');
  const [area, setArea] = useState('2NT');

  const [activeTab, setActiveTab] = useState<'recommend' | 'newschool'>('recommend');
  const [newSchools, setNewSchools] = useState<NewSchoolItem[]>([]);
  const [newSchoolsLoading, setNewSchoolsLoading] = useState(false);
  const [newSchoolsError, setNewSchoolsError] = useState('');

  // Tab kết quả lọc gợi ý trường trên mobile
  const [activeGroupTab, setActiveGroupTab] = useState<'fit' | 'consideration' | 'no-fit'>('fit');

  useEffect(() => {
    fetch('/api/tuyensinh247/provinces')
      .then((response) => response.json())
      .then((payload) => {
        const data = Array.isArray(payload.data) ? payload.data : [];
        setProvinces(data);
        const dakLak = data.find((province: Province) => province.code === 'daklak' || province.name?.includes('Đắk Lắk'));
        if (dakLak?.id) setProvinceId(dakLak.id);
      })
      .catch(() => setProvinces([]));
  }, []);

  useEffect(() => {
    fetch('/api/tuyensinh247/majors?q=')
      .then((response) => response.json())
      .then((payload) => {
        const data = Array.isArray(payload.data) ? payload.data : [];
        setMajors(data);
      })
      .catch(() => setMajors([]));
  }, []);

  useEffect(() => {
    if (activeTab === 'newschool' && newSchools.length === 0) {
      setNewSchoolsLoading(true);
      setNewSchoolsError('');
      fetch('/api/tuyensinh247/new-school')
        .then((response) => response.json())
        .then((payload) => {
          const data = Array.isArray(payload.data?.['new-school']) ? payload.data['new-school'] : [];
          setNewSchools(data);
        })
        .catch(() => setNewSchoolsError('Không lấy được danh sách trường mới.'))
        .finally(() => setNewSchoolsLoading(false));
    }
  }, [activeTab, newSchools.length]);

  async function fetchRecommendations() {
    setLoading(true);
    try {
      const response = await fetch('/api/tuyensinh247/find-school', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          method_id: 3,
          priority_score: 1,
          user_scores: userScores,
          filter: {
            ...(provinceId ? { province_id: provinceId } : {}),
            ...(majorIds.length ? { major_ids: majorIds } : {}),
          },
          meta: { priorityObject, area },
        }),
      });
      const data = await response.json();
      setResult({ ok: response.ok, data });
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="rounded-card border border-hairline bg-surface p-5">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-hairline pb-4">
        <div className="flex gap-2">
          <button onClick={() => setActiveTab('recommend')} className={`rounded-full px-4 py-2 text-sm font-medium transition ${activeTab === 'recommend' ? 'bg-white text-black' : 'text-mute hover:text-ink'}`}>
            Tư vấn chọn trường
          </button>
          <button onClick={() => setActiveTab('newschool')} className={`rounded-full px-4 py-2 text-sm font-medium transition ${activeTab === 'newschool' ? 'bg-white text-black' : 'text-mute hover:text-ink'}`}>
            Trường mới xét học bạ 2026
          </button>
        </div>
      </div>

      {activeTab === 'recommend' ? (
        <div className="mt-5 space-y-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-blue">Tuyển sinh 247 · Tham khảo 2025</p>
              <h3 className="mt-2 text-xl font-medium text-ink">Gợi ý nhóm trường phù hợp (Dựa trên điểm chuẩn 2025)</h3>
              <p className="mt-1 text-sm text-mute">Dữ liệu được đối chiếu trực tiếp với điểm chuẩn năm 2025 trên cổng TuyenSinh247.</p>
            </div>
            <button onClick={fetchRecommendations} disabled={loading || majorIds.length === 0} className="h-10 rounded-md bg-white px-4 text-sm font-medium text-black hover:bg-zinc-200 disabled:bg-elevated disabled:text-ash">
              {loading ? 'Đang tìm...' : 'Tìm trường phù hợp'}
            </button>
          </div>

          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            <Select label="Đối tượng" value={priorityObject} onChange={setPriorityObject} options={[["none", "Không thuộc ưu tiên"], ["dt1", "Đối tượng 01"], ["dt2", "Đối tượng 02"], ["dt3", "Đối tượng 03"]]} />
            <Select label="Khu vực" value={area} onChange={setArea} options={[["KV1", "KV1"], ["2NT", "KV2-NT"], ["KV2", "KV2"], ["KV3", "KV3"]]} />
            <label className="text-sm text-body">
              Tỉnh thành
              <select value={provinceId} onChange={(event) => setProvinceId(Number(event.target.value))} className="mt-2 h-11 w-full rounded-md border border-hairline bg-elevated px-3 text-ink outline-none focus:border-blue">
                {provinces.length ? provinces.map((province) => <option key={province.id} value={province.id}>{province.name}</option>) : <option value={57}>Đang tải tỉnh thành...</option>}
              </select>
            </label>
            <MajorMultiSelect
              majors={majors}
              selectedIds={majorIds}
              onToggle={(id) => setMajorIds((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]))}
            />
          </div>

          <RecommendationResultView result={result} activeGroupTab={activeGroupTab} setActiveGroupTab={setActiveGroupTab} />
        </div>
      ) : (
        <div className="mt-5">
          <div className="mb-4">
            <p className="text-xs uppercase tracking-[0.24em] text-blue">Tuyển sinh 2026</p>
            <h3 className="mt-2 text-xl font-medium text-ink">Danh sách trường mới xét học bạ</h3>
            <p className="mt-1 text-sm text-mute">Dữ liệu được cập nhật theo cổng TuyenSinh247 cho kỳ tuyển sinh năm nay.</p>
          </div>

          {newSchoolsLoading ? (
            <p className="text-sm text-mute">Đang tải danh sách trường mới...</p>
          ) : newSchoolsError ? (
            <p className="text-sm text-red">{newSchoolsError}</p>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 max-h-[500px] overflow-y-auto pr-1">
              {newSchools.length ? newSchools.map((item) => (
                <div key={item.id} className="rounded-md border border-hairline bg-elevated p-4 text-sm flex flex-col justify-between">
                  <div>
                    <span className="inline-block rounded bg-red/10 border border-red/20 px-2 py-0.5 text-xs text-red font-mono mb-2">{item.school_code}</span>
                    <h4 className="font-semibold text-ink leading-tight">{item.school_name}</h4>
                    <p className="mt-2 text-body">{item.name}</p>
                    <p className="mt-1 text-xs text-mute">Tổ hợp: {item.block.split(';').slice(0, 3).join(', ')}{item.block.split(';').length > 3 ? '...' : ''}</p>
                  </div>
                  <div className="mt-3 pt-3 border-t border-hairline/50 flex justify-between text-xs text-mute">
                    <span>Mã ngành: {item.code}</span>
                    <span>Chỉ tiêu: {item.quota || 'Chưa công bố'}</span>
                  </div>
                </div>
              )) : (
                <p className="text-sm text-mute col-span-full">Chưa có thông tin trường mới.</p>
              )}
            </div>
          )}
        </div>
      )}
    </section>
  );
}

function Select({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: string[][] }) {
  return (
    <label className="text-sm text-body">
      {label}
      <select value={value} onChange={(event) => onChange(event.target.value)} className="mt-2 h-11 w-full rounded-md border border-hairline bg-elevated px-3 text-ink outline-none focus:border-blue">
        {options.map(([optionValue, optionLabel]) => <option key={optionValue} value={optionValue}>{optionLabel}</option>)}
      </select>
    </label>
  );
}

function MajorMultiSelect({ majors, selectedIds, onToggle }: { majors: MajorGroup[]; selectedIds: number[]; onToggle: (id: number) => void }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const wrapperRef = useRef<HTMLDivElement>(null);
  const allMajorItems = majors.flatMap((group) => group.majors ?? []);
  const selectedMajors = allMajorItems.filter((major) => selectedIds.includes(major.id));
  const normalizedQuery = query.trim().toLowerCase();
  const filteredGroups = normalizedQuery
    ? majors
        .map((group) => {
          const groupMatched = group.title.toLowerCase().includes(normalizedQuery);
          return {
            ...group,
            majors: groupMatched ? (group.majors ?? []) : (group.majors ?? []).filter((major) => major.name.toLowerCase().includes(normalizedQuery)),
          };
        })
        .filter((group) => group.majors.length > 0)
    : majors;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={wrapperRef} className="relative text-sm text-body md:col-span-2 xl:col-span-1">
      <span>Ngành / nhóm ngành</span>
      <div className={`mt-2 flex min-h-11 w-full items-center gap-3 rounded-md border bg-elevated px-3 py-2 transition ${open ? 'border-blue' : 'border-hairline'}`}>
        <input
          value={open ? query : selectedMajors.map((major) => major.name).join(', ')}
          onChange={(event) => {
            setQuery(event.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder="Chọn ngành/nhóm ngành"
          className="min-w-0 flex-1 bg-transparent text-ink outline-none placeholder:text-mute"
        />
        <button type="button" onClick={() => setOpen((value) => !value)} className={`shrink-0 text-mute transition ${open ? 'rotate-180' : ''}`} aria-expanded={open} aria-label="Mở danh sách ngành">
          ⌄
        </button>
      </div>

      {open ? (
        <div className="absolute bottom-full left-0 right-0 z-30 mb-2 overflow-hidden rounded-md border border-hairline bg-elevated text-ink shadow-2xl">
          <div className="max-h-72 overflow-y-auto py-1">
            {filteredGroups.length ? filteredGroups.map((group) => (
              <div key={group.id}>
                <div className="px-5 py-2 text-sm leading-5 text-mute">{group.title}</div>
                {(group.majors ?? []).map((major) => {
                  const checked = selectedIds.includes(major.id);
                  return (
                    <button
                      key={major.id}
                      type="button"
                      onClick={() => onToggle(major.id)}
                      className={`flex w-full items-center gap-3 px-5 py-2 text-left text-sm leading-5 transition ${checked ? 'bg-blue/10 text-ink' : 'text-body hover:bg-surface'}`}
                    >
                      <span className={`grid h-4 w-4 shrink-0 place-items-center rounded border text-[10px] ${checked ? 'border-blue bg-blue text-white' : 'border-hairline bg-canvas'}`}>
                        {checked ? '✓' : ''}
                      </span>
                      <span className="min-w-0 flex-1">{major.name}</span>
                    </button>
                  );
                })}
              </div>
            )) : <p className="px-4 py-3 text-sm text-mute">{majors.length ? 'Không tìm thấy ngành phù hợp.' : 'Đang tải danh sách ngành...'}</p>}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function RecommendationResultView({
  result,
  activeGroupTab,
  setActiveGroupTab,
}: {
  result: RecommendationResult | null;
  activeGroupTab: 'fit' | 'consideration' | 'no-fit';
  setActiveGroupTab: (tab: 'fit' | 'consideration' | 'no-fit') => void;
}) {
  const [searchQuery, setSearchQuery] = useState('');

  // Xóa nội dung tìm kiếm khi đổi tab
  useEffect(() => {
    setSearchQuery('');
  }, [activeGroupTab]);

  if (!result) return null;
  if (!result.ok) {
    const data = result.data as { error?: string };
    return <p className="mt-4 rounded-md border border-red/30 bg-red/10 p-3 text-sm text-red">{String(data.error ?? 'Không lấy được gợi ý.')}</p>;
  }

  const payload = result.data as { data?: Record<string, unknown> };
  const groups = payload.data ?? {};

  return (
    <div className="mt-5 space-y-4">
      {/* Tab Navigation for All screens */}
      <div className="flex border-b border-hairline">
        {['fit', 'consideration', 'no-fit'].map((group) => {
          const meta = GROUP_META[group] || { label: group, text: 'text-ink' };
          const items = Array.isArray(groups[group]) ? (groups[group] as Record<string, unknown>[]) : [];
          const active = activeGroupTab === group;
          return (
            <button
              key={group}
              onClick={() => setActiveGroupTab(group as 'fit' | 'consideration' | 'no-fit')}
              className={`flex-1 pb-3 text-center text-sm font-semibold transition-all border-b-2 ${
                active ? 'border-blue text-ink' : 'border-transparent text-mute hover:text-ink'
              }`}
            >
              <span className={active ? meta.text : ''}>{meta.label}</span>
              <span className="ml-1.5 text-xs px-1.5 py-0.5 rounded-full bg-elevated text-mute">{items.length}</span>
            </button>
          );
        })}
      </div>

      {/* Content Display */}
      <div>
        {['fit', 'consideration', 'no-fit'].map((group) => {
          if (activeGroupTab !== group) return null;
          const meta = GROUP_META[group] || { label: group, border: 'border-hairline', bg: 'bg-elevated', text: 'text-ink' };
          const items = Array.isArray(groups[group]) ? (groups[group] as Record<string, unknown>[]) : [];
          
          const normalizedQuery = searchQuery.trim().toLowerCase();
          const filteredItems = normalizedQuery 
            ? items.filter((item) => 
                String(item.school_name ?? '').toLowerCase().includes(normalizedQuery) || 
                String(item.name ?? '').toLowerCase().includes(normalizedQuery)
              )
            : items;

          return (
            <div key={group} className={`rounded-md border ${meta.border} ${meta.bg} p-5`}>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <h4 className={`font-semibold ${meta.text}`}>{meta.label} ({filteredItems.length}{searchQuery ? ` / ${items.length}` : ''})</h4>
                <div className="relative w-full sm:w-72">
                  <input 
                    type="text" 
                    placeholder="Tìm nhanh trường, ngành..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-9 w-full rounded-md border border-hairline bg-canvas px-3 pl-9 text-sm text-ink outline-none focus:border-blue transition-colors"
                  />
                  <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-mute" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
              <div className="mt-4 max-h-[500px] overflow-auto pr-1 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredItems.length ? filteredItems.map((item, index) => (
                  <div key={`${group}-${index}`} className="rounded-lg border border-hairline bg-canvas/60 p-4 text-sm flex flex-col justify-between transition hover:border-blue/30 hover:shadow-sm">
                    <div>
                      <p className="font-medium text-ink leading-tight">{String(item.name ?? '-')}</p>
                      <p className="mt-2 text-mute">{String(item.school_name ?? '')}</p>
                      <p className="mt-1 text-xs text-mute">Tổ hợp: {String(item.block ?? '')}</p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-hairline/50 flex justify-between items-center text-body">
                      <span>Điểm bạn: <span className="font-semibold text-yellow">{String(item.user_point ?? '-')}</span></span>
                      <span>Chuẩn: <span className="font-semibold text-ink">{String(item.mark ?? '-')}</span></span>
                    </div>
                  </div>
                )) : <p className="text-sm text-mute col-span-full">Không có kết quả.</p>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
