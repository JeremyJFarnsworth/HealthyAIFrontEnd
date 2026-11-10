import "server-only";
import { notFound, redirect } from "next/navigation";
import { BackendError, backendFetch } from "./backend";
import type { ConversationDetail } from "./api";

export async function loadCase(caseId: string): Promise<ConversationDetail> {
  if (!/^\d+$/.test(caseId)) notFound();
  try {
    return await backendFetch<ConversationDetail>(`/chat/${caseId}`);
  } catch (e) {
    if (e instanceof BackendError) {
      if (e.status === 401) redirect("/logout");
      if (e.status === 404) notFound();
    }
    throw e;
  }
}
