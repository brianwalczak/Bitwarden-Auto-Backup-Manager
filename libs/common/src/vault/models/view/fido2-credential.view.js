"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Fido2CredentialView = void 0;
const item_view_1 = require("./item.view");
class Fido2CredentialView extends item_view_1.ItemView {
    constructor() {
        super(...arguments);
        this.creationDate = null;
    }
    get subTitle() {
        return this.userDisplayName;
    }
    static fromJSON(obj) {
        const creationDate = obj.creationDate != null ? new Date(obj.creationDate) : null;
        return Object.assign(new Fido2CredentialView(), obj, {
            creationDate,
        });
    }
}
exports.Fido2CredentialView = Fido2CredentialView;
//# sourceMappingURL=fido2-credential.view.js.map