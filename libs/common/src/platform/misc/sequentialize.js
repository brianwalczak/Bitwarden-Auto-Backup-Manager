"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearCaches = clearCaches;
exports.sequentialize = sequentialize;
const caches = new Map();
const getCache = (obj) => {
    let cache = caches.get(obj);
    if (cache != null) {
        return cache;
    }
    cache = new Map();
    caches.set(obj, cache);
    return cache;
};
function clearCaches() {
    caches.clear();
}
/**
 * Use as a Decorator on async functions, it will prevent multiple 'active' calls as the same time
 *
 * If a promise was returned from a previous call to this function, that hasn't yet resolved it will
 * be returned, instead of calling the original function again
 *
 * Results are not cached, once the promise has returned, the next call will result in a fresh call
 *
 * Read more at https://github.com/bitwarden/jslib/pull/7
 */
function sequentialize(cacheKey) {
    return (target, propertyKey, descriptor) => {
        const originalMethod = descriptor.value;
        return {
            value: function (...args) {
                const cache = getCache(this);
                const argsCacheKey = cacheKey(args);
                let response = cache.get(argsCacheKey);
                if (response != null) {
                    return response;
                }
                const onFinally = () => {
                    cache.delete(argsCacheKey);
                    if (cache.size === 0) {
                        caches.delete(this);
                    }
                };
                response = originalMethod
                    .apply(this, args)
                    .then((val) => {
                    onFinally();
                    return val;
                })
                    .catch((err) => {
                    onFinally();
                    throw err;
                });
                cache.set(argsCacheKey, response);
                return response;
            },
        };
    };
}
//# sourceMappingURL=sequentialize.js.map