# Bitwarden Auto-Backup Manager

A robust application that creates local, encrypted auto-backups for your Bitwarden vaults without using your master password.


## Features

- Create encrypted backups of your Bitwarden vaults with ease, ensuring that your personal information is safe.
- Enable encrypted automatic backups to occur every day, week, or month to keep your vaults saved.
- Restore your Bitwarden vault from any backup within seconds, helping you access your information freely.
- Your master password is never required to create a new backup, and each backup is automatically created from utilizing the Bitwarden Desktop app (for account authentication **only**) and direct Bitwarden API.
- Manage and back up **multiple Bitwarden accounts** from a single interface, making it easy to keep all your vaults securely backed up in one place.


## Requirements

Before installing the Bitwarden Auto-Backup Manager, you need to have the Bitwarden Desktop app installed locally on your device. If you don't already, click <a href='https://vault.bitwarden.com/download/?app=desktop&platform=windows'>here</a> to download the latest installer for the Bitwarden Desktop app.

Once you install the Bitwarden Desktop app, it's crucial that you login to your vault before you install the Bitwarden Auto-Backup Manager. This step is important, because it allows us to get the necessary information from the Bitwarden Desktop app to sync your vault directly through the Bitwarden API, all without the need of entering your master password.


## Installation

To install the Bitwarden Auto-Backup Manager, simply visit our <a href='https://github.com/BrianWalczak/Bitwarden-Auto-Backup-Manager/releases'>releases page</a> and download the Windows executable. Then, launch the app and configure your settings to enable automatic backups on your device.

We communicate directly with the Bitwarden API to get the latest update of your encrypted Bitwarden vault and save it as a backup with your Bitwarden Desktop configurations (using the active account on the Bitwarden Desktop app).
