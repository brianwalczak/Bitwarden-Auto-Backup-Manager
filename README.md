# Bitwarden Auto-Backup Manager
A robust application that creates local, encrypted auto-backups for your Bitwarden vault.

## Features
- Create encrypted backups of your Bitwarden Vault with ease, ensuring that your personal information is safe.
- Enable encrypted automatic backups to occur every day, week, or month to keep your vault saved.
- Restore your Bitwarden Vault from any backup within seconds, helping you access your information freely.
- Your master password is never required to create a new backup, and each backup is automatically created from utilizing the Bitwarden Desktop app.

## Requirements
Before installing the Bitwarden Auto-Backup Manager, you need to have the Bitwarden Desktop app installed locally on your device. You must ensure that the Bitwarden Desktop app is **not** installed through the Microsoft Store or the App Store.

If you have it downloaded through the Microsoft Store, you'll need to uninstall it, then click <a href='https://vault.bitwarden.com/download/?app=desktop&platform=windows'>here</a> to download the latest installer for the Bitwarden Desktop app. At this time, we currently only support Windows operating systems due to the background restrictions posed by macOS.

Once you install the Bitwarden Desktop app, it's crucial that you login to your vault before you install the Bitwarden Auto-Backup Manager. This step is important, because it allows us to communicate with the Bitwarden Desktop app and sync your vault automatically, all without the need of entering your master password.

## Installation
To install the Bitwarden Auto-Backup Manager, simply visit our <a href='https://github.com/BrianWalczak/Bitwarden-Auto-Backup-Manager/releases'>releases page</a> and download the Windows executable. Then, launch the app and configure your settings to enable automatic backups on your device.

We communicate directly with the Bitwarden Desktop app to get the latest update of your encrypted Bitwarden vault and save it as a backup.

## FAQ
### Why did my Bitwarden Desktop app randomly close?
During every backup, the Bitwarden Auto-Backup Manager will close all processes of the Bitwarden Desktop app, and relaunch them in the background to ensure that your vault is synced to its latest version. The backup process takes about 5 seconds, so you may re-open the app once the backup is finished. If you disrupt this process, the backup may fail.

### Why is my mouse cursor loading sometimes?
If your mouse cursor starts to load at random times, this means that there's a new background process being launched on your computer. When a new backup is created, this may sometimes occur as we communicate with the Bitwarden Desktop app, but this is completely normal.

### Will I receive automatic backups if my computer isn't turned on?
No, you will **not** receive backups if your computer isn't turned on. If your device isn't turned on, we won't be able to run in the background and ensure your vault is backed up.

### Do I need to stay connected to the internet for a backup?
Yes, you'll need to be connected to the internet to get the latest version of your vault backed up. To create a backup, we communicate with Bitwarden's server to get the most recent version of your encrypted vault. Without an internet connection, only your offline vault will be backed up.

### Why are some of my older backups being removed?
If you notice that some of your older backups are being removed from your specified backups folder, this means that your maximum backup threshold has been reached and your old backups are being deleted to free up space for new ones. However, this setting is completely customizable! Simply open the settings tab on the Bitwarden Auto-Backup Manager, and enter a number of your choice under "Number of backups to keep".

### Why isn't this incorporated in the Bitwarden Desktop app by default?
The answer is, nobody knows! At the moment, there is no way to create automatic backups in the Bitwarden Desktop app, which is why this app exists! If you'd like to submit feedback directly to Bitwarden, you can click <a href='https://bitwarden.com/contact/'>here</a>.

### How can I stay informed of future updates?
You don't need to! When launching the Bitwarden Auto-Backup Manager, we will inform you of any critical updates that have been released. Additionally, you can check if you're up-to-date by looking near the bottom of the window.

### I found a bug or would like to submit feedback. How can I do so?
That's awesome to hear! You can submit your feedback or any bugs that you find, on our <a href='https://github.com/BrianWalczak/Bitwarden-Auto-Backup-Manager/reports'>reports page</a>. These are checked very frequently, and we encourage you to find bugs :)

### I love this project, how can I support its maintenance?
I'm glad you find this project useful! If you'd like to support this project and its development, you can send me a donation <a href='https://buymeacoffee.com/brian'>here</a> :)
