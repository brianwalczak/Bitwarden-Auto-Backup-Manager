"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SortedCiphersCache = void 0;
const CacheTTL = 3000;
class SortedCiphersCache {
    constructor(comparator) {
        this.comparator = comparator;
        this.sortedCiphersByUrl = new Map();
        this.timeouts = new Map();
    }
    isCached(url) {
        return this.sortedCiphersByUrl.has(url);
    }
    addCiphers(url, ciphers) {
        ciphers.sort(this.comparator);
        this.sortedCiphersByUrl.set(url, new Ciphers(ciphers));
        this.resetTimer(url);
    }
    getLastUsed(url) {
        this.resetTimer(url);
        return this.isCached(url) ? this.sortedCiphersByUrl.get(url).getLastUsed() : null;
    }
    getLastLaunched(url) {
        return this.isCached(url) ? this.sortedCiphersByUrl.get(url).getLastLaunched() : null;
    }
    getNext(url) {
        this.resetTimer(url);
        return this.isCached(url) ? this.sortedCiphersByUrl.get(url).getNext() : null;
    }
    updateLastUsedIndex(url) {
        if (this.isCached(url)) {
            this.sortedCiphersByUrl.get(url).updateLastUsedIndex();
        }
    }
    clear() {
        this.sortedCiphersByUrl.clear();
        this.timeouts.clear();
    }
    resetTimer(url) {
        clearTimeout(this.timeouts.get(url));
        this.timeouts.set(url, setTimeout(() => {
            this.sortedCiphersByUrl.delete(url);
            this.timeouts.delete(url);
        }, CacheTTL));
    }
}
exports.SortedCiphersCache = SortedCiphersCache;
class Ciphers {
    constructor(ciphers) {
        this.ciphers = ciphers;
        this.lastUsedIndex = -1;
    }
    getLastUsed() {
        this.lastUsedIndex = Math.max(this.lastUsedIndex, 0);
        return this.ciphers[this.lastUsedIndex];
    }
    getLastLaunched() {
        const usedCiphers = this.ciphers.filter((cipher) => { var _a; return (_a = cipher.localData) === null || _a === void 0 ? void 0 : _a.lastLaunched; });
        const sortedCiphers = usedCiphers.sort((x, y) => y.localData.lastLaunched.valueOf() - x.localData.lastLaunched.valueOf());
        return sortedCiphers[0];
    }
    getNextIndex() {
        return (this.lastUsedIndex + 1) % this.ciphers.length;
    }
    getNext() {
        return this.ciphers[this.getNextIndex()];
    }
    updateLastUsedIndex() {
        this.lastUsedIndex = this.getNextIndex();
    }
}
//# sourceMappingURL=sorted-ciphers-cache.js.map