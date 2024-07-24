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
exports.CollectionService = void 0;
const rxjs_1 = require("rxjs");
const utils_1 = require("../../platform/misc/utils");
const state_1 = require("../../platform/state");
const collection_data_1 = require("../models/data/collection.data");
const collection_1 = require("../models/domain/collection");
const collection_view_1 = require("../models/view/collection.view");
const service_utils_1 = require("../service-utils");
const ENCRYPTED_COLLECTION_DATA_KEY = state_1.UserKeyDefinition.record(state_1.COLLECTION_DATA, "collections", {
    deserializer: (jsonData) => collection_data_1.CollectionData.fromJSON(jsonData),
    clearOn: ["logout"],
});
const DECRYPTED_COLLECTION_DATA_KEY = state_1.DeriveDefinition.from(ENCRYPTED_COLLECTION_DATA_KEY, {
    deserializer: (obj) => obj.map((collection) => collection_view_1.CollectionView.fromJSON(collection)),
    derive: (collections_1, _a) => __awaiter(void 0, [collections_1, _a], void 0, function* (collections, { collectionService }) {
        const data = [];
        for (const id in collections !== null && collections !== void 0 ? collections : {}) {
            const collectionId = id;
            data.push(new collection_1.Collection(collections[collectionId]));
        }
        return yield collectionService.decryptMany(data);
    }),
});
const NestingDelimiter = "/";
class CollectionService {
    decryptedCollectionViews$(ids) {
        return this.decryptedCollections$.pipe((0, rxjs_1.map)((collections) => collections.filter((c) => ids.includes(c.id))));
    }
    constructor(cryptoService, i18nService, stateProvider) {
        this.cryptoService = cryptoService;
        this.i18nService = i18nService;
        this.stateProvider = stateProvider;
        this.encryptedCollectionDataState = this.stateProvider.getActive(ENCRYPTED_COLLECTION_DATA_KEY);
        this.encryptedCollections$ = this.encryptedCollectionDataState.state$.pipe((0, rxjs_1.map)((collections) => {
            const response = [];
            for (const id in collections !== null && collections !== void 0 ? collections : {}) {
                response.push(new collection_1.Collection(collections[id]));
            }
            return response;
        }));
        this.decryptedCollectionDataState = this.stateProvider.getDerived(this.encryptedCollectionDataState.state$, DECRYPTED_COLLECTION_DATA_KEY, { collectionService: this });
        this.decryptedCollections$ = this.decryptedCollectionDataState.state$;
    }
    clearActiveUserCache() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.decryptedCollectionDataState.forceValue(null);
        });
    }
    encrypt(model) {
        return __awaiter(this, void 0, void 0, function* () {
            if (model.organizationId == null) {
                throw new Error("Collection has no organization id.");
            }
            const key = yield this.cryptoService.getOrgKey(model.organizationId);
            if (key == null) {
                throw new Error("No key for this collection's organization.");
            }
            const collection = new collection_1.Collection();
            collection.id = model.id;
            collection.organizationId = model.organizationId;
            collection.readOnly = model.readOnly;
            collection.name = yield this.cryptoService.encrypt(model.name, key);
            return collection;
        });
    }
    decryptMany(collections) {
        return __awaiter(this, void 0, void 0, function* () {
            if (collections == null) {
                return [];
            }
            const decCollections = [];
            const organizationKeys = yield (0, rxjs_1.firstValueFrom)(this.cryptoService.activeUserOrgKeys$);
            const promises = [];
            collections.forEach((collection) => {
                promises.push(collection
                    .decrypt(organizationKeys[collection.organizationId])
                    .then((c) => decCollections.push(c)));
            });
            yield Promise.all(promises);
            return decCollections.sort(utils_1.Utils.getSortFunction(this.i18nService, "name"));
        });
    }
    get(id) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            return ((_a = (yield (0, rxjs_1.firstValueFrom)(this.encryptedCollections$.pipe((0, rxjs_1.map)((cs) => cs.find((c) => c.id === id)))))) !== null && _a !== void 0 ? _a : null);
        });
    }
    getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, rxjs_1.firstValueFrom)(this.encryptedCollections$);
        });
    }
    getAllDecrypted() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, rxjs_1.firstValueFrom)(this.decryptedCollections$);
        });
    }
    getAllNested() {
        return __awaiter(this, arguments, void 0, function* (collections = null) {
            if (collections == null) {
                collections = yield this.getAllDecrypted();
            }
            const nodes = [];
            collections.forEach((c) => {
                const collectionCopy = new collection_view_1.CollectionView();
                collectionCopy.id = c.id;
                collectionCopy.organizationId = c.organizationId;
                const parts = c.name != null ? c.name.replace(/^\/+|\/+$/g, "").split(NestingDelimiter) : [];
                service_utils_1.ServiceUtils.nestedTraverse(nodes, 0, parts, collectionCopy, null, NestingDelimiter);
            });
            return nodes;
        });
    }
    /**
     * @deprecated August 30 2022: Moved to new Vault Filter Service
     * Remove when Desktop and Browser are updated
     */
    getNested(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const collections = yield this.getAllNested();
            return service_utils_1.ServiceUtils.getTreeNodeObjectFromList(collections, id);
        });
    }
    upsert(toUpdate) {
        return __awaiter(this, void 0, void 0, function* () {
            if (toUpdate == null) {
                return;
            }
            yield this.encryptedCollectionDataState.update((collections) => {
                if (collections == null) {
                    collections = {};
                }
                if (Array.isArray(toUpdate)) {
                    toUpdate.forEach((c) => {
                        collections[c.id] = c;
                    });
                }
                else {
                    collections[toUpdate.id] = toUpdate;
                }
                return collections;
            });
        });
    }
    replace(collections) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.encryptedCollectionDataState.update(() => collections);
        });
    }
    clear(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (userId == null) {
                yield this.encryptedCollectionDataState.update(() => null);
                yield this.decryptedCollectionDataState.forceValue(null);
            }
            else {
                yield this.stateProvider.getUser(userId, ENCRYPTED_COLLECTION_DATA_KEY).update(() => null);
            }
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.encryptedCollectionDataState.update((collections) => {
                if (collections == null) {
                    collections = {};
                }
                if (typeof id === "string") {
                    delete collections[id];
                }
                else {
                    id.forEach((i) => {
                        delete collections[i];
                    });
                }
                return collections;
            });
        });
    }
}
exports.CollectionService = CollectionService;
//# sourceMappingURL=collection.service.js.map