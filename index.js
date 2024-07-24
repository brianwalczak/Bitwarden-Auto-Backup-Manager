const { app, BrowserWindow, Menu, Notification, ipcMain, shell, dialog } = require('electron');
const { exec, spawn } = require('child_process');
const prompt = require('electron-prompt');
const keytar = require('keytar');
const fs = require('fs');
const path = require('path');
const os = require('os');

const { exportVault } = require('./vault/export'); // Exports a user vault from their Bitwarden Desktop configuration
const { restoreBackup } = require('./vault/restore'); // Restores a user vault from their KDF iteration and master password (w/ PBKDF2 only)

let dataPath; // User path to Bitwarden Desktop data.json file (will be defined later)
let settingsPath = path.join(app.getPath('userData'), 'settings.json'); // User app configuration file

// The code below is used so that there's never more than one process of the app running
// It also ensures that, at the same time, it's always running, whether in the foreground or as a background process
// This is required so that the app can periodically check if it's time for a backup

let win = null; // Global variable to hold the window instance
const isFirstInstance = app.requestSingleInstanceLock(); // Check if this instance is the first instance or a second instance

if (!isFirstInstance) {
    // If this process not the first instance, force quit
    process.exit();
} else {
    // If we are the first instance, create the window and detect for other instances
	
    app.on('second-instance', (event, commandLine, workingDirectory) => {
        // Someone tried to run a second instance while this one is already open, focus the existing window
        if (win) {
            win.show();
			win.reload();
            win.focus();
        }
    });

    // Create the window when the app is ready
    app.whenReady().then(createWindow);
}

// Complex function to compare versions (written by Viktor)
function compareVersions(v1, comparator, v2) {
    "use strict";
    var comparator = comparator == '=' ? '==' : comparator;
    if(['==','===','<','<=','>','>=','!=','!=='].indexOf(comparator) == -1) {
        throw new Error('Invalid comparator. ' + comparator);
    }
    var v1parts = v1.split('.'), v2parts = v2.split('.');
    var maxLen = Math.max(v1parts.length, v2parts.length);
    var part1, part2;
    var cmp = 0;
    for(var i = 0; i < maxLen && !cmp; i++) {
        part1 = parseInt(v1parts[i], 10) || 0;
        part2 = parseInt(v2parts[i], 10) || 0;
        if(part1 < part2)
            cmp = 1;
        if(part1 > part2)
            cmp = -1;
    }
    return eval('0' + comparator + cmp);
}

// Function that checks for updates
async function checkForUpdates(window) {
	try {
		const req = await fetch('https://brianwalczak.github.io/Bitwarden-Auto-Backup-Manager/version.json');
		const res = await req.json();
		res.currentVersion = app.getVersion();
	
		if(compareVersions(res.currentVersion, '<', res.latestVersion) && res.requireUpdate) {
			dialog.showMessageBox({
				type: 'warning',
				title: 'Update Required',
				message: `Update Required`,
				detail: `A critical update has been released for this software. In order to continue, you are required to update it.`,
				buttons: ['Update Now', 'Cancel'],
				defaultId: 0,
				cancelId: 1,
				modal: true
			}).then(async (response) => {
				if (response.response !== 0) return process.exit();
	
				await shell.openExternal(res.downloadUrl);
				process.exit();
			}).catch((err) => {});
		} else {
			res.upToDate = compareVersions(res.currentVersion, '==', res.latestVersion);
			window.webContents.send('version', res);
		}
	} catch(error) {
		console.log('Unable to check for new updates, skipped.');
	}
}

// A function that decrypts the file provided with a master password
async function decryptFile(backup, masterPassword) {
    try {
        let data = await fs.promises.readFile(settingsPath, 'utf8'); // Read the settings file (necessary to get their configuration)
        let backupFileName = `Backup Restore (${Date.now()}).json`;
	    data = JSON.parse(data);

        const unencryptedBackup = await restoreBackup(backup, masterPassword);
        await fs.promises.writeFile(path.join(data.folder, backupFileName), JSON.stringify(unencryptedBackup, null, "  "), 'utf8');
        return { success: true, location: path.join(data.folder, backupFileName) };
    } catch(error) {
        return { success: false, reason: error.toString() };
    }
}

