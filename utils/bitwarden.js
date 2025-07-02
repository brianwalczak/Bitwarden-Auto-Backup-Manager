// Creates an API request to Bitwarden creating an access token
async function getAccessToken(refresh_token, region) {
    const req = await fetch(`https://${region == 'EU' ? 'identity.bitwarden.eu' : 'identity.bitwarden.com'}/connect/token`, {
        method: 'POST',
        headers: {
          'content-type': 'application/x-www-form-urlencoded; charset=utf-8',
          'accept': 'application/json'
        },
        body: new URLSearchParams({
          'grant_type': 'refresh_token',
          'client_id': 'desktop',
          'refresh_token': refresh_token
        })
    });      

    const res = await req.json();
    return res.access_token;
}

// Creates an API request to Bitwarden to sync your vault
async function syncVault(access_token, region) {
    const req = await fetch(`https://${region == 'EU' ? 'api.bitwarden.eu' : 'api.bitwarden.com'}/sync?excludeDomains=true`, {
        headers: {
          'authorization': 'Bearer ' + access_token,
          'accept': 'application/json',
        }
      });

    const res = await req.json();
    return res;
}

// Function to get the user iteration count
async function getIterations(email) {
    const req = await fetch("https://vault.bitwarden.com/identity/accounts/prelogin", {
        "headers": {
          "content-type": "application/json; charset=utf-8",
        },
        "body": `{\"email\":\"${email}\"}`,
        "method": "POST"
    });
    const res = await req.json();
    if(!res.kdfIterations) return null;

    return res.kdfIterations;
}

// Export all functions for use
module.exports = {
    getAccessToken,
    syncVault,
    getIterations
};