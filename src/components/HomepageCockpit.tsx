'use client';

import { useMemo, useState } from 'react';

const NEXT_MILESTONE = new Date('2026-07-01T08:00:00+07:00');

type ScoreKey = 'toan' | 'van' | 'anh' | 'ly' | 'hoa' | 'sinh' | 'su' | 'dia' | 'gdcd' | 'tin' | 'cn' | 'nk1' | 'nk2';
type Scores = Record<ScoreKey, number | ''>;
const SUBJECT_OPTIONS: { key: ScoreKey; label: string }[] = [
  { key: 'toan', label: 'Toán' },
  { key: 'van', label: 'Ngữ Văn' },
  { key: 'anh', label: 'Ngoại ngữ' },
  { key: 'ly', label: 'Vật lý' },
  { key: 'hoa', label: 'Hóa học' },
  { key: 'sinh', label: 'Sinh học' },
  { key: 'su', label: 'Lịch sử' },
  { key: 'dia', label: 'Địa lý' },
  { key: 'gdcd', label: 'GDCD' },
  { key: 'tin', label: 'Tin học' },
  { key: 'cn', label: 'Công nghệ' },
  { key: 'nk1', label: 'Năng khiếu 1' },
  { key: 'nk2', label: 'Năng khiếu 2' },
];

const PRESET_COMBOS: { label: string; subjects: ScoreKey[] }[] = [
  { label: 'A00 (Toán, Lý, Hóa)', subjects: ['toan', 'ly', 'hoa'] },
  { label: 'A01 (Toán, Lý, Anh)', subjects: ['toan', 'ly', 'anh'] },
  { label: 'A02 (Toán, Lý, Sinh)', subjects: ['toan', 'ly', 'sinh'] },
  { label: 'B00 (Toán, Hóa, Sinh)', subjects: ['toan', 'hoa', 'sinh'] },
  { label: 'B08 (Toán, Sinh, Anh)', subjects: ['toan', 'sinh', 'anh'] },
  { label: 'C00 (Văn, Sử, Địa)', subjects: ['van', 'su', 'dia'] },
  { label: 'C01 (Toán, Văn, Lý)', subjects: ['toan', 'van', 'ly'] },
  { label: 'C03 (Toán, Văn, Sử)', subjects: ['toan', 'van', 'su'] },
  { label: 'C04 (Toán, Văn, Địa)', subjects: ['toan', 'van', 'dia'] },
  { label: 'D01 (Toán, Văn, Anh)', subjects: ['toan', 'van', 'anh'] },
  { label: 'D07 (Toán, Hóa, Anh)', subjects: ['toan', 'hoa', 'anh'] },
  { label: 'D08 (Toán, Sinh, Anh)', subjects: ['toan', 'sinh', 'anh'] },
  { label: 'D09 (Toán, Sử, Anh)', subjects: ['toan', 'su', 'anh'] },
  { label: 'D10 (Toán, Địa, Anh)', subjects: ['toan', 'dia', 'anh'] },
  { label: 'D14 (Văn, Sử, Anh)', subjects: ['van', 'su', 'anh'] },
  { label: 'D15 (Văn, Địa, Anh)', subjects: ['van', 'dia', 'anh'] },
  { label: 'H00 (Văn, NK1, NK2)', subjects: ['van', 'nk1', 'nk2'] },
  { label: 'V00 (Toán, Lý, NK1)', subjects: ['toan', 'ly', 'nk1'] },
  { label: 'X06 (Toán, Lý, Tin)', subjects: ['toan', 'ly', 'tin'] },
  { label: 'X26 (Toán, Anh, Tin)', subjects: ['toan', 'anh', 'tin'] },
];

const DEFAULT_SCORES: Scores = { toan: 8, van: 7.5, anh: 8.5, ly: 7, hoa: 8, sinh: 7, su: 6, dia: 7, gdcd: 9, tin: 8, cn: 8, nk1: 7, nk2: 7 };

const SCHEDULE = [
  { date: '17-21/06', time: 'Hệ thống', subject: 'Thực hành đăng ký NV', duration: 'Thử nghiệm', tone: 'blue' },
  { date: '01/07', time: '08:00', subject: 'Công bố điểm thi THPT', duration: 'Chính thức', tone: 'red' },
  { date: '01-09/07', time: 'Trường', subject: 'Nộp đơn phúc khảo', duration: 'Nếu có', tone: 'mute' },
  { date: '02-14/07', time: '17:00', subject: 'Đăng ký NV Đại học', duration: 'Chính thức', tone: 'green' },
  { date: '15-21/07', time: '17:00', subject: 'Nộp lệ phí xét tuyển', duration: 'Trực tuyến', tone: 'yellow' },
  { date: '13/08', time: '17:00', subject: 'Công bố điểm chuẩn', duration: 'Đợt 1', tone: 'red' },
  { date: '21/08', time: '17:00', subject: 'Xác nhận nhập học', duration: 'Trực tuyến', tone: 'blue' },
];

