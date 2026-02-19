import { SyncResponse, IdentityTokenResponse, PreloginResponse } from "../libs/common.cjs";
import { joinUrl } from "./utils.js";

// Creates an API request to Bitwarden creating an access token
async function getAccessToken(refresh_token, region, urls = null) {
    if (!refresh_token) throw new Error("Bitwarden API: Refresh token is required to get access token (are you logged in?).");

    let domain = null;
    if (urls?.base) {
        if (urls?.identity) {
            domain = joinUrl(urls.identity, "/connect/token");
        } else {
            domain = joinUrl(urls.base, "/identity" + "/connect/token");
        }
    } else if (region === "EU") {
        domain = "https://identity.bitwarden.eu/connect/token";
    } else {
        // default to US server
        domain = "https://identity.bitwarden.com/connect/token";
    }

    const req = await fetch(domain, {
        method: "POST",
        headers: {
            "content-type": "application/x-www-form-urlencoded; charset=utf-8",
            accept: "application/json",
        },
        body: new URLSearchParams({
            grant_type: "refresh_token",
            client_id: "desktop",
            refresh_token: refresh_token,
        }),
    });

    if (!req.ok) {
        const text = await req.text();
        throw new Error(`Bitwarden API: Failed to get access token (are you logged in?). Status: ${req.status}, Response: ${text}`);
    }

    const res = await req.json();
    const tokenResponse = new IdentityTokenResponse(res);

    return tokenResponse.accessToken;
}

// Creates an API request to Bitwarden to sync your vault
async function syncVault(access_token, region, urls = null) {
    if (!access_token) throw new Error("Bitwarden API: Access token is required to sync vault (are you logged in?).");

    let domain = null;
    if (urls?.base) {
        if (urls?.api) {
            domain = joinUrl(urls.api, "/sync?excludeDomains=true");
        } else {
            domain = joinUrl(urls.base, "/api" + "/sync?excludeDomains=true");
        }
    } else if (region === "EU") {
        domain = "https://api.bitwarden.eu/sync?excludeDomains=true";
    } else {
        // default to US server
        domain = "https://api.bitwarden.com/sync?excludeDomains=true";
    }

    const req = await fetch(domain, {
        headers: {
            authorization: "Bearer " + access_token,
            accept: "application/json",
        },
    });

    if (!req.ok) {
        const text = await req.text();
        throw new Error(`Bitwarden API: Failed to sync vault (are you logged in?). Status: ${req.status}, Response: ${text}`);
    }

    const res = await req.json();
    const syncResponse = new SyncResponse(res);

    return syncResponse;
}

// Function to get the user iteration count
async function getIterations(email, region, urls = null) {
    if (!email) throw new Error("Bitwarden API: An account email address is required to get decryption iteration count (are you logged in?).");

    let domain = null;
    if (urls?.base) {
        if (urls?.identity) {
            domain = joinUrl(urls.identity, "/accounts/prelogin");
        } else {
            domain = joinUrl(urls.base, "/identity" + "/accounts/prelogin");
        }
    } else if (region === "EU") {
        domain = "https://identity.bitwarden.eu/accounts/prelogin";
    } else {
        // default to US server
        domain = "https://identity.bitwarden.com/accounts/prelogin";
    }

    const req = await fetch(domain, {
        headers: {
            "content-type": "application/json; charset=utf-8",
        },
        body: `{\"email\":\"${email}\"}`,
        method: "POST",
    });

    const res = await req.json();
    const preloginResponse = new PreloginResponse(res);

    if (preloginResponse.kdf === undefined || preloginResponse.kdfIterations === undefined || preloginResponse.kdf !== 0) return null;
    return preloginResponse.kdfIterations;
}

export { getAccessToken, syncVault, getIterations };
