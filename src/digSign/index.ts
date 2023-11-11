import {
  createSign,
  createVerify,
  generateKeyPair,
  generateKeyPairSync,
} from "node:crypto";
import { CryptError } from "../utils/CryptError";

export type DigSignOpts = Record<"privateKey" | "publicKey", string>;

export type GenKeyPairResult = Record<"publicKey" | "privateKey", string>;

export class DigSign {
  private privateKey: string;
  public publicKey: string;

  constructor(opts: DigSignOpts) {
    if (!opts) throw new CryptError("Missing digit signature options");
    if (!opts.privateKey) throw new CryptError("Missing private key");
    if (!opts.publicKey) throw new CryptError("Missing public key");

    this.privateKey = opts.privateKey;
    this.publicKey = opts.publicKey;
  }

  static genKeyPair(): Promise<GenKeyPairResult> {
    return new Promise((resolve, reject) =>
      generateKeyPair(
        "rsa",
        {
          modulusLength: 2048,
          publicKeyEncoding: { type: "spki", format: "pem" },
          privateKeyEncoding: { type: "pkcs8", format: "pem" },
        },
        (err, publicKey, privateKey) => {
          if (err) return reject(err);

          resolve({
            publicKey,
            privateKey,
          });
        }
      )
    );
  }

  static genKeyPairSync(): GenKeyPairResult {
    return generateKeyPairSync("rsa", {
      modulusLength: 2048,
      publicKeyEncoding: { type: "spki", format: "pem" },
      privateKeyEncoding: { type: "pkcs8", format: "pem" },
    });
  }

  signData(data: string): string {
    if (!data)
      throw new CryptError(
        "Missing 'data' required parameter from 'signData' method"
      );

    const sign = createSign("SHA256");
    sign.update(data);
    return sign.sign(this.privateKey, "hex");
  }

  verifySign(data: string, signature: string): boolean {
    if (!data || !signature)
      throw new CryptError(
        "Missing required parameter(s) from 'verifyData' method"
      );

    const verify = createVerify("SHA256");
    verify.update(data);
    return verify.verify(this.publicKey, signature, "hex");
  }
}
