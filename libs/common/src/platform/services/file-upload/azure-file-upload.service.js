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
exports.AzureFileUploadService = void 0;
const utils_1 = require("../../misc/utils");
const MAX_SINGLE_BLOB_UPLOAD_SIZE = 256 * 1024 * 1024; // 256 MiB
const MAX_BLOCKS_PER_BLOB = 50000;
class AzureFileUploadService {
    constructor(logService) {
        this.logService = logService;
    }
    upload(url, data, renewalCallback) {
        return __awaiter(this, void 0, void 0, function* () {
            if (data.buffer.byteLength <= MAX_SINGLE_BLOB_UPLOAD_SIZE) {
                return yield this.azureUploadBlob(url, data);
            }
            else {
                return yield this.azureUploadBlocks(url, data, renewalCallback);
            }
        });
    }
    azureUploadBlob(url, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const urlObject = utils_1.Utils.getUrl(url);
            const headers = new Headers({
                "x-ms-date": new Date().toUTCString(),
                "x-ms-version": urlObject.searchParams.get("sv"),
                "Content-Length": data.buffer.byteLength.toString(),
                "x-ms-blob-type": "BlockBlob",
            });
            const request = new Request(url, {
                body: data.buffer,
                cache: "no-store",
                method: "PUT",
                headers: headers,
            });
            const blobResponse = yield fetch(request);
            if (blobResponse.status !== 201) {
                throw new Error(`Failed to create Azure blob: ${blobResponse.status}`);
            }
        });
    }
    azureUploadBlocks(url, data, renewalCallback) {
        return __awaiter(this, void 0, void 0, function* () {
            const baseUrl = utils_1.Utils.getUrl(url);
            const blockSize = this.getMaxBlockSize(baseUrl.searchParams.get("sv"));
            let blockIndex = 0;
            const numBlocks = Math.ceil(data.buffer.byteLength / blockSize);
            const blocksStaged = [];
            if (numBlocks > MAX_BLOCKS_PER_BLOB) {
                throw new Error(`Cannot upload file, exceeds maximum size of ${blockSize * MAX_BLOCKS_PER_BLOB}`);
            }
            // eslint-disable-next-line
            try {
                while (blockIndex < numBlocks) {
                    url = yield this.renewUrlIfNecessary(url, renewalCallback);
                    const blockUrl = utils_1.Utils.getUrl(url);
                    const blockId = this.encodedBlockId(blockIndex);
                    blockUrl.searchParams.append("comp", "block");
                    blockUrl.searchParams.append("blockid", blockId);
                    const start = blockIndex * blockSize;
                    const blockData = data.buffer.slice(start, start + blockSize);
                    const blockHeaders = new Headers({
                        "x-ms-date": new Date().toUTCString(),
                        "x-ms-version": blockUrl.searchParams.get("sv"),
                        "Content-Length": blockData.byteLength.toString(),
                    });
                    const blockRequest = new Request(blockUrl.toString(), {
                        body: blockData,
                        cache: "no-store",
                        method: "PUT",
                        headers: blockHeaders,
                    });
                    const blockResponse = yield fetch(blockRequest);
                    if (blockResponse.status !== 201) {
                        const message = `Unsuccessful block PUT. Received status ${blockResponse.status}`;
                        this.logService.error(message + "\n" + (yield blockResponse.json()));
                        throw new Error(message);
                    }
                    blocksStaged.push(blockId);
                    blockIndex++;
                }
                url = yield this.renewUrlIfNecessary(url, renewalCallback);
                const blockListUrl = utils_1.Utils.getUrl(url);
                const blockListXml = this.blockListXml(blocksStaged);
                blockListUrl.searchParams.append("comp", "blocklist");
                const headers = new Headers({
                    "x-ms-date": new Date().toUTCString(),
                    "x-ms-version": blockListUrl.searchParams.get("sv"),
                    "Content-Length": blockListXml.length.toString(),
                });
                const request = new Request(blockListUrl.toString(), {
                    body: blockListXml,
                    cache: "no-store",
                    method: "PUT",
                    headers: headers,
                });
                const response = yield fetch(request);
                if (response.status !== 201) {
                    const message = `Unsuccessful block list PUT. Received status ${response.status}`;
                    this.logService.error(message + "\n" + (yield response.json()));
                    throw new Error(message);
                }
            }
            catch (e) {
                throw e;
            }
        });
    }
    renewUrlIfNecessary(url, renewalCallback) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const urlObject = utils_1.Utils.getUrl(url);
            const expiry = new Date((_a = urlObject.searchParams.get("se")) !== null && _a !== void 0 ? _a : "");
            if (isNaN(expiry.getTime())) {
                expiry.setTime(Date.now() + 3600000);
            }
            if (expiry.getTime() < Date.now() + 1000) {
                return yield renewalCallback();
            }
            return url;
        });
    }
    encodedBlockId(blockIndex) {
        // Encoded blockId max size is 64, so pre-encoding max size is 48
        const utfBlockId = ("000000000000000000000000000000000000000000000000" + blockIndex.toString()).slice(-48);
        return utils_1.Utils.fromUtf8ToB64(utfBlockId);
    }
    blockListXml(blockIdList) {
        let xml = '<?xml version="1.0" encoding="utf-8"?><BlockList>';
        blockIdList.forEach((blockId) => {
            xml += `<Latest>${blockId}</Latest>`;
        });
        xml += "</BlockList>";
        return xml;
    }
    getMaxBlockSize(version) {
        if (Version.compare(version, "2019-12-12") >= 0) {
            return 4000 * 1024 * 1024; // 4000 MiB
        }
        else if (Version.compare(version, "2016-05-31") >= 0) {
            return 100 * 1024 * 1024; // 100 MiB
        }
        else {
            return 4 * 1024 * 1024; // 4 MiB
        }
    }
}
exports.AzureFileUploadService = AzureFileUploadService;
class Version {
    /**
     * Compares two Azure Versions against each other
     * @param a Version to compare
     * @param b Version to compare
     * @returns a number less than zero if b is newer than a, 0 if equal,
     * and greater than zero if a is newer than b
     */
    static compare(a, b) {
        if (typeof a === "string") {
            a = new Version(a);
        }
        if (typeof b === "string") {
            b = new Version(b);
        }
        return a.year !== b.year
            ? a.year - b.year
            : a.month !== b.month
                ? a.month - b.month
                : a.day !== b.day
                    ? a.day - b.day
                    : 0;
    }
    constructor(version) {
        this.year = 0;
        this.month = 0;
        this.day = 0;
        try {
            const parts = version.split("-").map((v) => Number.parseInt(v, 10));
            this.year = parts[0];
            this.month = parts[1];
            this.day = parts[2];
        }
        catch (_a) {
            // Ignore error
        }
    }
    /**
     * Compares two Azure Versions against each other
     * @param compareTo Version to compare against
     * @returns a number less than zero if compareTo is newer, 0 if equal,
     * and greater than zero if this is greater than compareTo
     */
    compare(compareTo) {
        return Version.compare(this, compareTo);
    }
}
//# sourceMappingURL=azure-file-upload.service.js.map