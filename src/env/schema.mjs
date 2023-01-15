// @ts-check
import { z } from "zod";

/**
 * Specify your server-side environment variables schema here.
 * This way you can ensure the app isn't built with invalid env vars.
 */
export const serverSchema = z.object({
  DATABASE_URL: z.string().url(),
  DATABASE_SHADOW_URL: z.string().url(),
  NODE_ENV: z.enum(["development", "test", "production"]),
  VERCEL_URL: z.string(),
  JWT_SECRET: z.string().min(1),
  NEXTAUTH_SECRET:
    process.env.NODE_ENV === "production"
      ? z.string().min(1)
      : z.string().min(1).optional(),
  NEXTAUTH_URL: z.preprocess(
    // This makes Vercel deployments not fail if you don't set NEXTAUTH_URL
    // Since NextAuth.js automatically uses the VERCEL_URL if present.
    (str) => process.env.NEXTAUTH_URL ?? process.env.VERCEL_URL ?? str,
    // VERCEL_URL doesn't include `https` so it cant be validated as a URL
    process.env.VERCEL ? z.string() : z.string().url()
  ),
  DISCORD_CLIENT_ID: z.string(),
  DISCORD_CLIENT_SECRET: z.string(),
  OPEN_ZEPPELIN_SECRET_KEY: z.string(),
  OPEN_ZEPPELIN_API_KEY: z.string(),
  SCW_WALLET_FACTORY: z.string(),
  SCW_WALLET_BEACON: z.string(),
  SCW_WALLET_BEACON_UPGRADEABLE: z.string(),
});

/**
 * You can't destruct `process.env` as a regular object, so you have to do
 * it manually here. This is because Next.js evaluates this at build time,
 * and only used environment variables are included in the build.
 * @type {{ [k in keyof z.infer<typeof serverSchema>]: z.infer<typeof serverSchema>[k] | undefined }}
 */
export const serverEnv = {
  DATABASE_URL: process.env.DATABASE_URL,
  DATABASE_SHADOW_URL: process.env.DATABASE_SHADOW_URL,
  NODE_ENV: process.env.NODE_ENV,
  VERCEL_URL: process.env.VERCEL_URL,
  JWT_SECRET: process.env.JWT_SECRET,
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
  NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  DISCORD_CLIENT_ID: process.env.DISCORD_CLIENT_ID,
  DISCORD_CLIENT_SECRET: process.env.DISCORD_CLIENT_SECRET,
  OPEN_ZEPPELIN_API_KEY: process.env.OPEN_ZEPPELIN_API_KEY,
  OPEN_ZEPPELIN_SECRET_KEY: process.env.OPEN_ZEPPELIN_SECRET_KEY,
  SCW_WALLET_FACTORY: process.env.SCW_WALLET_FACTORY,
  SCW_WALLET_BEACON: process.env.SCW_WALLET_BEACON,
  SCW_WALLET_BEACON_UPGRADEABLE: process.env.SCW_WALLET_BEACON_UPGRADEABLE,
};

/**
 * Specify your client-side environment variables schema here.
 * This way you can ensure the app isn't built with invalid env vars.
 * To expose them to the client, prefix them with `NEXT_PUBLIC_`.
 */
export const clientSchema = z.object({
  NEXT_PUBLIC_UPSTASH_REDIS_REST_URL: z.string(),
  NEXT_PUBLIC_UPSTASH_REDIS_REST_TOKEN: z.string(),
  NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID: z.string().min(1),
  NEXT_PUBLIC_WALLET_CONNECT_RELAY_URL: z.string().min(1),
  NEXT_PUBLIC_ALCHEMY_MAINNET_API_KEY: z.string().min(1),
  NEXT_PUBLIC_ALCHEMY_GOERLI_API_KEY: z.string().min(1),
  NEXT_PUBLIC_ALCHEMY_POLYGON_API_KEY: z.string().min(1),
  NEXT_PUBLIC_ALCHEMY_MUMBAI_API_KEY: z.string().min(1),
  NEXT_PUBLIC_TENDERLY_API_KEY: z.string().min(1),
});

/**
 * You can't destruct `process.env` as a regular object, so you have to do
 * it manually here. This is because Next.js evaluates this at build time,
 * and only used environment variables are included in the build.
 * @type {{ [k in keyof z.infer<typeof clientSchema>]: z.infer<typeof clientSchema>[k] | undefined }}
 */
export const clientEnv = {
  NEXT_PUBLIC_ALCHEMY_MAINNET_API_KEY:
    process.env.NEXT_PUBLIC_ALCHEMY_MAINNET_API_KEY,
  NEXT_PUBLIC_ALCHEMY_GOERLI_API_KEY:
    process.env.NEXT_PUBLIC_ALCHEMY_GOERLI_API_KEY,
  NEXT_PUBLIC_ALCHEMY_POLYGON_API_KEY:
    process.env.NEXT_PUBLIC_ALCHEMY_POLYGON_API_KEY,
  NEXT_PUBLIC_ALCHEMY_MUMBAI_API_KEY:
    process.env.NEXT_PUBLIC_ALCHEMY_MUMBAI_API_KEY,
  NEXT_PUBLIC_TENDERLY_API_KEY: process.env.NEXT_PUBLIC_TENDERLY_API_KEY,
  NEXT_PUBLIC_UPSTASH_REDIS_REST_URL:
    process.env.NEXT_PUBLIC_UPSTASH_REDIS_REST_URL,
  NEXT_PUBLIC_UPSTASH_REDIS_REST_TOKEN:
    process.env.NEXT_PUBLIC_UPSTASH_REDIS_REST_TOKEN,
  NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID:
    process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID,
  NEXT_PUBLIC_WALLET_CONNECT_RELAY_URL:
    process.env.NEXT_PUBLIC_WALLET_CONNECT_RELAY_URL,
};
