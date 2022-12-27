import { PrismaClient } from "@prisma/client";

import { env } from "../../env/server.mjs";

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

export const prisma =
  global.prisma ||
  new PrismaClient({
    log:
      env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

// swap out the {} with prisma if we want to expose the prisma method
// to the underlying client
export const PrismaObject = {};

if (env.NODE_ENV !== "production") {
  global.prisma = prisma;
}
