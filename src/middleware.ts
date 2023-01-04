import { getServerAuthSession } from "@server/common/get-server-auth-session";
import { Routes } from "@utils/routes";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  if (Routes.authPages.includes(request.nextUrl.pathname)) {
    const { user } = await getServerAuthSession({
      cookieString: request.headers.get("cookie") ?? undefined,
    });
    if (user?.state === "loggedIn") {
      const redirectUrl = request.nextUrl.searchParams.get(
        Routes.authRedirectQueryParam
      );
      return NextResponse.redirect(
        new URL(redirectUrl ?? Routes.wallet, request.nextUrl.origin)
      );
    }
  }

  console.log('request.nextUrl.pathname', request.nextUrl.pathname)
  if (Routes.authProtectedPages.includes(request.nextUrl.pathname)) {
    const { user } = await getServerAuthSession({
      cookieString: request.headers.get("cookie") ?? undefined,
    });
    console.log("user", user);
    if (user?.state !== "loggedIn") {
      const url = new URL(Routes.signUp, request.nextUrl.origin);
      url.searchParams.set(
        Routes.authRedirectQueryParam,
        request.nextUrl.pathname
      );
      return NextResponse.redirect(url);
    }
  }
}
