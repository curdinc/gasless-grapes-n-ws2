export class Routes {
  static getAbsolutePath(path: string, query?: Record<string, string>) {
    const basePath = location.origin;
    const url = new URL(path, basePath);
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
