import { NextResponse } from "next/server";
import { BackendError, backendFetch, TOKEN_COOKIE, USER_COOKIE } from "@/lib/backend";
import type { ConversationDetail } from "@/lib/api";

export const maxDuration = 120;

export async function POST(req: Request) {
  const { text } = await req.json().catch(() => ({}));
  if (typeof text !== "string" || !text.trim()) {
    return NextResponse.json({ error: "Describe the patient case first." }, { status: 400 });
  }
  try {
    const created = await backendFetch<ConversationDetail>("/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ case_text: text.trim() }),
    });
    return NextResponse.json({ caseId: created.id });
  } catch (e) {
    const err = e instanceof BackendError ? e : new BackendError(500, "Unexpected error.");
    const res = NextResponse.json({ error: err.message }, { status: err.status });
    if (err.status === 401) {
      res.cookies.delete(TOKEN_COOKIE);
      res.cookies.delete(USER_COOKIE);
    }
    return res;
  }
}
