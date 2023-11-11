import {
  createCipheriv,
  createDecipheriv,
  randomBytes,
  scrypt,
} from "node:crypto";
import { CryptError } from "../utils/CryptError";

export interface CipherOpts {
  algorithm: string;
  keylen: number;
}

export class Cipher {
  readonly algorithm: string = "aes-256-cbc";
  readonly key: string;
  readonly keylen: number = 32;

  constructor(key: string, opts?: CipherOpts) {
    if (!key) throw new CryptError("Missing secret key");

    this.key = key;

    if (
      opts &&
      Object.keys(opts).includes("algorithm") &&
      Object.keys(opts).includes("keylen")
    ) {
      this.algorithm = opts.algorithm;
      this.keylen = opts.keylen;
    }
  }

  static genSalt(length: number = 16): string {
    return randomBytes(length).toString("hex");
  }

  encrypt(data: string, salt: string): Promise<string> {
    const iv = randomBytes(16);

    if (!data || !salt)
      throw new CryptError(
        "Required parameter(s) missing from 'encrypt' method"
      );

    return new Promise((resolve, reject) => {
      scrypt(this.key, salt, this.keylen, (err, key) => {
        if (err) return reject(err);

        const cipher = createCipheriv(this.algorithm, key, iv);

        let encrypted = cipher.update(data, "utf-8", "hex");
        encrypted += cipher.final("hex");

        resolve(`${iv.toString("hex")}.${encrypted}.${salt}`);
      });
    });
  }

  decrypt(encryptedData: string): Promise<string> {
    if (!encryptedData)
      throw new CryptError(
        "Required 'encryptedData' parameter missing from 'decrypt' method"
      );
    if (
      typeof encryptedData !== "string" ||
      encryptedData.split(".").length !== 3
    )
      throw new CryptError("Invalid encrypted data structure");

    const [iv, data, salt] = encryptedData.split(".");

    return new Promise((resolve, reject) => {
      scrypt(this.key, salt, this.keylen, (err, key) => {
        if (err) return reject(err);

        const decipher = createDecipheriv(
          this.algorithm,
          key,
          Buffer.from(iv, "hex")
        );

        let decrypted = decipher.update(data, "hex", "utf-8");
        decrypted += decipher.final("utf8");

        resolve(decrypted);
      });
    });
  }
}
