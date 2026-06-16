import type { ExamCard, Transcript } from './thpt-api';

type ExamCardEnvelope = { theDuThi?: ExamCard | null };

function hasExamCardEnvelope(value: ExamCardEnvelope | ExamCard): value is ExamCardEnvelope {
  return Object.prototype.hasOwnProperty.call(value, 'theDuThi');
}

export function extractSoBaoDanh(examCard?: ExamCardEnvelope | ExamCard | null) {
  if (!examCard) return '';
  if (hasExamCardEnvelope(examCard)) return String(examCard.theDuThi?.soBaoDanh ?? '').trim();
  return String(examCard.soBaoDanh ?? '').trim();
}

const SUBJECT_MAP: Record<string, string[]> = {
  TOAN: ['toaN'],
  VAN: ['vaN'],
  ANH: ['ngoaingU', 'cnnN'],
  SU: ['sU'],
  DIA: ['diA'],
  GDKTPL: ['ktpL', 'gdcD'],
  LI: ['lY'],
  HOA: ['hoA'],
  SINH: ['sinH'],
  TIN: ['tiN'],
  CONG_NGHE: ['cncN', 'cnnN'],
};

const TERM_MAP = {
  HK_1: ['_HKI', '_KYI'],
  HK_2: ['_HKII', '_KYII'],
};

function valueFor(transcript: Transcript | undefined, prefixes: string[], suffixes: string[]) {
  if (!transcript) return undefined;
  for (const prefix of prefixes) {
    for (const suffix of suffixes) {
      const value = transcript[`${prefix}${suffix}`];
      if (value !== null && value !== undefined && value !== '') return Number(value);
    }
  }
  return undefined;
}

export function transcriptsToTuyenSinhScores(transcripts: Transcript[]) {
  const byLop = new Map(transcripts.map((transcript) => [String(transcript.lop), transcript]));
  const userScores: Record<string, number> = { sub_method: 5 };

  for (const lop of ['10', '11', '12']) {
    const transcript = byLop.get(lop);
    for (const [subject, prefixes] of Object.entries(SUBJECT_MAP)) {
      for (const [term, suffixes] of Object.entries(TERM_MAP)) {
        const value = valueFor(transcript, prefixes, suffixes);
        if (typeof value === 'number' && Number.isFinite(value)) userScores[`${subject}_${lop}_${term}`] = value;
      }
    }
  }

  return userScores;
}
