<h1 align="center">Bitwarden Auto-Backup Manager</h1>

<p align="center">A robust application that creates local, encrypted auto-backups for your Bitwarden vaults without using your master password.<br><br> <a href="LICENSE"><img src="https://img.shields.io/badge/license-Apache%202.0-blue.svg"></a></p>

<img src="https://raw.githubusercontent.com/BrianWalczak/Bitwarden-Auto-Backup-Manager/refs/heads/gh-pages/home.png" height="250" /> <img src="https://raw.githubusercontent.com/BrianWalczak/Bitwarden-Auto-Backup-Manager/refs/heads/gh-pages/backups.png" height="250" /> <img src="https://raw.githubusercontent.com/BrianWalczak/Bitwarden-Auto-Backup-Manager/refs/heads/gh-pages/settings.png" height="250" />

## Features

- Create encrypted backups of your Bitwarden vaults with ease, ensuring that your personal information is safe.
- Enable encrypted automatic backups to occur every day, week, or month to keep your vaults saved.
- Restore your Bitwarden vault from any backup within seconds, helping you access your information freely.
- Your master password is never required to create a new backup, and each backup is automatically created from utilizing the Bitwarden Desktop app (for account authentication **only**) and direct Bitwarden API.
- Manage and back up **multiple Bitwarden accounts** from a single interface, making it easy to keep all your vaults securely backed up in one place.

## Requirements

Before installing the Bitwarden Auto-Backup Manager, you need to have the Bitwarden Desktop app installed locally on your device. If you don't already, click <a href='https://vault.bitwarden.com/download/?app=desktop&platform=windows'>here</a> to download the latest installer for the Bitwarden Desktop app.

Once you install the Bitwarden Desktop app, it's crucial that you login to your vault before you install the Bitwarden Auto-Backup Manager. This step is important, because it allows us to get the necessary information from the Bitwarden Desktop app to sync your vault directly through the Bitwarden API, all without the need of entering your master password.

> [!CAUTION]
> **This project currently supports personal Bitwarden accounts, utilizing the PBKDF2 KDF algorithm (Argon2id is NOT supported). You can [click here](https://vault.bitwarden.com/#/settings/security/security-keys) to view and update your current KDF configuration.**

## Installation

To install the Bitwarden Auto-Backup Manager, simply visit our <a href='https://github.com/BrianWalczak/Bitwarden-Auto-Backup-Manager/releases'>releases page</a> and download the Windows executable. Then, launch the app and configure your settings to enable automatic backups on your device.

We communicate directly with the Bitwarden API to get the latest update of your encrypted Bitwarden vault and save it as a backup with your Bitwarden Desktop configurations (using the active account on the Bitwarden Desktop app).

## Credits/Authors

This project was made possible by utilizing the following dependencies:

- [`electron`](https://www.npmjs.com/package/electron) | This application is powered by Electron and other supported libraries, including [`electron-prompt`](https://www.npmjs.com/package/electron-prompt) and [`jquery`](https://www.npmjs.com/package/jquery), for a seamless user experience.
- [`bitwarden/clients`](https://github.com/bitwarden/clients/tree/main/libs/common/src) | The Bitwarden client library (as well as its dependencies) are utilized to ensure exports are supported by Bitwarden and properly formatted
- [`keytar`](https://www.npmjs.com/package/keytar) | Keytar is a system keychain manager that is utilized to help authenticate your Bitwarden account and create backups. Your Bitwarden account can only be used to download an **encrypted** version of your vault, keeping all of your passwords safe from bad actors.
- [`crypto`](https://www.npmjs.com/package/crypto) | CryptoJS is heavily used during the encryption and decryption process (as well as supported KDF algorithms).

... and much more (refer to the **package.json** for more information)!

## FAQ

### Why do I need to install the Bitwarden Desktop App?

We use the Bitwarden Desktop app to fetch your account configuration when creating a backup. This is crucial, because it's what allows you to decrypt your data at any given time. Despite this, we communicate directly with the direct Bitwarden API to sync your vault and generate an access token.

### Can I manage multiple Bitwarden accounts?

Yes! You can now enable automatic backups and create individual backups for multiple Bitwarden accounts directly within the app. Just make sure each account is added through Bitwarden Desktop before launching the app.

### Will I receive automatic backups if my computer isn't turned on?

No, you will **not** receive backups if your computer isn't turned on. If your device isn't turned on, we won't be able to run in the background and ensure your vault is backed up.

### Do I need to stay connected to the internet for a backup?

Yes, you'll need to be connected to the internet to get the latest version of your vault backed up. To create a backup, we communicate with Bitwarden's API server to get the most recent version of your encrypted vault. Without an internet connection, only your offline vault will be backed up.

### Why are some of my older backups being removed?

If you notice that some of your older backups are being removed from your specified backups folder, this means that your maximum backup threshold has been reached and your old backups are being deleted to free up space for new ones. However, this setting is completely customizable! Simply open the settings tab on the Bitwarden Auto-Backup Manager, and enter a number of your choice under "Number of backups to keep".

### Why isn't this incorporated in the Bitwarden Desktop app by default?

The answer is, nobody knows! At the moment, there is no way to create automatic backups in the Bitwarden Desktop app, which is why this app exists! If you'd like to submit feedback directly to Bitwarden, you can click <a href='https://bitwarden.com/contact/'>here</a>.

### How can I stay informed of future updates?

You don't need to! When launching the Bitwarden Auto-Backup Manager, we will inform you of any critical updates that have been released. Additionally, you can check if you're up-to-date by looking near the bottom of the window.

### I found a bug or would like to submit feedback. How can I do so?

That's awesome to hear! You can submit your feedback or any bugs that you find, on our <a href='https://github.com/BrianWalczak/Bitwarden-Auto-Backup-Manager/issues'>issues page</a>. These are checked very frequently, and we encourage you to find bugs :)

### I love this project, how can I support its maintenance?

I'm glad you find this project useful! If you'd like to support this project and its development, you can send me a donation <a href='https://ko-fi.com/brianwalczak'>here</a> :)
