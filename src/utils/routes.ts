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
  static wallet = {
    home: "/wallet",
    tokens: `/wallet/tokens`,
    transactions: `/wallet/transactions`,
    walletConnect: `/wallet/wallet-connect`,
    walletConnectToDapp: `/wallet/wallet-connect/connect`,
    settings: `/wallet/settings`,
  };

  // Auth
  static authBasePath = "/auth";
  static signIn = `${Routes.authBasePath}/sign-in`;
  static signUp = `${Routes.authBasePath}/sign-up`;
  static authRedirectQueryParam = "redirectUrl";
  static authErrorQueryParam = "errorMsg";
  static newUser = (userHandle: string) => `/new-user/${userHandle}`;

  static authProtectedPages = [...Object.values(Routes.wallet)];
  static authPages = [Routes.signIn, Routes.signUp, Routes.newUser];

  // New User
  static userNameQueryParam = "username";
}

