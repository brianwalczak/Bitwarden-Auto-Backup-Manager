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
exports.LoginUri = void 0;
const utils_1 = require("../../../platform/misc/utils");
const domain_base_1 = require("../../../platform/models/domain/domain-base");
const enc_string_1 = require("../../../platform/models/domain/enc-string");
const login_uri_data_1 = require("../data/login-uri.data");
const login_uri_view_1 = require("../view/login-uri.view");
class LoginUri extends domain_base_1.default {
    constructor(obj) {
        super();
        if (obj == null) {
            return;
        }
        this.match = obj.match;
        this.buildDomainModel(this, obj, {
            uri: null,
            uriChecksum: null,
        }, []);
    }
    decrypt(orgId, encKey) {
        return this.decryptObj(new login_uri_view_1.LoginUriView(this), {
            uri: null,
        }, orgId, encKey);
    }
    validateChecksum(clearTextUri, orgId, encKey) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.uriChecksum == null) {
                return false;
            }
            const cryptoService = utils_1.Utils.getContainerService().getEncryptService();
            const localChecksum = yield cryptoService.hash(clearTextUri, "sha256");
            const remoteChecksum = yield this.uriChecksum.decrypt(orgId, encKey);
            return remoteChecksum === localChecksum;
        });
    }
    toLoginUriData() {
        const u = new login_uri_data_1.LoginUriData();
        this.buildDataModel(this, u, {
            uri: null,
            uriChecksum: null,
            match: null,
        }, ["match"]);
        return u;
    }
    static fromJSON(obj) {
        if (obj == null) {
            return null;
        }
        const uri = enc_string_1.EncString.fromJSON(obj.uri);
        const uriChecksum = enc_string_1.EncString.fromJSON(obj.uriChecksum);
        return Object.assign(new LoginUri(), obj, {
            uri,
            uriChecksum,
        });
    }
}
exports.LoginUri = LoginUri;
//# sourceMappingURL=login-uri.js.map