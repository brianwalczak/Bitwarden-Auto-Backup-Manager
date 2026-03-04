import { BrowserWindow, Menu, dialog, shell, app, ipcMain } from "electron";
import log from "electron-log/main.js";
import path from "node:path";

import { checkForUpdates } from "./updater.js";
import { injectIpcHandlers } from "./ipc.js";
import { collectBackups } from "./backup.js";
import { getSettings } from "./settings.js";
import { getActiveUsers } from "./users.js";
import { updateTray, updateStatusCache } from "./tray.js";
import { globals } from "./shared.js";

let win = null; // holds the window instance

function getWindow() {
    return win;
}

async function showWindow() {
    if (!win) return await createWindow();
    if (app.dock) app.dock.show();

    win.show();
    win.reload();
    win.focus();
    return win;
}

function prompt(config) {
    return new Promise((resolve) => {
        const modal = new BrowserWindow({
            parent: getWindow() ?? undefined,
            modal: true,
            show: false,
            width: 420,
            height: 140 + (config?.fields?.length || 1) * 65,
            resizable: false,
            frame: false,
            webPreferences: {
                preload: path.join(import.meta.dirname, "../renderer/components/prompt/preload.js"),
                contextIsolation: true,
                nodeIntegration: false,
                sandbox: false,
            },
        });

        modal.loadFile(path.join(import.meta.dirname, "../renderer/components/prompt/index.html"));

        modal.webContents.once("did-finish-load", () => {
            modal.webContents.send("init", config);
        });

        const onceResponse = (_, data) => {
            ipcMain.removeListener("response", onceResponse);

            modal.destroy();
            resolve(data);
        };

        ipcMain.once("response", onceResponse);
        modal.once("ready-to-show", () => modal.show());
    });
}

async function createWindow(show = true) {
    if (app.dock && !show) app.dock.hide();

    win = new BrowserWindow({
        width: 750,
        height: 600,
        resizable: false,
        show,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            sandbox: false,
            preload: path.join(import.meta.dirname, "../renderer/preload.js"),
        },
    });

    win.loadFile(path.join(import.meta.dirname, "../renderer/index.html"));

    if (process.platform === "win32") {
        app.setAppUserModelId(app.name); // Set the app name for notifications
    }

    const aboutAction = () => {
        dialog
            .showMessageBox({
                type: "info",
                title: "Bitwarden Auto-Backup Manager",
                message: `Software Details`,
                detail: `Bitwarden Auto-Backup Manager v${app.getVersion()}\nDeveloped by Brian Walczak\nIf you find this software useful, please consider supporting its development.\n\n© ${new Date().getFullYear()} Brian Walczak`,
                buttons: ["Support Me", "GitHub Repository", "OK"],
                cancelId: 2,
            })
            .then((response) => {
                switch (response.response) {
                    case 0: // Support button clicked
                        shell.openExternal("https://github.com/sponsors/brianwalczak");
                        break;
                    case 1: // Learn More button clicked
                        shell.openExternal("https://github.com/BrianWalczak/Bitwarden-Auto-Backup-Manager");
                        break;
                    default:
                        break;
                }
            })
    };

    const helpAction = () => {
        shell.openExternal("https://github.com/BrianWalczak/Bitwarden-Auto-Backup-Manager");
    };

    let menu = Menu.buildFromTemplate([
        {
            label: "About",
            click() {
                aboutAction();
            },
        },
        {
            label: "Help",
            click() {
                helpAction();
            },
        },
        {
            label: "Restart",
            click() {
                win.reload();
            },
        },
        {
            label: "Quit",
            click() {
                win.close();
            },
        },
    ]);

    if (process.platform === "darwin") {
        menu = Menu.buildFromTemplate([
            {
                label: app.getName(),
                submenu: [
                    {
                        label: "About " + app.getName(),
                        click: aboutAction,
                    },
                    { type: "separator" },
                    {
                        label: "View on GitHub",
                        click: helpAction,
                    },
                ],
            },
            { role: "fileMenu" },
            { role: "editMenu" },
            { role: "viewMenu" },
            { role: "windowMenu" },
            { role: "help" },
        ]);
    }

    Menu.setApplicationMenu(menu);

    win.on("close", (event) => {
        if (!globals.isQuitting) {
            event.preventDefault();
            if (app.dock) app.dock.hide();
            
            win.destroy();
            win = null;
        }
    });

    win.webContents.on("did-finish-load", async () => {
        checkForUpdates(); // Check for updates to inform user
        const settings = await getSettings();
        const backups = await collectBackups(settings.folder);

        await updateStatusCache(settings.users); // Update the tray status on startup

        try {
            const users = await getActiveUsers(true);
            if (users) win.webContents.send("users", users);

            win.webContents.send("settings", settings);
            win.webContents.send("backups", backups);
        } catch (error) {
            return log.error("[Main Process] Error while loading the window page:", error);
        }
    });

    injectIpcHandlers();
    updateTray();
    return win;
}

export { getWindow, showWindow, createWindow, prompt };