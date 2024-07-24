"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SECURITY_STAMP_MEMORY = exports.API_KEY_CLIENT_SECRET_MEMORY = exports.API_KEY_CLIENT_SECRET_DISK = exports.API_KEY_CLIENT_ID_MEMORY = exports.API_KEY_CLIENT_ID_DISK = exports.EMAIL_TWO_FACTOR_TOKEN_RECORD_DISK_LOCAL = exports.REFRESH_TOKEN_MEMORY = exports.REFRESH_TOKEN_DISK = exports.ACCESS_TOKEN_MEMORY = exports.ACCESS_TOKEN_DISK = void 0;
const state_1 = require("../../platform/state");
// Note: all tokens / API key information must be cleared on logout.
// because we are using secure storage, we must manually call to clean up our tokens.
// See stateService.deAuthenticateAccount for where we call clearTokens(...)
exports.ACCESS_TOKEN_DISK = new state_1.UserKeyDefinition(state_1.TOKEN_DISK, "accessToken", {
    deserializer: (accessToken) => accessToken,
    clearOn: [], // Manually handled
});
exports.ACCESS_TOKEN_MEMORY = new state_1.UserKeyDefinition(state_1.TOKEN_MEMORY, "accessToken", {
    deserializer: (accessToken) => accessToken,
    clearOn: [], // Manually handled
});
exports.REFRESH_TOKEN_DISK = new state_1.UserKeyDefinition(state_1.TOKEN_DISK, "refreshToken", {
    deserializer: (refreshToken) => refreshToken,
    clearOn: [], // Manually handled
});
exports.REFRESH_TOKEN_MEMORY = new state_1.UserKeyDefinition(state_1.TOKEN_MEMORY, "refreshToken", {
    deserializer: (refreshToken) => refreshToken,
    clearOn: [], // Manually handled
});
exports.EMAIL_TWO_FACTOR_TOKEN_RECORD_DISK_LOCAL = state_1.KeyDefinition.record(state_1.TOKEN_DISK_LOCAL, "emailTwoFactorTokenRecord", {
    deserializer: (emailTwoFactorTokenRecord) => emailTwoFactorTokenRecord,
});
exports.API_KEY_CLIENT_ID_DISK = new state_1.UserKeyDefinition(state_1.TOKEN_DISK, "apiKeyClientId", {
    deserializer: (apiKeyClientId) => apiKeyClientId,
    clearOn: [], // Manually handled
});
exports.API_KEY_CLIENT_ID_MEMORY = new state_1.UserKeyDefinition(state_1.TOKEN_MEMORY, "apiKeyClientId", {
    deserializer: (apiKeyClientId) => apiKeyClientId,
    clearOn: [], // Manually handled
});
exports.API_KEY_CLIENT_SECRET_DISK = new state_1.UserKeyDefinition(state_1.TOKEN_DISK, "apiKeyClientSecret", {
    deserializer: (apiKeyClientSecret) => apiKeyClientSecret,
    clearOn: [], // Manually handled
});
exports.API_KEY_CLIENT_SECRET_MEMORY = new state_1.UserKeyDefinition(state_1.TOKEN_MEMORY, "apiKeyClientSecret", {
    deserializer: (apiKeyClientSecret) => apiKeyClientSecret,
    clearOn: [], // Manually handled
});
exports.SECURITY_STAMP_MEMORY = new state_1.UserKeyDefinition(state_1.TOKEN_MEMORY, "securityStamp", {
    deserializer: (securityStamp) => securityStamp,
    clearOn: ["logout"],
});
//# sourceMappingURL=token.state.js.map