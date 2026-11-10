import { jsonError, loginAndSetCookies } from "@/lib/session";

export async function POST(req: Request) {
  const { username, password } = await req.json().catch(() => ({}));
  if (!username?.trim()) return jsonError("Username is required.", 400);
  if (!password) return jsonError("Password is required.", 400);
  return loginAndSetCookies(username.trim(), password);
}