async function createWindow () {
	win = new BrowserWindow({
    	width: 750,
    	height: 600,
		resizable: false,
    	webPreferences: {
        	nodeIntegration: false,
        	contextIsolation: true,
			sandbox: false,
     		preload: path.join(__dirname, 'preload.js')
    	}
  	})

  	win.loadFile('index.html'); // Load index.html file in window
  	// win.webContents.openDevTools(); // Open up DevTools (for development purposes haha)

	if (process.platform === 'win32') {
		app.setAppUserModelId(app.name); // Set the app name for notifications
	}

	// Top navigation menu buttons and functions
	const menuTemplate = [
		{
			label: 'About', click() {
				dialog.showMessageBox({
					type: 'info',
					title: 'Learn more',
					message: `Software Details`,
					detail: `Bitwarden Auto-Backup Manager v${app.getVersion()}\nDeveloped by Brian Walczak\nIf you find this software useful, please consider supporting its development.\n\n© 2024 Brian Walczak`,
					buttons: ['Support Me', 'Learn More', 'OK']
				}).then((response) => {
					switch (response.response) {
						case 0: // Support button clicked
							shell.openExternal('https://buymeacoffee.com/briann');
							break;
						case 1: // Learn More button clicked
							shell.openExternal('https://github.com/BrianWalczak/Bitwarden-Auto-Backup-Manager');
							break;
						default:
							break;
					}
				}).catch((err) => {});
			}
		},
		{
			label: 'Help', click() {
				shell.openExternal('https://github.com/BrianWalczak/Bitwarden-Auto-Backup-Manager');
			}
		},
		{
			label: 'Restart', click() {
				win.reload();
			}
		},
		{
			label: 'Quit', click() {
				win.hide();
			}
		}
	];

  	const menu = Menu.buildFromTemplate(menuTemplate);
  	Menu.setApplicationMenu(menu);

	win.on('close', (event) => {
        event.preventDefault();
        win.hide(); // Hide the window instead to keep it running in the background
    });

	// Runs function when the app has loaded/refreshed
  	win.webContents.on('did-finish-load', async () => {
        checkForUpdates(win); // Check for updates to inform user

		// Send the user's settings data to index.html
    	fs.readFile(settingsPath, 'utf8', async (error, data) => {
			// The user does not have any settings, create a default settings file
			if(error) {
				const defaultData = {
					"occurrence": "day",
					"folder": path.join(os.homedir(), 'Bitwarden Backups'),
					"keeping": "50",
					"active": false
				};

				await updateSettings(defaultData);
				data = JSON.stringify(defaultData);
			}

			// Parse the JSON data from settings.json (or from the default settings file) and send it.
			try {
				const jsonData = JSON.parse(data);

				// Send all of the settings to index.html, as well as the backup status.
				win.webContents.send('settings', jsonData);
				win.webContents.send('status', { isEnabled: jsonData.active, nextDate: jsonData.nextDate });

			} catch(err) {
				return; // Their settings file isn't properly formatted, they need to do something.
			}
		});
  	});

	// When a user decides to create a brand new backup from index.html
	ipcMain.on('backup', async (event) => {
		let data = await fs.promises.readFile(settingsPath, 'utf8'); // Read the settings file (necessary to get their configuration)
		data = JSON.parse(data);
		const backupName = await performBackup(data); // Perform and save the backup
		
		return new Notification({ title: "Backup Completed", body: `Your backup has been successfully completed as ${backupName} in your saved folder.` }).show();
 	});
	
	// When a new settings configuration is received from index.html
  	ipcMain.on('settings', async (event, settings) => {
		settings.active = false; // Whenever new settings are saved, turn off auto-backup by default

		await updateSettings(settings); // Save the new settings to the JSON file
		return true;
  	});

	// When the user clicks the enable or disable button from index.html
  	ipcMain.on('status', async (event, data) => {
		// Update the auto-backup status
		const nextDate = await setStatus(data);

		// Send the new status as well as the next auto-backup date (if applicable, could be null)
		event.sender.send('status', { isEnabled: data, nextDate });
 	});

	// When the user attempts to restore from a previous backup in index.html
	ipcMain.on('restore', async (event, backupData) => {
		prompt({
			title: 'Restore from Backup',
			label: 'Master Password',
			type: 'input',
			inputAttrs: {
				type: 'password'
			},
		}).then(async (password) => {
			if (password === null) return dialog.showErrorBox('Restore Aborted', `You have aborted the restore process, and it has been cancelled.`);
			
            const decryption = await decryptFile(backupData, password);
            if(!decryption.success) return dialog.showErrorBox('Restore Failed', `An error occurred when decrypting your file. Please ensure that you've entered the correct master password and your backup file isn't corrupted.\n\nError: ` + decryption.reason || 'Unknown');
            
            shell.showItemInFolder(decryption.location);
			dialog.showMessageBox({
				type: 'info',
				title: 'Restore Successful',
				message: `Restore Successful`,
				detail: `Your Bitwarden vault export was successful. Remember to keep the file safe, because it contains all of your decrypted vault data.`,
				buttons: ['OK']
			}).then(() => {
				win.reload();
			}).catch((err) => {});

			return true;
		}).catch((err) => {});
 	});
}

