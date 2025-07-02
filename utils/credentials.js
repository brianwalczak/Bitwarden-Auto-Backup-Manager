// If you're prompted by your operating system, such as macOS, to enter your password before viewing your Bitwarden credential, make sure to click "Always Allow" to prevent any annoyances while automatic backups are running
const keytar = require('keytar');

// Simple function written with keytar to find credential based on search query
async function findCredential(service, code) {
    const credentials = await keytar.findCredentials(service);
    let result;

    credentials.forEach((cred) => {
        if(cred.account.includes(code)) {
            result = cred.password;
        }
    });

    return result?.replaceAll('"', '') ?? null;
}

// Simple function written with keytar to find exact credential
async function getCredential(service, account) {
    const password = await keytar.getPassword(service, account);

    return password?.replaceAll('"', '') ?? null;
}

module.exports = {
    findCredential,
    getCredential
};