import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const hostname = req.headers.get("host") || "";

  // Kalau admin.catatin.ai → redirect ke /dashboard-admin
  if (hostname === "admin.catatin.ai" && url.pathname === "/") {
    url.pathname = "/dashboard-admin";
    return NextResponse.redirect(url);
  }

  // Kalau app.catatin.ai → redirect ke /dashboard-user
  if (hostname === "app.catatin.ai" && url.pathname === "/") {
    url.pathname = "/dashboard-user";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}
