import { getDefaultProvider, Wallet } from "ethers";
import { Links } from "./links";
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
      location.href = Routes.wallet.home;
    } else if (!verified) {
      console.log("redirecting to homepage");
      location.href = Routes.home;
    }
  }

  static registerNewEoaToStorage(
    userId: string,
    deviceName: string,
    privateKey: string
  ) {
    if (localStorage) {
      localStorage.setItem(`${userId}-${deviceName}`, privateKey);
      return true;
    }
    return false;
  }
  static getAssociatedEoaWallet({
    userId,
    deviceName,
    chainId,
  }: {
    userId: string;
    deviceName: string;
    chainId: number;
  }) {
    if (localStorage) {
      const privateKey = localStorage.getItem(`${userId}-${deviceName}`);
      if (!privateKey) {
        return null;
      }
      return new Wallet(
        privateKey,
        getDefaultProvider(Links.rpcUrl({ chainId }))
      );
    }
    return null;
  }
}
