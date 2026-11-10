import "server-only";
import { cookies } from "next/headers";

export const BACKEND_URL = process.env.BACKEND_URL ?? "http://127.0.0.1:8000";
export const TOKEN_COOKIE = "hai_token";
export const USER_COOKIE = "hai_user";

export class BackendError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

/** Pull a human-readable message out of a FastAPI error body. */
export function errorDetail(body: unknown, fallback: string): string {
  const detail = (body as { detail?: unknown } | null)?.detail;
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail) && detail[0]?.msg) return String(detail[0].msg);
  return fallback;
}

/** Authenticated call to FastAPI using the httpOnly session cookie. */
export async function backendFetch<T>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const token = (await cookies()).get(TOKEN_COOKIE)?.value;
  if (!token) throw new BackendError(401, "Not authenticated");

  let res: Response;
  try {
    res = await fetch(`${BACKEND_URL}${path}`, {
      ...init,
      cache: "no-store",
      headers: {
        ...(init.headers ?? {}),
        Authorization: `Bearer ${token}`,
      },
    });
  } catch {
    throw new BackendError(503, "Could not reach the HealthyAI server.");
  }
  const body = await res.json().catch(() => null);
  if (!res.ok) {
    throw new BackendError(
      res.status,
      res.status >= 500
        ? "The analysis service is unavailable right now. Please try again."
        : errorDetail(body, "Request failed."),
    );
  }
  return body as T;
}
