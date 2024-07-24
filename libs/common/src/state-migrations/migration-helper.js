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
exports.MigrationHelper = void 0;
class MigrationHelper {
    constructor(currentVersion, storageService, logService, type, clientType) {
        this.currentVersion = currentVersion;
        this.storageService = storageService;
        this.logService = logService;
        this.clientType = clientType;
        this.type = type;
    }
    /**
     * Gets a value from the storage service at the given key.
     *
     * This is a brute force method to just get a value from the storage service. If you can use {@link getFromGlobal} or {@link getFromUser}, you should.
     * @param key location
     * @returns the value at the location
     */
    get(key) {
        return this.storageService.get(key);
    }
    /**
     * Sets a value in the storage service at the given key.
     *
     * This is a brute force method to just set a value in the storage service. If you can use {@link setToGlobal} or {@link setToUser}, you should.
     * @param key location
     * @param value the value to set
     * @returns
     */
    set(key, value) {
        this.logService.info(`Setting ${key}`);
        return this.storageService.save(key, value);
    }
    /**
     * Remove a value in the storage service at the given key.
     *
     * This is a brute force method to just remove a value in the storage service. If you can use {@link removeFromGlobal} or {@link removeFromUser}, you should.
     * @param key location
     * @returns void
     */
    remove(key) {
        this.logService.info(`Removing ${key}`);
        return this.storageService.remove(key);
    }
    /**
     * Gets a globally scoped value from a location derived through the key definition
     *
     * This is for use with the state providers framework, DO NOT use for values stored with {@link StateService},
     * use {@link get} for those.
     * @param keyDefinition unique key definition
     * @returns value from store
     */
    getFromGlobal(keyDefinition) {
        return this.get(this.getGlobalKey(keyDefinition));
    }
    /**
     * Sets a globally scoped value to a location derived through the key definition
     *
     * This is for use with the state providers framework, DO NOT use for values stored with {@link StateService},
     * use {@link set} for those.
     * @param keyDefinition unique key definition
     * @param value value to store
     * @returns void
     */
    setToGlobal(keyDefinition, value) {
        return this.set(this.getGlobalKey(keyDefinition), value);
    }
    /**
     * Remove a globally scoped location derived through the key definition
     *
     * This is for use with the state providers framework, DO NOT use for values stored with {@link StateService},
     * use {@link remove} for those.
     * @param keyDefinition unique key definition
     * @returns void
     */
    removeFromGlobal(keyDefinition) {
        return this.remove(this.getGlobalKey(keyDefinition));
    }
    /**
     * Gets a user scoped value from a location derived through the user id and key definition
     *
     * This is for use with the state providers framework, DO NOT use for values stored with {@link StateService},
     * use {@link get} for those.
     * @param userId userId to use in the key
     * @param keyDefinition unique key definition
     * @returns value from store
     */
    getFromUser(userId, keyDefinition) {
        return this.get(this.getUserKey(userId, keyDefinition));
    }
    /**
     * Sets a user scoped value to a location derived through the user id and key definition
     *
     * This is for use with the state providers framework, DO NOT use for values stored with {@link StateService},
     * use {@link set} for those.
     * @param userId userId to use in the key
     * @param keyDefinition unique key definition
     * @param value value to store
     * @returns void
     */
    setToUser(userId, keyDefinition, value) {
        return this.set(this.getUserKey(userId, keyDefinition), value);
    }
    /**
     * Remove a user scoped location derived through the key definition
     *
     * This is for use with the state providers framework, DO NOT use for values stored with {@link StateService},
     * use {@link remove} for those.
     * @param keyDefinition unique key definition
     * @returns void
     */
    removeFromUser(userId, keyDefinition) {
        return this.remove(this.getUserKey(userId, keyDefinition));
    }
    info(message) {
        this.logService.info(message);
    }
    /**
     * Helper method to read all Account objects stored by the State Service.
     *
     * This is useful from creating migrations off of this paradigm, but should not be used once a value is migrated to a state provider.
     *
     * @returns a list of all accounts that have been authenticated with state service, cast the expected type.
     */
    getAccounts() {
        return __awaiter(this, void 0, void 0, function* () {
            const userIds = yield this.getKnownUserIds();
            return Promise.all(userIds.map((userId) => __awaiter(this, void 0, void 0, function* () {
                return ({
                    userId,
                    account: yield this.get(userId),
                });
            })));
        });
    }
    /**
     * Helper method to read known users ids.
     */
    getKnownUserIds() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.currentVersion < 60) {
                return knownAccountUserIdsBuilderPre60(this.storageService);
            }
            else {
                return knownAccountUserIdsBuilder(this.storageService);
            }
        });
    }
    /**
     * Builds a user storage key appropriate for the current version.
     *
     * @param userId userId to use in the key
     * @param keyDefinition state and key to use in the key
     * @returns
     */
    getUserKey(userId, keyDefinition) {
        if (this.currentVersion < 9) {
            return userKeyBuilderPre9();
        }
        else {
            return userKeyBuilder(userId, keyDefinition);
        }
    }
    /**
     * Builds a global storage key appropriate for the current version.
     *
     * @param keyDefinition state and key to use in the key
     * @returns
     */
    getGlobalKey(keyDefinition) {
        if (this.currentVersion < 9) {
            return globalKeyBuilderPre9();
        }
        else {
            return globalKeyBuilder(keyDefinition);
        }
    }
}
exports.MigrationHelper = MigrationHelper;
/**
 * When this is updated, rename this function to `userKeyBuilderXToY` where `X` is the version number it
 * became relevant, and `Y` prior to the version it was updated.
 *
 * Be sure to update the map in `MigrationHelper` to point to the appropriate function for the current version.
 * @param userId The userId of the user you want the key to be for.
 * @param keyDefinition the key definition of which data the key should point to.
 * @returns
 */
function userKeyBuilder(userId, keyDefinition) {
    return `user_${userId}_${keyDefinition.stateDefinition.name}_${keyDefinition.key}`;
}
function userKeyBuilderPre9() {
    throw Error("No key builder should be used for versions prior to 9.");
}
/**
 * When this is updated, rename this function to `globalKeyBuilderXToY` where `X` is the version number
 * it became relevant, and `Y` prior to the version it was updated.
 *
 * Be sure to update the map in `MigrationHelper` to point to the appropriate function for the current version.
 * @param keyDefinition the key definition of which data the key should point to.
 * @returns
 */
function globalKeyBuilder(keyDefinition) {
    return `global_${keyDefinition.stateDefinition.name}_${keyDefinition.key}`;
}
function globalKeyBuilderPre9() {
    throw Error("No key builder should be used for versions prior to 9.");
}
function knownAccountUserIdsBuilderPre60(storageService) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        return (_a = (yield storageService.get("authenticatedAccounts"))) !== null && _a !== void 0 ? _a : [];
    });
}
function knownAccountUserIdsBuilder(storageService) {
    return __awaiter(this, void 0, void 0, function* () {
        const accounts = yield storageService.get(globalKeyBuilder({ stateDefinition: { name: "account" }, key: "accounts" }));
        return Object.keys(accounts !== null && accounts !== void 0 ? accounts : {});
    });
}
//# sourceMappingURL=migration-helper.js.map