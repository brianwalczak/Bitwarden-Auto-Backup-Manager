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
const enc_string_1 = require("./enc-string");
// https://contributing.bitwarden.com/architecture/clients/data-model#domain
class Domain {
    buildDomainModel(domain, dataObj, map, notEncList = []) {
        for (const prop in map) {
            // eslint-disable-next-line
            if (!map.hasOwnProperty(prop)) {
                continue;
            }
            const objProp = dataObj[map[prop] || prop];
            if (notEncList.indexOf(prop) > -1) {
                domain[prop] = objProp ? objProp : null;
            }
            else {
                domain[prop] = objProp ? new enc_string_1.EncString(objProp) : null;
            }
        }
    }
    buildDataModel(domain, dataObj, map, notEncStringList = []) {
        for (const prop in map) {
            // eslint-disable-next-line
            if (!map.hasOwnProperty(prop)) {
                continue;
            }
            const objProp = domain[map[prop] || prop];
            if (notEncStringList.indexOf(prop) > -1) {
                dataObj[prop] = objProp != null ? objProp : null;
            }
            else {
                dataObj[prop] = objProp != null ? objProp.encryptedString : null;
            }
        }
    }
    decryptObj(viewModel_1, map_1, orgId_1) {
        return __awaiter(this, arguments, void 0, function* (viewModel, map, orgId, key = null) {
            const promises = [];
            const self = this;
            for (const prop in map) {
                // eslint-disable-next-line
                if (!map.hasOwnProperty(prop)) {
                    continue;
                }
                (function (theProp) {
                    const p = Promise.resolve()
                        .then(() => {
                        const mapProp = map[theProp] || theProp;
                        if (self[mapProp]) {
                            return self[mapProp].decrypt(orgId, key);
                        }
                        return null;
                    })
                        .then((val) => {
                        viewModel[theProp] = val;
                    });
                    promises.push(p);
                })(prop);
            }
            yield Promise.all(promises);
            return viewModel;
        });
    }
}
exports.default = Domain;
//# sourceMappingURL=domain-base.js.map