import Link from "next/link";
import { pct, type Result } from "@/lib/api";
import { Tag } from "./ui";

export function ResultsBlock({ caseId, results }: { caseId: number; results: Result[] }) {
  return (
    <div className="results">
      <div className="results-head">
        <span className="results-title">Ranked diagnoses</span>
        <span className="muted">{results.length} candidates · calibrated likelihood</span>
      </div>
      <div className="card-grid">
        {results.map((r) => (
          <Link key={r.rank} href={`/cases/${caseId}/results/${r.rank}`} className="rcard">
            <div className="rcard-top">
              <span className="rcard-rank">#{r.rank}</span>
              <span className="rcard-name">{r.diagnosis}</span>
              <span className="rcard-score">{pct(r.score)}</span>
            </div>
            <div className="bar"><div style={{ width: pct(r.score) }} /></div>
            <div className="tags">
              {r.topSymptoms.map((s) => <Tag key={s}>{s}</Tag>)}
            </div>
          </Link>
        ))}
      </div>
      <div className="muted">Decision support only. Confirm with clinical judgment and the suggested tests.</div>
    </div>
  );
}

export function ResultDetail({ caseId, result, total }: { caseId: number; result: Result; total: number }) {
  return (
    <div className="detail">
      <Link href={`/cases/${caseId}`} className="detail-back">
        <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor" aria-hidden="true"><path d="M7 1v8L2.5 5z" /></svg>
        Back to results
      </Link>
      <div className="detail-head">
        <div style={{ flex: 1, minWidth: 240, display: "flex", flexDirection: "column", gap: 4 }}>
          <span className="muted">Rank #{result.rank} of {total}</span>
          <h1>{result.diagnosis}</h1>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
          <span style={{ fontSize: 37, fontWeight: 600, color: "var(--text-strong)", lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>
            {(result.score * 100).toFixed(1)}%
          </span>
          <span className="muted">Calibrated likelihood</span>
        </div>
      </div>
      <section>
        <h2>Description</h2>
        <p>{result.description}</p>
      </section>
      <section>
        <h2>Common symptoms</h2>
        <div className="tags">{result.symptoms.map((s) => <Tag key={s}>{s}</Tag>)}</div>
      </section>
      <div className="two-up">
        <div className="panel">
          <h2>Recommended treatment plan</h2>
          <ol>{result.treatmentPlan.map((t, i) => <li key={i}>{t}</li>)}</ol>
        </div>
        <div className="panel">
          <h2>Suggested confirmatory tests</h2>
          <ul>{result.confirmatoryTests.map((t, i) => <li key={i}>{t}</li>)}</ul>
        </div>
      </div>
    </div>
  );
}
