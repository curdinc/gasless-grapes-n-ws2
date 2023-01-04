import { env } from "@env/server.mjs";
import type { CookieSerializeOptions } from "cookie";
import { parse, serialize } from "cookie";
import dayjs from "dayjs";
import * as jose from "jose";
import type { GetServerSidePropsContext } from "next";
import type { z, ZodType } from "zod";

class JwtCookie {
  protected secret: string;
  protected baseCookieSetting: CookieSerializeOptions = {
    path: "/",
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "lax",
  } as const;

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
        ...this.baseCookieSetting,
        expires: dayjs().add(7, "days").toDate(),
      })
    );
  }
  async expire(res: GetServerSidePropsContext["res"], name: string) {
    res.setHeader(
      "Set-Cookie",
      serialize(name, "", {
        ...this.baseCookieSetting,
        maxAge: 0,
      })
    );
  }
}

export const jwtCookie = new JwtCookie({ secret: env.JWT_SECRET });
