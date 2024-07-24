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
exports.SearchService = exports.LUNR_SEARCH_INDEXING = exports.LUNR_SEARCH_INDEXED_ENTITY_ID = exports.LUNR_SEARCH_INDEX = void 0;
const lunr = require("lunr");
const rxjs_1 = require("rxjs");
const domain_service_1 = require("../models/domain/domain-service");
const state_1 = require("../platform/state");
const enums_1 = require("../vault/enums");
const cipher_type_1 = require("../vault/enums/cipher-type");
/**
 * The `KeyDefinition` for accessing the search index in application state.
 * The key definition is configured to clear the index when the user locks the vault.
 */
exports.LUNR_SEARCH_INDEX = new state_1.UserKeyDefinition(state_1.VAULT_SEARCH_MEMORY, "searchIndex", {
    deserializer: (obj) => obj,
    clearOn: ["lock", "logout"],
});
/**
 * The `KeyDefinition` for accessing the ID of the entity currently indexed by Lunr search.
 * The key definition is configured to clear the indexed entity ID when the user locks the vault.
 */
exports.LUNR_SEARCH_INDEXED_ENTITY_ID = new state_1.UserKeyDefinition(state_1.VAULT_SEARCH_MEMORY, "searchIndexedEntityId", {
    deserializer: (obj) => obj,
    clearOn: ["lock", "logout"],
});
/**
 * The `KeyDefinition` for accessing the state of Lunr search indexing, indicating whether the Lunr search index is currently being built or updating.
 * The key definition is configured to clear the indexing state when the user locks the vault.
 */
