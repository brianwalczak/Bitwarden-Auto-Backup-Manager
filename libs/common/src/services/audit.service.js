"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
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
exports.AuditService = void 0;
const throttle_1 = require("../platform/misc/throttle");
const utils_1 = require("../platform/misc/utils");
const PwnedPasswordsApi = "https://api.pwnedpasswords.com/range/";
class AuditService {
    constructor(cryptoFunctionService, apiService) {
        this.cryptoFunctionService = cryptoFunctionService;
        this.apiService = apiService;
    }
    passwordLeaked(password) {
        return __awaiter(this, void 0, void 0, function* () {
            const hashBytes = yield this.cryptoFunctionService.hash(password, "sha1");
            const hash = utils_1.Utils.fromBufferToHex(hashBytes).toUpperCase();
            const hashStart = hash.substr(0, 5);
            const hashEnding = hash.substr(5);
            const response = yield this.apiService.nativeFetch(new Request(PwnedPasswordsApi + hashStart));
            const leakedHashes = yield response.text();
            const match = leakedHashes.split(/\r?\n/).find((v) => {
                return v.split(":")[0] === hashEnding;
            });
            return match != null ? parseInt(match.split(":")[1], 10) : 0;
        });
    }
    breachedAccounts(username) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.apiService.getHibpBreach(username);
            }
            catch (e) {
                const error = e;
                if (error.statusCode === 404) {
                    return [];
                }
                throw new Error();
            }
        });
    }
}
exports.AuditService = AuditService;
__decorate([
    (0, throttle_1.throttle)(100, () => "passwordLeaked"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuditService.prototype, "passwordLeaked", null);
//# sourceMappingURL=audit.service.js.map