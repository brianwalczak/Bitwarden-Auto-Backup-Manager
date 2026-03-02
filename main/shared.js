import { app } from "electron";
import path from "node:path";

export const globals = {
    isQuitting: false,
    config: {
        data: null, // User path to Bitwarden Desktop data.json file (will be defined later)
        settings: path.join(app.getPath("userData"), "settings.json"), // User app configuration file
    }
}