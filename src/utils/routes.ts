export class Routes {
  static getAbsolutePath(path: string, query?: Record<string, string>) {
    const url = new URL(path, location.origin);
    if (query) {
      Object.keys(query).map((key) => {
        url.searchParams.set(key, query[key] as string);
      });
    }
    return url;
  }

  // pages
  static home = "/";

  // Wallet Pages
  static wallet = "/wallet";
  static tokens = `${Routes.wallet}/tokens`;
  static transactions = `${Routes.wallet}/transactions`;
  static walletConnect = `${Routes.wallet}/wallet-connect`;
  static walletConnectToDapp = `${Routes.walletConnect}/connect`;
  static settings = `${Routes.wallet}/settings`;

  // Auth
  static authBasePath = "/auth";
  static signIn = `${Routes.authBasePath}/sign-in`;
  static signUp = `${Routes.authBasePath}/sign-up`;
  static authRedirectQueryParam = "redirectUrl";
  static authErrorQueryParam = "errorMsg";
  static newUser = (userHandle: string) => `/new-user/${userHandle}`;

  static authProtectedPages = [Routes.wallet];
  static authPages = [Routes.signIn, Routes.signUp, Routes.newUser];

  // New User
  static userNameQueryParam = "username";
}
