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
exports.EnableContextMenuMigrator = void 0;
const migrator_1 = require("../migrator");
const enableContextMenuKeyDefinition = {
    stateDefinition: {
        name: "autofillSettings",
    },
    key: "enableContextMenu",
};
class EnableContextMenuMigrator extends migrator_1.Migrator {
    migrate(helper) {
        return __awaiter(this, void 0, void 0, function* () {
            const globalState = yield helper.get("global");
            // disableContextMenuItem -> enableContextMenu
            if ((globalState === null || globalState === void 0 ? void 0 : globalState.disableContextMenuItem) != null) {
                yield helper.setToGlobal(enableContextMenuKeyDefinition, !globalState.disableContextMenuItem);
                // delete `disableContextMenuItem` from state global
                delete globalState.disableContextMenuItem;
                yield helper.set("global", globalState);
            }
        });
    }
    rollback(helper) {
        return __awaiter(this, void 0, void 0, function* () {
            const globalState = (yield helper.get("global")) || {};
            const enableContextMenu = yield helper.getFromGlobal(enableContextMenuKeyDefinition);
            // enableContextMenu -> disableContextMenuItem
            if (enableContextMenu != null) {
                yield helper.set("global", Object.assign(Object.assign({}, globalState), { disableContextMenuItem: !enableContextMenu }));
                // remove the global state provider framework key for `enableContextMenu`
                yield helper.setToGlobal(enableContextMenuKeyDefinition, null);
            }
        });
    }
}
exports.EnableContextMenuMigrator = EnableContextMenuMigrator;
//# sourceMappingURL=31-move-enable-context-menu-to-autofill-settings-state-provider.js.map