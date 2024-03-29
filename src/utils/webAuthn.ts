import { env } from "@env/client.mjs";
import { getDefaultProvider, Wallet } from "ethers";
import type { SupportedChainIdsType } from "types/schema/blockchain/chains";
import { ClientEncryption } from "./clientEncryption";
import { Links } from "./links";
import { ErrorMessages } from "./messages";
import { Routes } from "./routes";
import { vanillaTrpcClient } from "./trpc";

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

  static async getAssociatedEoaWallet({
    chainId,
  }: {
    chainId: SupportedChainIdsType;
  }) {
    try {
      const eoaWallet =
        await vanillaTrpcClient.user.getCurrentEoaWallet.query();
      if (!eoaWallet.privateKey) {
        throw new Error(ErrorMessages.missingEoaWalletPrivateKey);
      }
      return new Wallet(
        await new ClientEncryption({
          pwd: env.NEXT_PUBLIC_EOA_ENCRYPTION_KEY,
        }).decrypt(eoaWallet.privateKey),
        getDefaultProvider(Links.rpcUrl({ chainId }))
      );
    } catch (e) {
      console.error("Error getting associated device wallet");
      return null;
    }
  }
}
