import { env } from "@env/client.mjs";

export class Routes {
  static origin = env.NEXT_PUBLIC_VERCEL_URL
    ? env.NEXT_PUBLIC_VERCEL_URL
    : env.NEXT_PUBLIC_NODE_ENV === "development"
    ? `b4dc-142-189-10-126.ngrok.io`
    : "gaslessgrapes.com";
  static baseUrl = `https://${Routes.origin}`;
  static getAbsolutePath(path: string, query?: Record<string, string>) {
    const url = new URL(path, Routes.baseUrl);
    if (query) {
      Object.keys(query).map((key) => {
        url.searchParams.set(key, query[key] as string);
      });
    }
    return url;
  }
  static home = "/";
  static wallet = "/wallet";

  // Auth
  static authBasePath = "/auth";
  static signIn = `${Routes.authBasePath}/sign-in`;
  static signUp = `${Routes.authBasePath}/sign-up`;
}
