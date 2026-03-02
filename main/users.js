import log from "electron-log/main.js";

import { readFile } from "../utils/utils.js";
import { getSettings } from "./settings.js";
import { globals } from "./shared.js";

async function getActiveUsers(active = false) {
    const data = await readFile(globals.config.data);
    if (!data || (!data.global_account_accounts && (!data.global_account_activeAccountId || !data?.[data.global_account_activeAccountId]?.profile))) return null;

    const searchable = data?.global_account_accounts ?? {
        [data.global_account_activeAccountId]: {
            name: data?.[data.global_account_activeAccountId]?.profile?.name ?? null,
            email: data?.[data.global_account_activeAccountId]?.profile?.email ?? null,
        },
    };
    let users = [];

    try {
        users = Object.entries(searchable)
            .filter(([uid, account]) => {
                return typeof uid === "string" && uid.trim() !== "" && typeof account?.email === "string" && account.email.trim() !== ""; // filter out deleted accounts or invalid ones (check if UID and email are both valid)
            })
            .map(([uid, account]) => ({
                name: account.name && account.name.trim() !== "" ? account.name : null,
                email: account.email, // already filtered above
                uid, // already filtered above
                region: data?.[`user_${uid}_environment_environment`]?.region?.trim() || "US",
            }));
    } catch (error) {
        log.error("[Main Process] Unable to fetch users from Bitwarden Desktop app:", error);
        return null;
    }

    if (!active) return users;

    try {
        const settings = await getSettings();
        if (!settings || !settings.users) return users;

        for (const user of users) {
            if (settings.users.some((u) => u.uid === user.uid)) {
                user.active = true;
            } else {
                user.active = false;
            }
        }
    } catch (error) {
        log.error("[Main Process] Unable to fetch active user status from settings:", error);

        for (const user of users) {
            user.active = false;
        }
    }

    return users;
}

export { getActiveUsers };