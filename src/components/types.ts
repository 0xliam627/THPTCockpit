export type LoginResult = {
  token: string;
  userInfo: Record<string, unknown>;
  examCard: Record<string, unknown>;
  soBaoDanh: string;
};

export type TranscriptBundle = {
  transcripts: Record<string, unknown>[];
  userScores: Record<string, number>;
};