exports.LUNR_SEARCH_INDEXING = new state_1.UserKeyDefinition(state_1.VAULT_SEARCH_MEMORY, "isIndexing", {
    deserializer: (obj) => obj,
    clearOn: ["lock", "logout"],
});
class SearchService {
    constructor(logService, i18nService, stateProvider) {
        this.logService = logService;
        this.i18nService = i18nService;
        this.stateProvider = stateProvider;
        this.searchIndexState = this.stateProvider.getActive(exports.LUNR_SEARCH_INDEX);
        this.index$ = this.searchIndexState.state$.pipe((0, rxjs_1.map)((searchIndex) => (searchIndex ? lunr.Index.load(searchIndex) : null)));
        this.searchIndexEntityIdState = this.stateProvider.getActive(exports.LUNR_SEARCH_INDEXED_ENTITY_ID);
        this.indexedEntityId$ = this.searchIndexEntityIdState.state$.pipe((0, rxjs_1.map)((id) => id));
        this.searchIsIndexingState = this.stateProvider.getActive(exports.LUNR_SEARCH_INDEXING);
        this.searchIsIndexing$ = this.searchIsIndexingState.state$.pipe((0, rxjs_1.map)((indexing) => indexing !== null && indexing !== void 0 ? indexing : false));
        this.immediateSearchLocales = ["zh-CN", "zh-TW", "ja", "ko", "vi"];
        this.defaultSearchableMinLength = 2;
        this.searchableMinLength = this.defaultSearchableMinLength;
        this.i18nService.locale$.subscribe((locale) => {
            if (this.immediateSearchLocales.indexOf(locale) !== -1) {
                this.searchableMinLength = 1;
            }
            else {
                this.searchableMinLength = this.defaultSearchableMinLength;
            }
        });
        // Currently have to ensure this is only done a single time. Lunr allows you to register a function
        // multiple times but they will add a warning message to the console. The way they do that breaks when ran on a service worker.
        if (!SearchService.registeredPipeline) {
            SearchService.registeredPipeline = true;
            //register lunr pipeline function
            lunr.Pipeline.registerFunction(this.normalizeAccentsPipelineFunction, "normalizeAccents");
        }
    }
    clearIndex() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.searchIndexEntityIdState.update(() => null);
            yield this.searchIndexState.update(() => null);
            yield this.searchIsIndexingState.update(() => null);
        });
    }
    isSearchable(query) {
        return __awaiter(this, void 0, void 0, function* () {
            query = SearchService.normalizeSearchQuery(query);
            const index = yield this.getIndexForSearch();
            const notSearchable = query == null ||
                (index == null && query.length < this.searchableMinLength) ||
                (index != null && query.length < this.searchableMinLength && query.indexOf(">") !== 0);
            return !notSearchable;
        });
    }
    indexCiphers(ciphers, indexedEntityId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (yield this.getIsIndexing()) {
                return;
            }
            yield this.setIsIndexing(true);
            yield this.setIndexedEntityIdForSearch(indexedEntityId);
            const builder = new lunr.Builder();
            builder.pipeline.add(this.normalizeAccentsPipelineFunction);
            builder.ref("id");
            builder.field("shortid", { boost: 100, extractor: (c) => c.id.substr(0, 8) });
            builder.field("name", {
                boost: 10,
            });
            builder.field("subtitle", {
                boost: 5,
                extractor: (c) => {
                    if (c.subTitle != null && c.type === cipher_type_1.CipherType.Card) {
                        return c.subTitle.replace(/\*/g, "");
                    }
                    return c.subTitle;
                },
            });
            builder.field("notes");
            builder.field("login.username", {
                extractor: (c) => c.type === cipher_type_1.CipherType.Login && c.login != null ? c.login.username : null,
            });
            builder.field("login.uris", { boost: 2, extractor: (c) => this.uriExtractor(c) });
            builder.field("fields", { extractor: (c) => this.fieldExtractor(c, false) });
            builder.field("fields_joined", { extractor: (c) => this.fieldExtractor(c, true) });
            builder.field("attachments", {
                extractor: (c) => this.attachmentExtractor(c, false),
            });
            builder.field("attachments_joined", {
                extractor: (c) => this.attachmentExtractor(c, true),
            });
            builder.field("organizationid", { extractor: (c) => c.organizationId });
            ciphers = ciphers || [];
            ciphers.forEach((c) => builder.add(c));
            const index = builder.build();
            yield this.setIndexForSearch(index.toJSON());
            yield this.setIsIndexing(false);
            this.logService.info("Finished search indexing");
        });
    }
    searchCiphers(query_1) {
        return __awaiter(this, arguments, void 0, function* (query, filter = null, ciphers) {
            const results = [];
            if (query != null) {
                query = SearchService.normalizeSearchQuery(query.trim().toLowerCase());
            }
            if (query === "") {
                query = null;
            }
            if (ciphers == null) {
                ciphers = [];
            }
            if (filter != null && Array.isArray(filter) && filter.length > 0) {
                ciphers = ciphers.filter((c) => filter.every((f) => f == null || f(c)));
            }
            else if (filter != null) {
                ciphers = ciphers.filter(filter);
            }
            if (!(yield this.isSearchable(query))) {
                return ciphers;
            }
            if (yield this.getIsIndexing()) {
                yield new Promise((r) => setTimeout(r, 250));
                if (yield this.getIsIndexing()) {
                    yield new Promise((r) => setTimeout(r, 500));
                }
            }
            const index = yield this.getIndexForSearch();
            if (index == null) {
                // Fall back to basic search if index is not available
                return this.searchCiphersBasic(ciphers, query);
            }
            const ciphersMap = new Map();
            ciphers.forEach((c) => ciphersMap.set(c.id, c));
            let searchResults = null;
            const isQueryString = query != null && query.length > 1 && query.indexOf(">") === 0;
            if (isQueryString) {
                try {
                    searchResults = index.search(query.substr(1).trim());
                }
                catch (e) {
                    this.logService.error(e);
                }
            }
            else {
                const soWild = lunr.Query.wildcard.LEADING | lunr.Query.wildcard.TRAILING;
                searchResults = index.query((q) => {
                    lunr.tokenizer(query).forEach((token) => {
                        const t = token.toString();
                        q.term(t, { fields: ["name"], wildcard: soWild });
                        q.term(t, { fields: ["subtitle"], wildcard: soWild });
                        q.term(t, { fields: ["login.uris"], wildcard: soWild });
                        q.term(t, {});
                    });
                });
            }
            if (searchResults != null) {
                searchResults.forEach((r) => {
                    if (ciphersMap.has(r.ref)) {
                        results.push(ciphersMap.get(r.ref));
                    }
                });
            }
            return results;
        });
    }
    searchCiphersBasic(ciphers, query, deleted = false) {
        query = SearchService.normalizeSearchQuery(query.trim().toLowerCase());
        return ciphers.filter((c) => {
            if (deleted !== c.isDeleted) {
                return false;
            }
            if (c.name != null && c.name.toLowerCase().indexOf(query) > -1) {
                return true;
            }
            if (query.length >= 8 && c.id.startsWith(query)) {
                return true;
            }
            if (c.subTitle != null && c.subTitle.toLowerCase().indexOf(query) > -1) {
                return true;
            }
            if (c.login &&
                c.login.hasUris &&
                c.login.uris.some((loginUri) => { var _a; return ((_a = loginUri === null || loginUri === void 0 ? void 0 : loginUri.uri) === null || _a === void 0 ? void 0 : _a.toLowerCase().indexOf(query)) > -1; })) {
                return true;
            }
            return false;
        });
    }
    searchSends(sends, query) {
        query = SearchService.normalizeSearchQuery(query.trim().toLocaleLowerCase());
        if (query === null) {
            return sends;
        }
        const sendsMatched = [];
        const lowPriorityMatched = [];
        sends.forEach((s) => {
            var _a, _b, _c;
            if (s.name != null && s.name.toLowerCase().indexOf(query) > -1) {
                sendsMatched.push(s);
            }
            else if (query.length >= 8 &&
                (s.id.startsWith(query) ||
                    s.accessId.toLocaleLowerCase().startsWith(query) ||
                    (((_a = s.file) === null || _a === void 0 ? void 0 : _a.id) != null && s.file.id.startsWith(query)))) {
                lowPriorityMatched.push(s);
            }
            else if (s.notes != null && s.notes.toLowerCase().indexOf(query) > -1) {
                lowPriorityMatched.push(s);
            }
            else if (((_b = s.text) === null || _b === void 0 ? void 0 : _b.text) != null && s.text.text.toLowerCase().indexOf(query) > -1) {
                lowPriorityMatched.push(s);
            }
            else if (((_c = s.file) === null || _c === void 0 ? void 0 : _c.fileName) != null && s.file.fileName.toLowerCase().indexOf(query) > -1) {
                lowPriorityMatched.push(s);
            }
        });
        return sendsMatched.concat(lowPriorityMatched);
    }
    getIndexForSearch() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, rxjs_1.firstValueFrom)(this.index$);
        });
    }
    setIndexForSearch(index) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.searchIndexState.update(() => index);
        });
    }
    setIndexedEntityIdForSearch(indexedEntityId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.searchIndexEntityIdState.update(() => indexedEntityId);
        });
    }
    setIsIndexing(indexing) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.searchIsIndexingState.update(() => indexing);
        });
    }
    getIsIndexing() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, rxjs_1.firstValueFrom)(this.searchIsIndexing$);
        });
    }
    fieldExtractor(c, joined) {
        if (!c.hasFields) {
            return null;
        }
        let fields = [];
        c.fields.forEach((f) => {
            if (f.name != null) {
                fields.push(f.name);
            }
            if (f.type === enums_1.FieldType.Text && f.value != null) {
                fields.push(f.value);
            }
        });
        fields = fields.filter((f) => f.trim() !== "");
        if (fields.length === 0) {
            return null;
        }
        return joined ? fields.join(" ") : fields;
    }
    attachmentExtractor(c, joined) {
        if (!c.hasAttachments) {
            return null;
        }
        let attachments = [];
        c.attachments.forEach((a) => {
            if (a != null && a.fileName != null) {
                if (joined && a.fileName.indexOf(".") > -1) {
                    attachments.push(a.fileName.substr(0, a.fileName.lastIndexOf(".")));
                }
                else {
                    attachments.push(a.fileName);
                }
            }
        });
        attachments = attachments.filter((f) => f.trim() !== "");
        if (attachments.length === 0) {
            return null;
        }
        return joined ? attachments.join(" ") : attachments;
    }
    uriExtractor(c) {
        if (c.type !== cipher_type_1.CipherType.Login || c.login == null || !c.login.hasUris) {
            return null;
        }
        const uris = [];
        c.login.uris.forEach((u) => {
            if (u.uri == null || u.uri === "") {
                return;
            }
            if (u.hostname != null) {
                uris.push(u.hostname);
                return;
            }
            let uri = u.uri;
            if (u.match !== domain_service_1.UriMatchStrategy.RegularExpression) {
                const protocolIndex = uri.indexOf("://");
                if (protocolIndex > -1) {
                    uri = uri.substr(protocolIndex + 3);
                }
                const queryIndex = uri.search(/\?|&|#/);
                if (queryIndex > -1) {
                    uri = uri.substring(0, queryIndex);
                }
            }
            uris.push(uri);
        });
        return uris.length > 0 ? uris : null;
    }
    normalizeAccentsPipelineFunction(token) {
        const searchableFields = ["name", "login.username", "subtitle", "notes"];
        const fields = token.metadata["fields"];
        const checkFields = fields.every((i) => searchableFields.includes(i));
        if (checkFields) {
            return SearchService.normalizeSearchQuery(token.toString());
        }
        return token;
    }
    // Remove accents/diacritics characters from text. This regex is equivalent to the Diacritic unicode property escape, i.e. it will match all diacritic characters.
    static normalizeSearchQuery(query) {
        return query === null || query === void 0 ? void 0 : query.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    }
}
exports.SearchService = SearchService;
SearchService.registeredPipeline = false;
//# sourceMappingURL=search.service.js.map