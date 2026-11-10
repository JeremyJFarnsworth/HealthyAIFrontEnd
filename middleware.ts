import { NextResponse, type NextRequest } from "next/server";

const TOKEN_COOKIE = "hai_token";

export function middleware(req: NextRequest) {
  const authed = Boolean(req.cookies.get(TOKEN_COOKIE)?.value);
  const { pathname } = req.nextUrl;
  const isAuthPage = pathname === "/login" || pathname === "/signup";

  if (!authed && !isAuthPage) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
  if (authed && isAuthPage) {
    return NextResponse.redirect(new URL("/cases", req.url));
  }
  return NextResponse.next();
}

export const config = { matcher: ["/cases/:path*", "/login", "/signup"] };
