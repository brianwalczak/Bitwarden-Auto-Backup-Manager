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
exports.DeleteInstalledVersion = void 0;
const migrator_1 = require("../migrator");
class DeleteInstalledVersion extends migrator_1.Migrator {
    migrate(helper) {
        return __awaiter(this, void 0, void 0, function* () {
            const legacyGlobal = yield helper.get("global");
            if ((legacyGlobal === null || legacyGlobal === void 0 ? void 0 : legacyGlobal.installedVersion) != null) {
                delete legacyGlobal.installedVersion;
                yield helper.set("global", legacyGlobal);
            }
        });
    }
    rollback(helper) {
        throw migrator_1.IRREVERSIBLE;
    }
}
exports.DeleteInstalledVersion = DeleteInstalledVersion;
//# sourceMappingURL=52-delete-installed-version.js.map