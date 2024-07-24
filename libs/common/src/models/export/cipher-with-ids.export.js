"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CipherWithIdExport = void 0;
const cipher_export_1 = require("./cipher.export");
class CipherWithIdExport extends cipher_export_1.CipherExport {
    // Use build method instead of ctor so that we can control order of JSON stringify for pretty print
    build(o) {
        this.id = o.id;
        super.build(o);
        this.collectionIds = o.collectionIds;
    }
}
exports.CipherWithIdExport = CipherWithIdExport;
//# sourceMappingURL=cipher-with-ids.export.js.map