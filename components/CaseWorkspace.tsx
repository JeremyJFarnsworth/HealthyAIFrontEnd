"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { Button, Spinner } from "./ui";

const TIMEOUT_MS = 120_000;
const SLOW_MS = 15_000;

/** New-case screen: empty state, composer, and the in-flight user bubble + spinner. */
export function CaseWorkspace() {
  const router = useRouter();
  const [draft, setDraft] = useState("");
  const [submitted, setSubmitted] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [slow, setSlow] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [submitted, error]);

  async function submit(text: string) {
    setSubmitted(text);
    setError("");
    setSlow(false);
    const slowTimer = setTimeout(() => setSlow(true), SLOW_MS);
    const ctrl = new AbortController();
    const abort = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
    try {
      const res = await fetch("/api/cases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
        signal: ctrl.signal,
      });
      const body = await res.json().catch(() => ({}));
      if (res.status === 401) {
        router.replace("/login");
        return;
      }
      if (!res.ok) throw new Error(body.error ?? "The analysis failed.");
      router.push(`/cases/${body.caseId}`);
      router.refresh(); // refresh the history rail
    } catch (e) {
      setError(
        e instanceof DOMException && e.name === "AbortError"
          ? "The analysis took too long. Please try again."
          : e instanceof Error ? e.message : "The analysis failed.",
      );
    } finally {
      clearTimeout(slowTimer);
      clearTimeout(abort);
    }
  }

  function onSubmit(e?: FormEvent) {
    e?.preventDefault();
    const text = draft.trim();
    if (!text || (submitted && !error)) return;
    setDraft("");
    void submit(text);
  }

  function onKey(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSubmit();
    }
  }

  const busy = submitted !== null && !error;

  return (
    <>
      <div className="scroll" ref={scrollRef}>
        {submitted === null ? (
          <div className="empty">
            <h1>Describe a patient case</h1>
          </div>
        ) : (
          <div className="thread">
            <div className="bubble-wrap">
              <div className="bubble">{submitted}</div>
            </div>
            {busy && (
              <div className="loading-row">
                <Spinner />
                <span>
                  {slow
                    ? "Still analyzing — this is taking longer than usual…"
                    : "Analyzing case — scoring candidate diagnoses…"}
                </span>
              </div>
            )}
            {error && (
              <div role="alert" className="alert" style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ flex: 1 }}>{error}</span>
                <Button variant="outlined" size="sm" onClick={() => void submit(submitted)}>Retry</Button>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="composer-wrap">
        <form className="composer" onSubmit={onSubmit}>
          <textarea
            rows={2}
            value={draft}
            placeholder="Enter text here"
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={onKey}
            disabled={busy}
          />
          <div className="composer-bar">
            <span className="hint">Enter to submit · Shift+Enter for new line</span>
            <Button type="submit" variant="primary" disabled={!draft.trim() || busy}>Analyze case</Button>
          </div>
        </form>
      </div>
    </>
  );
}
