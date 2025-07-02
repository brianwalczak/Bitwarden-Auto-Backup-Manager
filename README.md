### **[[ <a href='https://github.com/BrianWalczak/Bitwarden-Auto-Backup-Manager/releases/latest/download/Bitwarden_Auto-Backup_Manager.exe'>Click here to download the latest release</a> ]]**


# Bitwarden Auto-Backup Manager (Beta)
A robust application that creates local, encrypted auto-backups for your Bitwarden vault without using your master password.

## Features
- Create encrypted backups of your Bitwarden vaults with ease, ensuring that your personal information is safe.
- Enable encrypted automatic backups to occur every day, week, or month to keep your vaults saved.
- Restore your Bitwarden vault from any backup within seconds, helping you access your information freely.
- Your master password is never required to create a new backup, and each backup is automatically created from utilizing the Bitwarden Desktop app (for account authentication **only**) and direct Bitwarden API.
- Manage and back up **multiple Bitwarden accounts** from a single interface, making it easy to keep all your vaults securely backed up in one place.

## Requirements
Before installing the Bitwarden Auto-Backup Manager, you need to have the Bitwarden Desktop app installed locally on your device. If you don't already, click <a href='https://vault.bitwarden.com/download/?app=desktop&platform=windows'>here</a> to download the latest installer for the Bitwarden Desktop app.

Once you install the Bitwarden Desktop app, it's crucial that you login to your vault before you install the Bitwarden Auto-Backup Manager. This step is important, because it allows us to get the necessary information from the Bitwarden Desktop app to sync your vault directly through the Bitwarden API, all without the need of entering your master password.

> **This project currently supports personal Bitwarden accounts, utilizing the PBKDF2 KDF algorithm (Argon2id is NOT supported). You can [click here](https://vault.bitwarden.com/#/settings/security/security-keys) to view and update your current KDF configuration.**
