"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateProfileRequest = void 0;
class UpdateProfileRequest {
    constructor(name, masterPasswordHint) {
        this.culture = "en-US"; // deprecated
        this.name = name;
        this.masterPasswordHint = masterPasswordHint ? masterPasswordHint : null;
    }
}
exports.UpdateProfileRequest = UpdateProfileRequest;
//# sourceMappingURL=update-profile.request.js.map