// Types mirror the FastAPI contracts (healthy.api.schemas / healthy.llm.schemas).

export type RawDiagnosis = {
  diagnosis: string;
  score: number;
  description: string;
  common_symptoms: string[];
  treatment_plan: string;
  suggested_tests: string[];
};

export type ConversationSummary = {
  id: number;
  case_text: string;
  created_at: string;
  top_diagnosis: string | null;
  top_score: number | null;
};

export type ConversationDetail = {
  id: number;
  case_text: string;
  created_at: string;
  diagnosis: { results: RawDiagnosis[] };
};

export type Result = {
  rank: number;
  diagnosis: string;
  score: number;
  topSymptoms: string[];
  description: string;
  symptoms: string[];
  treatmentPlan: string[];
  confirmatoryTests: string[];
};

/** The backend returns the treatment plan as one string; split it into steps. */
export function splitPlan(plan: string): string[] {
  const text = plan.trim();
  if (!text) return [];
  const marker = /^\s*(?:\d+[.)]|[-•*])\s+/;
  let parts = text.split(/\r?\n+/);
  if (parts.length === 1) {
    // "1. foo 2. bar" on a single line
    const inline = text.split(/\s+(?=\d+[.)]\s)/);
    if (inline.length > 1) parts = inline;
  }
  return parts.map((p) => p.replace(marker, "").trim()).filter(Boolean);
}

export function toResults(raw: RawDiagnosis[]): Result[] {
  return raw.map((r, i) => ({
    rank: i + 1,
    diagnosis: r.diagnosis,
    score: r.score,
    topSymptoms: r.common_symptoms.slice(0, 3),
    description: r.description,
    symptoms: r.common_symptoms,
    treatmentPlan: splitPlan(r.treatment_plan),
    confirmatoryTests: r.suggested_tests,
  }));
}

export const pct = (p: number) => `${Math.round(p * 100)}%`;
