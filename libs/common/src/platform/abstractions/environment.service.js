"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnvironmentService = exports.Region = void 0;
/**
 * A subset of available regions, additional regions can be loaded through configuration.
 */
var Region;
(function (Region) {
    Region["US"] = "US";
    Region["EU"] = "EU";
    Region["SelfHosted"] = "Self-hosted";
})(Region || (exports.Region = Region = {}));
/**
 * The environment service. Provides access to set the current environment urls and region.
 */
class EnvironmentService {
}
exports.EnvironmentService = EnvironmentService;
//# sourceMappingURL=environment.service.js.map