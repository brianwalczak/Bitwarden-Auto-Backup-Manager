"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContainerService = void 0;

class ContainerService {
    constructor(cryptoService, encryptService) {
        this.cryptoService = cryptoService;
        this.encryptService = encryptService;
    }
    attachToGlobal(global) {
        if (!global.bitwardenContainerService) {
            global.bitwardenContainerService = this;
        }
    }
    /**
     * @throws Will throw if CryptoService was not instantiated and provided to the ContainerService constructor
     */
    getCryptoService() {
        if (this.cryptoService == null) {
            throw new Error("ContainerService.cryptoService not initialized.");
        }
        return this.cryptoService;
    }
    /**
     * @throws Will throw if EncryptService was not instantiated and provided to the ContainerService constructor
     */
    getEncryptService() {
        if (this.encryptService == null) {
            throw new Error("ContainerService.encryptService not initialized.");
        }
        return this.encryptService;
    }
}
exports.ContainerService = ContainerService;
//# sourceMappingURL=container.service.js.map