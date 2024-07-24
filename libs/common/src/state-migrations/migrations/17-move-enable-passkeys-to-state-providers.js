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
exports.EnablePasskeysMigrator = void 0;
const migrator_1 = require("../migrator");
const USER_ENABLE_PASSKEYS = {
    key: "enablePasskeys",
    stateDefinition: {
        name: "vaultSettings",
    },
};
class EnablePasskeysMigrator extends migrator_1.Migrator {
    migrate(helper) {
        return __awaiter(this, void 0, void 0, function* () {
            const global = yield helper.get("global");
            if ((global === null || global === void 0 ? void 0 : global.enablePasskeys) != null) {
                yield helper.setToGlobal(USER_ENABLE_PASSKEYS, global.enablePasskeys);
                global === null || global === void 0 ? true : delete global.enablePasskeys;
                yield helper.set("global", global);
            }
        });
    }
    rollback(helper) {
        return __awaiter(this, void 0, void 0, function* () {
            let global = yield helper.get("global");
            const globalEnablePasskeys = yield helper.getFromGlobal(USER_ENABLE_PASSKEYS);
            if (globalEnablePasskeys != null) {
                global = Object.assign(global !== null && global !== void 0 ? global : {}, { enablePasskeys: globalEnablePasskeys });
                yield helper.set("global", global);
                yield helper.setToGlobal(USER_ENABLE_PASSKEYS, undefined);
            }
        });
    }
}
exports.EnablePasskeysMigrator = EnablePasskeysMigrator;
//# sourceMappingURL=17-move-enable-passkeys-to-state-providers.js.map