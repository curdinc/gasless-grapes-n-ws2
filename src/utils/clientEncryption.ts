export class ClientEncryption {
  private ENCRYPTION_SEPARATOR = ":";
  private pwd: string;

  constructor({ pwd }: { pwd: string }) {
    this.pwd = pwd;
  }

  // Client Side Share encryption and decryption
  protected getKeyMaterial() {
    const enc = new TextEncoder();
    return crypto.subtle.importKey(
      "raw",
      enc.encode(this.pwd),
      "PBKDF2",
      false,
      ["deriveBits", "deriveKey"]
    );
  }

  protected async getEncryptionKey(salt: ArrayBuffer) {
    const keyMaterial = await this.getKeyMaterial();
    return crypto.subtle.deriveKey(
      {
        name: "PBKDF2",
        salt,
        iterations: 100000,
        hash: "SHA-256",
      },
      keyMaterial,
      { name: "AES-GCM", length: 256 },
      true,
      ["encrypt", "decrypt"]
    );
  }

  protected bufferToBase64(arrayBuffer: ArrayBuffer): string {
    return Buffer.from(arrayBuffer).toString("base64");
  }

  protected base64ToBuffer(base64String: string): ArrayBuffer {
    return Buffer.from(base64String, "base64");
  }

  async encrypt(share: string): Promise<string> {
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const key = await this.getEncryptionKey(salt);

    const normalizedShare = new TextEncoder().encode(share);

    // why 12 bytes for iv https://crypto.stackexchange.com/questions/41601/aes-gcm-recommended-iv-size-why-12-bytes
    const iv = crypto.getRandomValues(new Uint8Array(12));
    // https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/encrypt
    const encryptedValue = await crypto.subtle.encrypt(
      { name: "AES-GCM", iv },
      key,
      normalizedShare
    );

    return `${this.bufferToBase64(encryptedValue)}${
      this.ENCRYPTION_SEPARATOR
    }${this.bufferToBase64(iv)}${
      this.ENCRYPTION_SEPARATOR
    }${this.bufferToBase64(salt)}`;
  }

  async decrypt(encryptedShareDetails: string): Promise<string> {
    const [encryptedShare, iv, salt] = encryptedShareDetails.split(
      this.ENCRYPTION_SEPARATOR
    );
    if (!salt || !encryptedShare || !iv) {
      throw new Error("INVALID ENCRYPTED SHARE GIVEN");
    }

    const key = await this.getEncryptionKey(this.base64ToBuffer(salt));

    const normalizedEncryptedShare = this.base64ToBuffer(encryptedShare);
    const normalizedShare = await crypto.subtle.decrypt(
      {
        name: "AES-GCM",
        iv: this.base64ToBuffer(iv),
      },
      key,
      normalizedEncryptedShare
    );

    return new TextDecoder().decode(normalizedShare);
  }
}
