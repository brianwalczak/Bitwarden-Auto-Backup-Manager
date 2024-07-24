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
exports.EnableFaviconMigrator = void 0;
const migrator_1 = require("../migrator");
const ShowFaviconDefinition = {
    stateDefinition: {
        name: "domainSettings",
    },
    key: "showFavicons",
};
class EnableFaviconMigrator extends migrator_1.Migrator {
    migrate(helper) {
        return __awaiter(this, void 0, void 0, function* () {
            // global state ("disableFavicon" -> "showFavicons")
            const globalState = yield helper.get("global");
            if ((globalState === null || globalState === void 0 ? void 0 : globalState.disableFavicon) != null) {
                yield helper.setToGlobal(ShowFaviconDefinition, !globalState.disableFavicon);
                // delete `disableFavicon` from state global
                delete globalState.disableFavicon;
                yield helper.set("global", globalState);
            }
        });
    }
    rollback(helper) {
        return __awaiter(this, void 0, void 0, function* () {
            // global state ("showFavicons" -> "disableFavicon")
            const globalState = (yield helper.get("global")) || {};
            const showFavicons = yield helper.getFromGlobal(ShowFaviconDefinition);
            if (showFavicons != null) {
                yield helper.set("global", Object.assign(Object.assign({}, globalState), { disableFavicon: !showFavicons }));
                // remove the global state provider framework key for `showFavicons`
                yield helper.setToGlobal(ShowFaviconDefinition, null);
            }
        });
    }
}
exports.EnableFaviconMigrator = EnableFaviconMigrator;
//# sourceMappingURL=42-move-enable-favicon-to-domain-settings-state-provider.js.map