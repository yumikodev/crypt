# @yumiko0828/crypt

This is a personal module containing some utility functions from `node:crypto`.

## Table of Content

- [Install](#install)
- [Classes](#classes)
  - [`Cipher`](#cipher)
  - [`DigSign`](#digsign)

## Install

Install with NPM or your favorite package manager (yarn, pnpm, etc).

```sh
npm i -E @yumiko0828/crypt
```

### Import

> Optionally you can apply object destructuring.

CommonJs:

```cjs
const Crypt = require("@yumiko0828/crypt");
```

ESModules:

```mjs
import * as Crypt from "@yumiko0828/crypt";
```

## Classes

This module provides 2 relevant classes, `Cipher` and `DigSign`.

### Cipher

Provides data encryption and decryption utilities (an improved version of npm `yutil.js@1.0.5`).

#### Basic usage:

```mjs
import { Cipher } from "@yumiko0828/crypt";

const cipher = new Cipher("your-secret-key-here");

/**
 * Encrypt data:
 */
const salt = Cipher.genSalt(/* default = 16 */);
const encryptedData = cipher.encrypt("Hola mundo!", salt);

console.log(encryptedData);
// Example: b8340697d3ef8c2294515...

/**
 * Decrypt data:
 */
const decryptedData = cipher.decrypt(encryptedData);

console.log(decrypteddata);
// Show: Hola mundo!
```

### DigSign

Provides methods to create and verify digital signatures.

### Basic usage:

```mjs
import { DigSign } from "@yumiko0828/crypt";

// Important!
const { privateKey, publicKey } = await DigSign.genKeyPair();

const digsin = new DigSign({
  privateKey,
  publicKey,
});

/**
 * Generate a digital signature:
 */
const sign = digsin.signData("Hello World!");
console.log(sign);
// Example: 869407afeb6e15c...

/**
 * Verify the digital signature:
 */
const isValidSign = digsin.verifySign("Hello world!", sign);
console.log(isValidSign);
// Show: false (or true)
```

## License

This project uses the MIT license.
