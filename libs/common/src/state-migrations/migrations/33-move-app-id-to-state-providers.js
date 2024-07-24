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
exports.AppIdMigrator = exports.ANONYMOUS_APP_ID_KEY = exports.APP_ID_KEY = exports.ANONYMOUS_APP_ID_STORAGE_KEY = exports.APP_ID_STORAGE_KEY = void 0;
const migrator_1 = require("../migrator");
exports.APP_ID_STORAGE_KEY = "appId";
exports.ANONYMOUS_APP_ID_STORAGE_KEY = "anonymousAppId";
exports.APP_ID_KEY = {
    key: exports.APP_ID_STORAGE_KEY,
    stateDefinition: { name: "applicationId" },
};
exports.ANONYMOUS_APP_ID_KEY = {
    key: exports.ANONYMOUS_APP_ID_STORAGE_KEY,
    stateDefinition: { name: "applicationId" },
};
class AppIdMigrator extends migrator_1.Migrator {
    migrate(helper) {
        return __awaiter(this, void 0, void 0, function* () {
            const appId = yield helper.get(exports.APP_ID_STORAGE_KEY);
            const anonymousAppId = yield helper.get(exports.ANONYMOUS_APP_ID_STORAGE_KEY);
            if (appId != null) {
                yield helper.setToGlobal(exports.APP_ID_KEY, appId);
                yield helper.set(exports.APP_ID_STORAGE_KEY, null);
            }
            if (anonymousAppId != null) {
                yield helper.setToGlobal(exports.ANONYMOUS_APP_ID_KEY, anonymousAppId);
                yield helper.set(exports.ANONYMOUS_APP_ID_STORAGE_KEY, null);
            }
        });
    }
    rollback(helper) {
        return __awaiter(this, void 0, void 0, function* () {
            const appId = yield helper.getFromGlobal(exports.APP_ID_KEY);
            const anonymousAppId = yield helper.getFromGlobal(exports.ANONYMOUS_APP_ID_KEY);
            if (appId != null) {
                yield helper.set(exports.APP_ID_STORAGE_KEY, appId);
                yield helper.setToGlobal(exports.APP_ID_KEY, null);
            }
            if (anonymousAppId != null) {
                yield helper.set(exports.ANONYMOUS_APP_ID_STORAGE_KEY, anonymousAppId);
                yield helper.setToGlobal(exports.ANONYMOUS_APP_ID_KEY, null);
            }
        });
    }
}
exports.AppIdMigrator = AppIdMigrator;
//# sourceMappingURL=33-move-app-id-to-state-providers.js.map