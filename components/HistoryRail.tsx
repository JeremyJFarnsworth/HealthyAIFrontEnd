"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { pct, type ConversationSummary } from "@/lib/api";
import { relativeTime } from "@/lib/time";
import { LinkButton } from "./ui";

export function HistoryRail({ cases }: { cases: ConversationSummary[] }) {
  const params = useParams<{ caseId?: string }>();
  const active = params.caseId;

  return (
    <aside className="rail">
      <div className="rail-top">
        <LinkButton href="/cases" variant="outlined" block>New case</LinkButton>
      </div>
      <div className="rail-label">Case history</div>
      <div className="rail-list">
        {cases.length === 0 && <div className="rail-empty">No cases yet.</div>}
        {cases.map((c) => (
          <Link
            key={c.id}
            href={`/cases/${c.id}`}
            className="rail-row"
            aria-current={active === String(c.id) ? "page" : undefined}
          >
            <span className="rail-title">{c.case_text}</span>
            <span className="rail-meta">
              <span>
                {c.top_diagnosis
                  ? `${c.top_diagnosis}${c.top_score != null ? ` · ${pct(c.top_score)}` : ""}`
                  : "Analyzing…"}
              </span>
              <span>{relativeTime(c.created_at)}</span>
            </span>
          </Link>
        ))}
      </div>
    </aside>
  );
}
