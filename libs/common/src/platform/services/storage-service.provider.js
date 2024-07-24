"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StorageServiceProvider = void 0;
/**
 * A provider for getting client specific computed storage locations and services.
 */
class StorageServiceProvider {
    constructor(diskStorageService, memoryStorageService) {
        this.diskStorageService = diskStorageService;
        this.memoryStorageService = memoryStorageService;
    }
    /**
     * Computes the location and corresponding service for a given client.
     *
     * **NOTE** The default implementation does not respect client overrides and if clients
     * have special overrides they are responsible for implementing this service.
     * @param defaultLocation The default location to use if no client specific override is preferred.
     * @param overrides Client specific overrides
     * @returns The computed storage location and corresponding storage service to use to get/store state.
     * @throws If there is no configured storage service for the given inputs.
     */
    get(defaultLocation, overrides) {
        switch (defaultLocation) {
            case "disk":
                return [defaultLocation, this.diskStorageService];
            case "memory":
                return [defaultLocation, this.memoryStorageService];
            default:
                throw new Error(`Unexpected location: ${defaultLocation}`);
        }
    }
}
exports.StorageServiceProvider = StorageServiceProvider;
//# sourceMappingURL=storage-service.provider.js.map