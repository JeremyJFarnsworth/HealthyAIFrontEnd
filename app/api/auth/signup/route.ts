import { BACKEND_URL, errorDetail } from "@/lib/backend";
import { jsonError, loginAndSetCookies } from "@/lib/session";

export async function POST(req: Request) {
  const { username, password } = await req.json().catch(() => ({}));
  if (!username?.trim()) return jsonError("Username is required.", 400);
  if (!password) return jsonError("Password is required.", 400);

  let r: Response;
  try {
    r = await fetch(`${BACKEND_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: username.trim(), password }),
      cache: "no-store",
    });
  } catch {
    return jsonError("Could not reach the HealthyAI server.", 503);
  }
  if (!r.ok) {
    const body = await r.json().catch(() => null);
    return jsonError(
      r.status === 409
        ? "That username is already taken."
        : errorDetail(body, "Could not create account."),
      r.status,
    );
  }
  return loginAndSetCookies(username.trim(), password);
}
