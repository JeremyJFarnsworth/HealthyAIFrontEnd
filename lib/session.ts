import "server-only";
import { NextResponse } from "next/server";
import { BACKEND_URL, TOKEN_COOKIE, USER_COOKIE, errorDetail } from "./backend";

const MAX_AGE = 60 * 60; // matches backend jwt_expire_minutes default

export function jsonError(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

/** Exchange credentials for a JWT and return a response carrying session cookies. */
export async function loginAndSetCookies(username: string, password: string) {
  let r: Response;
  try {
    r = await fetch(`${BACKEND_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ username, password }),
      cache: "no-store",
    });
  } catch {
    return jsonError("Could not reach the HealthyAI server.", 503);
  }
  const body = await r.json().catch(() => null);
  if (!r.ok) {
    return jsonError(
      r.status === 401
        ? "Incorrect username or password."
        : errorDetail(body, "Login failed."),
      r.status,
    );
  }
  const res = NextResponse.json({ user: { username } });
  const secure = process.env.NODE_ENV === "production";
  res.cookies.set(TOKEN_COOKIE, body.access_token, {
    httpOnly: true, sameSite: "lax", secure, path: "/", maxAge: MAX_AGE,
  });
  res.cookies.set(USER_COOKIE, username, {
    httpOnly: false, sameSite: "lax", secure, path: "/", maxAge: MAX_AGE,
  });
  return res;
}
