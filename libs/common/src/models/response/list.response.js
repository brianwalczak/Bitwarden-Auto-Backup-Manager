"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListResponse = void 0;
const base_response_1 = require("./base.response");
class ListResponse extends base_response_1.BaseResponse {
    constructor(response, t) {
        super(response);
        const data = this.getResponseProperty("Data");
        this.data = data == null ? [] : data.map((dr) => new t(dr));
        this.continuationToken = this.getResponseProperty("ContinuationToken");
    }
}
exports.ListResponse = ListResponse;
//# sourceMappingURL=list.response.js.map