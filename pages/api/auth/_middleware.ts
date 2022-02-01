import { NextMiddleware, NextResponse } from "next/server";

const BLACKLIST = /^\/api\/auth\/(signin|signout|verify-request)(\/|$)/;

export const middleware: NextMiddleware = (req) => {
  const path = req.nextUrl.pathname;

  if (path === "/api/auth/error") {
    const url = req.nextUrl.clone();
    url.pathname = "/auth-error";
    return NextResponse.redirect(url);
  }

  if (req.method === "GET" && BLACKLIST.test(path)) {
    const url = req.nextUrl.clone();
    url.pathname = "/404";
    return NextResponse.rewrite(url);
  } else {
    return NextResponse.next();
  }
};
