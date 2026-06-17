'use client';

import { useState, useEffect } from 'react';

type RecommendationResult = { ok: boolean; data: any };

const GROUP_META: Record<string, { label: string; border: string; bg: string; text: string }> = {
  dream: {
    label: '☁️ Ước mơ',
    border: 'border-purple/30',
    bg: 'bg-purple/5',
    text: 'text-purple',
  },
  target: {
    label: '🎯 Mục tiêu',
    border: 'border-blue/30',
    bg: 'bg-blue/5',
    text: 'text-blue',
  },
  safe: {
    label: '🛡️ An toàn',
    border: 'border-green/30',
    bg: 'bg-green/5',
    text: 'text-green',
  },
  'no-fit': {
    label: '⚓ Quá cao',
    border: 'border-red/30',
    bg: 'bg-red/5',
    text: 'text-red',
  },
};

export function AspirationRecommendations({ userScores }: { userScores: Record<string, number> }) {
  const [result, setResult] = useState<RecommendationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [majorInput, setMajorInput] = useState('');
  const [totalScore, setTotalScore] = useState('');
  const [province, setProvince] = useState('all');
  
  // Data for selects and autocomplete
  const [provincesList, setProvincesList] = useState<{name: string}[]>([]);
  const [majorsList, setMajorsList] = useState<{name: string}[]>([]);
  const [showMajorSuggestions, setShowMajorSuggestions] = useState(false);
  
  const [strategyAspirations, setStrategyAspirations] = useState<any[]>([]);

  // Mobile tab state
  const [activeGroupTab, setActiveGroupTab] = useState<'safe' | 'target' | 'dream' | 'no-fit'>('target');

  useEffect(() => {
    fetch('/api/tuyensinh247/provinces')
      .then(res => res.json())
      .then(payload => {
        if (Array.isArray(payload.data)) {
          setProvincesList(payload.data);
        }
      })
      .catch(() => {});
      
    fetch('/api/tuyensinh247/majors?q=')
      .then(res => res.json())
      .then(payload => {
        if (Array.isArray(payload.data)) {
          // Flatten grouped majors to a simple list of strings
          const allMajors: {name: string}[] = [];
          payload.data.forEach((group: any) => {
            if (group.majors) {
              group.majors.forEach((m: any) => allMajors.push({ name: m.name }));
            }
          });
          setMajorsList(allMajors);
        }
      })
      .catch(() => {});
  }, []);

  function buildStrategy(data: any) {
    const dreamList = [...(data.dream || [])].sort(() => Math.random() - 0.5);
    const targetList = [...(data.target || [])].sort(() => Math.random() - 0.5);
    const safeList = [...(data.safe || [])].sort(() => Math.random() - 0.5);

    const strategy = [
      ...dreamList.slice(0, 3).map((x: any) => ({ ...x, group: 'dream' })),
      ...targetList.slice(0, 6).map((x: any) => ({ ...x, group: 'target' })),
      ...safeList.slice(0, 6).map((x: any) => ({ ...x, group: 'safe' }))
    ];
    setStrategyAspirations(strategy);
  }

  async function fetchRecommendations() {
    if (!majorInput.trim() || !totalScore.trim()) return;
    
    setLoading(true);
    setShowMajorSuggestions(false);
    try {
      const response = await fetch('/api/aspiration', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          major: majorInput.trim(),
          scores: parseFloat(totalScore),
          province: province
        }),
      });
      const data = await response.json();
      setResult({ ok: response.ok, data });
      if (response.ok && data.success && data.data) {
        buildStrategy(data.data);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="rounded-card border border-hairline bg-surface p-5">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-hairline pb-4">
        <div className="flex gap-2">
          <button className="rounded-full bg-white px-4 py-2 text-sm font-medium text-black transition">
            Chiến thuật Nguyện vọng THPT
          </button>
        </div>
      </div>

      <div className="mt-5 space-y-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-blue">Dữ liệu toàn quốc · Chuẩn 2025/2026</p>
            <h3 className="mt-2 text-xl font-medium text-ink">Sắp xếp nguyện vọng thông minh</h3>
            <p className="mt-1 text-sm text-mute">Nhập tổng điểm thi thực tế (hoặc ước tính) và tên ngành bạn thích để hệ thống gợi ý cách đặt nguyện vọng an toàn nhất.</p>
          </div>
        </div>

        <div className="flex flex-wrap items-end gap-4">
          <div className="w-full sm:w-48">
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-ash">Tổng điểm khối xét tuyển</label>
            <input 
              type="number" 
              step="0.25"
              min="0"
              max="40"
              placeholder="Vd: 24.5"
              className="h-10 w-full rounded-md border border-hairline bg-elevated px-3 text-sm text-ink outline-none focus:border-blue"
              value={totalScore}
              onChange={(e) => setTotalScore(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchRecommendations()}
            />
          </div>
          <div className="w-full sm:w-48">
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-ash">Tỉnh/Thành phố</label>
            <select
              className="h-10 w-full rounded-md border border-hairline bg-elevated px-3 text-sm text-ink outline-none focus:border-blue"
              value={province}
              onChange={(e) => setProvince(e.target.value)}
            >
              <option value="all">Tất cả tỉnh thành</option>
              {provincesList.map((p, idx) => (
                <option key={idx} value={p.name}>{p.name}</option>
              ))}
            </select>
          </div>
          <div className="flex-1 min-w-[200px] relative">
             <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-ash">Ngành học mong muốn</label>
             <input 
               type="text" 
               placeholder="Vd: Công nghệ thông tin, Kinh tế, Y khoa..."
               className="h-10 w-full rounded-md border border-hairline bg-elevated px-3 text-sm text-ink outline-none focus:border-blue"
               value={majorInput}
               onChange={(e) => {
                 setMajorInput(e.target.value);
                 setShowMajorSuggestions(true);
               }}
               onFocus={() => setShowMajorSuggestions(true)}
               onBlur={() => setTimeout(() => setShowMajorSuggestions(false), 200)}
               onKeyDown={(e) => {
                 if (e.key === 'Enter') {
                   setShowMajorSuggestions(false);
                   fetchRecommendations();
                 }
               }}
             />
             {/* Suggestions dropdown */}
             {showMajorSuggestions && majorInput.trim() && (
               <div className="absolute top-full left-0 right-0 z-10 mt-1 max-h-60 overflow-y-auto rounded-md border border-hairline bg-surface shadow-hover custom-scrollbar">
                 {majorsList
                   .filter(m => m.name.toLowerCase().includes(majorInput.toLowerCase()))
                   .slice(0, 15) // limit to 15 suggestions
                   .map((m, idx) => (
                     <div 
                       key={idx}
                       className="cursor-pointer px-4 py-2 text-sm text-ink hover:bg-elevated transition"
                       onClick={() => {
                         setMajorInput(m.name);
                         setShowMajorSuggestions(false);
                       }}
                     >
                       {m.name}
                     </div>
                   ))}
               </div>
             )}
          </div>
          <button onClick={fetchRecommendations} disabled={loading || !majorInput.trim() || !totalScore.trim()} className="h-10 w-full sm:w-auto rounded-md bg-white px-6 text-sm font-medium text-black hover:bg-zinc-200 disabled:bg-elevated disabled:text-ash transition">
            {loading ? 'Đang phân tích...' : 'Tìm trường & Điểm chuẩn'}
          </button>
        </div>

        {/* Lỗi nếu có */}
        {result && !result.ok && (
          <div className="rounded-md border border-red/30 bg-red/5 p-4 text-sm text-red">
            {result.data?.error || 'Có lỗi xảy ra.'}
          </div>
        )}

        {/* Kết quả */}
        {result?.ok && result.data?.success && result.data.data && (() => {
          if (strategyAspirations.length === 0) {
            return (
              <div className="mt-8 rounded-md border border-hairline bg-surface p-8 text-center">
                <p className="text-ash">Không tìm thấy trường nào phù hợp.</p>
                <p className="mt-1 text-sm text-mute">Bạn hãy thử mở rộng khu vực, thử ngành khác, hoặc nhập điểm thấp hơn xem sao nhé!</p>
              </div>
            );
          }

          return (
            <div className="mt-8">
               <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
                 <h4 className="text-lg font-medium text-ink">Bảng Gợi ý {strategyAspirations.length} Nguyện vọng Tối ưu</h4>
                 <button 
                   onClick={() => buildStrategy(result.data.data)}
                   className="flex items-center gap-2 rounded-md bg-elevated px-4 py-2 text-sm font-medium text-ink hover:bg-hairline transition"
                 >
                   <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21.5 2v6h-6M2.13 15.57a9 9 0 1 0 3.87-11.6l-5.6 3.1"/></svg>
                   Gợi ý bộ NV khác
                 </button>
               </div>
               {/* Desktop Table */}
               <div className="hidden lg:block overflow-x-auto rounded-md border border-hairline bg-surface custom-scrollbar">
                 <table className="w-full text-left text-sm text-ink whitespace-nowrap min-w-[700px]">
                   <thead className="bg-elevated text-xs uppercase tracking-wide text-ash">
                     <tr>
                       <th className="px-4 py-3 text-center w-12">NV</th>
                       <th className="px-4 py-3">Trường</th>
                       <th className="px-4 py-3">Ngành / Tổ hợp</th>
                       <th className="px-4 py-3 text-right">Điểm xét tuyển</th>
                       <th className="px-4 py-3 text-right">Điểm chuẩn '25</th>
                       <th className="px-4 py-3 text-center">Chiến thuật</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-hairline">
                     {strategyAspirations.map((item, idx) => {
                       const meta = GROUP_META[item.group as keyof typeof GROUP_META];
                       return (
                         <tr key={idx} className="hover:bg-elevated/50 transition">
                           <td className="px-4 py-3 text-center font-bold text-ash">{idx + 1}</td>
                           <td className="px-4 py-3">
                             <p className="font-medium text-ink">{item.schoolName}</p>
                             <p className="text-xs text-mute mt-0.5">{item.schoolCode}</p>
                           </td>
                           <td className="px-4 py-3">
                             <p className="truncate max-w-[200px] lg:max-w-[300px]" title={item.majorName}>{item.majorName}</p>
                             <div className="text-xs text-mute mt-1 flex flex-wrap gap-1">
                               {item.blocks && item.blocks.map((b: any, idx2: number) => (
                                 <span key={idx2} className="inline-block bg-elevated rounded px-1.5 py-0.5 border border-hairline">
                                   {b.name} ({b.score})
                                 </span>
                               ))}
                             </div>
                           </td>
                           <td className="px-4 py-3 text-right font-medium text-ink">{item.userScore}</td>
                           <td className="px-4 py-3 text-right font-medium text-blue">{item.admissionScore}</td>
                           <td className="px-4 py-3 text-center">
                             <span className={`inline-flex items-center rounded-full border ${meta.border} bg-surface px-2.5 py-1 text-xs font-medium ${meta.text}`}>
                               {meta.label}
                             </span>
                           </td>
                         </tr>
                       );
                     })}
                   </tbody>
                 </table>
               </div>

               {/* Mobile Cards */}
               <div className="lg:hidden space-y-3 mt-4">
                 {strategyAspirations.map((item, idx) => {
                   const meta = GROUP_META[item.group as keyof typeof GROUP_META];
                   return (
                     <div key={idx} className="rounded-card border border-hairline bg-surface p-4 relative overflow-hidden">
                       <div className={`absolute top-0 left-0 w-1 h-full ${meta.border.replace('border-', 'bg-')}`}></div>
                       <div className="flex justify-between items-start gap-2 mb-2 pl-2">
                         <div>
                           <span className="text-xs font-bold text-ash mr-2">NV {idx + 1}</span>
                           <span className={`inline-flex items-center rounded-full border ${meta.border} bg-elevated px-2 py-0.5 text-[10px] font-medium ${meta.text}`}>
                             {meta.label}
                           </span>
                         </div>
                         <span className="shrink-0 rounded bg-elevated px-1.5 py-0.5 text-[10px] text-mute">{item.schoolCode}</span>
                       </div>
                       
                       <div className="pl-2">
                         <p className="text-sm font-medium text-ink leading-tight">{item.schoolName}</p>
                         <p className="mt-1 text-xs text-mute">{item.majorName}</p>
                         
                         <div className="text-xs text-mute mt-2 flex flex-wrap gap-1">
                           {item.blocks && item.blocks.map((b: any, idx2: number) => (
                             <span key={idx2} className="inline-block bg-elevated rounded px-1.5 py-0.5 border border-hairline">
                               {b.name} ({b.score})
                             </span>
                           ))}
                         </div>
                         
                         <div className="mt-3 flex flex-wrap items-center gap-3 border-t border-hairline pt-2">
                           <div className="flex-1">
                             <p className="text-[10px] uppercase text-ash">Điểm xét tuyển</p>
                             <p className="text-sm font-medium text-ink">{item.userScore}</p>
                           </div>
                           <div className="text-right">
                             <p className="text-[10px] uppercase text-ash">Điểm chuẩn '25</p>
                             <p className="text-sm font-bold text-blue">{item.admissionScore}</p>
                           </div>
                         </div>
                       </div>
                     </div>
                   );
                 })}
               </div>
            </div>
          );
        })()}
      </div>
    </section>
  );
}


