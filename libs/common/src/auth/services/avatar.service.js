"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AvatarService = void 0;
const update_avatar_request_1 = require("../../models/request/update-avatar.request");
const state_1 = require("../../platform/state");
const AVATAR_COLOR = new state_1.UserKeyDefinition(state_1.AVATAR_DISK, "avatarColor", {
    deserializer: (value) => value,
    clearOn: [],
});
class AvatarService {
    constructor(apiService, stateProvider) {
        this.apiService = apiService;
        this.stateProvider = stateProvider;
        this.avatarColor$ = this.stateProvider.getActive(AVATAR_COLOR).state$;
    }
    setAvatarColor(color) {
        return __awaiter(this, void 0, void 0, function* () {
            const { avatarColor } = yield this.apiService.putAvatar(new update_avatar_request_1.UpdateAvatarRequest(color));
            yield this.stateProvider.setUserState(AVATAR_COLOR, avatarColor);
        });
    }
    setSyncAvatarColor(userId, color) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.stateProvider.getUser(userId, AVATAR_COLOR).update(() => color);
        });
    }
    getUserAvatarColor$(userId) {
        return this.stateProvider.getUser(userId, AVATAR_COLOR).state$;
    }
}
exports.AvatarService = AvatarService;
//# sourceMappingURL=avatar.service.js.map