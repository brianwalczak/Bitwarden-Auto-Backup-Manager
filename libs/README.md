# Bitwarden Clients

This folder contains essential code sourced directly from the official [Bitwarden Clients repository](https://github.com/bitwarden/clients). These files are required to support vault data structuring, which is used in this application for handling backups and decryption handling.

The code in this directory is **licensed under the [GNU General Public License v3.0 (GPLv3)](https://www.gnu.org/licenses/gpl-3.0.html)**, which is available in the [BW.LICENSE](../BW.LICENSE) file. As a result, this entire project is also licensed under GPLv3. Please refer to this license for the full terms and conditions.

## Purpose

This code enables Bitwarden Auto-Backup Manager to reliably generate encrypted backups that are fully compatible with all Bitwarden clients. Without Bitwarden's open-source clients and API, this project would not have been possible. ❤️

## Compilation

The Bitwarden Auto-Backup Manager relies on select modules from Bitwarden's [`@bitwarden/common`](https://github.com/bitwarden/clients/tree/main/libs/common) library, which is dependent on the [`@bitwarden/sdk-internal`](https://github.com/bitwarden/sdk-internal) package. Rather than compiling the entire `@bitwarden/common` library, only the required exports are bundled via an [entry.ts](entry.ts) entry point using [esbuild](https://esbuild.github.io/).

To replicate the compilation (in this directory):

```bash
git clone https://github.com/bitwarden/clients.git
cd clients
npm ci

cp ../entry.ts .
npx esbuild entry.ts --bundle --platform=node --format=cjs --outfile=../common.cjs --packages=external
```

> All rights to the original code are retained by Bitwarden, Inc. This project does not modify or redistribute the Bitwarden client itself, but utilizes data structuring logic and decryption systems strictly for proper vault formatting.