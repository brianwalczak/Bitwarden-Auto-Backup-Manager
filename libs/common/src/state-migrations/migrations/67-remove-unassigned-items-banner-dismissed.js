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
exports.RemoveUnassignedItemsBannerDismissed = exports.SHOW_BANNER = void 0;
const migrator_1 = require("../migrator");
exports.SHOW_BANNER = {
    key: "showBanner",
    stateDefinition: { name: "unassignedItemsBanner" },
};
class RemoveUnassignedItemsBannerDismissed extends migrator_1.Migrator {
    migrate(helper) {
        return __awaiter(this, void 0, void 0, function* () {
            yield Promise.all((yield helper.getAccounts()).map((_a) => __awaiter(this, [_a], void 0, function* ({ userId }) {
                if (helper.getFromUser(userId, exports.SHOW_BANNER) != null) {
                    yield helper.removeFromUser(userId, exports.SHOW_BANNER);
                }
            })));
        });
    }
    rollback(helper) {
        return __awaiter(this, void 0, void 0, function* () {
            throw migrator_1.IRREVERSIBLE;
        });
    }
}
exports.RemoveUnassignedItemsBannerDismissed = RemoveUnassignedItemsBannerDismissed;
//# sourceMappingURL=67-remove-unassigned-items-banner-dismissed.js.map