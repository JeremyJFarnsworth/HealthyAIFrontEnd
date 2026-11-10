import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { HistoryRail } from "@/components/HistoryRail";
import { UserMenu } from "@/components/UserMenu";
import { BackendError, USER_COOKIE, backendFetch } from "@/lib/backend";
import type { ConversationSummary } from "@/lib/api";

export const dynamic = "force-dynamic";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const username = (await cookies()).get(USER_COOKIE)?.value ?? "";

  let cases: ConversationSummary[] = [];
  try {
    cases = await backendFetch<ConversationSummary[]>("/chat");
  } catch (e) {
    if (e instanceof BackendError && e.status === 401) redirect("/logout");
    // Backend unreachable: still render the shell; rail shows empty.
  }

  return (
    <div className="home">
      <header className="site-header home-header">
        <UserMenu username={username} />
        <div style={{ flex: 1 }} />
        <span className="wordmark" style={{ fontSize: 15 }}>HealthyAI</span>
      </header>
      <div className="home-body">
        <main className="home-main">{children}</main>
        <HistoryRail cases={cases} />
      </div>
    </div>
  );
}
