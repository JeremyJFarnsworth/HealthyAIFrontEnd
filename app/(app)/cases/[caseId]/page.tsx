import { ResultsBlock } from "@/components/Results";
import { toResults } from "@/lib/api";
import { loadCase } from "@/lib/cases";

export default async function CasePage({ params }: { params: Promise<{ caseId: string }> }) {
  const { caseId } = await params;
  const c = await loadCase(caseId);
  const results = toResults(c.diagnosis.results);

  return (
    <div className="scroll">
      <div className="thread">
        <div className="bubble-wrap">
          <div className="bubble">{c.case_text}</div>
        </div>
        <ResultsBlock caseId={c.id} results={results} />
      </div>
    </div>
  );
}
