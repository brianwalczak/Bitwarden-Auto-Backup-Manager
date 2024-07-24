"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FolderResponse = void 0;
const base_response_1 = require("../../../models/response/base.response");
class FolderResponse extends base_response_1.BaseResponse {
    constructor(response) {
        super(response);
        this.id = this.getResponseProperty("Id");
        this.name = this.getResponseProperty("Name");
        this.revisionDate = this.getResponseProperty("RevisionDate");
    }
}
exports.FolderResponse = FolderResponse;
//# sourceMappingURL=folder.response.js.map