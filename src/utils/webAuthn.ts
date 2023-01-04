import { Routes } from "./routes";

export class WebAuthnUtils {
  static bufferToHexString(value: Buffer): string {
    return value.toString("hex");
  }
  static hexStringToBuffer(value: string): Buffer {
    return Buffer.from(value, "hex");
  }
  static base64UrlToHexString(value: string): string {
    return Buffer.from(value, "base64url").toString("hex");
  }
  static redirectUser(redirectUrl: unknown, verified: boolean) {
    if (typeof redirectUrl === "string") {
      console.log("redirecting to ", redirectUrl);
      location.href = redirectUrl;
    } else if (verified) {
      console.log("redirecting to wallet");
      location.href = Routes.wallet;
    } else if (!verified) {
      console.log("redirecting to homepage");
      location.href = Routes.home;
    }
  }
}