// Function to update the settings to the JSON file
async function updateSettings(newData) {
	try {
		newData.folder = newData.folder.replaceAll('\\', '/'); // Replace all "\" occurrences in the directory with "/"
		await fs.promises.writeFile(settingsPath, JSON.stringify(newData, null, 2));

		return newData;
	} catch(error) {
		return null;
	}
}

// Function to check if a file/directory exists in the system
function fileExists(filePath) {
    return new Promise((resolve, reject) => {
        fs.access(filePath, fs.constants.F_OK, (err) => {
            if (err) {
                if (err.code === 'ENOENT') {
                    resolve(false); // File does not exist
                } else {
                    resolve(false); // Other error, likely not accessible
                }
            } else {
                resolve(true); // File exists
            }
        });
    });
}

// Function that will get the next backup date in Epoch time based on their settings
function getNextBackup(data) {
	let currentTime = Date.now();
	let equationInMs = 0;

	if(data.occurrence == 'day') equationInMs = 24 * 60 * 60 * 1000;
	if(data.occurrence == 'week') equationInMs = 7 * 24 * 60 * 60 * 1000;
	if(data.occurrence == 'month') equationInMs = 30 * 24 * 60 * 60 * 1000;
	
	return currentTime + equationInMs;
}

// Function that will schedule the next backup date and save to file
async function scheduleNextBackup(data) {
	// Before continuing with the backup, we need to set the next scheduled time
	data.nextDate = getNextBackup(data);

	// Write next update to file
	await updateSettings(data);
	return data.nextDate;
}

// Function that will delete old backups if they are more than the user specified to hold at once
async function checkOldBackups(data) {
	const files = await fs.promises.readdir(data.folder);
	if(files.length <= Number(data.keeping)) return; // Don't continue if the limit hasn't yet been exceeded

    try {
        let oldestFile = null;
        let oldestBirthtime = Infinity;

        for (const file of files) {
            const filePath = path.join(data.folder, file);
            const stats = await fs.promises.stat(filePath);

            if (stats.birthtimeMs < oldestBirthtime) {
                oldestFile = filePath;
                oldestBirthtime = stats.birthtimeMs;
            }
        }

        if (oldestFile) {
            await fs.promises.unlink(oldestFile); // Delete the oldest file to free up space
            return true;
        } else {
            return false; // No files were found in the directory???
        }

    } catch (error) {
        return false; // Oldest file couldn't be deleted???
    }
}

