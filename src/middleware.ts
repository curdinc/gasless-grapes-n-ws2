import { getServerAuthSession } from "@server/common/get-server-auth-session";
import { Routes } from "@utils/routes";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith(Routes.authBasePath)) {
    const { user } = await getServerAuthSession({
      cookieString: request.headers.get("cookie") ?? undefined,
    });
    if (user?.state === "loggedIn") {
      const redirectUrl = request.nextUrl.searchParams.get(
        Routes.authRedirectQueryParam
      );
      return NextResponse.redirect(
        new URL(redirectUrl ?? Routes.home, request.nextUrl.origin)
      );
    }
  }

  if (Routes.authRequiredPages.includes(request.nextUrl.pathname)) {
    const { user } = await getServerAuthSession({
      cookieString: request.headers.get("cookie") ?? undefined,
    });
    if (user?.state !== "loggedIn") {
      const url = new URL(Routes.signIn, request.nextUrl.origin);
      url.searchParams.set(
        Routes.authRedirectQueryParam,
        request.nextUrl.pathname
      );
      return NextResponse.redirect(url);
    }
  }
}