export function HomepageCockpit() {
  const [scores, setScores] = useState<Scores>(DEFAULT_SCORES);
  
  // States for University Admission
  const [selectedCombo, setSelectedCombo] = useState<ScoreKey[]>(['toan', 'ly', 'hoa']);
  
  // States for Graduation Calc
  const [electives, setElectives] = useState<ScoreKey[]>(['anh', 'ly']);
  const [gpa, setGpa] = useState<{ grade10: number | ''; grade11: number | ''; grade12: number | '' }>({ grade10: 8.0, grade11: 8.0, grade12: 8.0 });
  const [priority, setPriority] = useState<number | ''>(0);
  
  const [activeTab, setActiveTab] = useState<'combo' | 'graduation'>('combo');

  const daysLeft = Math.max(0, Math.ceil((NEXT_MILESTONE.getTime() - Date.now()) / 86_400_000));

  const comboScore = useMemo(() => {
    return round2(selectedCombo.reduce((total, subject) => total + (Number(scores[subject]) || 0), 0));
  }, [scores, selectedCombo]);

  const graduationData = useMemo(() => {
    const toan = Number(scores.toan) || 0;
    const van = Number(scores.van) || 0;
    const el1 = Number(scores[electives[0]]) || 0;
    const el2 = Number(scores[electives[1]]) || 0;

    const examTotal = toan + van + el1 + el2;
    const examAvg = examTotal / 4;
    const gpaAvg = ((Number(gpa.grade10) || 0) + (Number(gpa.grade11) || 0) * 2 + (Number(gpa.grade12) || 0) * 3) / 6;
    const finalScore = round2((examAvg * 0.5) + (gpaAvg * 0.5) + (Number(priority) || 0));
    
    const isFailExam = (toan <= 1 || van <= 1 || el1 <= 1 || el2 <= 1);
    const passed = finalScore >= 5.0 && !isFailExam;
    
    return { examAvg, gpaAvg, finalScore, passed, isFailExam };
  }, [scores, electives, gpa, priority]);

  const parseInput = (val: string) => (val === '' ? '' : Number(val));

  const matchCombo = PRESET_COMBOS.find(c => JSON.stringify(c.subjects) === JSON.stringify(selectedCombo));
  const comboValue = matchCombo ? matchCombo.label : 'custom';

  return (
    <div className="grid gap-4 lg:gap-5 xl:grid-cols-[1fr_340px]">
      <div className="flex flex-col gap-4 lg:gap-5">
        <section className="group rounded-card border border-hairline bg-surface p-4 shadow-card transition-all duration-200 hover:-translate-y-[2px] hover:border-hairlineHover hover:shadow-hover sm:p-6 md:p-8">
          <p className="text-xs uppercase tracking-[0.28em] text-blue sm:text-sm sm:tracking-[0.35em]">Giai đoạn 2: Xét tuyển Đại học</p>
          <h1 className="mt-4 text-3xl font-semibold leading-tight text-ink sm:text-4xl md:text-5xl">Hành trình Đại học 2026</h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-body sm:text-lg sm:leading-8">Kỳ thi đã kết thúc. Đây là lúc để bạn nghỉ ngơi, tính điểm dự kiến từ đáp án tham khảo và chuẩn bị chiến lược sắp xếp Nguyện vọng thông minh nhất.</p>
          <div className="mt-6 grid grid-cols-3 gap-2 sm:gap-3">
            <Metric label="Còn lại" value={`${daysLeft}`} suffix="ngày" tone="red" />
            <Metric label="Mốc lớn" value="01/07" suffix="Điểm thi" tone="yellow" />
            <Metric label="Giai đoạn" value="Xét" suffix="Tuyển" tone="blue" />
          </div>
        </section>

        <section className="group rounded-card border border-hairline bg-surface p-4 shadow-card transition-all duration-200 hover:-translate-y-[2px] hover:border-hairlineHover hover:shadow-hover sm:p-6 md:p-8">
          <div className="flex flex-wrap items-end justify-between gap-4 border-b border-hairline pb-4">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-yellow">Công cụ</p>
              <h2 className="mt-2 text-xl font-medium text-ink sm:text-2xl">Tính điểm 2026</h2>
            </div>
            <div className="grid w-full grid-cols-2 gap-1 rounded-input border border-hairline bg-canvas p-1 sm:flex sm:w-auto">
              <button onClick={() => setActiveTab('combo')} className={`rounded-btn px-2 py-2 text-xs sm:text-sm sm:px-4 font-medium transition ${activeTab === 'combo' ? 'bg-surface text-ink shadow-sm' : 'text-body hover:text-ink'}`}>Xét Đại học</button>
              <button onClick={() => setActiveTab('graduation')} className={`rounded-btn px-2 py-2 text-xs sm:text-sm sm:px-4 font-medium transition ${activeTab === 'graduation' ? 'bg-surface text-ink shadow-sm' : 'text-body hover:text-ink'}`}>Xét Tốt nghiệp</button>
            </div>
          </div>

          {activeTab === 'combo' && (
            <div className="mt-5 animate-in fade-in">
              <p className="text-sm leading-6 text-mute">Tính điểm tổng 3 môn cho các tổ hợp xét tuyển Đại học truyền thống.</p>
              <div className="mt-4">
                <select
                  value={comboValue}
                  onChange={(e) => {
                    if (e.target.value !== 'custom') {
                      const combo = PRESET_COMBOS.find((c) => c.label === e.target.value);
                      if (combo) setSelectedCombo(combo.subjects);
                    }
                  }}
                  className="h-11 w-full max-w-sm rounded-input border border-hairline bg-canvas px-3 text-sm font-medium text-ink outline-none transition focus:border-blue"
                >
                  {PRESET_COMBOS.map((combo) => (
                    <option key={combo.label} value={combo.label} className="bg-surface text-ink">
                      Khối {combo.label}
                    </option>
                  ))}
                  {comboValue === 'custom' && <option value="custom" className="bg-surface text-ink">Tổ hợp tùy chọn (Tự chọn môn)</option>}
                </select>
              </div>

              <div className="mt-5 flex flex-col gap-3 sm:grid sm:grid-cols-3 sm:items-start">
                {selectedCombo.map((subject, index) => (
                  <div key={index} className="flex items-end gap-3 rounded-card border border-hairline bg-elevated p-3 sm:block sm:space-y-3 sm:p-4">
                    <div className="flex-1 sm:block sm:w-full">
                      <label className="block text-xs text-mute sm:text-sm sm:text-body">Môn {index + 1}</label>
                      <select value={subject} onChange={(event) => setSelectedCombo((prev) => prev.map((item, itemIndex) => itemIndex === index ? event.target.value as ScoreKey : item))} className="mt-1.5 block h-11 w-full rounded-input border border-hairline bg-canvas px-2 text-sm font-medium text-ink outline-none transition focus:border-blue sm:mt-2 sm:px-3">
                        {SUBJECT_OPTIONS.map((option) => <option key={option.key} value={option.key} className="bg-surface text-ink">{option.label}</option>)}
                      </select>
                    </div>
                    <div className="w-24 shrink-0 sm:block sm:w-full">
                      <label className="block text-xs text-mute sm:text-sm sm:text-body">Điểm</label>
                      <input type="number" min="0" max="10" step="0.25" value={scores[subject]} onChange={(event) => setScores((prev) => ({ ...prev, [subject]: parseInput(event.target.value) }))} className="mt-1.5 block h-11 w-full rounded-input border border-hairline bg-canvas px-2 text-center text-lg font-bold text-blue outline-none transition focus:border-blue sm:mt-2 sm:px-3 sm:text-left sm:text-base sm:font-normal sm:text-ink" />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-5 flex flex-col items-center justify-between gap-3 rounded-card border border-hairline bg-canvas/50 p-4 text-center sm:flex-row sm:gap-4 sm:p-5 sm:text-left">
                <div>
                  <p className="text-sm text-mute">Tổng điểm tổ hợp ({selectedCombo.map(subjectLabel).join(' + ')})</p>
                </div>
                <p className="text-4xl font-bold text-yellow">{comboScore}</p>
              </div>
            </div>
          )}

          {activeTab === 'graduation' && (
            <div className="mt-5 animate-in fade-in">
              <p className="text-sm leading-6 text-mute">Theo quy chế 2025+, ĐXTN = 50% Điểm thi (4 môn) + 50% Học bạ (Lớp 10x1 + Lớp 11x2 + Lớp 12x3)/6 + Điểm ưu tiên.</p>
              
              <div className="mt-5 grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold uppercase text-ink">1. Điểm thi (4 môn)</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-card border border-hairline bg-elevated p-3">
                      <p className="text-sm text-body">Toán (Bắt buộc)</p>
                      <input type="number" min="0" max="10" step="0.25" value={scores.toan} onChange={(e) => setScores((prev) => ({ ...prev, toan: parseInput(e.target.value) }))} className="mt-2 h-10 w-full rounded-input border border-hairline bg-canvas px-3 text-ink outline-none transition focus:border-blue" />
                    </div>
                    <div className="rounded-card border border-hairline bg-elevated p-3">
                      <p className="text-sm text-body">Ngữ Văn (Bắt buộc)</p>
                      <input type="number" min="0" max="10" step="0.25" value={scores.van} onChange={(e) => setScores((prev) => ({ ...prev, van: parseInput(e.target.value) }))} className="mt-2 h-10 w-full rounded-input border border-hairline bg-canvas px-3 text-ink outline-none transition focus:border-blue" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {electives.map((subject, index) => (
                      <div key={index} className="rounded-card border border-hairline bg-elevated p-3">
                        <select value={subject} onChange={(e) => setElectives((prev) => prev.map((item, i) => i === index ? e.target.value as ScoreKey : item))} className="w-full bg-transparent text-sm text-body outline-none">
                          {SUBJECT_OPTIONS.filter((o) => o.key !== 'toan' && o.key !== 'van').map((option) => <option key={option.key} value={option.key} className="bg-surface text-ink">Tự chọn: {option.label}</option>)}
                        </select>
                        <input type="number" min="0" max="10" step="0.25" value={scores[subject]} onChange={(e) => setScores((prev) => ({ ...prev, [subject]: parseInput(e.target.value) }))} className="mt-2 h-10 w-full rounded-input border border-hairline bg-canvas px-3 text-ink outline-none transition focus:border-blue" />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-semibold uppercase text-ink">2. Học bạ & Ưu tiên</h3>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="rounded-card border border-hairline bg-elevated p-2 sm:p-3">
                      <p className="truncate text-[10px] text-body sm:text-xs">ĐTB Lớp 10</p>
                      <input type="number" min="0" max="10" step="0.1" value={gpa.grade10} onChange={(e) => setGpa((prev) => ({ ...prev, grade10: parseInput(e.target.value) }))} className="mt-2 h-10 w-full rounded-input border border-hairline bg-canvas px-1 text-center text-ink outline-none transition focus:border-blue sm:px-2" />
                    </div>
                    <div className="rounded-card border border-hairline bg-elevated p-2 sm:p-3">
                      <p className="truncate text-[10px] text-body sm:text-xs">ĐTB Lớp 11</p>
                      <input type="number" min="0" max="10" step="0.1" value={gpa.grade11} onChange={(e) => setGpa((prev) => ({ ...prev, grade11: parseInput(e.target.value) }))} className="mt-2 h-10 w-full rounded-input border border-hairline bg-canvas px-1 text-center text-ink outline-none transition focus:border-blue sm:px-2" />
                    </div>
                    <div className="rounded-card border border-hairline bg-elevated p-2 sm:p-3">
                      <p className="truncate text-[10px] text-body sm:text-xs">ĐTB Lớp 12</p>
                      <input type="number" min="0" max="10" step="0.1" value={gpa.grade12} onChange={(e) => setGpa((prev) => ({ ...prev, grade12: parseInput(e.target.value) }))} className="mt-2 h-10 w-full rounded-input border border-hairline bg-canvas px-1 text-center text-ink outline-none transition focus:border-blue sm:px-2" />
                    </div>
                  </div>
                  <div className="rounded-card border border-hairline bg-elevated p-3">
                    <p className="text-sm text-body">Điểm ưu tiên / Khuyến khích (Cộng thêm)</p>
                    <input type="number" min="0" max="5" step="0.25" value={priority} onChange={(e) => setPriority(parseInput(e.target.value))} className="mt-2 h-10 w-full rounded-input border border-hairline bg-canvas px-3 text-ink outline-none transition focus:border-blue" />
                  </div>
                </div>
              </div>

              <div className={`mt-6 flex flex-col items-center justify-between gap-4 rounded-card border border-hairline p-4 text-center sm:flex-row sm:p-5 sm:text-left ${graduationData.passed ? 'bg-green/10' : 'bg-red/10'}`}>
                <div>
                  <p className="text-sm text-mute">Điểm xét tốt nghiệp (ĐXTN)</p>
                  <div className="mt-1 flex justify-center gap-4 text-xs text-mute sm:justify-start">
                    <span>TB Thi: <strong className="text-ink">{round2(graduationData.examAvg)}</strong></span>
                    <span>TB Học bạ: <strong className="text-ink">{round2(graduationData.gpaAvg)}</strong></span>
                  </div>
                </div>
                <div className="text-center sm:text-right">
                  <p className={`text-4xl font-bold ${graduationData.passed ? 'text-green' : 'text-red'}`}>{graduationData.finalScore}</p>
                  <p className={`mt-1 text-sm font-medium ${graduationData.passed ? 'text-green' : 'text-red'}`}>
                    {graduationData.isFailExam ? 'Trượt (Có môn liệt <= 1)' : graduationData.passed ? 'Đủ điều kiện đỗ TN' : 'Trượt (ĐXTN < 5.0)'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </section>
      </div>

      <div className="flex flex-col gap-4 lg:gap-5">
        <section className="group rounded-card border border-hairline bg-surface p-4 shadow-card transition-all duration-200 hover:-translate-y-[2px] hover:border-hairlineHover hover:shadow-hover sm:p-5">
          <p className="text-xs uppercase tracking-[0.24em] text-red">Lịch trình Xét tuyển ĐH</p>
          <div className="mt-5 relative space-y-4 before:absolute before:inset-y-0 before:left-2 before:w-[2px] before:bg-hairline">
            {SCHEDULE.map((item, idx) => (
              <div key={idx} className="relative flex items-start gap-4 pl-6">
                <div className={`absolute left-[3px] top-1.5 h-2 w-2 -translate-x-1/2 rounded-full ring-4 ring-surface bg-${item.tone === 'mute' ? 'ash' : item.tone}`}></div>
                <div>
                  <p className={`text-xs font-semibold text-${item.tone === 'mute' ? 'ash' : item.tone}`}>{item.date}</p>
                  <p className="mt-1 text-sm font-medium text-ink">{item.subject}</p>
                  <p className="mt-0.5 text-xs text-mute">{item.time} · {item.duration}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="group rounded-card border border-hairline bg-surface p-4 shadow-card transition-all duration-200 hover:-translate-y-[2px] hover:border-hairlineHover hover:shadow-hover sm:p-5">
          <p className="text-xs uppercase tracking-[0.24em] text-green">Góc chiến thuật</p>
          <div className="mt-4 space-y-3 text-sm text-body">
            <p>💡 <strong className="text-ink">Quy tắc vàng:</strong> Luôn đặt ngành/trường bạn <b>thích nhất</b> ở NV1, dù điểm dự kiến thấp hơn điểm chuẩn năm ngoái 1-2 điểm.</p>
            <p>💡 <strong className="text-ink">NV An toàn:</strong> Phải có ít nhất 2 nguyện vọng có điểm chuẩn năm trước thấp hơn điểm của bạn từ 2-3 điểm để "lót đường".</p>
            <p>💡 <strong className="text-ink">Lọc ảo:</strong> Hệ thống sẽ xét từ NV1 xuống dưới, đỗ NV nào sẽ dừng lại ở NV đó. Đừng đặt trường "chắc đỗ nhưng không thích" lên trên trường "rất thích nhưng không chắc đỗ"!</p>
          </div>
        </section>
      </div>
    </div>
  );
}

function Metric({ label, value, suffix, tone }: { label: string; value: string; suffix: string; tone: 'red' | 'yellow' | 'blue' | 'green' }) {
  const toneClass = { red: 'text-red', yellow: 'text-yellow', blue: 'text-blue', green: 'text-green' }[tone];
  return (
    <div className="rounded-card border border-hairline bg-canvas/50 p-3 sm:p-4 text-center">
      <p className="truncate text-[10px] uppercase text-mute sm:text-[11px]">{label}</p>
      <p className={`mt-2 text-2xl font-bold sm:text-4xl ${toneClass}`}>{value}</p>
      <p className="mt-1 truncate text-[11px] text-mute">{suffix}</p>
    </div>
  );
}

function subjectLabel(key: string) {
  return ({ toan: 'Toán', van: 'Ngữ Văn', anh: 'Ngoại ngữ', ly: 'Vật lý', hoa: 'Hóa học', sinh: 'Sinh học', su: 'Lịch sử', dia: 'Địa lý', gdcd: 'GDCD', tin: 'Tin học', cn: 'Công nghệ', nk1: 'Năng khiếu 1', nk2: 'Năng khiếu 2' } as Record<string, string>)[key] ?? key;
}

function round2(value: number) { return Math.round(value * 100) / 100; }
