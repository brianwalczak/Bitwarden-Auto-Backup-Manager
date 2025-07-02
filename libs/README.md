# Bitwarden Clients

This folder contains essential code sourced directly from the official [Bitwarden Clients repository](https://github.com/bitwarden/clients). These files are required to support vault data structuring, which is used in this application for handling backups and decryption handling.

The code in this directory is **licensed under the Bitwarden Client License**, which is available in the [BW.LICENSE.txt](../BW.LICENSE.txt) file in this folder. Please refer to this license for the full terms and conditions.

## Purpose

This code enables Bitwarden Auto-Backup Manager to reliably generate encrypted backups that are fully compatible with all Bitwarden clients. Without Bitwarden's open-source clients and API, this project would not have been possible. ❤️

## Compilation

The Bitwarden Auto-Backup Manager relies on Bitwarden’s [`@bitwarden/common`](https://github.com/bitwarden/clients/tree/main/libs/common) library, which has been compiled using TypeScript (`tsc`) into compatible JavaScript included here.

To replicate the same compilation setup, use `npm run build` in the `libs/common/` folder. You may need to modify the `tsconfig.base.json` to compile with CommonJS (**danger**).

> All rights to the original code are retained by Bitwarden, Inc. This project does not modify or redistribute the Bitwarden client itself, but utilizes data structuring logic and decryption systems strictly for proper vault formatting.