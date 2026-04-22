import { Injectable } from "@nestjs/common";
import * as crypto from "crypto";

@Injectable()
export class EncryptionService {
  private readonly algorithm = "aes-256-gcm";
  private readonly key: Buffer;

  constructor() {
    this.key = Buffer.from(process.env.ENCRYPTION_KEY!, "base64");

    if (this.key.length !== 32) {
      throw new Error("ENCRYPTION_KEY must be 32 bytes (base64 encoded)");
    }
  }

  encrypt(plainText: string): string {
    const iv = crypto.randomBytes(12); 

    const cipher = crypto.createCipheriv(this.algorithm, this.key, iv);

    const encrypted = Buffer.concat([
      cipher.update(plainText, "utf8"),
      cipher.final(),
    ]);

    const authTag = cipher.getAuthTag();

    return Buffer.concat([iv, authTag, encrypted]).toString("base64");
  }

  decrypt(payload: string): string {
    const data = Buffer.from(payload, "base64");

    const iv = data.subarray(0, 12);
    const authTag = data.subarray(12, 28);
    const encrypted = data.subarray(28);

    const decipher = crypto.createDecipheriv(this.algorithm, this.key, iv);
    decipher.setAuthTag(authTag);

    const decrypted = Buffer.concat([
      decipher.update(encrypted),
      decipher.final(),
    ]);

    return decrypted.toString("utf8");
  }
}
