"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.throttle = throttle;
/**
 * Use as a Decorator on async functions, it will limit how many times the function can be
 * in-flight at a time.
 *
 * Calls beyond the limit will be queued, and run when one of the active calls finishes
 */
function throttle(limit, throttleKey) {
    return (target, propertyKey, descriptor) => {
        const originalMethod = descriptor.value;
        const allThrottles = new Map();
        const getThrottles = (obj) => {
            let throttles = allThrottles.get(obj);
            if (throttles != null) {
                return throttles;
            }
            throttles = new Map();
            allThrottles.set(obj, throttles);
            return throttles;
        };
        return {
            value: function (...args) {
                const throttles = getThrottles(this);
                const argsThrottleKey = throttleKey(args);
                let queue = throttles.get(argsThrottleKey);
                if (queue == null) {
                    queue = [];
                    throttles.set(argsThrottleKey, queue);
                }
                return new Promise((resolve, reject) => {
                    const exec = () => {
                        const onFinally = () => {
                            queue.splice(queue.indexOf(exec), 1);
                            if (queue.length >= limit) {
                                queue[limit - 1]();
                            }
                            else if (queue.length === 0) {
                                throttles.delete(argsThrottleKey);
                                if (throttles.size === 0) {
                                    allThrottles.delete(this);
                                }
                            }
                        };
                        originalMethod
                            .apply(this, args)
                            .then((val) => {
                            onFinally();
                            return val;
                        })
                            .catch((err) => {
                            onFinally();
                            throw err;
                        })
                            .then(resolve, reject);
                    };
                    queue.push(exec);
                    if (queue.length <= limit) {
                        exec();
                    }
                });
            },
        };
    };
}
//# sourceMappingURL=throttle.js.map