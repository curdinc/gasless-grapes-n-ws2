import { env } from "@env/server.mjs";
import { parse, serialize } from "cookie";
import dayjs from "dayjs";
import * as jose from "jose";
import type { GetServerSidePropsContext } from "next";
import type { z, ZodType } from "zod";

export class JwtCookie {
  protected secret: string;
  constructor({ secret }: { secret: string }) {
    this.secret = secret;
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async get<T extends ZodType<any, any, any>>({
    cookieString,
    name,
    schema,
  }: {
    cookieString: string | undefined;
    name: string;
    schema: T;
  }): Promise<z.infer<T> | null> {
    if (!cookieString) {
      return null;
    }
    const cookies = parse(cookieString);
    const token = cookies[name];
    if (!token) {
      return null;
    }
    const { payload } = await jose.jwtVerify(
      token,
      new TextEncoder().encode(this.secret)
    );
    return schema.parse(payload);
  }
  async set<T extends jose.JWTPayload>(
    res: GetServerSidePropsContext["res"],
    name: string,
    data: T
  ) {
    const signedData = await new jose.SignJWT(data)
      .setIssuedAt()
      .setExpirationTime("8d")
      .setProtectedHeader({ alg: "HS256" })
      .sign(new TextEncoder().encode(this.secret));
    res.setHeader(
      "Set-Cookie",
      serialize(name, signedData, {
        path: "/",
        expires: dayjs().add(7, "days").toDate(),
        httpOnly: true,
        secure: env.NODE_ENV === "production",
        sameSite: "lax",
      })
    );
  }
}
