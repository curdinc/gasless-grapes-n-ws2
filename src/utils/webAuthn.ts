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
}
