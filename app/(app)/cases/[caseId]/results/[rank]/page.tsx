import { notFound } from "next/navigation";
import { ResultDetail } from "@/components/Results";
import { toResults } from "@/lib/api";
import { loadCase } from "@/lib/cases";

export default async function ResultPage({
  params,
}: {
  params: Promise<{ caseId: string; rank: string }>;
}) {
  const { caseId, rank } = await params;
  const c = await loadCase(caseId);
  const results = toResults(c.diagnosis.results);
  const result = results[Number(rank) - 1];
  if (!/^\d+$/.test(rank) || !result) notFound();

  return (
    <div className="scroll">
      <ResultDetail caseId={c.id} result={result} total={results.length} />
    </div>
  );
}
