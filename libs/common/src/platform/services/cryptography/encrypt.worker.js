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
exports.init = init;
const symmetric_crypto_key_1 = require("../../models/domain/symmetric-crypto-key");
const console_log_service_1 = require("../console-log.service");
const container_service_1 = require("../container.service");
const web_crypto_function_service_1 = require("../web-crypto-function.service");
const encrypt_service_implementation_1 = require("./encrypt.service.implementation");
const get_class_initializer_1 = require("./get-class-initializer");
const workerApi = self;
let inited = false;
let encryptService;
/**
 * Bootstrap the worker environment with services required for decryption
 */
function init() {
    const cryptoFunctionService = new web_crypto_function_service_1.WebCryptoFunctionService(self);
    const logService = new console_log_service_1.ConsoleLogService(false);
    encryptService = new encrypt_service_implementation_1.EncryptServiceImplementation(cryptoFunctionService, logService, true);
    const bitwardenContainerService = new container_service_1.ContainerService(null, encryptService);
    bitwardenContainerService.attachToGlobal(self);
    inited = true;
}

/**
 * Listen for messages and decrypt their contents
 */
workerApi.addEventListener("message", (event) => __awaiter(void 0, void 0, void 0, function* () {
    if (!inited) {
        init();
    }
    const request = JSON.parse(event.data);
    const key = symmetric_crypto_key_1.SymmetricCryptoKey.fromJSON(request.key);
    const items = request.items.map((jsonItem) => {
        const initializer = (0, get_class_initializer_1.getClassInitializer)(jsonItem.initializerKey);
        return initializer(jsonItem);
    });
    const result = yield encryptService.decryptItems(items, key);
    workerApi.postMessage({
        id: request.id,
        items: JSON.stringify(result),
    });
}));
//# sourceMappingURL=encrypt.worker.js.map