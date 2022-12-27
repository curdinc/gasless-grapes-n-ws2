import { env } from "@env/client.mjs";
import { Redis } from "@upstash/redis";

export const redis = new Redis({
  url: env.NEXT_PUBLIC_UPSTASH_REDIS_REST_URL,
  token: env.NEXT_PUBLIC_UPSTASH_REDIS_REST_TOKEN,
});
