import { env } from "@env/client.mjs";

export class Routes {
  static hostname =
    env.NEXT_PUBLIC_NODE_ENV === "staging"
      ? env.NEXT_PUBLIC_VERCEL_URL
      : env.NEXT_PUBLIC_NODE_ENV === "development"
      ? `b588-174-91-116-181.ngrok.io`
      : "gaslessgrapes.com";
  static origin = `https://${Routes.hostname}`;
  static getAbsolutePath(path: string, query?: Record<string, string>) {
    const url = new URL(path, Routes.origin);
    if (query) {
      Object.keys(query).map((key) => {
        url.searchParams.set(key, query[key] as string);
      });
    }
    return url;
  }

  // pages
  static home = "/";
  static wallet = "/wallet";
  static newUser = (userHandle: string) => `/new-user/${userHandle}`;
  static tokens = `${Routes.wallet}/tokens`;
  static transactions = `${Routes.wallet}/transactions`;
  static settings = `${Routes.wallet}/settings`;

  // Auth
  static authProtectedPages = [Routes.wallet];
  static authBasePath = "/auth";
  static signIn = `${Routes.authBasePath}/sign-in`;
  static signUp = `${Routes.authBasePath}/sign-up`;
  static authRedirectQueryParam = "redirectUrl";
  static authErrorQueryParam = "errorMsg";

  // New User
  static userNameQueryParam = "username";
}
