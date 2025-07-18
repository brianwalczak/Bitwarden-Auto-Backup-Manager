const { app, BrowserWindow, Menu, Notification, ipcMain, shell, dialog, globalShortcut } = require('electron');
const { isDeepStrictEqual } = require('node:util');
const prompt = require('electron-prompt');
const fs = require('fs').promises;
const path = require('path');
const os = require('os');

const { exportVault } = require('./utils/vault/export.js'); // Exports a user vault from their Bitwarden Desktop configuration
const { restoreBackup } = require('./utils/vault/restore.js'); // Restores a user vault from their KDF iteration and master password (w/ PBKDF2 only)
const { readFile, compareVersions, mergeDeep, fileExists } = require('./utils/utils.js');

let win = null; // Global variable to hold the window instance
let config = {
	data: null, // User path to Bitwarden Desktop data.json file (will be defined later)
	settings: path.join(app.getPath('userData'), 'settings.json'), // User app configuration file
	logs: false
};

const logOrigin = console.log;
const warnOrigin = console.warn;
const errOrigin = console.error;

console.log = function(...args) {
  logOrigin.apply(console, args);

  if (config.logs) {
    dialog.showMessageBoxSync({
      type: 'info',
      title: 'Console Log',
      message: args.map(String).join(' ')
    });
  }
};

console.warn = function(...args) {
  warnOrigin.apply(console, args);

  if (config.logs) {
    dialog.showMessageBoxSync({
      type: 'warning',
      title: 'Console Warning',
      message: args.map(String).join(' ')
    });
  }
};

console.error = function(...args) {
  errOrigin.apply(console, args);

  if (config.logs) {
    dialog.showMessageBoxSync({
      type: 'error',
      title: 'Console Error',
      message: args.map(String).join(' ')
    });
  }
};

// The code below is used so that there's never more than one process of the app running
// It also ensures that, at the same time, it's always running, whether in the foreground or as a background process
// This is required so that the app can periodically check if it's time for a backup