// Function that will will grab the synced vault file and copy it to the users specified backup folder
async function performBackup(data) {
	const jsonDoc = await exportVault(dataPath);

	// Get the current date to rename file
	const formattedDate = new Date().toLocaleDateString('en-US', {
		month: '2-digit',
		day: '2-digit',
		year: 'numeric'
	}).replace(/\//g, '-');
	const backupFileName = `${formattedDate} (${Date.now()}).json`;

	await fs.promises.mkdir(data.folder, { recursive: true }); // Create backup directory if doesn't exist
	await fs.promises.writeFile(path.join(data.folder, backupFileName), JSON.stringify(jsonDoc, null, "  "), 'utf8'); // Copy the JSON to the user's selected backup location
	checkOldBackups(data); // Check all old backups to see if the configuration by the user exceeded

	return backupFileName;
}

// Function that will set the auto-backup status (enable or disable backing up)
async function setStatus(status) {
    try {
        // Read file contents
        let data = await fs.promises.readFile(settingsPath, 'utf8');
        const jsonData = JSON.parse(data);

        // Update JSON data
        jsonData.active = status;
        jsonData.nextDate = status ? Date.now() : null;

        // Write updated JSON data back to file
        await updateSettings(jsonData);

        // Perform backup if status is true
        if (status) {
			await scheduleNextBackup(jsonData); // Schedule the next backup time
			await performBackup(jsonData); // Perform and save the backup
		} else {
			new Notification({ title: "Automatic Backup's Disabled", body: "Turn on Automatic Backup's for your Bitwarden Vault to stay protected." }).show();
		}
		return jsonData.nextDate;
    } catch (err) {
        return false;
    }
}

// Function to check if the user has the Bitwarden Desktop app and proper data installed.
async function checkRequirements() {
    const bitwardenData = {
        standard: path.join(os.homedir(), 'AppData/Roaming/Bitwarden', 'data.json'),
        microsoft: path.join(os.homedir(), 'AppData/Local/Packages/8bitSolutionsLLC.bitwardendesktop_h4e712dmw3xyy/LocalCache/Roaming/Bitwarden', 'data.json')
    }

    const isStandard = await fileExists(bitwardenData.standard); // Standard app installation (bw desktop)
    const isMicrosoft = await fileExists(bitwardenData.microsoft); // Microsoft Store app installation (bw desktop)
    
	if(process.platform !== 'win32') { // Check operating system (in case somebody re-deploys)
		dialog.showErrorBox('Unsupported OS', `Unfortunately, it looks like your operating system is unsupported. The app needs to quit.`);
		process.exit();
	}

	if(!isStandard && !isMicrosoft) {
		dialog.showErrorBox('Unauthorized', `We are unable to locate the neccessary app data for the Bitwarden Desktop app. Please ensure that it is installed, and you have previously synced your vault.`);
		process.exit();
    } else if(isStandard) {
        dataPath = bitwardenData.standard;
    } else if(isMicrosoft) {
        dataPath = bitwardenData.microsoft;
	}
}

app.on('window-all-closed', () => {
	// Prevent the app from quitting on all windows closed, leave
})

// Run when the app is ready and started
app.on("ready", async () => {
    // Enable auto-backup to run in the background at startup
    app.setLoginItemSettings({
        openAtLogin: true,
        path: app.getPath("exe")
    });

	// Simple check if the user has the Bitwarden Desktop app and proper data installed.
	await checkRequirements();
});

// Create a window when the app is activated (if one doesn't exist)
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

// Run backup check every minute **at all times**
// This can run like this, because whenever a user closes the software, it will always run in the background
// Don't worry, it takes up little memory, whilelist ensuring that your vault is always backed up! :)
setInterval(async () => {
	try {
		let data = await fs.promises.readFile(settingsPath, 'utf8'); // Read the settings file (necessary to get their configuration)
		data = JSON.parse(data);
	
		// Only backup if the next date hasn't been reached, or if we aren't running
		if(data.active && Date.now() >= data.nextDate) {
			await scheduleNextBackup(data); // Schedule the next backup time
			await performBackup(data); // Perform and save the backup
		}
	} catch(error) {
		dialog.showErrorBox('Background Error', `We we're unable to check for upcoming backups. Please ensure that you've entered valid settings, and your AppData isn't corrupted.`);
		process.exit();
	}
}, 60000);