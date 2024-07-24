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
exports.RememberedEmailMigrator = void 0;
const migrator_1 = require("../migrator");
const LOGIN_EMAIL_STATE = { name: "loginEmail" };
const STORED_EMAIL = {
    key: "storedEmail",
    stateDefinition: LOGIN_EMAIL_STATE,
};
class RememberedEmailMigrator extends migrator_1.Migrator {
    migrate(helper) {
        return __awaiter(this, void 0, void 0, function* () {
            const legacyGlobal = yield helper.get("global");
            // Move global data
            if ((legacyGlobal === null || legacyGlobal === void 0 ? void 0 : legacyGlobal.rememberedEmail) != null) {
                yield helper.setToGlobal(STORED_EMAIL, legacyGlobal.rememberedEmail);
            }
            // Delete legacy global data
            legacyGlobal === null || legacyGlobal === void 0 ? true : delete legacyGlobal.rememberedEmail;
            yield helper.set("global", legacyGlobal);
        });
    }
    rollback(helper) {
        return __awaiter(this, void 0, void 0, function* () {
            let legacyGlobal = yield helper.get("global");
            let updatedLegacyGlobal = false;
            const globalStoredEmail = yield helper.getFromGlobal(STORED_EMAIL);
            if (globalStoredEmail) {
                if (!legacyGlobal) {
                    legacyGlobal = {};
                }
                updatedLegacyGlobal = true;
                legacyGlobal.rememberedEmail = globalStoredEmail;
                yield helper.setToGlobal(STORED_EMAIL, null);
            }
            if (updatedLegacyGlobal) {
                yield helper.set("global", legacyGlobal);
            }
        });
    }
}
exports.RememberedEmailMigrator = RememberedEmailMigrator;
//# sourceMappingURL=51-move-remembered-email-to-state-providers.js.map