if (!app.requestSingleInstanceLock()) { // Check if this instance is the first instance or a second instance
    // If this process not the first instance, force quit
    process.exit();
} else {
    // If we are the first instance, create the window and detect for other instances
	
    app.on('second-instance', () => {
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

// Check for software updates via GitHub
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
				detail: `A critical update has been released for Bitwarden Auto-Backup Manager. In order to continue with backups, you are required to update it.`,
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

// Decrypts the file provided with a master password
async function decryptFile(backup, masterPassword) {
    try {
        const settings = await getSettings();

        const decBackup = await restoreBackup(backup, masterPassword);
		const folder = path.join(settings.folder, 'Restored');
		const file = `Backup Restore (${Date.now()}).json`;

		await fs.mkdir(folder, { recursive: true }); // Create restore directory if doesn't exist
        await fs.writeFile(path.join(folder, file), JSON.stringify(decBackup, null, "  "), 'utf8');
        return { success: true, location: path.join(folder, file) };
    } catch(error) {
        return { success: false, reason: error.toString() };
    }
}

// Get the users from the Bitwarden Desktop app
async function getActiveUsers(active = false) {
	const data = await readFile(config.data);
	if(!data || !data.global_account_accounts) return null;

	let users = [];
	
	try {
		users = Object.entries(data.global_account_accounts).map(([uid, { name, email }]) => ({
			name,
			email,
			uid,
			region: data?.[`user_${uid}_environment_environment`]?.region ?? 'US'
		})).filter(user => 
			user.name && user.email && user.region &&
			user.name.trim() !== '' && user.email.trim() !== '' && user.region.trim() !== ''
		);
	} catch(error) {
		return null;
	}

	if(!active) return users;

	try {
		const settings = await getSettings();
		if(!settings || !settings.users) return users;

		for(const user of users) {
			if(settings.users.some(u => u.uid === user.uid)) {
				user.active = true;
			} else {
				user.active = false;
			}
		}
	} catch(error) {
		console.error('An error occurred while finding active user status: ', error);

		for(const user of users) {
			user.active = false;
		}
	}

	return users;
}

// Get the settings from the settings file
async function getSettings() {
	try {
		const settings = await readFile(config.settings);

		if(settings?.users) {
			const users = await getActiveUsers(false);
			settings.users = settings.users.filter(user => users.find(u => u.uid === user.uid)); // If the user is not found in the Bitwarden Desktop app, remove them from the settings
		}

		const data = {
			occurrence: settings?.occurrence ?? "day",
			folder: (settings?.folder ?? path.join(os.homedir(), 'Bitwarden Backups')).replaceAll('\\', '/'),
			keeping: settings?.keeping ?? 50,
			users: settings?.users ?? []
		};

		if(!isDeepStrictEqual(settings, data)) {
			await fs.writeFile(config.settings, JSON.stringify(data, null, 2));
		}

		return data;
	} catch (error) {
		console.error('An error occurred while reading the settings file: ', error);

		return {
			occurrence: "day",
			folder: path.join(os.homedir(), 'Bitwarden Backups'),
			keeping: 50,
			users: []
		};
	}
}

// Update the settings to the settings file
async function updateSettings(data) {
	const settings = await getSettings();
	if(!data || typeof data !== 'object') return null;

	try {
		if(data.folder) data.folder = data.folder.replaceAll('\\', '/'); // Replace all "\" occurrences in the directory with "/"

		mergeDeep(settings, data);
		await fs.writeFile(config.settings, JSON.stringify(settings, null, 2));

		return settings;
	} catch(error) {
		return null;
	}
}

// Collects all backups from the user's backup folder
async function collectBackups(folder) {
	const backups = [];

	try {
		await fs.mkdir(folder, { recursive: true }); // Create requested directory if doesn't exist
		const folders = (await fs.readdir(folder, { withFileTypes: true })).filter(file => file.isDirectory() && file.name !== 'Restored');

		for (const dir of folders) {
			const dirPath = path.join(folder, dir.name);
			const files = (await fs.readdir(dirPath, { withFileTypes: true })).filter(file => file.isFile() && file.name.endsWith('.json'));

			for (const file of files) {
				const filePath = path.join(dirPath, file.name);
				const stats = await fs.stat(filePath);

				backups.push({
					id: dir.name,
					name: file.name.replace('.json', ''),
					createdAt: stats.birthtimeMs,
					size: stats.size,
					location: filePath
				});
			}
		}
	} catch(error) {
		console.error('An error occurred when attempting to collect backups:', error);
		return [];
	}

	return backups.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
}

async function createWindow() {
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

  	win.loadFile('static/index.html');

	if (process.platform === 'win32') {
		app.setAppUserModelId(app.name); // Set the app name for notifications
	}

	// Top navigation menu buttons and functions
  	const menu = Menu.buildFromTemplate([
		{
			label: 'About', click() {
				dialog.showMessageBox({
					type: 'info',
					title: 'Learn more',
					message: `Software Details`,
					detail: `Bitwarden Auto-Backup Manager v${app.getVersion()}\nDeveloped by Brian Walczak\nIf you find this software useful, please consider supporting its development.\n\n© 2024 Brian Walczak`,
					buttons: ['Support Me', 'Learn More', 'OK'],
					cancelId: 2
				}).then((response) => {
					switch (response.response) {
						case 0: // Support button clicked
							shell.openExternal('https://ko-fi.com/brianwalczak');
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
	]);
  	Menu.setApplicationMenu(menu);

	try {
		globalShortcut.register('Control+Shift+D', () => {
			config.logs = !config.logs; // Toggle developer mode

			return dialog.showMessageBox({
				type: 'info',
				title: 'Developer Mode',
				message: `Developer mode has been ${config.logs ? 'enabled' : 'disabled'} for this session.`,
				buttons: ['OK']
			});
		});
	} catch (error) {
		console.warn('Developer mode shortcut registration failed, ignoring.');
	}

	win.on('close', (event) => {
        event.preventDefault();
        win.hide(); // Hide the window instead to keep it running in the background
    });

  	win.webContents.on('did-finish-load', async () => {
        checkForUpdates(win); // Check for updates to inform user
		const settings = await getSettings();
		const backups = await collectBackups(settings.folder);

		try {
			const users = await getActiveUsers(true);
			if(users) win.webContents.send('users', users);

			win.webContents.send('settings', settings);
			win.webContents.send('backups', backups);
		} catch(error) {
			return console.error('An error occurred while loading the window page: ', error);
		}
  	});

	ipcMain.on('backup', async (event, user) => {
		const users = await getActiveUsers(false);
		const isUser = users.some(u => u.uid === user.uid);

		if(!isUser) return dialog.showErrorBox("User Not Found", "We were unable to find the user in your Bitwarden Desktop app. Please ensure that you have logged in to this Bitwarden account before.");

		const backup = await performBackup(user.uid);
		if(!backup) return dialog.showErrorBox("Backup Failed", "An error occurred while performing your Bitwarden vault backup. Please ensure that your Bitwarden Desktop app is installed and you have a valid internet connection.");

		const notification = new Notification({ 
			title: "Backup Completed", 
			body: `Your backup has been successfully completed for your Bitwarden account. Click to open.`, 
		});

		notification.show();
		notification.on('click', (event, arg) => {
			shell.showItemInFolder(backup);
		});
 	});
	
  	ipcMain.on('settings', async (event, settings) => {
		const update = await updateSettings(settings);
		if(!update) return dialog.showErrorBox("Settings Update Failed", "Your settings have failed to update. Please ensure that the file isn't corrupted, and you have write permissions to your configuration file.");

		win.webContents.send('settings', update); // Send the updated settings to the renderer process
		return new Notification({ title: "Settings Updated", body: "Your settings have been updated successfully." }).show();
	});

  	ipcMain.on('toggle', async (event, user) => {
		const users = await getActiveUsers(true);
		const isUser = users.find(u => u.uid === user.uid);

		if(!isUser) return dialog.showErrorBox("User Not Found", "We were unable to find the user in your Bitwarden Desktop app. Please ensure that you have logged in to this Bitwarden account before.");

		const settings = await getSettings();
		const index = settings.users.findIndex(u => u.uid === user.uid);

		if(index !== -1) { // User already exists, disable backups
			settings.users.splice(index, 1);
			isUser.active = false;
		} else { // User doesn't exist, enable backups
			settings.users.push({
				uid: user.uid,
				lastBackup: null,
				nextDate: Date.now()
			});
			isUser.active = true;
		}

		const update = await updateSettings(settings);
		if(!update) return dialog.showErrorBox("Settings Update Failed", "Your settings have failed to update. Please ensure that the file isn't corrupted, and you have write permissions to your configuration file.");

		new Notification({ title: `Backups ${isUser.active ? 'Enabled' : 'Disabled'}`, body: `You have successfully ${isUser.active ? 'enabled' : 'disabled'} backups for your Bitwarden account.` }).show();
		win.webContents.send('users', users); // Send the updated users to the renderer process
	});

	ipcMain.on('restore', async (event, data) => {
		prompt({
			title: 'Restore from Backup',
			label: 'Master Password',
			type: 'input',
			inputAttrs: {
				type: 'password'
			},
		}).then(async (password) => {
			if (password === null) return;
			if (typeof data === 'string' && path.extname(data)) {
				data = await readFile(data);
			}

			if(!data) return dialog.showErrorBox("Restore Failed", "An error occurred while reading your backup file. Please ensure that the file exists and is a valid Bitwarden backup file.");
			
            const decryption = await decryptFile(data, password);
            if(!decryption.success) return dialog.showErrorBox("Restore Failed", `An error occurred when decrypting your file. Please ensure that you've entered the correct master password and your backup file isn't corrupted.\n\nError: ` + decryption.reason || 'Unknown');
            
            shell.showItemInFolder(decryption.location);
			dialog.showMessageBox({
				type: 'info',
				title: 'Restore Successful',
				message: `Restore Successful`,
				detail: `Your Bitwarden vault export was successful. Remember to keep the file safe, because it contains all of your decrypted vault data.`,
				buttons: ['OK']
			});

			return true;
		}).catch((err) => {});
 	});
}

// Get the next backup date in Epoch time based on settings
async function getNextBackup() {
	const settings = await getSettings();
	
	let currentTime = Date.now();
	let equationInMs = 0;
	
	switch (settings.occurrence) {
		case 'day':
			equationInMs = 24 * 60 * 60 * 1000;
			break;
		case 'week':
			equationInMs = 7 * 24 * 60 * 60 * 1000;
			break;
		case 'month':
			equationInMs = 30 * 24 * 60 * 60 * 1000;
			break;
		default:
			equationInMs = 24 * 60 * 60 * 1000;
	}

	return (currentTime + equationInMs);
}

// Deletes old backups if they are more than the user specified to hold at once
async function checkOldBackups() {
	const settings = await getSettings();

	for (const user of settings.users) {
		try {
			const folder = path.join(settings.folder, user.uid);
			const files = await fs.readdir(folder);
			if(files.length <= Number(settings.keeping)) continue; // Don't continue if the limit hasn't yet been exceeded

			let oldestFile = null;
			let oldestBirthtime = Infinity;

			for (const file of files) {
				const filePath = path.join(folder, file);
				const stats = await fs.stat(filePath);

				if (stats.birthtimeMs < oldestBirthtime) {
					oldestFile = filePath;
					oldestBirthtime = stats.birthtimeMs;
				}
			}

			if (oldestFile) await fs.unlink(oldestFile); // Delete the oldest file to free up space
		} catch (error) {
			continue;
		};
	}

	return true;
}

// Performs a backup of the user's vault and saves to backup directory
async function performBackup(uid) {
	const settings = await getSettings();

	try {
		const encBackup = await exportVault(config.data, uid);
		const formattedDate = new Date().toLocaleDateString('en-US', {
			month: '2-digit',
			day: '2-digit',
			year: 'numeric'
		}).replace(/\//g, '-');
		const file = `${formattedDate} (${Date.now()}).json`;
		const folder = path.join(settings.folder, uid);

		await fs.mkdir(folder, { recursive: true }); // Create backup directory if doesn't exist
		await fs.writeFile(path.join(folder, file), JSON.stringify(encBackup, null, 2), 'utf8');
		await checkOldBackups(); // Check all old backups to see if the configuration by the user exceeded

		const backups = await collectBackups(settings.folder);
		win.webContents.send('backups', backups);
		
		return path.join(folder, file);
	} catch (error) {
		return null;
	}
}

// Checks if the user has the Bitwarden Desktop app and proper data installed.
async function checkRequirements() {
    const bitwardenData = {
        standard: path.join(os.homedir(), 'AppData/Roaming/Bitwarden', 'data.json'),
        microsoft: path.join(os.homedir(), 'AppData/Local/Packages/8bitSolutionsLLC.bitwardendesktop_h4e712dmw3xyy/LocalCache/Roaming/Bitwarden', 'data.json')
    }

    const isStandard = await fileExists(bitwardenData.standard); // Standard app installation (bw desktop)
    const isMicrosoft = await fileExists(bitwardenData.microsoft); // Microsoft Store app installation (bw desktop)
    
	if(process.platform !== 'win32') { // Check operating system (in case somebody re-deploys)
		dialog.showErrorBox('Unsupported OS', `Unfortunately, it looks like your operating system is unsupported for Bitwarden Auto-Backup Manager.`);
		process.exit();
	}

	if(!isStandard && !isMicrosoft) {
		dialog.showErrorBox('Unauthorized', `We are unable to locate the neccessary app data for the Bitwarden Desktop app. Please ensure that it is installed, and you have previously synced your vault.`);
		process.exit();
    } else if(isStandard) {
        config.data = bitwardenData.standard;
    } else if(isMicrosoft) {
        config.data = bitwardenData.microsoft;
	}
}

// Checks for upcoming backups in the background
async function backgroundBackupCheck() {
	try {
		const settings = await getSettings();

		for (const user of settings.users) {
			if(user.nextDate && Date.now() >= user.nextDate) {
				user.nextDate = await getNextBackup(); // Schedule the next backup time
				user.lastBackup = Date.now(); // Set the last backup time
				await updateSettings(settings);

				win.webContents.send('settings', settings); // Send the updated settings to the renderer process
				await performBackup(user.uid); // Perform and save the backup
			}

			continue;
		}
	} catch(error) {
		dialog.showErrorBox('Background Error', `We we're unable to check for upcoming Bitwarden vault backups. Please ensure that you've entered valid settings, and your AppData isn't corrupted.`);
		process.exit();
	}

	return true;
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
		createWindow();
	}
})

// Run backup check every minute **at all times**
// This can run like this, because whenever a user closes the software, it will always run in the background
// Don't worry, it takes up little memory, whilelist ensuring that your vault is always backed up! :)
setInterval(backgroundBackupCheck, 60000);