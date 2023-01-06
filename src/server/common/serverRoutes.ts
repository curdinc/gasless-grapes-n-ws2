import { env } from "@env/server.mjs";

export class ServerRoutes {
  static serverHostname =
    env.NODE_ENV === "development"
      ? `localhost`
      : env.NODE_ENV === "test"
      ? env.VERCEL_URL
      : "gaslessgrapes.com";
}
