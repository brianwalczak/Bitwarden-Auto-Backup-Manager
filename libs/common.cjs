var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from2, except, desc) => {
  if (from2 && typeof from2 === "object" || typeof from2 === "function") {
    for (let key of __getOwnPropNames(from2))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from2[key], enumerable: !(desc = __getOwnPropDesc(from2, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var __decorateClass = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result) __defProp(target, key, result);
  return result;
};

// entry.ts
var entry_exports = {};
__export(entry_exports, {
  Cipher: () => Cipher,
  CipherData: () => CipherData,
  CipherWithIdExport: () => CipherWithIdExport,
  EncString: () => EncString,
  Folder: () => Folder,
  FolderData: () => FolderData,
  FolderWithIdExport: () => FolderWithIdExport,
  IdentityTokenResponse: () => IdentityTokenResponse,
  PreloginResponse: () => PreloginResponse,
  SymmetricCryptoKey: () => SymmetricCryptoKey,
  SyncResponse: () => SyncResponse
});
module.exports = __toCommonJS(entry_exports);

// libs/common/src/vault/enums/cipher-reprompt-type.ts
var CipherRepromptType = {
  None: 0,
  Password: 1
};
function normalizeCipherRepromptTypeForSdk(value) {
  switch (value) {
    case CipherRepromptType.None:
    case CipherRepromptType.Password:
      return value;
    default:
      return CipherRepromptType.None;
  }
}

// libs/common/src/vault/enums/cipher-type.ts
var _CipherType = Object.freeze({
  Login: 1,
  SecureNote: 2,
  Card: 3,
  Identity: 4,
  SshKey: 5
});
var CipherType = _CipherType;
var cipherTypeNames = Object.freeze(
  Object.fromEntries(Object.entries(CipherType).map(([key, value]) => [value, key]))
);

// libs/common/src/models/response/base.response.ts
var BaseResponse = class {
  constructor(response) {
    this.response = response;
  }
  getResponseProperty(propertyName, response = null, exactName = false) {
    if (propertyName == null || propertyName === "") {
      throw new Error("propertyName must not be null/empty.");
    }
    if (response == null && this.response != null) {
      response = this.response;
    }
    if (response == null) {
      return null;
    }
    if (!exactName && response[propertyName] === void 0) {
      let otherCasePropertyName = null;
      if (propertyName.charAt(0) === propertyName.charAt(0).toUpperCase()) {
        otherCasePropertyName = propertyName.charAt(0).toLowerCase();
      } else {
        otherCasePropertyName = propertyName.charAt(0).toUpperCase();
      }
      if (propertyName.length > 1) {
        otherCasePropertyName += propertyName.slice(1);
      }
      propertyName = otherCasePropertyName;
      if (response[propertyName] === void 0) {
        propertyName = propertyName.toLowerCase();
      }
      if (response[propertyName] === void 0) {
        propertyName = propertyName.toUpperCase();
      }
    }
    return response[propertyName];
  }
};

// libs/common/src/vault/models/api/cipher-permissions.api.ts
var CipherPermissionsApi = class _CipherPermissionsApi extends BaseResponse {
  constructor(data = null) {
    super(data);
    this.delete = false;
    this.restore = false;
    if (data == null) {
      return;
    }
    this.delete = this.getResponseProperty("Delete");
    this.restore = this.getResponseProperty("Restore");
  }
  static fromJSON(obj) {
    return Object.assign(new _CipherPermissionsApi(), obj);
  }
  /**
   * Converts the SDK CipherPermissionsApi to a CipherPermissionsApi.
   */
  static fromSdkCipherPermissions(obj) {
    if (!obj) {
      return void 0;
    }
    const permissions = new _CipherPermissionsApi();
    permissions.delete = obj.delete;
    permissions.restore = obj.restore;
    return permissions;
  }
  /**
   * Converts the CipherPermissionsApi to an SdkCipherPermissions
   */
  toSdkCipherPermissions() {
    return this;
  }
};

// libs/common/src/vault/models/data/attachment.data.ts
var AttachmentData = class {
  constructor(response) {
    if (response == null) {
      return;
    }
    this.id = response.id;
    this.url = response.url;
    this.fileName = response.fileName;
    this.key = response.key;
    this.size = response.size;
    this.sizeName = response.sizeName;
  }
};

// libs/common/src/vault/models/data/card.data.ts
var CardData = class {
  constructor(data) {
    if (data == null) {
      return;
    }
    this.cardholderName = data.cardholderName;
    this.brand = data.brand;
    this.number = data.number;
    this.expMonth = data.expMonth;
    this.expYear = data.expYear;
    this.code = data.code;
  }
};

// libs/common/src/vault/enums/field-type.enum.ts
var _FieldType = Object.freeze({
  Text: 0,
  Hidden: 1,
  Boolean: 2,
  Linked: 3
});
var FieldType = _FieldType;
function normalizeFieldTypeForSdk(value) {
  switch (value) {
    case FieldType.Text:
    case FieldType.Hidden:
    case FieldType.Boolean:
    case FieldType.Linked:
      return value;
    default:
      return FieldType.Text;
  }
}

// libs/common/src/vault/enums/linked-id-type.enum.ts
var LoginLinkedId = {
  Username: 100,
  Password: 101
};
var CardLinkedId = {
  CardholderName: 300,
  ExpMonth: 301,
  ExpYear: 302,
  Code: 303,
  Brand: 304,
  Number: 305
};
var IdentityLinkedId = {
  Title: 400,
  MiddleName: 401,
  Address1: 402,
  Address2: 403,
  Address3: 404,
  City: 405,
  State: 406,
  PostalCode: 407,
  Country: 408,
  Company: 409,
  Email: 410,
  Phone: 411,
  Ssn: 412,
  Username: 413,
  PassportNumber: 414,
  LicenseNumber: 415,
  FirstName: 416,
  LastName: 417,
  FullName: 418
};
function normalizeLinkedIdTypeForSdk(value) {
  if (value == null) {
    return void 0;
  }
  const allValidValues = [
    ...Object.values(LoginLinkedId),
    ...Object.values(CardLinkedId),
    ...Object.values(IdentityLinkedId)
  ];
  return allValidValues.includes(value) ? value : void 0;
}

// libs/common/src/vault/enums/secure-note-type.enum.ts
var SecureNoteType = {
  Generic: 0
};
function normalizeSecureNoteTypeForSdk(value) {
  return SecureNoteType.Generic;
}

// libs/common/src/vault/models/data/field.data.ts
var FieldData = class {
  constructor(response) {
    this.type = FieldType.Text;
    if (response == null) {
      return;
    }
    this.type = response.type;
    this.name = response.name;
    this.value = response.value;
    this.linkedId = response.linkedId;
  }
};

// libs/common/src/vault/models/data/identity.data.ts
var IdentityData = class {
  constructor(data) {
    if (data == null) {
      return;
    }
    this.title = data.title;
    this.firstName = data.firstName;
    this.middleName = data.middleName;
    this.lastName = data.lastName;
    this.address1 = data.address1;
    this.address2 = data.address2;
    this.address3 = data.address3;
    this.city = data.city;
    this.state = data.state;
    this.postalCode = data.postalCode;
    this.country = data.country;
    this.company = data.company;
    this.email = data.email;
    this.phone = data.phone;
    this.ssn = data.ssn;
    this.username = data.username;
    this.passportNumber = data.passportNumber;
    this.licenseNumber = data.licenseNumber;
  }
};

// libs/common/src/vault/models/data/fido2-credential.data.ts
var Fido2CredentialData = class {
  constructor(data) {
    if (data == null) {
      return;
    }
    this.credentialId = data.credentialId;
    this.keyType = data.keyType;
    this.keyAlgorithm = data.keyAlgorithm;
    this.keyCurve = data.keyCurve;
    this.keyValue = data.keyValue;
    this.rpId = data.rpId;
    this.userHandle = data.userHandle;
    this.userName = data.userName;
    this.counter = data.counter;
    this.rpName = data.rpName;
    this.userDisplayName = data.userDisplayName;
    this.discoverable = data.discoverable;
    this.creationDate = data.creationDate;
  }
};

// libs/common/src/vault/models/data/login-uri.data.ts
var LoginUriData = class {
  constructor(data) {
    if (data == null) {
      return;
    }
    this.uri = data.uri;
    this.uriChecksum = data.uriChecksum;
    this.match = data.match;
  }
};

// libs/common/src/vault/models/data/login.data.ts
var LoginData = class {
  constructor(data) {
    if (data == null) {
      return;
    }
    this.username = data.username;
    this.password = data.password;
    this.passwordRevisionDate = data.passwordRevisionDate;
    this.totp = data.totp;
    this.autofillOnPageLoad = data.autofillOnPageLoad;
    if (data.uris) {
      this.uris = data.uris.map((u) => new LoginUriData(u));
    }
    if (data.fido2Credentials) {
      this.fido2Credentials = data.fido2Credentials?.map((key) => new Fido2CredentialData(key));
    }
  }
};

// libs/common/src/vault/models/data/password-history.data.ts
var PasswordHistoryData = class {
  constructor(response) {
    if (response == null) {
      return;
    }
    this.password = response.password;
    this.lastUsedDate = response.lastUsedDate;
  }
};

// libs/common/src/vault/models/data/secure-note.data.ts
var SecureNoteData = class {
  constructor(data) {
    this.type = SecureNoteType.Generic;
    if (data == null) {
      return;
    }
    this.type = data.type;
  }
};

// libs/common/src/vault/models/data/ssh-key.data.ts
var SshKeyData = class {
  constructor(data) {
    if (data == null) {
      return;
    }
    this.privateKey = data.privateKey;
    this.publicKey = data.publicKey;
    this.keyFingerprint = data.keyFingerprint;
  }
};

// libs/common/src/vault/models/data/cipher.data.ts
var CipherData = class _CipherData {
  constructor(response, collectionIds) {
    this.id = "";
    this.edit = false;
    this.viewPassword = true;
    this.organizationUseTotp = false;
    this.favorite = false;
    this.type = CipherType.Login;
    this.name = "";
    this.reprompt = CipherRepromptType.None;
    if (response == null) {
      this.creationDate = this.revisionDate = (/* @__PURE__ */ new Date()).toISOString();
      return;
    }
    this.id = response.id;
    this.organizationId = response.organizationId;
    this.folderId = response.folderId;
    this.edit = response.edit;
    this.viewPassword = response.viewPassword;
    this.permissions = response.permissions;
    this.organizationUseTotp = response.organizationUseTotp;
    this.favorite = response.favorite;
    this.revisionDate = response.revisionDate;
    this.type = response.type;
    this.name = response.name;
    this.notes = response.notes;
    this.collectionIds = collectionIds != null ? collectionIds : response.collectionIds;
    this.creationDate = response.creationDate;
    this.deletedDate = response.deletedDate;
    this.archivedDate = response.archivedDate;
    this.reprompt = response.reprompt;
    this.key = response.key;
    switch (this.type) {
      case CipherType.Login:
        this.login = new LoginData(response.login);
        break;
      case CipherType.SecureNote:
        this.secureNote = new SecureNoteData(response.secureNote);
        break;
      case CipherType.Card:
        this.card = new CardData(response.card);
        break;
      case CipherType.Identity:
        this.identity = new IdentityData(response.identity);
        break;
      case CipherType.SshKey:
        this.sshKey = new SshKeyData(response.sshKey);
        break;
      default:
        break;
    }
    if (response.fields != null) {
      this.fields = response.fields.map((f) => new FieldData(f));
    }
    if (response.attachments != null) {
      this.attachments = response.attachments.map((a) => new AttachmentData(a));
    }
    if (response.passwordHistory != null) {
      this.passwordHistory = response.passwordHistory.map((ph) => new PasswordHistoryData(ph));
    }
  }
  static fromJSON(obj) {
    const result = Object.assign(new _CipherData(), obj);
    if (obj.permissions != null) {
      result.permissions = CipherPermissionsApi.fromJSON(obj.permissions);
    }
    return result;
  }
};

// libs/common/src/auth/utils/assert-non-nullish.util.ts
function assertNonNullish(val, name, ctx) {
  if (val == null) {
    throw new Error(`${name} is null or undefined.${ctx ? ` ${ctx}` : ""}`);
  }
}

// libs/common/src/platform/enums/encryption-type.enum.ts
var EXPECTED_NUM_PARTS_BY_ENCRYPTION_TYPE = {
  [0 /* AesCbc256_B64 */]: 2,
  [2 /* AesCbc256_HmacSha256_B64 */]: 3,
  [3 /* Rsa2048_OaepSha256_B64 */]: 1,
  [4 /* Rsa2048_OaepSha1_B64 */]: 1,
  [5 /* Rsa2048_OaepSha256_HmacSha256_B64 */]: 2,
  [6 /* Rsa2048_OaepSha1_HmacSha256_B64 */]: 2,
  [7 /* CoseEncrypt0 */]: 1
};

// libs/storage-core/src/memory-storage.service.ts
var import_rxjs = require("rxjs");

// libs/storage-core/src/serialized-memory-storage.service.ts
var import_rxjs2 = require("rxjs");

// libs/common/src/platform/misc/utils.ts
var path = __toESM(require("path"));
var import_buffer = require("buffer/");
var import_rxjs3 = require("rxjs");
var import_tldts = require("tldts");
var nodeURL = typeof self === "undefined" ? require("url") : null;
var Utils = class _Utils {
  static {
    this.inited = false;
  }
  static {
    this.isNode = false;
  }
  static {
    this.isBrowser = true;
  }
  static {
    this.isMobileBrowser = false;
  }
  static {
    this.isAppleMobileBrowser = false;
  }
  static {
    this.global = null;
  }
  static {
    // Transpiled version of /\p{Emoji_Presentation}/gu using https://mothereff.in/regexpu. Used for compatability in older browsers.
    this.regexpEmojiPresentation = /(?:[\u231A\u231B\u23E9-\u23EC\u23F0\u23F3\u25FD\u25FE\u2614\u2615\u2648-\u2653\u267F\u2693\u26A1\u26AA\u26AB\u26BD\u26BE\u26C4\u26C5\u26CE\u26D4\u26EA\u26F2\u26F3\u26F5\u26FA\u26FD\u2705\u270A\u270B\u2728\u274C\u274E\u2753-\u2755\u2757\u2795-\u2797\u27B0\u27BF\u2B1B\u2B1C\u2B50\u2B55]|\uD83C[\uDC04\uDCCF\uDD8E\uDD91-\uDD9A\uDDE6-\uDDFF\uDE01\uDE1A\uDE2F\uDE32-\uDE36\uDE38-\uDE3A\uDE50\uDE51\uDF00-\uDF20\uDF2D-\uDF35\uDF37-\uDF7C\uDF7E-\uDF93\uDFA0-\uDFCA\uDFCF-\uDFD3\uDFE0-\uDFF0\uDFF4\uDFF8-\uDFFF]|\uD83D[\uDC00-\uDC3E\uDC40\uDC42-\uDCFC\uDCFF-\uDD3D\uDD4B-\uDD4E\uDD50-\uDD67\uDD7A\uDD95\uDD96\uDDA4\uDDFB-\uDE4F\uDE80-\uDEC5\uDECC\uDED0-\uDED2\uDED5-\uDED7\uDEEB\uDEEC\uDEF4-\uDEFC\uDFE0-\uDFEB]|\uD83E[\uDD0C-\uDD3A\uDD3C-\uDD45\uDD47-\uDD78\uDD7A-\uDDCB\uDDCD-\uDDFF\uDE70-\uDE74\uDE78-\uDE7A\uDE80-\uDE86\uDE90-\uDEA8\uDEB0-\uDEB6\uDEC0-\uDEC2\uDED0-\uDED6])/g;
  }
  static {
    this.validHosts = ["localhost"];
  }
  static {
    this.originalMinimumPasswordLength = 8;
  }
  static {
    this.minimumPasswordLength = 12;
  }
  static {
    this.maximumPasswordLength = 128;
  }
  static {
    this.DomainMatchBlacklist = /* @__PURE__ */ new Map([
      ["google.com", /* @__PURE__ */ new Set(["script.google.com"])]
    ]);
  }
  static init() {
    if (_Utils.inited) {
      return;
    }
    _Utils.inited = true;
    _Utils.isNode = typeof process !== "undefined" && process.release != null && process.release.name === "node";
    _Utils.isBrowser = typeof window !== "undefined";
    _Utils.isMobileBrowser = _Utils.isBrowser && this.isMobile(window);
    _Utils.isAppleMobileBrowser = _Utils.isBrowser && this.isAppleMobile(window);
    if (_Utils.isNode) {
      _Utils.global = global;
    } else if (_Utils.isBrowser) {
      _Utils.global = window;
    } else {
      _Utils.global = self;
    }
  }
  static fromB64ToArray(str) {
    if (str == null) {
      return null;
    }
    if (_Utils.isNode) {
      return new Uint8Array(Buffer.from(str, "base64"));
    } else {
      const binaryString = _Utils.global.atob(str);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      return bytes;
    }
  }
  static fromUrlB64ToArray(str) {
    return _Utils.fromB64ToArray(_Utils.fromUrlB64ToB64(str));
  }
  static fromHexToArray(str) {
    if (_Utils.isNode) {
      return new Uint8Array(Buffer.from(str, "hex"));
    } else {
      const bytes = new Uint8Array(str.length / 2);
      for (let i = 0; i < str.length; i += 2) {
        bytes[i / 2] = parseInt(str.substr(i, 2), 16);
      }
      return bytes;
    }
  }
  static fromUtf8ToArray(str) {
    if (_Utils.isNode) {
      return new Uint8Array(Buffer.from(str, "utf8"));
    } else {
      const strUtf8 = unescape(encodeURIComponent(str));
      const arr = new Uint8Array(strUtf8.length);
      for (let i = 0; i < strUtf8.length; i++) {
        arr[i] = strUtf8.charCodeAt(i);
      }
      return arr;
    }
  }
  static fromByteStringToArray(str) {
    if (str == null) {
      return null;
    }
    const arr = new Uint8Array(str.length);
    for (let i = 0; i < str.length; i++) {
      arr[i] = str.charCodeAt(i);
    }
    return arr;
  }
  static fromBufferToB64(buffer) {
    if (buffer == null) {
      return null;
    }
    const bytes = _Utils.normalizeToUint8Array(buffer);
    if (bytes.length === 0) {
      return "";
    }
    if (_Utils.isNode) {
      return Buffer.from(bytes).toString("base64");
    } else {
      let binary = "";
      for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      return _Utils.global.btoa(binary);
    }
  }
  /**
   * Normalizes input into a Uint8Array so we always have a uniform,
   * byte-level view of the data. This avoids dealing with differences
   * between ArrayBuffer (raw memory with no indexing) and other typed
   * views (which may have element sizes, offsets, and lengths).
   * @param buffer ArrayBuffer or ArrayBufferView (e.g. Uint8Array, DataView, etc.)
   */
  static normalizeToUint8Array(buffer) {
    if (buffer instanceof Uint8Array) {
      return buffer;
    } else if (buffer instanceof ArrayBuffer) {
      return new Uint8Array(buffer);
    } else {
      const view = buffer;
      return new Uint8Array(view.buffer, view.byteOffset, view.byteLength);
    }
  }
  static fromBufferToUrlB64(buffer) {
    return _Utils.fromB64toUrlB64(_Utils.fromBufferToB64(buffer));
  }
  static fromB64toUrlB64(b64Str) {
    return b64Str.replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
  }
  static fromBufferToUtf8(buffer) {
    return import_buffer.Buffer.from(buffer).toString("utf8");
  }
  static fromBufferToByteString(buffer) {
    return String.fromCharCode.apply(null, new Uint8Array(buffer));
  }
  // ref: https://stackoverflow.com/a/40031979/1090359
  static fromBufferToHex(buffer) {
    if (_Utils.isNode) {
      return Buffer.from(buffer).toString("hex");
    } else {
      const bytes = new Uint8Array(buffer);
      return Array.prototype.map.call(bytes, (x) => ("00" + x.toString(16)).slice(-2)).join("");
    }
  }
  /**
   * Converts a hex string to an ArrayBuffer.
   * Note: this doesn't need any Node specific code as parseInt() / ArrayBuffer / Uint8Array
   * work the same in Node and the browser.
   * @param {string} hexString - A string of hexadecimal characters.
   * @returns {ArrayBuffer} The ArrayBuffer representation of the hex string.
   */
  static hexStringToArrayBuffer(hexString) {
    if (hexString.length % 2 !== 0) {
      throw "HexString has to be an even length";
    }
    const arrayBuffer = new ArrayBuffer(hexString.length / 2);
    const uint8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < uint8Array.length; i++) {
      const hexByte = hexString.substr(i * 2, 2);
      const byteValue = parseInt(hexByte, 16);
      uint8Array[i] = byteValue;
    }
    return arrayBuffer;
  }
  static fromUrlB64ToB64(urlB64Str) {
    let output = urlB64Str.replace(/-/g, "+").replace(/_/g, "/");
    switch (output.length % 4) {
      case 0:
        break;
      case 2:
        output += "==";
        break;
      case 3:
        output += "=";
        break;
      default:
        throw new Error("Illegal base64url string!");
    }
    return output;
  }
  static fromUrlB64ToUtf8(urlB64Str) {
    return _Utils.fromB64ToUtf8(_Utils.fromUrlB64ToB64(urlB64Str));
  }
  static fromUtf8ToB64(utfStr) {
    if (_Utils.isNode) {
      return Buffer.from(utfStr, "utf8").toString("base64");
    } else {
      return import_buffer.Buffer.from(utfStr, "utf8").toString("base64");
    }
  }
  static fromUtf8ToUrlB64(utfStr) {
    return _Utils.fromBufferToUrlB64(_Utils.fromUtf8ToArray(utfStr));
  }
  static fromB64ToUtf8(b64Str) {
    if (_Utils.isNode) {
      return Buffer.from(b64Str, "base64").toString("utf8");
    } else {
      return import_buffer.Buffer.from(b64Str, "base64").toString("utf8");
    }
  }
  // ref: http://stackoverflow.com/a/2117523/1090359
  /** @deprecated Use newGuid from @bitwarden/guid instead */
  static newGuid() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
      const r = Math.random() * 16 | 0;
      const v = c === "x" ? r : r & 3 | 8;
      return v.toString(16);
    });
  }
  static {
    /** @deprecated Use guidRegex from @bitwarden/guid instead */
    this.guidRegex = /^[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/;
  }
  /** @deprecated Use isGuid from @bitwarden/guid instead */
  static isGuid(id) {
    return RegExp(_Utils.guidRegex, "i").test(id);
  }
  static getHostname(uriString) {
    if (_Utils.isNullOrWhitespace(uriString)) {
      return null;
    }
    uriString = uriString.trim();
    if (uriString.startsWith("data:")) {
      return null;
    }
    if (uriString.startsWith("about:")) {
      return null;
    }
    if (uriString.startsWith("file:")) {
      return null;
    }
    if (uriString.indexOf("!") > 0) {
      return null;
    }
    try {
      const hostname = (0, import_tldts.getHostname)(uriString, { validHosts: this.validHosts });
      if (hostname != null) {
        return hostname;
      }
    } catch {
      return null;
    }
    return null;
  }
  static getHost(uriString) {
    const url = _Utils.getUrl(uriString);
    try {
      return url != null && url.host !== "" ? url.host : null;
    } catch {
      return null;
    }
  }
  static getDomain(uriString) {
    if (_Utils.isNullOrWhitespace(uriString)) {
      return null;
    }
    uriString = uriString.trim();
    if (uriString.startsWith("data:")) {
      return null;
    }
    if (uriString.startsWith("about:")) {
      return null;
    }
    try {
      const parseResult = (0, import_tldts.parse)(uriString, {
        validHosts: this.validHosts,
        allowPrivateDomains: true
      });
      if (parseResult != null && parseResult.hostname != null) {
        if (parseResult.hostname === "localhost" || parseResult.isIp) {
          return parseResult.hostname;
        }
        if (parseResult.domain != null) {
          return parseResult.domain;
        }
        return null;
      }
    } catch {
      return null;
    }
    return null;
  }
  static getQueryParams(uriString) {
    const url = _Utils.getUrl(uriString);
    if (url == null || url.search == null || url.search === "") {
      return null;
    }
    const map9 = /* @__PURE__ */ new Map();
    const pairs = (url.search[0] === "?" ? url.search.substr(1) : url.search).split("&");
    pairs.forEach((pair) => {
      const parts = pair.split("=");
      if (parts.length < 1) {
        return;
      }
      map9.set(
        decodeURIComponent(parts[0]).toLowerCase(),
        parts[1] == null ? "" : decodeURIComponent(parts[1])
      );
    });
    return map9;
  }
  static getSortFunction(i18nService, prop) {
    return (a, b) => {
      if (a[prop] == null && b[prop] != null) {
        return -1;
      }
      if (a[prop] != null && b[prop] == null) {
        return 1;
      }
      if (a[prop] == null && b[prop] == null) {
        return 0;
      }
      return i18nService.collator ? i18nService.collator.compare(a[prop], b[prop]) : a[prop].localeCompare(b[prop]);
    };
  }
  static isNullOrWhitespace(str) {
    return str == null || typeof str !== "string" || str.trim() === "";
  }
  static isNullOrEmpty(str) {
    return str == null || typeof str !== "string" || str == "";
  }
  static isPromise(obj) {
    return obj != void 0 && typeof obj["then"] === "function" && typeof obj["catch"] === "function";
  }
  static nameOf(name) {
    return name;
  }
  static assign(target, source) {
    return Object.assign(target, source);
  }
  static iterateEnum(obj) {
    return Object.keys(obj).filter((k) => Number.isNaN(+k)).map((k) => obj[k]);
  }
  static getUrl(uriString) {
    if (this.isNullOrWhitespace(uriString)) {
      return null;
    }
    uriString = uriString.trim();
    return _Utils.getUrlObject(uriString);
  }
  static camelToPascalCase(s) {
    return s.charAt(0).toUpperCase() + s.slice(1);
  }
  /**
   * There are a few ways to calculate text color for contrast, this one seems to fit accessibility guidelines best.
   * https://stackoverflow.com/a/3943023/6869691
   *
   * @param {string} bgColor
   * @param {number} [threshold] see stackoverflow link above
   * @param {boolean} [svgTextFill]
   * Indicates if this method is performed on an SVG <text> 'fill' attribute (e.g. <text fill="black"></text>).
   * This check is necessary because the '!important' tag cannot be used in a 'fill' attribute.
   */
  static pickTextColorBasedOnBgColor(bgColor, threshold = 186, svgTextFill = false) {
    const bgColorHexNums = bgColor.charAt(0) === "#" ? bgColor.substring(1, 7) : bgColor;
    const r = parseInt(bgColorHexNums.substring(0, 2), 16);
    const g = parseInt(bgColorHexNums.substring(2, 4), 16);
    const b = parseInt(bgColorHexNums.substring(4, 6), 16);
    const blackColor = svgTextFill ? "black" : "black !important";
    const whiteColor = svgTextFill ? "white" : "white !important";
    return r * 0.299 + g * 0.587 + b * 0.114 > threshold ? blackColor : whiteColor;
  }
  static stringToColor(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    let color = "#";
    for (let i = 0; i < 3; i++) {
      const value = hash >> i * 8 & 255;
      color += ("00" + value.toString(16)).substr(-2);
    }
    return color;
  }
  /**
   * @throws Will throw an error if the ContainerService has not been attached to the window object
   */
  static getContainerService() {
    if (this.global.bitwardenContainerService == null) {
      throw new Error("global bitwardenContainerService not initialized.");
    }
    return this.global.bitwardenContainerService;
  }
  static validateHexColor(color) {
    return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color);
  }
  /**
   * Converts map to a Record<string, V> with the same data. Inverse of recordToMap
   * Useful in toJSON methods, since Maps are not serializable
   * @param map
   * @returns
   */
  static mapToRecord(map9) {
    if (map9 == null) {
      return null;
    }
    if (!(map9 instanceof Map)) {
      return map9;
    }
    return Object.fromEntries(map9);
  }
  /**
   * Converts record to a Map<string, V> with the same data. Inverse of mapToRecord
   * Useful in fromJSON methods, since Maps are not serializable
   *
   * Warning: If the record has string keys that are numbers, they will be converted to numbers in the map
   * @param record
   * @returns
   */
  static recordToMap(record2) {
    if (record2 == null) {
      return null;
    } else if (record2 instanceof Map) {
      return record2;
    }
    const entries = Object.entries(record2);
    if (entries.length === 0) {
      return /* @__PURE__ */ new Map();
    }
    if (isNaN(Number(entries[0][0]))) {
      return new Map(entries);
    } else {
      return new Map(entries.map((e) => [Number(e[0]), e[1]]));
    }
  }
  /** Applies Object.assign, but converts the type nicely using Type-Fest Merge<Destination, Source> */
  static merge(destination, source) {
    return Object.assign(destination, source);
  }
  /**
   * encodeURIComponent escapes all characters except the following:
   * alphabetic, decimal digits, - _ . ! ~ * ' ( )
   * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent#encoding_for_rfc3986
   */
  static encodeRFC3986URIComponent(str) {
    return encodeURIComponent(str).replace(
      /[!'()*]/g,
      (c) => `%${c.charCodeAt(0).toString(16).toUpperCase()}`
    );
  }
  /**
   * Normalizes a path for defense against attacks like traversals
   * @param denormalizedPath
   * @returns
   */
  static normalizePath(denormalizedPath) {
    return path.normalize(decodeURIComponent(denormalizedPath)).replace(/^(\.\.(\/|\\|$))+/, "");
  }
  /**
   * Validates an url checking against invalid patterns
   * @param url
   * @returns true if invalid patterns found, false if safe
   */
  static invalidUrlPatterns(url) {
    const invalidUrlPatterns = ["..", "%2e", "\\", "%5c"];
    const decodedUrl = decodeURIComponent(url.toLocaleLowerCase());
    if (invalidUrlPatterns.some((p) => decodedUrl.includes(p))) {
      return true;
    }
    if (decodedUrl.includes("?")) {
      const hasInvalidParams = this.validateQueryParameters(decodedUrl);
      if (hasInvalidParams) {
        return true;
      }
    }
    return false;
  }
  /**
   * Validates query parameters for additional invalid patterns
   * @param url - The URL containing query parameters
   * @returns true if invalid patterns found, false if safe
   */
  static validateQueryParameters(url) {
    try {
      let queryString;
      if (url.includes("?")) {
        queryString = url.split("?")[1];
      } else {
        return false;
      }
      const paramInvalidPatterns = ["/", "%2f", "#", "%23"];
      return paramInvalidPatterns.some((p) => queryString.includes(p));
    } catch (error) {
      throw new Error(`Error validating query parameters: ${error}`);
    }
  }
  static isMobile(win) {
    let mobile = false;
    ((a) => {
      if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(
        a
      ) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
        a.substr(0, 4)
      )) {
        mobile = true;
      }
    })(win.navigator.userAgent || win.navigator.vendor || win.opera);
    return mobile || win.navigator.userAgent.match(/iPad/i) != null;
  }
  static delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  /**
   * Generate an observable from a function that returns a promise.
   * Similar to the rxjs function {@link from} with one big exception:
   * {@link from} will not re-execute the function when observers resubscribe.
   * {@link Util.asyncToObservable} will execute `generator` for every
   * subscribe, making it ideal if the value ever needs to be refreshed.
   * */
  static asyncToObservable(generator) {
    return (0, import_rxjs3.of)(void 0).pipe((0, import_rxjs3.switchMap)(() => generator()));
  }
  /**
   * Return the number of days remaining before a target date arrives.
   * Returns 0 if the day has already passed.
   */
  static daysRemaining(targetDate) {
    const diffTime = targetDate.getTime() - Date.now();
    const msPerDay = 864e5;
    return Math.max(0, Math.floor(diffTime / msPerDay));
  }
  static isAppleMobile(win) {
    return win.navigator.userAgent.match(/iPhone/i) != null || win.navigator.userAgent.match(/iPad/i) != null;
  }
  static getUrlObject(uriString) {
    const hasProtocol = uriString.indexOf("://") > -1;
    if (!hasProtocol && uriString.indexOf(".") > -1) {
      uriString = "http://" + uriString;
    } else if (!hasProtocol) {
      return null;
    }
    try {
      if (nodeURL != null) {
        return new nodeURL.URL(uriString);
      }
      return new URL(uriString);
    } catch (e) {
    }
    return null;
  }
};
Utils.init();

// libs/common/src/key-management/crypto/models/enc-string.ts
var DECRYPT_ERROR = "[error: cannot decrypt]";
var EncString = class _EncString {
  constructor(encryptedStringOrType, data, iv, mac) {
    if (data != null) {
      this.initFromData(encryptedStringOrType, data, iv, mac);
    } else {
      this.initFromEncryptedString(encryptedStringOrType);
    }
  }
  get ivBytes() {
    return this.iv == null ? null : Utils.fromB64ToArray(this.iv);
  }
  get macBytes() {
    return this.mac == null ? null : Utils.fromB64ToArray(this.mac);
  }
  get dataBytes() {
    return this.data == null ? null : Utils.fromB64ToArray(this.data);
  }
  toSdk() {
    return this.encryptedString;
  }
  toJSON() {
    return this.encryptedString;
  }
  static fromJSON(obj) {
    if (obj == null) {
      return null;
    }
    return new _EncString(obj);
  }
  initFromData(encType, data, iv, mac) {
    if (iv != null) {
      this.encryptedString = encType + "." + iv + "|" + data;
    } else {
      this.encryptedString = encType + "." + data;
    }
    if (mac != null) {
      this.encryptedString = this.encryptedString + "|" + mac;
    }
    this.encryptionType = encType;
    this.data = data;
    this.iv = iv;
    this.mac = mac;
  }
  initFromEncryptedString(encryptedString) {
    this.encryptedString = encryptedString;
    if (!this.encryptedString) {
      return;
    }
    const { encType, encPieces } = _EncString.parseEncryptedString(this.encryptedString);
    this.encryptionType = encType;
    if (encPieces.length !== EXPECTED_NUM_PARTS_BY_ENCRYPTION_TYPE[encType]) {
      return;
    }
    switch (encType) {
      case 2 /* AesCbc256_HmacSha256_B64 */:
        this.iv = encPieces[0];
        this.data = encPieces[1];
        this.mac = encPieces[2];
        break;
      case 0 /* AesCbc256_B64 */:
        this.iv = encPieces[0];
        this.data = encPieces[1];
        break;
      case 3 /* Rsa2048_OaepSha256_B64 */:
      case 4 /* Rsa2048_OaepSha1_B64 */:
        this.data = encPieces[0];
        break;
      case 5 /* Rsa2048_OaepSha256_HmacSha256_B64 */:
      case 6 /* Rsa2048_OaepSha1_HmacSha256_B64 */:
        this.data = encPieces[0];
        this.mac = encPieces[1];
        break;
      default:
        return;
    }
  }
  static parseEncryptedString(encryptedString) {
    const headerPieces = encryptedString.split(".");
    let encType;
    let encPieces = null;
    if (headerPieces.length === 2) {
      try {
        encType = parseInt(headerPieces[0], null);
        encPieces = headerPieces[1].split("|");
      } catch (e) {
        return { encType: NaN, encPieces: [] };
      }
    } else {
      encPieces = encryptedString.split("|");
      encType = 0 /* AesCbc256_B64 */;
    }
    return {
      encType,
      encPieces
    };
  }
  static isSerializedEncString(s) {
    if (s == null) {
      return false;
    }
    const { encType, encPieces } = this.parseEncryptedString(s);
    if (isNaN(encType) || encPieces.length === 0) {
      return false;
    }
    return EXPECTED_NUM_PARTS_BY_ENCRYPTION_TYPE[encType] === encPieces.length;
  }
  /**
   * @deprecated - This function is deprecated. Use EncryptService.decryptString instead.
   * @returns - The decrypted string, or `[error: cannot decrypt]` if decryption fails.
   */
  async decrypt(orgId, key = null, context) {
    if (this.decryptedValue != null) {
      return this.decryptedValue;
    }
    try {
      if (key == null) {
        key = await this.getKeyForDecryption(orgId);
      }
      if (key == null) {
        throw new Error("No key to decrypt EncString with orgId " + orgId);
      }
      const encryptService = Utils.getContainerService().getEncryptService();
      this.decryptedValue = await encryptService.decryptString(this, key);
    } catch (e) {
      console.error(
        "[EncString Generic Decrypt] failed to decrypt encstring. Context: " + (context ?? "No context"),
        e
      );
      this.decryptedValue = DECRYPT_ERROR;
    }
    return this.decryptedValue;
  }
  async getKeyForDecryption(orgId) {
    const keyService = Utils.getContainerService().getKeyService();
    return orgId != null ? await keyService.getOrgKey(orgId) : await keyService.getUserKey();
  }
};

// libs/common/src/enums/push-notification-logout-reason.enum.ts
var PushNotificationLogOutReasonType = Object.freeze({
  KdfChange: 0
});

// libs/common/src/platform/abstractions/sdk/sdk.service.ts
var InvalidUuid = class extends Error {
  constructor(uuid) {
    super(`Invalid UUID: ${uuid}`);
  }
};
function asUuid(uuid) {
  if (Utils.isGuid(uuid)) {
    return uuid;
  }
  throw new InvalidUuid(uuid);
}
function uuidAsString(uuid) {
  return uuid;
}

// libs/common/src/platform/models/domain/domain-base.ts
var Domain = class {
  buildDomainModel(domain, dataObj, map9, notEncList = []) {
    for (const prop in map9) {
      if (!map9.hasOwnProperty(prop)) {
        continue;
      }
      const objProp = dataObj[map9[prop] || prop];
      if (notEncList.indexOf(prop) > -1) {
        domain[prop] = objProp ? objProp : null;
      } else {
        domain[prop] = objProp ? new EncString(objProp) : null;
      }
    }
  }
  buildDataModel(domain, dataObj, map9, notEncStringList = []) {
    for (const prop in map9) {
      if (!map9.hasOwnProperty(prop)) {
        continue;
      }
      const objProp = domain[map9[prop] || prop];
      if (notEncStringList.indexOf(prop) > -1) {
        dataObj[prop] = objProp != null ? objProp : null;
      } else {
        dataObj[prop] = objProp != null ? objProp.encryptedString : null;
      }
    }
  }
  async decryptObj(domain, viewModel, props, key = null, objectContext = "No Domain Context") {
    for (const prop of props) {
      viewModel[prop] = await domain[prop]?.decrypt(
        null,
        key,
        `Property: ${prop}; ObjectContext: ${objectContext}`
      ) ?? null;
    }
    return viewModel;
  }
};

// libs/common/src/vault/utils/domain-utils.ts
var conditionalEncString = (value) => {
  return value != null ? new EncString(value) : void 0;
};
var encStringFrom = (value) => {
  return value != null ? EncString.fromJSON(value) : void 0;
};

// libs/common/src/vault/models/data/local.data.ts
function fromSdkLocalData(localData) {
  if (localData == null) {
    return void 0;
  }
  return {
    lastUsedDate: localData.lastUsedDate ? new Date(localData.lastUsedDate).getTime() : void 0,
    lastLaunched: localData.lastLaunched ? new Date(localData.lastLaunched).getTime() : void 0
  };
}
function toSdkLocalData(localData) {
  if (localData == null) {
    return void 0;
  }
  return {
    lastUsedDate: localData.lastUsedDate ? new Date(localData.lastUsedDate).toISOString() : void 0,
    lastLaunched: localData.lastLaunched ? new Date(localData.lastLaunched).toISOString() : void 0
  };
}

// libs/common/src/platform/models/domain/symmetric-crypto-key.ts
var SymmetricCryptoKey = class _SymmetricCryptoKey {
  /**
   * @param key The key in one of the permitted serialization formats
   */
  constructor(key) {
    if (key == null) {
      throw new Error("Must provide key");
    }
    if (key.byteLength === 32) {
      this.innerKey = {
        type: 0 /* AesCbc256_B64 */,
        encryptionKey: key
      };
      this.keyB64 = this.toBase64();
    } else if (key.byteLength === 64) {
      this.innerKey = {
        type: 2 /* AesCbc256_HmacSha256_B64 */,
        encryptionKey: key.slice(0, 32),
        authenticationKey: key.slice(32)
      };
      this.keyB64 = this.toBase64();
    } else if (key.byteLength > 64) {
      this.innerKey = {
        type: 7 /* CoseEncrypt0 */,
        encryptionKey: key
      };
      this.keyB64 = this.toBase64();
    } else {
      throw new Error(`Unsupported encType/key length ${key.byteLength}`);
    }
  }
  toJSON() {
    return { keyB64: this.keyB64 };
  }
  /**
   * It is preferred not to work with the raw key where possible.
   * Only use this method if absolutely necessary.
   *
   * @returns The inner key instance that can be directly used for encryption primitives
   */
  inner() {
    return this.innerKey;
  }
  /**
   * @returns The serialized key in base64 format
   */
  toBase64() {
    return Utils.fromBufferToB64(this.toEncoded());
  }
  /**
   * Serializes the key to a format that can be written to state or shared
   * The currently permitted format is:
   * - AesCbc256_B64: 32 bytes (the raw key)
   * - AesCbc256_HmacSha256_B64: 64 bytes (32 bytes encryption key, 32 bytes authentication key, concatenated)
   *
   * @returns The serialized key that can be written to state or encrypted and then written to state / shared
   */
  toEncoded() {
    if (this.innerKey.type === 0 /* AesCbc256_B64 */) {
      return this.innerKey.encryptionKey;
    } else if (this.innerKey.type === 2 /* AesCbc256_HmacSha256_B64 */) {
      const encodedKey = new Uint8Array(64);
      encodedKey.set(this.innerKey.encryptionKey, 0);
      encodedKey.set(this.innerKey.authenticationKey, 32);
      return encodedKey;
    } else if (this.innerKey.type === 7 /* CoseEncrypt0 */) {
      return this.innerKey.encryptionKey;
    } else {
      throw new Error("Unsupported encryption type.");
    }
  }
  /**
   * @param s The serialized key in base64 format
   * @returns A SymmetricCryptoKey instance
   */
  static fromString(s) {
    if (s == null) {
      return null;
    }
    const arrayBuffer = Utils.fromB64ToArray(s);
    return new _SymmetricCryptoKey(arrayBuffer);
  }
  static fromJSON(obj) {
    return _SymmetricCryptoKey.fromString(obj?.keyB64);
  }
};

// libs/common/src/vault/models/view/attachment.view.ts
var AttachmentView = class _AttachmentView {
  constructor(a) {
    if (!a) {
      return;
    }
    this.id = a.id;
    this.url = a.url;
    this.size = a.size;
    this.sizeName = a.sizeName;
  }
  get fileSize() {
    try {
      if (this.size != null) {
        return parseInt(this.size);
      }
    } catch {
    }
    return 0;
  }
  get hasDecryptionError() {
    return this._hasDecryptionError || this.fileName === DECRYPT_ERROR;
  }
  set hasDecryptionError(value) {
    this._hasDecryptionError = value;
  }
  static fromJSON(obj) {
    const key = obj.key == null ? null : SymmetricCryptoKey.fromJSON(obj.key);
    let encryptedKey;
    if (obj.encryptedKey != null) {
      if (typeof obj.encryptedKey === "string") {
        encryptedKey = EncString.fromJSON(obj.encryptedKey);
      } else if (obj.encryptedKey instanceof EncString) {
        encryptedKey = obj.encryptedKey;
      }
    }
    return Object.assign(new _AttachmentView(), obj, { key, encryptedKey });
  }
  /**
   * Converts the AttachmentView to a SDK AttachmentView.
   */
  toSdkAttachmentView() {
    return {
      id: this.id,
      url: this.url,
      size: this.size,
      sizeName: this.sizeName,
      fileName: this.fileName,
      key: this.encryptedKey?.toSdk(),
      // TODO: PM-23005 - Temporary field, should be removed when encrypted migration is complete
      decryptedKey: this.key ? this.key.toBase64() : void 0
    };
  }
  /**
   * Converts the SDK AttachmentView to a AttachmentView.
   */
  static fromSdkAttachmentView(obj, failure = false) {
    if (!obj) {
      return void 0;
    }
    const view = new _AttachmentView();
    view.id = obj.id;
    view.url = obj.url;
    view.size = obj.size;
    view.sizeName = obj.sizeName;
    view.fileName = obj.fileName;
    view.key = obj.decryptedKey ? SymmetricCryptoKey.fromString(obj.decryptedKey) : void 0;
    view.encryptedKey = obj.key ? new EncString(obj.key) : void 0;
    view._hasDecryptionError = failure;
    return view;
  }
};

// libs/common/src/autofill/constants/match-patterns.ts
var CardExpiryDateDelimiters = ["/", "-", ".", " "];
var ExpiryDateDelimitersPattern = "\\" + CardExpiryDateDelimiters.join("\\").replace(" ", "s");
var MonthPattern = "(([1]{1}[0-2]{1})|(0?[1-9]{1}))";
var ExpiryFullYearPattern = "2[0-1]{1}\\d{2}";
var DelimiterPatternExpression = new RegExp(`[${ExpiryDateDelimitersPattern}]`, "g");
var IrrelevantExpiryCharactersPatternExpression = new RegExp(
  // "nor digits" to ensure numbers are removed from guidance pattern, which aren't covered by ^\w
  `[^\\d${ExpiryDateDelimitersPattern}]`,
  "g"
);
var MonthPatternExpression = new RegExp(`^${MonthPattern}$`);
var ExpiryFullYearPatternExpression = new RegExp(`^${ExpiryFullYearPattern}$`);

// libs/common/src/autofill/constants/index.ts
var CLEAR_NOTIFICATION_LOGIN_DATA_DURATION = 60 * 1e3;

// libs/common/src/autofill/utils.ts
function normalizeExpiryYearFormat(yearInput) {
  const yearInputIsEmpty = yearInput == null || yearInput === "";
  let expirationYear = yearInputIsEmpty ? null : `${yearInput}`;
  if (yearInputIsEmpty || expirationYear && /^[1-9]{1}\d{3}$/.test(expirationYear)) {
    return expirationYear;
  }
  expirationYear = (expirationYear || "").replace(/[^\d]/g, "").replace(/^[0]+(?=.)/, "");
  if (expirationYear === "") {
    expirationYear = null;
  }
  if (expirationYear && expirationYear.length !== 4) {
    const paddedYear = ("00" + expirationYear).slice(-2);
    const currentCentury = `${(/* @__PURE__ */ new Date()).getFullYear()}`.slice(0, 2);
    expirationYear = currentCentury + paddedYear;
  }
  return expirationYear;
}

// libs/common/src/vault/linked-field-option.decorator.ts
var LinkedMetadata = class {
  constructor(propertyKey, attributes) {
    this.propertyKey = propertyKey;
    this._i18nKey = attributes?.i18nKey;
    this.sortPosition = attributes.sortPosition;
  }
  get i18nKey() {
    return this._i18nKey ?? this.propertyKey;
  }
};
function linkedFieldOption(id, attributes) {
  return (prototype, propertyKey) => {
    if (prototype.linkedFieldOptions == null) {
      prototype.linkedFieldOptions = /* @__PURE__ */ new Map();
    }
    prototype.linkedFieldOptions.set(id, new LinkedMetadata(propertyKey, attributes));
  };
}

// libs/common/src/vault/models/view/item.view.ts
var ItemView = class {
};

// libs/common/src/vault/models/view/card.view.ts
var _CardView = class _CardView extends ItemView {
  get maskedCode() {
    return this.code != null ? "\u2022".repeat(this.code.length) : void 0;
  }
  get maskedNumber() {
    return this.number != null ? "\u2022".repeat(this.number.length) : void 0;
  }
  get brand() {
    return this._brand;
  }
  set brand(value) {
    this._brand = value;
    this._subTitle = void 0;
  }
  get number() {
    return this._number;
  }
  set number(value) {
    this._number = value;
    this._subTitle = void 0;
  }
  get subTitle() {
    if (this._subTitle == null) {
      this._subTitle = this.brand;
      if (this.number != null && this.number.length >= 4) {
        if (this._subTitle != null && this._subTitle !== "") {
          this._subTitle += ", ";
        } else {
          this._subTitle = "";
        }
        const count = this.number.length >= 5 && this.number.match(new RegExp("^3[47]")) != null ? 5 : 4;
        this._subTitle += "*" + this.number.substr(this.number.length - count);
      }
    }
    return this._subTitle;
  }
  get expiration() {
    const normalizedYear = this.expYear ? normalizeExpiryYearFormat(this.expYear) : void 0;
    if (!this.expMonth && !normalizedYear) {
      return void 0;
    }
    let exp = this.expMonth != null ? ("0" + this.expMonth).slice(-2) : "__";
    exp += " / " + (normalizedYear || "____");
    return exp;
  }
  static fromJSON(obj) {
    return Object.assign(new _CardView(), obj);
  }
  // ref https://stackoverflow.com/a/5911300
  static getCardBrandByPatterns(cardNum) {
    if (cardNum == null || typeof cardNum !== "string" || cardNum.trim() === "") {
      return void 0;
    }
    let re = new RegExp("^4");
    if (cardNum.match(re) != null) {
      return "Visa";
    }
    if (/^(5[1-5][0-9]{14}|2(22[1-9][0-9]{12}|2[3-9][0-9]{13}|[3-6][0-9]{14}|7[0-1][0-9]{13}|720[0-9]{12}))$/.test(
      cardNum
    )) {
      return "Mastercard";
    }
    re = new RegExp("^3[47]");
    if (cardNum.match(re) != null) {
      return "Amex";
    }
    re = new RegExp(
      "^(6011|622(12[6-9]|1[3-9][0-9]|[2-8][0-9]{2}|9[0-1][0-9]|92[0-5]|64[4-9])|65)"
    );
    if (cardNum.match(re) != null) {
      return "Discover";
    }
    re = new RegExp("^36");
    if (cardNum.match(re) != null) {
      return "Diners Club";
    }
    re = new RegExp("^30[0-5]");
    if (cardNum.match(re) != null) {
      return "Diners Club";
    }
    re = new RegExp("^35(2[89]|[3-8][0-9])");
    if (cardNum.match(re) != null) {
      return "JCB";
    }
    re = new RegExp("^(4026|417500|4508|4844|491(3|7))");
    if (cardNum.match(re) != null) {
      return "Visa";
    }
    return void 0;
  }
  /**
   * Converts an SDK CardView to a CardView.
   */
  static fromSdkCardView(obj) {
    const cardView = new _CardView();
    cardView.cardholderName = obj.cardholderName;
    cardView.brand = obj.brand;
    cardView.number = obj.number;
    cardView.expMonth = obj.expMonth;
    cardView.expYear = obj.expYear;
    cardView.code = obj.code;
    return cardView;
  }
  /**
   * Converts the CardView to an SDK CardView.
   * The view implements the SdkView so we can safely return `this`
   */
  toSdkCardView() {
    return this;
  }
};
__decorateClass([
  linkedFieldOption(CardLinkedId.CardholderName, { sortPosition: 0 })
], _CardView.prototype, "cardholderName", 2);
__decorateClass([
  linkedFieldOption(CardLinkedId.ExpMonth, { sortPosition: 3, i18nKey: "expirationMonth" })
], _CardView.prototype, "expMonth", 2);
__decorateClass([
  linkedFieldOption(CardLinkedId.ExpYear, { sortPosition: 4, i18nKey: "expirationYear" })
], _CardView.prototype, "expYear", 2);
__decorateClass([
  linkedFieldOption(CardLinkedId.Code, { sortPosition: 5, i18nKey: "securityCode" })
], _CardView.prototype, "code", 2);
__decorateClass([
  linkedFieldOption(CardLinkedId.Brand, { sortPosition: 2 })
], _CardView.prototype, "brand", 1);
__decorateClass([
  linkedFieldOption(CardLinkedId.Number, { sortPosition: 1 })
], _CardView.prototype, "number", 1);
var CardView = _CardView;

// libs/common/src/vault/models/view/field.view.ts
var import_sdk_internal = require("@bitwarden/sdk-internal");
var FieldView = class _FieldView {
  constructor(f) {
    this.type = FieldType.Text;
    this.newField = false;
    // Marks if the field is new and hasn't been saved
    this.showValue = false;
    this.showCount = false;
    if (!f) {
      return;
    }
    this.type = f.type;
    this.linkedId = f.linkedId;
  }
  get maskedValue() {
    return this.value != null ? "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022" : void 0;
  }
  static fromJSON(obj) {
    return Object.assign(new _FieldView(), obj);
  }
  /**
   * Converts the SDK FieldView to a FieldView.
   */
  static fromSdkFieldView(obj) {
    if (!obj) {
      return void 0;
    }
    const view = new _FieldView();
    view.name = obj.name;
    view.value = obj.value;
    view.type = obj.type;
    view.linkedId = obj.linkedId;
    return view;
  }
  /**
   * Converts the FieldView to an SDK FieldView.
   */
  toSdkFieldView() {
    return {
      name: this.name ?? void 0,
      value: this.value ?? void 0,
      type: this.type ?? import_sdk_internal.FieldType.Text,
      linkedId: this.linkedId ?? void 0
    };
  }
};

// libs/common/src/vault/models/view/identity.view.ts
var _IdentityView = class _IdentityView extends ItemView {
  constructor() {
    super();
  }
  get firstName() {
    return this._firstName;
  }
  set firstName(value) {
    this._firstName = value;
    this._subTitle = void 0;
  }
  get lastName() {
    return this._lastName;
  }
  set lastName(value) {
    this._lastName = value;
    this._subTitle = void 0;
  }
  get subTitle() {
    if (this._subTitle == null && (this.firstName != null || this.lastName != null)) {
      this._subTitle = "";
      if (this.firstName != null) {
        this._subTitle = this.firstName;
      }
      if (this.lastName != null) {
        if (this._subTitle !== "") {
          this._subTitle += " ";
        }
        this._subTitle += this.lastName;
      }
    }
    return this._subTitle;
  }
  get fullName() {
    if (this.title != null || this.firstName != null || this.middleName != null || this.lastName != null) {
      let name = "";
      if (!Utils.isNullOrWhitespace(this.title)) {
        name += this.title + " ";
      }
      if (!Utils.isNullOrWhitespace(this.firstName)) {
        name += this.firstName + " ";
      }
      if (!Utils.isNullOrWhitespace(this.middleName)) {
        name += this.middleName + " ";
      }
      if (!Utils.isNullOrWhitespace(this.lastName)) {
        name += this.lastName;
      }
      return name.trim();
    }
    return void 0;
  }
  get fullAddress() {
    let address = this.address1 ?? "";
    if (!Utils.isNullOrWhitespace(this.address2)) {
      if (!Utils.isNullOrWhitespace(address)) {
        address += ", ";
      }
      address += this.address2;
    }
    if (!Utils.isNullOrWhitespace(this.address3)) {
      if (!Utils.isNullOrWhitespace(address)) {
        address += ", ";
      }
      address += this.address3;
    }
    return address;
  }
  get fullAddressPart2() {
    const hasCity = !Utils.isNullOrWhitespace(this.city);
    const hasState = !Utils.isNullOrWhitespace(this.state);
    const hasPostalCode = !Utils.isNullOrWhitespace(this.postalCode);
    if (!hasCity && !hasState && !hasPostalCode) {
      return void 0;
    }
    const city = hasCity ? this.city : "-";
    const state = this.state;
    const postalCode = hasPostalCode ? this.postalCode : "-";
    let addressPart2 = city;
    if (hasState) {
      addressPart2 += ", " + state;
    }
    addressPart2 += ", " + postalCode;
    return addressPart2;
  }
  get fullAddressForCopy() {
    let address = this.fullAddress;
    if (this.city != null || this.state != null || this.postalCode != null) {
      address += "\n" + this.fullAddressPart2;
    }
    if (this.country != null) {
      address += "\n" + this.country;
    }
    return address;
  }
  static fromJSON(obj) {
    return Object.assign(new _IdentityView(), obj);
  }
  /**
   * Converts the SDK IdentityView to an IdentityView.
   */
  static fromSdkIdentityView(obj) {
    const identityView = new _IdentityView();
    identityView.title = obj.title;
    identityView.firstName = obj.firstName;
    identityView.middleName = obj.middleName;
    identityView.lastName = obj.lastName;
    identityView.address1 = obj.address1;
    identityView.address2 = obj.address2;
    identityView.address3 = obj.address3;
    identityView.city = obj.city;
    identityView.state = obj.state;
    identityView.postalCode = obj.postalCode;
    identityView.country = obj.country;
    identityView.company = obj.company;
    identityView.email = obj.email;
    identityView.phone = obj.phone;
    identityView.ssn = obj.ssn;
    identityView.username = obj.username;
    identityView.passportNumber = obj.passportNumber;
    identityView.licenseNumber = obj.licenseNumber;
    return identityView;
  }
  /**
   * Converts the IdentityView to an SDK IdentityView.
   * The view implements the SdkView so we can safely return `this`
   */
  toSdkIdentityView() {
    return this;
  }
};
__decorateClass([
  linkedFieldOption(IdentityLinkedId.Title, { sortPosition: 0 })
], _IdentityView.prototype, "title", 2);
__decorateClass([
  linkedFieldOption(IdentityLinkedId.MiddleName, { sortPosition: 2 })
], _IdentityView.prototype, "middleName", 2);
__decorateClass([
  linkedFieldOption(IdentityLinkedId.Address1, { sortPosition: 12 })
], _IdentityView.prototype, "address1", 2);
__decorateClass([
  linkedFieldOption(IdentityLinkedId.Address2, { sortPosition: 13 })
], _IdentityView.prototype, "address2", 2);
__decorateClass([
  linkedFieldOption(IdentityLinkedId.Address3, { sortPosition: 14 })
], _IdentityView.prototype, "address3", 2);
__decorateClass([
  linkedFieldOption(IdentityLinkedId.City, { sortPosition: 15, i18nKey: "cityTown" })
], _IdentityView.prototype, "city", 2);
__decorateClass([
  linkedFieldOption(IdentityLinkedId.State, { sortPosition: 16, i18nKey: "stateProvince" })
], _IdentityView.prototype, "state", 2);
__decorateClass([
  linkedFieldOption(IdentityLinkedId.PostalCode, { sortPosition: 17, i18nKey: "zipPostalCodeLabel" })
], _IdentityView.prototype, "postalCode", 2);
__decorateClass([
  linkedFieldOption(IdentityLinkedId.Country, { sortPosition: 18 })
], _IdentityView.prototype, "country", 2);
__decorateClass([
  linkedFieldOption(IdentityLinkedId.Company, { sortPosition: 6 })
], _IdentityView.prototype, "company", 2);
__decorateClass([
  linkedFieldOption(IdentityLinkedId.Email, { sortPosition: 10 })
], _IdentityView.prototype, "email", 2);
__decorateClass([
  linkedFieldOption(IdentityLinkedId.Phone, { sortPosition: 11 })
], _IdentityView.prototype, "phone", 2);
__decorateClass([
  linkedFieldOption(IdentityLinkedId.Ssn, { sortPosition: 7 })
], _IdentityView.prototype, "ssn", 2);
__decorateClass([
  linkedFieldOption(IdentityLinkedId.Username, { sortPosition: 5 })
], _IdentityView.prototype, "username", 2);
__decorateClass([
  linkedFieldOption(IdentityLinkedId.PassportNumber, { sortPosition: 8 })
], _IdentityView.prototype, "passportNumber", 2);
__decorateClass([
  linkedFieldOption(IdentityLinkedId.LicenseNumber, { sortPosition: 9 })
], _IdentityView.prototype, "licenseNumber", 2);
__decorateClass([
  linkedFieldOption(IdentityLinkedId.FirstName, { sortPosition: 1 })
], _IdentityView.prototype, "firstName", 1);
__decorateClass([
  linkedFieldOption(IdentityLinkedId.LastName, { sortPosition: 4 })
], _IdentityView.prototype, "lastName", 1);
__decorateClass([
  linkedFieldOption(IdentityLinkedId.FullName, { sortPosition: 3 })
], _IdentityView.prototype, "fullName", 1);
var IdentityView = _IdentityView;

// libs/common/src/vault/models/view/fido2-credential.view.ts
var Fido2CredentialView = class _Fido2CredentialView extends ItemView {
  constructor(f) {
    super();
    this.discoverable = false;
    if (f == null) {
      return;
    }
    this.credentialId = f.credentialId;
    this.keyType = f.keyType;
    this.keyAlgorithm = f.keyAlgorithm;
    this.keyCurve = f.keyCurve;
    this.keyValue = f.keyValue;
    this.rpId = f.rpId;
    this.userHandle = f.userHandle;
    this.userName = f.userName;
    this.counter = f.counter;
    this.rpName = f.rpName;
    this.userDisplayName = f.userDisplayName;
    this.discoverable = f.discoverable ?? false;
    this.creationDate = f.creationDate;
  }
  get subTitle() {
    return this.userDisplayName;
  }
  static fromJSON(obj) {
    const creationDate = obj.creationDate != null ? new Date(obj.creationDate) : null;
    return Object.assign(new _Fido2CredentialView(), obj, {
      creationDate
    });
  }
  /**
   * Converts the SDK Fido2CredentialView to a Fido2CredentialView.
   */
  static fromSdkFido2CredentialView(obj) {
    if (!obj) {
      return void 0;
    }
    return new _Fido2CredentialView({
      credentialId: obj.credentialId,
      keyType: obj.keyType,
      keyAlgorithm: obj.keyAlgorithm,
      keyCurve: obj.keyCurve,
      keyValue: obj.keyValue,
      rpId: obj.rpId,
      userHandle: obj.userHandle,
      userName: obj.userName,
      counter: parseInt(obj.counter),
      rpName: obj.rpName,
      userDisplayName: obj.userDisplayName,
      discoverable: obj.discoverable?.toLowerCase() === "true",
      creationDate: new Date(obj.creationDate)
    });
  }
  toSdkFido2CredentialFullView() {
    return {
      credentialId: this.credentialId,
      keyType: this.keyType,
      keyAlgorithm: this.keyAlgorithm,
      keyCurve: this.keyCurve,
      keyValue: this.keyValue,
      rpId: this.rpId,
      userHandle: this.userHandle,
      userName: this.userName,
      counter: this.counter.toString(),
      rpName: this.rpName,
      userDisplayName: this.userDisplayName,
      discoverable: this.discoverable ? "true" : "false",
      creationDate: this.creationDate?.toISOString()
    };
  }
};

// libs/common/src/models/domain/domain-service.ts
var UriMatchStrategy = {
  Domain: 0,
  Host: 1,
  StartsWith: 2,
  Exact: 3,
  RegularExpression: 4,
  Never: 5
};
function normalizeUriMatchStrategyForSdk(value) {
  if (value == null) {
    return void 0;
  }
  switch (value) {
    case 0:
    // Domain
    case 1:
    // Host
    case 2:
    // StartsWith
    case 3:
    // Exact
    case 4:
    // RegularExpression
    case 5:
      return value;
    default:
      return void 0;
  }
}

// libs/common/src/platform/misc/safe-urls.ts
var CanLaunchWhitelist = [
  "https://",
  "http://",
  "ssh://",
  "ftp://",
  "sftp://",
  "irc://",
  "vnc://",
  // https://docs.microsoft.com/en-us/windows-server/remote/remote-desktop-services/clients/remote-desktop-uri
  "rdp://",
  // Legacy RDP URI scheme
  "ms-rd:",
  // Preferred RDP URI scheme
  "chrome://",
  "iosapp://",
  "androidapp://"
];
var SafeUrls = class {
  static canLaunch(uri) {
    if (Utils.isNullOrWhitespace(uri)) {
      return false;
    }
    for (let i = 0; i < CanLaunchWhitelist.length; i++) {
      if (uri.indexOf(CanLaunchWhitelist[i]) === 0) {
        return true;
      }
    }
    return false;
  }
};

// libs/common/src/vault/models/view/login-uri.view.ts
var LoginUriView = class _LoginUriView {
  constructor(u) {
    if (!u) {
      return;
    }
    this.match = u.match;
  }
  get uri() {
    return this._uri;
  }
  set uri(value) {
    this._uri = value;
    this._domain = void 0;
    this._canLaunch = void 0;
  }
  get domain() {
    if (this._domain == null && this.uri != null) {
      this._domain = Utils.getDomain(this.uri);
      if (this._domain === "") {
        this._domain = void 0;
      }
    }
    return this._domain;
  }
  get hostname() {
    if (this.match === UriMatchStrategy.RegularExpression) {
      return void 0;
    }
    if (this._hostname == null && this.uri != null) {
      this._hostname = Utils.getHostname(this.uri);
      if (this._hostname === "") {
        this._hostname = void 0;
      }
    }
    return this._hostname;
  }
  get host() {
    if (this.match === UriMatchStrategy.RegularExpression) {
      return void 0;
    }
    if (this._host == null && this.uri != null) {
      this._host = Utils.getHost(this.uri);
      if (this._host === "") {
        this._host = void 0;
      }
    }
    return this._host;
  }
  get hostnameOrUri() {
    return this.hostname != null ? this.hostname : this.uri;
  }
  get hostOrUri() {
    return this.host != null ? this.host : this.uri;
  }
  get isWebsite() {
    return this.uri != null && (this.uri.indexOf("http://") === 0 || this.uri.indexOf("https://") === 0 || this.uri.indexOf("://") < 0 && !Utils.isNullOrWhitespace(Utils.getDomain(this.uri)));
  }
  get canLaunch() {
    if (this._canLaunch != null) {
      return this._canLaunch;
    }
    if (this.uri != null && this.match !== UriMatchStrategy.RegularExpression) {
      this._canLaunch = SafeUrls.canLaunch(this.launchUri);
    } else {
      this._canLaunch = false;
    }
    return this._canLaunch;
  }
  get launchUri() {
    if (this.uri == null) {
      return void 0;
    }
    return this.uri.indexOf("://") < 0 && !Utils.isNullOrWhitespace(Utils.getDomain(this.uri)) ? "http://" + this.uri : this.uri;
  }
  static fromJSON(obj) {
    return Object.assign(new _LoginUriView(), obj);
  }
  /**
   * Converts a LoginUriView object from the SDK to a LoginUriView object.
   */
  static fromSdkLoginUriView(obj) {
    if (obj == null) {
      return void 0;
    }
    const view = new _LoginUriView();
    view.uri = obj.uri;
    view.match = obj.match;
    return view;
  }
  /** Converts a LoginUriView object to an SDK LoginUriView object. */
  toSdkLoginUriView() {
    return {
      uri: this.uri ?? void 0,
      match: this.match ?? void 0,
      uriChecksum: void 0
      // SDK handles uri checksum generation internally
    };
  }
  matchesUri(targetUri, equivalentDomains, defaultUriMatch, overrideNeverMatchStrategy) {
    if (!this.uri || !targetUri) {
      return false;
    }
    let matchType = this.match ?? defaultUriMatch;
    matchType ??= UriMatchStrategy.Domain;
    if (overrideNeverMatchStrategy && matchType === UriMatchStrategy.Never) {
      matchType = UriMatchStrategy.Domain;
    }
    const targetDomain = Utils.getDomain(targetUri);
    const matchDomains = equivalentDomains.add(targetDomain);
    switch (matchType) {
      case UriMatchStrategy.Domain:
        return this.matchesDomain(targetUri, matchDomains);
      case UriMatchStrategy.Host: {
        const urlHost = Utils.getHost(targetUri);
        return urlHost != null && urlHost === Utils.getHost(this.uri);
      }
      case UriMatchStrategy.Exact:
        return targetUri === this.uri;
      case UriMatchStrategy.StartsWith:
        return targetUri.startsWith(this.uri);
      case UriMatchStrategy.RegularExpression:
        try {
          const regex = new RegExp(this.uri, "i");
          return regex.test(targetUri);
        } catch (e) {
          return false;
        }
      case UriMatchStrategy.Never:
        return false;
      default:
        break;
    }
    return false;
  }
  matchesDomain(targetUri, matchDomains) {
    if (targetUri == null || this.domain == null || !matchDomains.has(this.domain)) {
      return false;
    }
    if (Utils.DomainMatchBlacklist.has(this.domain)) {
      const domainUrlHost = Utils.getHost(targetUri);
      return !Utils.DomainMatchBlacklist.get(this.domain).has(domainUrlHost);
    }
    return true;
  }
};

// libs/common/src/vault/models/view/login.view.ts
var _LoginView = class _LoginView extends ItemView {
  constructor(l) {
    super();
    this.uris = [];
    this.fido2Credentials = [];
    if (!l) {
      return;
    }
    this.passwordRevisionDate = l.passwordRevisionDate;
    this.autofillOnPageLoad = l.autofillOnPageLoad;
  }
  get uri() {
    return this.hasUris ? this.uris[0].uri : void 0;
  }
  get maskedPassword() {
    return this.password != null ? "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022" : void 0;
  }
  get subTitle() {
    if (Utils.isNullOrEmpty(this.username) && this.fido2Credentials?.length > 0) {
      return this.fido2Credentials[0].userName;
    }
    return this.username;
  }
  get canLaunch() {
    return this.hasUris && this.uris.some((u) => u.canLaunch);
  }
  get hasTotp() {
    return !Utils.isNullOrWhitespace(this.totp);
  }
  get launchUri() {
    if (this.hasUris) {
      const uri = this.uris.find((u) => u.canLaunch);
      if (uri != null) {
        return uri.launchUri;
      }
    }
    return void 0;
  }
  get hasUris() {
    return this.uris != null && this.uris.length > 0;
  }
  get hasFido2Credentials() {
    return this.fido2Credentials != null && this.fido2Credentials.length > 0;
  }
  matchesUri(targetUri, equivalentDomains, defaultUriMatch, overrideNeverMatchStrategy) {
    if (this.uris == null) {
      return false;
    }
    return this.uris.some(
      (uri) => uri.matchesUri(targetUri, equivalentDomains, defaultUriMatch, overrideNeverMatchStrategy)
    );
  }
  static fromJSON(obj) {
    if (obj == void 0) {
      return new _LoginView();
    }
    const loginView = Object.assign(new _LoginView(), obj);
    loginView.passwordRevisionDate = obj.passwordRevisionDate == null ? void 0 : new Date(obj.passwordRevisionDate);
    loginView.uris = obj.uris?.map((uri) => LoginUriView.fromJSON(uri)) ?? [];
    loginView.fido2Credentials = obj.fido2Credentials?.map((key) => Fido2CredentialView.fromJSON(key)) ?? [];
    return loginView;
  }
  /**
   * Converts the SDK LoginView to a LoginView.
   *
   * Note: FIDO2 credentials remain encrypted at this stage.
   * Unlike other fields that are decrypted as part of the LoginView, the SDK maintains
   * the FIDO2 credentials in encrypted form. We can decrypt them later using a separate
   * call to client.vault().ciphers().decrypt_fido2_credentials().
   */
  static fromSdkLoginView(obj) {
    const loginView = new _LoginView();
    loginView.username = obj.username;
    loginView.password = obj.password;
    loginView.passwordRevisionDate = obj.passwordRevisionDate == null ? void 0 : new Date(obj.passwordRevisionDate);
    loginView.totp = obj.totp;
    loginView.autofillOnPageLoad = obj.autofillOnPageLoad;
    loginView.uris = obj.uris?.filter((uri) => uri.uri != null && uri.uri !== "").map((uri) => LoginUriView.fromSdkLoginUriView(uri)) || [];
    loginView.fido2Credentials = [];
    return loginView;
  }
  /**
   * Converts the LoginView to an SDK LoginView.
   *
   * Note: FIDO2 credentials remain encrypted in the SDK view so they are not included here.
   */
  toSdkLoginView() {
    return {
      username: this.username,
      password: this.password,
      passwordRevisionDate: this.passwordRevisionDate?.toISOString(),
      totp: this.totp,
      autofillOnPageLoad: this.autofillOnPageLoad ?? void 0,
      uris: this.uris?.map((uri) => uri.toSdkLoginUriView()),
      fido2Credentials: void 0
      // FIDO2 credentials are handled separately and remain encrypted
    };
  }
};
__decorateClass([
  linkedFieldOption(LoginLinkedId.Username, { sortPosition: 0 })
], _LoginView.prototype, "username", 2);
__decorateClass([
  linkedFieldOption(LoginLinkedId.Password, { sortPosition: 1 })
], _LoginView.prototype, "password", 2);
var LoginView = _LoginView;

// libs/common/src/vault/models/view/password-history.view.ts
var PasswordHistoryView = class _PasswordHistoryView {
  constructor(ph) {
    this.password = null;
    this.lastUsedDate = null;
    if (!ph) {
      return;
    }
    this.lastUsedDate = ph.lastUsedDate;
  }
  static fromJSON(obj) {
    const lastUsedDate = obj.lastUsedDate == null ? null : new Date(obj.lastUsedDate);
    return Object.assign(new _PasswordHistoryView(), obj, {
      lastUsedDate
    });
  }
  /**
   * Converts the SDK PasswordHistoryView to a PasswordHistoryView.
   */
  static fromSdkPasswordHistoryView(obj) {
    if (!obj) {
      return void 0;
    }
    const view = new _PasswordHistoryView();
    view.password = obj.password;
    view.lastUsedDate = obj.lastUsedDate == null ? null : new Date(obj.lastUsedDate);
    return view;
  }
  /**
   * Converts the PasswordHistoryView to an SDK PasswordHistoryView.
   */
  toSdkPasswordHistoryView() {
    return {
      password: this.password ?? "",
      lastUsedDate: this.lastUsedDate.toISOString()
    };
  }
};

// libs/common/src/vault/models/view/secure-note.view.ts
var SecureNoteView = class _SecureNoteView extends ItemView {
  constructor(n) {
    super();
    this.type = SecureNoteType.Generic;
    if (!n) {
      return;
    }
    this.type = n.type;
  }
  get subTitle() {
    return void 0;
  }
  static fromJSON(obj) {
    return Object.assign(new _SecureNoteView(), obj);
  }
  /**
   * Converts the SDK SecureNoteView to a SecureNoteView.
   */
  static fromSdkSecureNoteView(obj) {
    const secureNoteView = new _SecureNoteView();
    secureNoteView.type = obj.type;
    return secureNoteView;
  }
  /**
   * Converts the SecureNoteView to an SDK SecureNoteView.
   * The view implements the SdkView so we can safely return `this`
   */
  toSdkSecureNoteView() {
    return this;
  }
};

// libs/common/src/vault/models/view/ssh-key.view.ts
var SshKeyView = class _SshKeyView extends ItemView {
  get maskedPrivateKey() {
    if (!this.privateKey || this.privateKey.length === 0) {
      return "";
    }
    let lines = this.privateKey.split("\n").filter((l) => l.trim() !== "");
    lines = lines.map((l, i) => {
      if (i === 0 || i === lines.length - 1) {
        return l;
      }
      return this.maskLine(l);
    });
    return lines.join("\n");
  }
  maskLine(line) {
    return "\u2022".repeat(32);
  }
  get subTitle() {
    return this.keyFingerprint;
  }
  static fromJSON(obj) {
    return Object.assign(new _SshKeyView(), obj);
  }
  /**
   * Converts the SDK SshKeyView to a SshKeyView.
   */
  static fromSdkSshKeyView(obj) {
    const sshKeyView = new _SshKeyView();
    sshKeyView.privateKey = obj.privateKey;
    sshKeyView.publicKey = obj.publicKey;
    sshKeyView.keyFingerprint = obj.fingerprint;
    return sshKeyView;
  }
  /**
   * Converts the SshKeyView to an SDK SshKeyView.
   */
  toSdkSshKeyView() {
    return {
      privateKey: this.privateKey,
      publicKey: this.publicKey,
      fingerprint: this.keyFingerprint
    };
  }
};

// libs/common/src/vault/models/view/cipher.view.ts
var CipherView = class _CipherView {
  constructor(c) {
    this.initializerKey = 1 /* CipherView */;
    this.id = "";
    this.name = "";
    this.type = CipherType.Login;
    this.favorite = false;
    this.organizationUseTotp = false;
    this.permissions = new CipherPermissionsApi();
    this.edit = false;
    this.viewPassword = true;
    this.login = new LoginView();
    this.identity = new IdentityView();
    this.card = new CardView();
    this.secureNote = new SecureNoteView();
    this.sshKey = new SshKeyView();
    this.attachments = [];
    this.fields = [];
    this.passwordHistory = [];
    this.collectionIds = [];
    this.reprompt = CipherRepromptType.None;
    /**
     * Flag to indicate if the cipher decryption failed.
     */
    this.decryptionFailure = false;
    if (!c) {
      this.creationDate = this.revisionDate = /* @__PURE__ */ new Date();
      return;
    }
    this.id = c.id;
    this.organizationId = c.organizationId;
    this.folderId = c.folderId;
    this.favorite = c.favorite;
    this.organizationUseTotp = c.organizationUseTotp;
    this.edit = c.edit;
    this.viewPassword = c.viewPassword;
    this.permissions = c.permissions;
    this.type = c.type;
    this.localData = c.localData;
    this.collectionIds = c.collectionIds;
    this.revisionDate = c.revisionDate;
    this.creationDate = c.creationDate;
    this.deletedDate = c.deletedDate;
    this.archivedDate = c.archivedDate;
    this.reprompt = c.reprompt ?? CipherRepromptType.None;
    this.key = c.key;
  }
  get item() {
    switch (this.type) {
      case CipherType.Login:
        return this.login;
      case CipherType.SecureNote:
        return this.secureNote;
      case CipherType.Card:
        return this.card;
      case CipherType.Identity:
        return this.identity;
      case CipherType.SshKey:
        return this.sshKey;
      default:
        break;
    }
    return void 0;
  }
  get subTitle() {
    return this.item?.subTitle;
  }
  get canBeArchived() {
    return !this.isDeleted && !this.isArchived;
  }
  get hasPasswordHistory() {
    return this.passwordHistory && this.passwordHistory.length > 0;
  }
  get hasLoginPassword() {
    return this.type === CipherType.Login && this.login?.password != null && this.login.password !== "";
  }
  get hasAttachments() {
    return !!this.attachments && this.attachments.length > 0;
  }
  get hasOldAttachments() {
    if (this.hasAttachments) {
      for (let i = 0; i < this.attachments.length; i++) {
        if (this.attachments[i].key == null && this.attachments[i].encryptedKey == null) {
          return true;
        }
      }
    }
    return false;
  }
  get hasFields() {
    return this.fields && this.fields.length > 0;
  }
  get passwordRevisionDisplayDate() {
    if (this.type !== CipherType.Login || this.login == null) {
      return void 0;
    } else if (this.login.password == null || this.login.password === "") {
      return void 0;
    }
    return this.login.passwordRevisionDate;
  }
  get isDeleted() {
    return this.deletedDate != null;
  }
  get isArchived() {
    return this.archivedDate != null;
  }
  get linkedFieldOptions() {
    return this.item?.linkedFieldOptions;
  }
  get isUnassigned() {
    return this.organizationId != null && (this.collectionIds == null || this.collectionIds.length === 0);
  }
  get canAssignToCollections() {
    if (this.organizationId == null) {
      return true;
    }
    return this.edit && this.viewPassword;
  }
  /**
   * Determines if the cipher can be launched in a new browser tab.
   */
  get canLaunch() {
    return this.type === CipherType.Login && this.login.canLaunch;
  }
  linkedFieldValue(id) {
    const linkedFieldOption2 = this.linkedFieldOptions?.get(id);
    const item = this.item;
    if (linkedFieldOption2 == null || item == null) {
      return void 0;
    }
    return item[linkedFieldOption2.propertyKey];
  }
  // This is used as a marker to indicate that the cipher view object still has its prototype
  toJSON() {
    return this;
  }
  static fromJSON(obj) {
    if (obj == null) {
      return null;
    }
    const view = new _CipherView();
    view.type = obj.type ?? CipherType.Login;
    view.id = obj.id ?? "";
    view.organizationId = obj.organizationId ?? void 0;
    view.folderId = obj.folderId ?? void 0;
    view.collectionIds = obj.collectionIds ?? [];
    view.name = obj.name ?? "";
    view.notes = obj.notes;
    view.edit = obj.edit ?? false;
    view.viewPassword = obj.viewPassword ?? true;
    view.favorite = obj.favorite ?? false;
    view.organizationUseTotp = obj.organizationUseTotp ?? false;
    view.localData = obj.localData ? obj.localData : void 0;
    view.permissions = obj.permissions ? CipherPermissionsApi.fromJSON(obj.permissions) : void 0;
    view.reprompt = obj.reprompt ?? CipherRepromptType.None;
    view.decryptionFailure = obj.decryptionFailure ?? false;
    if (obj.creationDate) {
      view.creationDate = new Date(obj.creationDate);
    }
    if (obj.revisionDate) {
      view.revisionDate = new Date(obj.revisionDate);
    }
    view.deletedDate = obj.deletedDate == null ? void 0 : new Date(obj.deletedDate);
    view.archivedDate = obj.archivedDate == null ? void 0 : new Date(obj.archivedDate);
    view.attachments = obj.attachments?.map((a) => AttachmentView.fromJSON(a)) ?? [];
    view.fields = obj.fields?.map((f) => FieldView.fromJSON(f)) ?? [];
    view.passwordHistory = obj.passwordHistory?.map((ph) => PasswordHistoryView.fromJSON(ph)) ?? [];
    if (obj.key != null) {
      let key;
      if (typeof obj.key === "string") {
        key = EncString.fromJSON(obj.key);
      } else if (obj.key instanceof EncString) {
        key = obj.key;
      }
      view.key = key;
    }
    switch (obj.type) {
      case CipherType.Card:
        view.card = CardView.fromJSON(obj.card);
        break;
      case CipherType.Identity:
        view.identity = IdentityView.fromJSON(obj.identity);
        break;
      case CipherType.Login:
        view.login = LoginView.fromJSON(obj.login);
        break;
      case CipherType.SecureNote:
        view.secureNote = SecureNoteView.fromJSON(obj.secureNote);
        break;
      case CipherType.SshKey:
        view.sshKey = SshKeyView.fromJSON(obj.sshKey);
        break;
      default:
        break;
    }
    return view;
  }
  /**
   * Creates a CipherView from the SDK CipherView.
   */
  static fromSdkCipherView(obj) {
    if (obj == null) {
      return void 0;
    }
    const attachments = obj.attachments?.map((a) => AttachmentView.fromSdkAttachmentView(a)) ?? [];
    if (obj.attachmentDecryptionFailures?.length) {
      obj.attachmentDecryptionFailures.forEach((attachment) => {
        const attachmentView = AttachmentView.fromSdkAttachmentView(attachment, true);
        if (attachmentView) {
          attachments.push(attachmentView);
        }
      });
    }
    const cipherView = new _CipherView();
    cipherView.id = uuidAsString(obj.id);
    cipherView.organizationId = uuidAsString(obj.organizationId);
    cipherView.folderId = uuidAsString(obj.folderId);
    cipherView.name = obj.name;
    cipherView.notes = obj.notes;
    cipherView.type = obj.type;
    cipherView.favorite = obj.favorite;
    cipherView.organizationUseTotp = obj.organizationUseTotp;
    cipherView.permissions = obj.permissions ? CipherPermissionsApi.fromSdkCipherPermissions(obj.permissions) : void 0;
    cipherView.edit = obj.edit;
    cipherView.viewPassword = obj.viewPassword;
    cipherView.localData = fromSdkLocalData(obj.localData);
    cipherView.attachments = attachments;
    cipherView.fields = obj.fields?.map((f) => FieldView.fromSdkFieldView(f)) ?? [];
    cipherView.passwordHistory = obj.passwordHistory?.map((ph) => PasswordHistoryView.fromSdkPasswordHistoryView(ph)) ?? [];
    cipherView.collectionIds = obj.collectionIds?.map((i) => uuidAsString(i)) ?? [];
    cipherView.revisionDate = new Date(obj.revisionDate);
    cipherView.creationDate = new Date(obj.creationDate);
    cipherView.deletedDate = obj.deletedDate == null ? void 0 : new Date(obj.deletedDate);
    cipherView.archivedDate = obj.archivedDate == null ? void 0 : new Date(obj.archivedDate);
    cipherView.reprompt = obj.reprompt ?? CipherRepromptType.None;
    cipherView.key = obj.key ? EncString.fromJSON(obj.key) : void 0;
    switch (obj.type) {
      case CipherType.Card:
        cipherView.card = obj.card ? CardView.fromSdkCardView(obj.card) : new CardView();
        break;
      case CipherType.Identity:
        cipherView.identity = obj.identity ? IdentityView.fromSdkIdentityView(obj.identity) : new IdentityView();
        break;
      case CipherType.Login:
        cipherView.login = obj.login ? LoginView.fromSdkLoginView(obj.login) : new LoginView();
        break;
      case CipherType.SecureNote:
        cipherView.secureNote = obj.secureNote ? SecureNoteView.fromSdkSecureNoteView(obj.secureNote) : new SecureNoteView();
        break;
      case CipherType.SshKey:
        cipherView.sshKey = obj.sshKey ? SshKeyView.fromSdkSshKeyView(obj.sshKey) : new SshKeyView();
        break;
      default:
        break;
    }
    return cipherView;
  }
  /**
   * Maps CipherView to an SDK CipherCreateRequest
   *
   * @returns {CipherCreateRequest} The SDK cipher create request object
   */
  toSdkCreateCipherRequest() {
    const sdkCipherCreateRequest = {
      organizationId: this.organizationId ? asUuid(this.organizationId) : void 0,
      collectionIds: this.collectionIds ? this.collectionIds.map((i) => asUuid(i)) : [],
      folderId: this.folderId ? asUuid(this.folderId) : void 0,
      name: this.name ?? "",
      notes: this.notes,
      favorite: this.favorite ?? false,
      reprompt: this.reprompt ?? CipherRepromptType.None,
      fields: this.fields?.map((f) => f.toSdkFieldView()),
      type: this.getSdkCipherViewType()
    };
    return sdkCipherCreateRequest;
  }
  /**
   * Maps CipherView to an SDK CipherEditRequest
   *
   * @returns {CipherEditRequest} The SDK cipher edit request object
   */
  toSdkUpdateCipherRequest() {
    const sdkCipherEditRequest = {
      id: asUuid(this.id),
      organizationId: this.organizationId ? asUuid(this.organizationId) : void 0,
      folderId: this.folderId ? asUuid(this.folderId) : void 0,
      name: this.name ?? "",
      notes: this.notes,
      favorite: this.favorite ?? false,
      reprompt: this.reprompt ?? CipherRepromptType.None,
      fields: this.fields?.map((f) => f.toSdkFieldView()),
      type: this.getSdkCipherViewType(),
      revisionDate: this.revisionDate?.toISOString(),
      archivedDate: this.archivedDate?.toISOString(),
      attachments: this.attachments?.map((a) => a.toSdkAttachmentView()),
      key: this.key?.toSdk()
    };
    return sdkCipherEditRequest;
  }
  /**
   * Returns the SDK CipherViewType object for the cipher.
   *
   * @returns {CipherViewType} The SDK CipherViewType for the cipher.t
   */
  getSdkCipherViewType() {
    let viewType;
    switch (this.type) {
      case CipherType.Card:
        viewType = { card: this.card?.toSdkCardView() };
        break;
      case CipherType.Identity:
        viewType = { identity: this.identity?.toSdkIdentityView() };
        break;
      case CipherType.Login:
        viewType = { login: this.login?.toSdkLoginView() };
        break;
      case CipherType.SecureNote:
        viewType = { secureNote: this.secureNote?.toSdkSecureNoteView() };
        break;
      case CipherType.SshKey:
        viewType = { sshKey: this.sshKey?.toSdkSshKeyView() };
        break;
      default:
        viewType = {
          // Default to empty login - should not be valid code path.
          login: new LoginView().toSdkLoginView()
        };
        break;
    }
    return viewType;
  }
  /**
   * Maps CipherView to SdkCipherView
   *
   * @returns {SdkCipherView} The SDK cipher view object
   */
  toSdkCipherView() {
    const sdkCipherView = {
      id: this.id ? asUuid(this.id) : void 0,
      organizationId: this.organizationId ? asUuid(this.organizationId) : void 0,
      folderId: this.folderId ? asUuid(this.folderId) : void 0,
      name: this.name ?? "",
      notes: this.notes,
      type: this.type ?? CipherType.Login,
      favorite: this.favorite ?? false,
      organizationUseTotp: this.organizationUseTotp ?? false,
      permissions: this.permissions?.toSdkCipherPermissions(),
      edit: this.edit ?? true,
      viewPassword: this.viewPassword ?? true,
      localData: toSdkLocalData(this.localData),
      attachments: this.attachments?.map((a) => a.toSdkAttachmentView()),
      fields: this.fields?.map((f) => f.toSdkFieldView()),
      passwordHistory: this.passwordHistory?.map((ph) => ph.toSdkPasswordHistoryView()),
      collectionIds: this.collectionIds?.map((i) => asUuid(i)) ?? [],
      // Revision and creation dates are non-nullable in SDKCipherView
      revisionDate: (this.revisionDate ?? /* @__PURE__ */ new Date()).toISOString(),
      creationDate: (this.creationDate ?? /* @__PURE__ */ new Date()).toISOString(),
      deletedDate: this.deletedDate?.toISOString(),
      archivedDate: this.archivedDate?.toISOString(),
      reprompt: this.reprompt ?? CipherRepromptType.None,
      key: this.key?.toSdk(),
      // Cipher type specific properties are set in the switch statement below
      // CipherView initializes each with default constructors (undefined values)
      // The SDK does not expect those undefined values and will throw exceptions
      login: void 0,
      card: void 0,
      identity: void 0,
      secureNote: void 0,
      sshKey: void 0
    };
    switch (this.type) {
      case CipherType.Card:
        sdkCipherView.card = this.card?.toSdkCardView();
        break;
      case CipherType.Identity:
        sdkCipherView.identity = this.identity?.toSdkIdentityView();
        break;
      case CipherType.Login:
        sdkCipherView.login = this.login?.toSdkLoginView();
        break;
      case CipherType.SecureNote:
        sdkCipherView.secureNote = this.secureNote?.toSdkSecureNoteView();
        break;
      case CipherType.SshKey:
        sdkCipherView.sshKey = this.sshKey?.toSdkSshKeyView();
        break;
      default:
        break;
    }
    return sdkCipherView;
  }
};

// libs/common/src/vault/models/domain/attachment.ts
var Attachment = class _Attachment extends Domain {
  constructor(obj) {
    super();
    if (obj == null) {
      return;
    }
    this.id = obj.id;
    this.url = obj.url;
    this.size = obj.size;
    this.sizeName = obj.sizeName;
    this.fileName = conditionalEncString(obj.fileName);
    this.key = conditionalEncString(obj.key);
  }
  async decrypt(decryptionKey, context = "No Cipher Context") {
    const view = await this.decryptObj(
      this,
      new AttachmentView(this),
      ["fileName"],
      decryptionKey,
      "DomainType: Attachment; " + context
    );
    if (this.key != null) {
      view.key = await this.decryptAttachmentKey(decryptionKey);
      view.encryptedKey = this.key;
      if (!view.key) {
        view.hasDecryptionError = true;
      }
    }
    return view;
  }
  async decryptAttachmentKey(decryptionKey) {
    try {
      if (this.key == null) {
        return void 0;
      }
      const encryptService = Utils.getContainerService().getEncryptService();
      const decValue = await encryptService.unwrapSymmetricKey(this.key, decryptionKey);
      return decValue;
    } catch (e) {
      console.error("[Attachment] Error decrypting attachment", e);
      return void 0;
    }
  }
  toAttachmentData() {
    const a = new AttachmentData();
    if (this.size != null) {
      a.size = this.size;
    }
    this.buildDataModel(
      this,
      a,
      {
        id: null,
        url: null,
        sizeName: null,
        fileName: null,
        key: null
      },
      ["id", "url", "sizeName"]
    );
    return a;
  }
  static fromJSON(obj) {
    if (obj == null) {
      return void 0;
    }
    const attachment = new _Attachment();
    attachment.id = obj.id;
    attachment.url = obj.url;
    attachment.size = obj.size;
    attachment.sizeName = obj.sizeName;
    attachment.key = encStringFrom(obj.key);
    attachment.fileName = encStringFrom(obj.fileName);
    return attachment;
  }
  /**
   * Maps to SDK Attachment
   *
   * @returns {SdkAttachment} - The SDK Attachment object
   */
  toSdkAttachment() {
    return {
      id: this.id,
      url: this.url,
      size: this.size,
      sizeName: this.sizeName,
      fileName: this.fileName?.toSdk(),
      key: this.key?.toSdk()
    };
  }
  /**
   * Maps an SDK Attachment object to an Attachment
   * @param obj - The SDK attachment object
   */
  static fromSdkAttachment(obj) {
    if (!obj) {
      return void 0;
    }
    const attachment = new _Attachment();
    attachment.id = obj.id;
    attachment.url = obj.url;
    attachment.size = obj.size;
    attachment.sizeName = obj.sizeName;
    attachment.fileName = encStringFrom(obj.fileName);
    attachment.key = encStringFrom(obj.key);
    return attachment;
  }
};

// libs/common/src/vault/models/domain/card.ts
var Card = class _Card extends Domain {
  constructor(obj) {
    super();
    if (obj == null) {
      return;
    }
    this.cardholderName = conditionalEncString(obj.cardholderName);
    this.brand = conditionalEncString(obj.brand);
    this.number = conditionalEncString(obj.number);
    this.expMonth = conditionalEncString(obj.expMonth);
    this.expYear = conditionalEncString(obj.expYear);
    this.code = conditionalEncString(obj.code);
  }
  async decrypt(encKey, context = "No Cipher Context") {
    return this.decryptObj(
      this,
      new CardView(),
      ["cardholderName", "brand", "number", "expMonth", "expYear", "code"],
      encKey,
      "DomainType: Card; " + context
    );
  }
  toCardData() {
    const c = new CardData();
    this.buildDataModel(this, c, {
      cardholderName: null,
      brand: null,
      number: null,
      expMonth: null,
      expYear: null,
      code: null
    });
    return c;
  }
  static fromJSON(obj) {
    if (obj == null) {
      return void 0;
    }
    const card = new _Card();
    card.cardholderName = encStringFrom(obj.cardholderName);
    card.brand = encStringFrom(obj.brand);
    card.number = encStringFrom(obj.number);
    card.expMonth = encStringFrom(obj.expMonth);
    card.expYear = encStringFrom(obj.expYear);
    card.code = encStringFrom(obj.code);
    return card;
  }
  /**
   *  Maps Card to SDK format.
   *
   * @returns {SdkCard} The SDK card object.
   */
  toSdkCard() {
    return {
      cardholderName: this.cardholderName?.toSdk(),
      brand: this.brand?.toSdk(),
      number: this.number?.toSdk(),
      expMonth: this.expMonth?.toSdk(),
      expYear: this.expYear?.toSdk(),
      code: this.code?.toSdk()
    };
  }
  /**
   * Maps an SDK Card object to a Card
   * @param obj - The SDK Card object
   */
  static fromSdkCard(obj) {
    if (!obj) {
      return void 0;
    }
    const card = new _Card();
    card.cardholderName = encStringFrom(obj.cardholderName);
    card.brand = encStringFrom(obj.brand);
    card.number = encStringFrom(obj.number);
    card.expMonth = encStringFrom(obj.expMonth);
    card.expYear = encStringFrom(obj.expYear);
    card.code = encStringFrom(obj.code);
    return card;
  }
};

// libs/common/src/vault/models/domain/field.ts
var Field = class _Field extends Domain {
  constructor(obj) {
    super();
    this.type = FieldType.Text;
    if (obj == null) {
      return;
    }
    this.type = obj.type;
    this.linkedId = obj.linkedId ?? void 0;
    this.name = conditionalEncString(obj.name);
    this.value = conditionalEncString(obj.value);
  }
  decrypt(encKey) {
    return this.decryptObj(this, new FieldView(this), ["name", "value"], encKey);
  }
  toFieldData() {
    const f = new FieldData();
    this.buildDataModel(
      this,
      f,
      {
        name: null,
        value: null,
        type: null,
        linkedId: null
      },
      ["type", "linkedId"]
    );
    return f;
  }
  static fromJSON(obj) {
    if (obj == null) {
      return void 0;
    }
    const field = new _Field();
    field.type = obj.type ?? FieldType.Text;
    field.linkedId = obj.linkedId ?? void 0;
    field.name = encStringFrom(obj.name);
    field.value = encStringFrom(obj.value);
    return field;
  }
  /**
   * Maps Field to SDK format.
   *
   * @returns {SdkField} The SDK field object.
   */
  toSdkField() {
    return {
      name: this.name?.toSdk(),
      value: this.value?.toSdk(),
      type: normalizeFieldTypeForSdk(this.type),
      linkedId: normalizeLinkedIdTypeForSdk(this.linkedId)
    };
  }
  /**
   * Maps SDK Field to Field
   * @param obj The SDK Field object to map
   */
  static fromSdkField(obj) {
    if (obj == null) {
      return void 0;
    }
    const field = new _Field();
    field.name = encStringFrom(obj.name);
    field.value = encStringFrom(obj.value);
    field.type = obj.type;
    field.linkedId = obj.linkedId;
    return field;
  }
};

// libs/common/src/vault/models/domain/identity.ts
var Identity = class _Identity extends Domain {
  constructor(obj) {
    super();
    if (obj == null) {
      return;
    }
    this.title = conditionalEncString(obj.title);
    this.firstName = conditionalEncString(obj.firstName);
    this.middleName = conditionalEncString(obj.middleName);
    this.lastName = conditionalEncString(obj.lastName);
    this.address1 = conditionalEncString(obj.address1);
    this.address2 = conditionalEncString(obj.address2);
    this.address3 = conditionalEncString(obj.address3);
    this.city = conditionalEncString(obj.city);
    this.state = conditionalEncString(obj.state);
    this.postalCode = conditionalEncString(obj.postalCode);
    this.country = conditionalEncString(obj.country);
    this.company = conditionalEncString(obj.company);
    this.email = conditionalEncString(obj.email);
    this.phone = conditionalEncString(obj.phone);
    this.ssn = conditionalEncString(obj.ssn);
    this.username = conditionalEncString(obj.username);
    this.passportNumber = conditionalEncString(obj.passportNumber);
    this.licenseNumber = conditionalEncString(obj.licenseNumber);
  }
  decrypt(encKey, context = "No Cipher Context") {
    return this.decryptObj(
      this,
      new IdentityView(),
      [
        "title",
        "firstName",
        "middleName",
        "lastName",
        "address1",
        "address2",
        "address3",
        "city",
        "state",
        "postalCode",
        "country",
        "company",
        "email",
        "phone",
        "ssn",
        "username",
        "passportNumber",
        "licenseNumber"
      ],
      encKey,
      "DomainType: Identity; " + context
    );
  }
  toIdentityData() {
    const i = new IdentityData();
    this.buildDataModel(this, i, {
      title: null,
      firstName: null,
      middleName: null,
      lastName: null,
      address1: null,
      address2: null,
      address3: null,
      city: null,
      state: null,
      postalCode: null,
      country: null,
      company: null,
      email: null,
      phone: null,
      ssn: null,
      username: null,
      passportNumber: null,
      licenseNumber: null
    });
    return i;
  }
  static fromJSON(obj) {
    if (obj == null) {
      return void 0;
    }
    const identity = new _Identity();
    identity.title = encStringFrom(obj.title);
    identity.firstName = encStringFrom(obj.firstName);
    identity.middleName = encStringFrom(obj.middleName);
    identity.lastName = encStringFrom(obj.lastName);
    identity.address1 = encStringFrom(obj.address1);
    identity.address2 = encStringFrom(obj.address2);
    identity.address3 = encStringFrom(obj.address3);
    identity.city = encStringFrom(obj.city);
    identity.state = encStringFrom(obj.state);
    identity.postalCode = encStringFrom(obj.postalCode);
    identity.country = encStringFrom(obj.country);
    identity.company = encStringFrom(obj.company);
    identity.email = encStringFrom(obj.email);
    identity.phone = encStringFrom(obj.phone);
    identity.ssn = encStringFrom(obj.ssn);
    identity.username = encStringFrom(obj.username);
    identity.passportNumber = encStringFrom(obj.passportNumber);
    identity.licenseNumber = encStringFrom(obj.licenseNumber);
    return identity;
  }
  /**
   * Maps Identity to SDK format.
   *
   * @returns {SdkIdentity} The SDK identity object.
   */
  toSdkIdentity() {
    return {
      title: this.title?.toSdk(),
      firstName: this.firstName?.toSdk(),
      middleName: this.middleName?.toSdk(),
      lastName: this.lastName?.toSdk(),
      address1: this.address1?.toSdk(),
      address2: this.address2?.toSdk(),
      address3: this.address3?.toSdk(),
      city: this.city?.toSdk(),
      state: this.state?.toSdk(),
      postalCode: this.postalCode?.toSdk(),
      country: this.country?.toSdk(),
      company: this.company?.toSdk(),
      email: this.email?.toSdk(),
      phone: this.phone?.toSdk(),
      ssn: this.ssn?.toSdk(),
      username: this.username?.toSdk(),
      passportNumber: this.passportNumber?.toSdk(),
      licenseNumber: this.licenseNumber?.toSdk()
    };
  }
  /**
   * Maps an SDK Identity object to an Identity
   * @param obj - The SDK Identity object
   */
  static fromSdkIdentity(obj) {
    if (obj == null) {
      return void 0;
    }
    const identity = new _Identity();
    identity.title = encStringFrom(obj.title);
    identity.firstName = encStringFrom(obj.firstName);
    identity.middleName = encStringFrom(obj.middleName);
    identity.lastName = encStringFrom(obj.lastName);
    identity.address1 = encStringFrom(obj.address1);
    identity.address2 = encStringFrom(obj.address2);
    identity.address3 = encStringFrom(obj.address3);
    identity.city = encStringFrom(obj.city);
    identity.state = encStringFrom(obj.state);
    identity.postalCode = encStringFrom(obj.postalCode);
    identity.country = encStringFrom(obj.country);
    identity.company = encStringFrom(obj.company);
    identity.email = encStringFrom(obj.email);
    identity.phone = encStringFrom(obj.phone);
    identity.ssn = encStringFrom(obj.ssn);
    identity.username = encStringFrom(obj.username);
    identity.passportNumber = encStringFrom(obj.passportNumber);
    identity.licenseNumber = encStringFrom(obj.licenseNumber);
    return identity;
  }
};

// libs/common/src/vault/models/domain/fido2-credential.ts
var Fido2Credential = class _Fido2Credential extends Domain {
  constructor(obj) {
    super();
    if (obj == null) {
      this.creationDate = /* @__PURE__ */ new Date();
      return;
    }
    this.credentialId = new EncString(obj.credentialId);
    this.keyType = new EncString(obj.keyType);
    this.keyAlgorithm = new EncString(obj.keyAlgorithm);
    this.keyCurve = new EncString(obj.keyCurve);
    this.keyValue = new EncString(obj.keyValue);
    this.rpId = new EncString(obj.rpId);
    this.counter = new EncString(obj.counter);
    this.discoverable = new EncString(obj.discoverable);
    this.userHandle = conditionalEncString(obj.userHandle);
    this.userName = conditionalEncString(obj.userName);
    this.rpName = conditionalEncString(obj.rpName);
    this.userDisplayName = conditionalEncString(obj.userDisplayName);
    this.creationDate = new Date(obj.creationDate);
  }
  async decrypt(decryptionKey) {
    const view = await this.decryptObj(
      this,
      new Fido2CredentialView(),
      [
        "credentialId",
        "keyType",
        "keyAlgorithm",
        "keyCurve",
        "keyValue",
        "rpId",
        "userHandle",
        "userName",
        "rpName",
        "userDisplayName"
      ],
      decryptionKey
    );
    const { counter } = await this.decryptObj(this, { counter: "" }, ["counter"], decryptionKey);
    view.counter = parseInt(counter);
    const { discoverable } = await this.decryptObj(
      this,
      { discoverable: "" },
      ["discoverable"],
      decryptionKey
    );
    view.discoverable = discoverable === "true";
    view.creationDate = this.creationDate;
    return view;
  }
  toFido2CredentialData() {
    const i = new Fido2CredentialData();
    i.creationDate = this.creationDate.toISOString();
    this.buildDataModel(this, i, {
      credentialId: null,
      keyType: null,
      keyAlgorithm: null,
      keyCurve: null,
      keyValue: null,
      rpId: null,
      userHandle: null,
      userName: null,
      counter: null,
      rpName: null,
      userDisplayName: null,
      discoverable: null
    });
    return i;
  }
  static fromJSON(obj) {
    if (obj == null) {
      return void 0;
    }
    const credential = new _Fido2Credential();
    credential.credentialId = EncString.fromJSON(obj.credentialId);
    credential.keyType = EncString.fromJSON(obj.keyType);
    credential.keyAlgorithm = EncString.fromJSON(obj.keyAlgorithm);
    credential.keyCurve = EncString.fromJSON(obj.keyCurve);
    credential.keyValue = EncString.fromJSON(obj.keyValue);
    credential.rpId = EncString.fromJSON(obj.rpId);
    credential.userHandle = encStringFrom(obj.userHandle);
    credential.userName = encStringFrom(obj.userName);
    credential.counter = EncString.fromJSON(obj.counter);
    credential.rpName = encStringFrom(obj.rpName);
    credential.userDisplayName = encStringFrom(obj.userDisplayName);
    credential.discoverable = EncString.fromJSON(obj.discoverable);
    credential.creationDate = new Date(obj.creationDate);
    return credential;
  }
  /**
   *  Maps Fido2Credential to SDK format.
   *
   * @returns {SdkFido2Credential} The SDK Fido2Credential object.
   */
  toSdkFido2Credential() {
    return {
      credentialId: this.credentialId?.toSdk(),
      keyType: this.keyType.toSdk(),
      keyAlgorithm: this.keyAlgorithm.toSdk(),
      keyCurve: this.keyCurve.toSdk(),
      keyValue: this.keyValue.toSdk(),
      rpId: this.rpId.toSdk(),
      userHandle: this.userHandle?.toSdk(),
      userName: this.userName?.toSdk(),
      counter: this.counter.toSdk(),
      rpName: this.rpName?.toSdk(),
      userDisplayName: this.userDisplayName?.toSdk(),
      discoverable: this.discoverable?.toSdk(),
      creationDate: this.creationDate.toISOString()
    };
  }
  /**
   * Maps an SDK Fido2Credential object to a Fido2Credential
   * @param obj - The SDK Fido2Credential object
   */
  static fromSdkFido2Credential(obj) {
    if (obj == null) {
      return void 0;
    }
    const credential = new _Fido2Credential();
    credential.credentialId = EncString.fromJSON(obj.credentialId);
    credential.keyType = EncString.fromJSON(obj.keyType);
    credential.keyAlgorithm = EncString.fromJSON(obj.keyAlgorithm);
    credential.keyCurve = EncString.fromJSON(obj.keyCurve);
    credential.keyValue = EncString.fromJSON(obj.keyValue);
    credential.rpId = EncString.fromJSON(obj.rpId);
    credential.counter = EncString.fromJSON(obj.counter);
    credential.userHandle = encStringFrom(obj.userHandle);
    credential.userName = encStringFrom(obj.userName);
    credential.rpName = encStringFrom(obj.rpName);
    credential.userDisplayName = encStringFrom(obj.userDisplayName);
    credential.discoverable = EncString.fromJSON(obj.discoverable);
    credential.creationDate = new Date(obj.creationDate);
    return credential;
  }
};

// libs/common/src/vault/models/domain/login-uri.ts
var LoginUri = class _LoginUri extends Domain {
  constructor(obj) {
    super();
    if (obj == null) {
      return;
    }
    this.uri = conditionalEncString(obj.uri);
    this.uriChecksum = conditionalEncString(obj.uriChecksum);
    this.match = obj.match ?? void 0;
  }
  decrypt(encKey, context = "No Cipher Context") {
    return this.decryptObj(
      this,
      new LoginUriView(this),
      ["uri"],
      encKey,
      context
    );
  }
  async validateChecksum(clearTextUri, encKey) {
    if (this.uriChecksum == null) {
      return false;
    }
    const encryptService = Utils.getContainerService().getEncryptService();
    const localChecksum = await encryptService.hash(clearTextUri, "sha256");
    const remoteChecksum = await encryptService.decryptString(this.uriChecksum, encKey);
    return remoteChecksum === localChecksum;
  }
  toLoginUriData() {
    const u = new LoginUriData();
    this.buildDataModel(
      this,
      u,
      {
        uri: null,
        uriChecksum: null,
        match: null
      },
      ["match"]
    );
    return u;
  }
  static fromJSON(obj) {
    if (obj == null) {
      return void 0;
    }
    const loginUri = new _LoginUri();
    loginUri.uri = encStringFrom(obj.uri);
    loginUri.match = obj.match ?? void 0;
    loginUri.uriChecksum = encStringFrom(obj.uriChecksum);
    return loginUri;
  }
  /**
   *  Maps LoginUri to SDK format.
   *
   * @returns {SdkLoginUri} The SDK login uri object.
   */
  toSdkLoginUri() {
    return {
      uri: this.uri?.toSdk(),
      uriChecksum: this.uriChecksum?.toSdk(),
      match: normalizeUriMatchStrategyForSdk(this.match)
    };
  }
  static fromSdkLoginUri(obj) {
    if (obj == null) {
      return void 0;
    }
    const loginUri = new _LoginUri();
    loginUri.uri = encStringFrom(obj.uri);
    loginUri.uriChecksum = encStringFrom(obj.uriChecksum);
    loginUri.match = obj.match;
    return loginUri;
  }
};

// libs/common/src/vault/models/domain/login.ts
var Login = class _Login extends Domain {
  constructor(obj) {
    super();
    if (obj == null) {
      return;
    }
    this.passwordRevisionDate = obj.passwordRevisionDate != null ? new Date(obj.passwordRevisionDate) : void 0;
    this.autofillOnPageLoad = obj.autofillOnPageLoad;
    this.username = conditionalEncString(obj.username);
    this.password = conditionalEncString(obj.password);
    this.totp = conditionalEncString(obj.totp);
    if (obj.uris) {
      this.uris = obj.uris.map((u) => new LoginUri(u));
    }
    if (obj.fido2Credentials) {
      this.fido2Credentials = obj.fido2Credentials.map((key) => new Fido2Credential(key));
    }
  }
  async decrypt(bypassValidation, encKey, context = "No Cipher Context") {
    const view = await this.decryptObj(
      this,
      new LoginView(this),
      ["username", "password", "totp"],
      encKey,
      `DomainType: Login; ${context}`
    );
    if (this.uris != null) {
      view.uris = [];
      for (let i = 0; i < this.uris.length; i++) {
        if (this.uris[i].uri == null) {
          continue;
        }
        const uri = await this.uris[i].decrypt(encKey, context);
        const uriString = uri.uri;
        if (uriString == null) {
          continue;
        }
        const isValidUri = bypassValidation || await this.uris[i].validateChecksum(uriString, encKey);
        if (isValidUri) {
          view.uris.push(uri);
        }
      }
    }
    if (this.fido2Credentials != null) {
      view.fido2Credentials = await Promise.all(
        this.fido2Credentials.map((key) => key.decrypt(encKey))
      );
    }
    return view;
  }
  toLoginData() {
    const l = new LoginData();
    if (this.passwordRevisionDate != null) {
      l.passwordRevisionDate = this.passwordRevisionDate.toISOString();
    }
    if (this.autofillOnPageLoad != null) {
      l.autofillOnPageLoad = this.autofillOnPageLoad;
    }
    this.buildDataModel(this, l, {
      username: null,
      password: null,
      totp: null
    });
    if (this.uris != null && this.uris.length > 0) {
      l.uris = this.uris.map((u) => u.toLoginUriData());
    }
    if (this.fido2Credentials != null && this.fido2Credentials.length > 0) {
      l.fido2Credentials = this.fido2Credentials.map((key) => key.toFido2CredentialData());
    }
    return l;
  }
  static fromJSON(obj) {
    if (obj == null) {
      return void 0;
    }
    const login = new _Login();
    login.passwordRevisionDate = obj.passwordRevisionDate != null ? new Date(obj.passwordRevisionDate) : void 0;
    login.autofillOnPageLoad = obj.autofillOnPageLoad;
    login.username = encStringFrom(obj.username);
    login.password = encStringFrom(obj.password);
    login.totp = encStringFrom(obj.totp);
    login.uris = obj.uris?.map((uri) => LoginUri.fromJSON(uri)).filter((u) => u != null);
    login.fido2Credentials = obj.fido2Credentials?.map((key) => Fido2Credential.fromJSON(key)).filter((c) => c != null) ?? void 0;
    return login;
  }
  /**
   * Maps Login to SDK format.
   *
   * @returns {SdkLogin} The SDK login object.
   */
  toSdkLogin() {
    return {
      uris: this.uris?.map((u) => u.toSdkLoginUri()),
      username: this.username?.toSdk(),
      password: this.password?.toSdk(),
      passwordRevisionDate: this.passwordRevisionDate?.toISOString(),
      totp: this.totp?.toSdk(),
      autofillOnPageLoad: this.autofillOnPageLoad ?? void 0,
      fido2Credentials: this.fido2Credentials?.map((f) => f.toSdkFido2Credential())
    };
  }
  /**
   * Maps an SDK Login object to a Login
   * @param obj - The SDK Login object
   */
  static fromSdkLogin(obj) {
    if (!obj) {
      return void 0;
    }
    const login = new _Login();
    login.passwordRevisionDate = obj.passwordRevisionDate != null ? new Date(obj.passwordRevisionDate) : void 0;
    login.autofillOnPageLoad = obj.autofillOnPageLoad;
    login.username = encStringFrom(obj.username);
    login.password = encStringFrom(obj.password);
    login.totp = encStringFrom(obj.totp);
    login.uris = obj.uris?.filter((u) => u.uri != null).map((uri) => LoginUri.fromSdkLoginUri(uri)).filter((u) => u != null) ?? void 0;
    login.fido2Credentials = obj.fido2Credentials?.map((f) => Fido2Credential.fromSdkFido2Credential(f)).filter((c) => c != null) ?? void 0;
    return login;
  }
};

// libs/common/src/vault/models/domain/password.ts
var Password = class _Password extends Domain {
  constructor(obj) {
    super();
    if (obj == null) {
      return;
    }
    this.password = new EncString(obj.password);
    this.lastUsedDate = new Date(obj.lastUsedDate);
  }
  decrypt(encKey) {
    return this.decryptObj(
      this,
      new PasswordHistoryView(this),
      ["password"],
      encKey,
      "DomainType: PasswordHistory"
    );
  }
  toPasswordHistoryData() {
    const ph = new PasswordHistoryData();
    ph.lastUsedDate = this.lastUsedDate.toISOString();
    this.buildDataModel(this, ph, {
      password: null
    });
    return ph;
  }
  static fromJSON(obj) {
    if (obj == null) {
      return void 0;
    }
    const passwordHistory = new _Password();
    passwordHistory.password = EncString.fromJSON(obj.password);
    passwordHistory.lastUsedDate = new Date(obj.lastUsedDate);
    return passwordHistory;
  }
  /**
   * Maps Password to SDK format.
   *
   * @returns {PasswordHistory} The SDK password history object.
   */
  toSdkPasswordHistory() {
    return {
      password: this.password.toSdk(),
      lastUsedDate: this.lastUsedDate.toISOString()
    };
  }
  /**
   * Maps an SDK PasswordHistory object to a Password
   * @param obj - The SDK PasswordHistory object
   */
  static fromSdkPasswordHistory(obj) {
    if (!obj) {
      return void 0;
    }
    const passwordHistory = new _Password();
    passwordHistory.password = EncString.fromJSON(obj.password);
    passwordHistory.lastUsedDate = new Date(obj.lastUsedDate);
    return passwordHistory;
  }
};

// libs/common/src/vault/models/domain/secure-note.ts
var SecureNote = class _SecureNote extends Domain {
  constructor(obj) {
    super();
    this.type = SecureNoteType.Generic;
    if (obj == null) {
      return;
    }
    this.type = obj.type;
  }
  async decrypt() {
    return new SecureNoteView(this);
  }
  toSecureNoteData() {
    const n = new SecureNoteData();
    n.type = this.type;
    return n;
  }
  static fromJSON(obj) {
    if (obj == null) {
      return void 0;
    }
    const secureNote = new _SecureNote();
    secureNote.type = obj.type;
    return secureNote;
  }
  /**
   * Maps Secure note to SDK format.
   *
   * @returns {SdkSecureNote} The SDK secure note object.
   */
  toSdkSecureNote() {
    return {
      type: normalizeSecureNoteTypeForSdk(this.type)
    };
  }
  /**
   * Maps an SDK SecureNote object to a SecureNote
   * @param obj - The SDK SecureNote object
   */
  static fromSdkSecureNote(obj) {
    if (obj == null) {
      return void 0;
    }
    const secureNote = new _SecureNote();
    secureNote.type = obj.type;
    return secureNote;
  }
};

// libs/common/src/vault/models/domain/ssh-key.ts
var SshKey = class _SshKey extends Domain {
  constructor(obj) {
    super();
    if (obj == null) {
      return;
    }
    this.privateKey = new EncString(obj.privateKey);
    this.publicKey = new EncString(obj.publicKey);
    this.keyFingerprint = new EncString(obj.keyFingerprint);
  }
  decrypt(encKey, context = "No Cipher Context") {
    return this.decryptObj(
      this,
      new SshKeyView(),
      ["privateKey", "publicKey", "keyFingerprint"],
      encKey,
      "DomainType: SshKey; " + context
    );
  }
  toSshKeyData() {
    const c = new SshKeyData();
    this.buildDataModel(this, c, {
      privateKey: null,
      publicKey: null,
      keyFingerprint: null
    });
    return c;
  }
  static fromJSON(obj) {
    if (obj == null) {
      return void 0;
    }
    const sshKey = new _SshKey();
    sshKey.privateKey = EncString.fromJSON(obj.privateKey);
    sshKey.publicKey = EncString.fromJSON(obj.publicKey);
    sshKey.keyFingerprint = EncString.fromJSON(obj.keyFingerprint);
    return sshKey;
  }
  /**
   * Maps SSH key to SDK format.
   *
   * @returns {SdkSshKey} The SDK SSH key object.
   */
  toSdkSshKey() {
    return {
      privateKey: this.privateKey.toSdk(),
      publicKey: this.publicKey.toSdk(),
      fingerprint: this.keyFingerprint.toSdk()
    };
  }
  /**
   * Maps an SDK SshKey object to a SshKey
   * @param obj - The SDK SshKey object
   */
  static fromSdkSshKey(obj) {
    if (obj == null) {
      return void 0;
    }
    const sshKey = new _SshKey();
    sshKey.privateKey = EncString.fromJSON(obj.privateKey);
    sshKey.publicKey = EncString.fromJSON(obj.publicKey);
    sshKey.keyFingerprint = EncString.fromJSON(obj.fingerprint);
    return sshKey;
  }
};

// libs/common/src/vault/models/domain/cipher.ts
var Cipher = class _Cipher extends Domain {
  constructor(obj, localData) {
    super();
    this.initializerKey = 0 /* Cipher */;
    this.id = "";
    this.name = new EncString("");
    this.type = CipherType.Login;
    this.favorite = false;
    this.organizationUseTotp = false;
    this.edit = false;
    this.viewPassword = true;
    this.collectionIds = [];
    this.reprompt = CipherRepromptType.None;
    if (obj == null) {
      this.creationDate = this.revisionDate = /* @__PURE__ */ new Date();
      return;
    }
    this.id = obj.id;
    this.organizationId = obj.organizationId;
    this.folderId = obj.folderId;
    this.name = new EncString(obj.name);
    this.notes = conditionalEncString(obj.notes);
    this.type = obj.type;
    this.favorite = obj.favorite;
    this.organizationUseTotp = obj.organizationUseTotp;
    this.edit = obj.edit;
    this.viewPassword = obj.viewPassword;
    this.permissions = obj.permissions;
    this.revisionDate = new Date(obj.revisionDate);
    this.localData = localData;
    this.collectionIds = obj.collectionIds ?? [];
    this.creationDate = new Date(obj.creationDate);
    this.deletedDate = obj.deletedDate != null ? new Date(obj.deletedDate) : void 0;
    this.archivedDate = obj.archivedDate != null ? new Date(obj.archivedDate) : void 0;
    this.reprompt = obj.reprompt;
    this.key = conditionalEncString(obj.key);
    switch (this.type) {
      case CipherType.Login:
        this.login = new Login(obj.login);
        break;
      case CipherType.SecureNote:
        this.secureNote = new SecureNote(obj.secureNote);
        break;
      case CipherType.Card:
        this.card = new Card(obj.card);
        break;
      case CipherType.Identity:
        this.identity = new Identity(obj.identity);
        break;
      case CipherType.SshKey:
        this.sshKey = new SshKey(obj.sshKey);
        break;
      default:
        break;
    }
    if (obj.attachments != null) {
      this.attachments = obj.attachments.map((a) => new Attachment(a));
    }
    if (obj.fields != null) {
      this.fields = obj.fields.map((f) => new Field(f));
    }
    if (obj.passwordHistory != null) {
      this.passwordHistory = obj.passwordHistory.map((ph) => new Password(ph));
    }
  }
  async decrypt(userKeyOrOrgKey) {
    assertNonNullish(userKeyOrOrgKey, "userKeyOrOrgKey", "Cipher decryption");
    const model = new CipherView(this);
    let bypassValidation = true;
    let cipherDecryptionKey = userKeyOrOrgKey;
    if (this.key != null) {
      const encryptService = Utils.getContainerService().getEncryptService();
      try {
        const cipherKey = await encryptService.unwrapSymmetricKey(this.key, userKeyOrOrgKey);
        cipherDecryptionKey = cipherKey;
        bypassValidation = false;
      } catch {
        model.name = "[error: cannot decrypt]";
        model.decryptionFailure = true;
        return model;
      }
    }
    await this.decryptObj(this, model, ["name", "notes"], cipherDecryptionKey);
    switch (this.type) {
      case CipherType.Login:
        if (this.login != null) {
          model.login = await this.login.decrypt(
            bypassValidation,
            cipherDecryptionKey,
            `Cipher Id: ${this.id}`
          );
        }
        break;
      case CipherType.SecureNote:
        if (this.secureNote != null) {
          model.secureNote = await this.secureNote.decrypt();
        }
        break;
      case CipherType.Card:
        if (this.card != null) {
          model.card = await this.card.decrypt(cipherDecryptionKey, `Cipher Id: ${this.id}`);
        }
        break;
      case CipherType.Identity:
        if (this.identity != null) {
          model.identity = await this.identity.decrypt(
            cipherDecryptionKey,
            `Cipher Id: ${this.id}`
          );
        }
        break;
      case CipherType.SshKey:
        if (this.sshKey != null) {
          model.sshKey = await this.sshKey.decrypt(cipherDecryptionKey, `Cipher Id: ${this.id}`);
        }
        break;
      default:
        break;
    }
    if (this.attachments != null && this.attachments.length > 0) {
      const attachments = [];
      for (const attachment of this.attachments) {
        const decryptedAttachment = await attachment.decrypt(
          cipherDecryptionKey,
          `Cipher Id: ${this.id}`
        );
        attachments.push(decryptedAttachment);
      }
      model.attachments = attachments;
    }
    if (this.fields != null && this.fields.length > 0) {
      const fields = [];
      for (const field of this.fields) {
        const decryptedField = await field.decrypt(cipherDecryptionKey);
        fields.push(decryptedField);
      }
      model.fields = fields;
    }
    if (this.passwordHistory != null && this.passwordHistory.length > 0) {
      const passwordHistory = [];
      for (const ph of this.passwordHistory) {
        const decryptedPh = await ph.decrypt(cipherDecryptionKey);
        passwordHistory.push(decryptedPh);
      }
      model.passwordHistory = passwordHistory;
    }
    return model;
  }
  toCipherData() {
    const c = new CipherData();
    c.id = this.id;
    if (this.organizationId != null) {
      c.organizationId = this.organizationId;
    }
    if (this.folderId != null) {
      c.folderId = this.folderId;
    }
    c.edit = this.edit;
    c.viewPassword = this.viewPassword;
    c.organizationUseTotp = this.organizationUseTotp;
    c.favorite = this.favorite;
    c.revisionDate = this.revisionDate.toISOString();
    c.type = this.type;
    c.collectionIds = this.collectionIds;
    c.creationDate = this.creationDate.toISOString();
    c.deletedDate = this.deletedDate != null ? this.deletedDate.toISOString() : void 0;
    c.reprompt = this.reprompt;
    if (this.key != null && this.key.encryptedString != null) {
      c.key = this.key.encryptedString;
    }
    if (this.permissions != null) {
      c.permissions = this.permissions;
    }
    c.archivedDate = this.archivedDate != null ? this.archivedDate.toISOString() : void 0;
    this.buildDataModel(this, c, {
      name: null,
      notes: null
    });
    switch (c.type) {
      case CipherType.Login:
        if (this.login != null) {
          c.login = this.login.toLoginData();
        }
        break;
      case CipherType.SecureNote:
        if (this.secureNote != null) {
          c.secureNote = this.secureNote.toSecureNoteData();
        }
        break;
      case CipherType.Card:
        if (this.card != null) {
          c.card = this.card.toCardData();
        }
        break;
      case CipherType.Identity:
        if (this.identity != null) {
          c.identity = this.identity.toIdentityData();
        }
        break;
      case CipherType.SshKey:
        if (this.sshKey != null) {
          c.sshKey = this.sshKey.toSshKeyData();
        }
        break;
      default:
        break;
    }
    if (this.fields != null) {
      c.fields = this.fields.map((f) => f.toFieldData());
    }
    if (this.attachments != null) {
      c.attachments = this.attachments.map((a) => a.toAttachmentData());
    }
    if (this.passwordHistory != null) {
      c.passwordHistory = this.passwordHistory.map((ph) => ph.toPasswordHistoryData());
    }
    return c;
  }
  static fromJSON(obj) {
    if (obj == null) {
      return void 0;
    }
    const domain = new _Cipher();
    domain.id = obj.id;
    domain.organizationId = obj.organizationId;
    domain.folderId = obj.folderId;
    domain.type = obj.type;
    domain.favorite = obj.favorite;
    domain.organizationUseTotp = obj.organizationUseTotp;
    domain.edit = obj.edit;
    domain.viewPassword = obj.viewPassword;
    if (obj.permissions != null) {
      domain.permissions = new CipherPermissionsApi(obj.permissions);
    }
    domain.collectionIds = obj.collectionIds;
    domain.localData = obj.localData;
    domain.reprompt = obj.reprompt;
    domain.creationDate = new Date(obj.creationDate);
    domain.revisionDate = new Date(obj.revisionDate);
    domain.deletedDate = obj.deletedDate != null ? new Date(obj.deletedDate) : void 0;
    domain.archivedDate = obj.archivedDate != null ? new Date(obj.archivedDate) : void 0;
    domain.name = EncString.fromJSON(obj.name);
    domain.notes = encStringFrom(obj.notes);
    domain.key = encStringFrom(obj.key);
    domain.attachments = obj.attachments?.map((a) => Attachment.fromJSON(a)).filter((a) => a != null);
    domain.fields = obj.fields?.map((f) => Field.fromJSON(f)).filter((f) => f != null);
    domain.passwordHistory = obj.passwordHistory?.map((ph) => Password.fromJSON(ph)).filter((ph) => ph != null);
    switch (obj.type) {
      case CipherType.Card:
        if (obj.card != null) {
          domain.card = Card.fromJSON(obj.card);
        }
        break;
      case CipherType.Identity:
        if (obj.identity != null) {
          domain.identity = Identity.fromJSON(obj.identity);
        }
        break;
      case CipherType.Login:
        if (obj.login != null) {
          domain.login = Login.fromJSON(obj.login);
        }
        break;
      case CipherType.SecureNote:
        if (obj.secureNote != null) {
          domain.secureNote = SecureNote.fromJSON(obj.secureNote);
        }
        break;
      case CipherType.SshKey:
        if (obj.sshKey != null) {
          domain.sshKey = SshKey.fromJSON(obj.sshKey);
        }
        break;
      default:
        break;
    }
    return domain;
  }
  /**
   * Maps Cipher to SDK format.
   *
   * @returns {SdkCipher} The SDK cipher object.
   */
  toSdkCipher() {
    const sdkCipher = {
      id: this.id ? asUuid(this.id) : void 0,
      organizationId: this.organizationId ? asUuid(this.organizationId) : void 0,
      folderId: this.folderId ? asUuid(this.folderId) : void 0,
      collectionIds: this.collectionIds ? this.collectionIds.map(asUuid) : [],
      key: this.key?.toSdk(),
      name: this.name.toSdk(),
      notes: this.notes?.toSdk(),
      type: this.type,
      favorite: this.favorite,
      organizationUseTotp: this.organizationUseTotp,
      edit: this.edit,
      permissions: this.permissions ? {
        delete: this.permissions.delete,
        restore: this.permissions.restore
      } : void 0,
      viewPassword: this.viewPassword,
      localData: toSdkLocalData(this.localData),
      attachments: this.attachments?.map((a) => a.toSdkAttachment()),
      fields: this.fields?.map((f) => f.toSdkField()),
      passwordHistory: this.passwordHistory?.map((ph) => ph.toSdkPasswordHistory()),
      revisionDate: this.revisionDate.toISOString(),
      creationDate: this.creationDate.toISOString(),
      deletedDate: this.deletedDate?.toISOString(),
      archivedDate: this.archivedDate?.toISOString(),
      reprompt: normalizeCipherRepromptTypeForSdk(this.reprompt),
      // Initialize all cipher-type-specific properties as undefined
      login: void 0,
      identity: void 0,
      card: void 0,
      secureNote: void 0,
      sshKey: void 0,
      data: void 0
    };
    switch (this.type) {
      case CipherType.Login:
        if (this.login != null) {
          sdkCipher.login = this.login.toSdkLogin();
        }
        break;
      case CipherType.SecureNote:
        if (this.secureNote != null) {
          sdkCipher.secureNote = this.secureNote.toSdkSecureNote();
        }
        break;
      case CipherType.Card:
        if (this.card != null) {
          sdkCipher.card = this.card.toSdkCard();
        }
        break;
      case CipherType.Identity:
        if (this.identity != null) {
          sdkCipher.identity = this.identity.toSdkIdentity();
        }
        break;
      case CipherType.SshKey:
        if (this.sshKey != null) {
          sdkCipher.sshKey = this.sshKey.toSdkSshKey();
        }
        break;
      default:
        break;
    }
    return sdkCipher;
  }
  /**
   * Maps an SDK Cipher object to a Cipher
   * @param sdkCipher - The SDK Cipher object
   */
  static fromSdkCipher(sdkCipher) {
    if (sdkCipher == null) {
      return void 0;
    }
    const cipher = new _Cipher();
    cipher.id = sdkCipher.id ? uuidAsString(sdkCipher.id) : "";
    cipher.organizationId = sdkCipher.organizationId ? uuidAsString(sdkCipher.organizationId) : void 0;
    cipher.folderId = sdkCipher.folderId ? uuidAsString(sdkCipher.folderId) : void 0;
    cipher.collectionIds = sdkCipher.collectionIds ? sdkCipher.collectionIds.map(uuidAsString) : [];
    cipher.key = encStringFrom(sdkCipher.key);
    cipher.name = EncString.fromJSON(sdkCipher.name);
    cipher.notes = encStringFrom(sdkCipher.notes);
    cipher.type = sdkCipher.type;
    cipher.favorite = sdkCipher.favorite;
    cipher.organizationUseTotp = sdkCipher.organizationUseTotp;
    cipher.edit = sdkCipher.edit;
    cipher.permissions = CipherPermissionsApi.fromSdkCipherPermissions(sdkCipher.permissions);
    cipher.viewPassword = sdkCipher.viewPassword;
    cipher.localData = fromSdkLocalData(sdkCipher.localData);
    cipher.attachments = sdkCipher.attachments?.map((a) => Attachment.fromSdkAttachment(a)).filter((a) => a != null);
    cipher.fields = sdkCipher.fields?.map((f) => Field.fromSdkField(f)).filter((f) => f != null);
    cipher.passwordHistory = sdkCipher.passwordHistory?.map((ph) => Password.fromSdkPasswordHistory(ph)).filter((ph) => ph != null);
    cipher.creationDate = new Date(sdkCipher.creationDate);
    cipher.revisionDate = new Date(sdkCipher.revisionDate);
    cipher.deletedDate = sdkCipher.deletedDate ? new Date(sdkCipher.deletedDate) : void 0;
    cipher.archivedDate = sdkCipher.archivedDate ? new Date(sdkCipher.archivedDate) : void 0;
    cipher.reprompt = sdkCipher.reprompt;
    cipher.login = Login.fromSdkLogin(sdkCipher.login);
    cipher.secureNote = SecureNote.fromSdkSecureNote(sdkCipher.secureNote);
    cipher.card = Card.fromSdkCard(sdkCipher.card);
    cipher.identity = Identity.fromSdkIdentity(sdkCipher.identity);
    cipher.sshKey = SshKey.fromSdkSshKey(sdkCipher.sshKey);
    return cipher;
  }
};

// libs/common/src/vault/models/data/folder.data.ts
var FolderData = class _FolderData {
  constructor(response) {
    this.name = response.name ?? "";
    this.id = response.id ?? "";
    this.revisionDate = response.revisionDate ?? (/* @__PURE__ */ new Date()).toISOString();
  }
  static fromJSON(obj) {
    if (obj == null) {
      return null;
    }
    return new _FolderData({
      id: obj.id,
      name: obj.name,
      revisionDate: obj.revisionDate
    });
  }
};

// libs/common/src/vault/models/view/folder.view.ts
var FolderView = class _FolderView {
  constructor(f) {
    this.id = "";
    this.name = "";
    if (!f) {
      this.revisionDate = /* @__PURE__ */ new Date();
      return;
    }
    this.id = f.id;
    this.revisionDate = f.revisionDate;
  }
  static fromJSON(obj) {
    const folderView = new _FolderView();
    folderView.id = obj.id ?? "";
    folderView.name = obj.name ?? "";
    if (obj.revisionDate != null) {
      folderView.revisionDate = new Date(obj.revisionDate);
    }
    return folderView;
  }
};

// libs/common/src/vault/models/domain/folder.ts
var Folder = class _Folder extends Domain {
  constructor(obj) {
    super();
    this.id = "";
    this.name = new EncString("");
    this.revisionDate = /* @__PURE__ */ new Date();
    if (obj == null) {
      return;
    }
    this.id = obj.id;
    this.name = new EncString(obj.name);
    this.revisionDate = new Date(obj.revisionDate);
  }
  decrypt(key) {
    return this.decryptObj(this, new FolderView(this), ["name"], key);
  }
  async decryptWithKey(key, encryptService) {
    const folderView = new FolderView();
    folderView.id = this.id;
    folderView.revisionDate = this.revisionDate;
    try {
      folderView.name = await encryptService.decryptString(this.name, key);
    } catch (e) {
      console.error("[Folder] Error decrypting folder", e);
      throw e;
    }
    return folderView;
  }
  static fromJSON(obj) {
    if (obj == null) {
      return null;
    }
    const folder = new _Folder();
    folder.id = obj.id;
    folder.name = EncString.fromJSON(obj.name);
    folder.revisionDate = new Date(obj.revisionDate);
    return folder;
  }
};

// libs/common/src/models/export/utils.ts
function safeGetString(value) {
  if (value == null) {
    return null;
  }
  if (typeof value == "string") {
    return value;
  }
  return value?.encryptedString;
}

// libs/common/src/models/export/folder.export.ts
var FolderExport = class _FolderExport {
  constructor() {
    this.name = "";
  }
  static template() {
    const req = new _FolderExport();
    req.name = "Folder name";
    return req;
  }
  static toView(req, view = new FolderView()) {
    view.name = req.name;
    return view;
  }
  static toDomain(req, domain = new Folder()) {
    domain.name = new EncString(req.name);
    return domain;
  }
  // Use build method instead of ctor so that we can control order of JSON stringify for pretty print
  build(o) {
    this.name = safeGetString(o.name ?? "") ?? "";
  }
};

// libs/common/src/models/export/folder-with-id.export.ts
var FolderWithIdExport = class extends FolderExport {
  static toView(req, view = new FolderView()) {
    view.id = req.id;
    return super.toView(req, view);
  }
  static toDomain(req, domain = new Folder()) {
    domain.id = req.id;
    return super.toDomain(req, domain);
  }
  // Use build method instead of ctor so that we can control order of JSON stringify for pretty print
  build(o) {
    this.id = o.id;
    super.build(o);
  }
};

// libs/common/src/models/export/card.export.ts
var CardExport = class _CardExport {
  static template() {
    const req = new _CardExport();
    req.cardholderName = "John Doe";
    req.brand = "visa";
    req.number = "4242424242424242";
    req.expMonth = "04";
    req.expYear = "2023";
    req.code = "123";
    return req;
  }
  static toView(req, view = new CardView()) {
    view.cardholderName = req.cardholderName;
    view.brand = req.brand;
    view.number = req.number;
    view.expMonth = req.expMonth;
    view.expYear = req.expYear;
    view.code = req.code;
    return view;
  }
  static toDomain(req, domain = new Card()) {
    domain.cardholderName = req.cardholderName != null ? new EncString(req.cardholderName) : null;
    domain.brand = req.brand != null ? new EncString(req.brand) : null;
    domain.number = req.number != null ? new EncString(req.number) : null;
    domain.expMonth = req.expMonth != null ? new EncString(req.expMonth) : null;
    domain.expYear = req.expYear != null ? new EncString(req.expYear) : null;
    domain.code = req.code != null ? new EncString(req.code) : null;
    return domain;
  }
  constructor(o) {
    if (o == null) {
      return;
    }
    this.cardholderName = safeGetString(o.cardholderName);
    this.brand = safeGetString(o.brand);
    this.number = safeGetString(o.number);
    this.expMonth = safeGetString(o.expMonth);
    this.expYear = safeGetString(o.expYear);
    this.code = safeGetString(o.code);
  }
};

// libs/common/src/models/export/field.export.ts
var FieldExport = class _FieldExport {
  static template() {
    const req = new _FieldExport();
    req.name = "Field name";
    req.value = "Some value";
    req.type = FieldType.Text;
    return req;
  }
  static toView(req, view = new FieldView()) {
    view.type = req.type;
    view.value = req.value;
    view.name = req.name;
    view.linkedId = req.linkedId;
    return view;
  }
  static toDomain(req, domain = new Field()) {
    domain.type = req.type;
    domain.value = req.value != null ? new EncString(req.value) : null;
    domain.name = req.name != null ? new EncString(req.name) : null;
    domain.linkedId = req.linkedId;
    return domain;
  }
  constructor(o) {
    if (o == null) {
      return;
    }
    this.name = safeGetString(o.name);
    this.value = safeGetString(o.value);
    this.type = o.type;
    this.linkedId = o.linkedId;
  }
};

// libs/common/src/models/export/identity.export.ts
var IdentityExport = class _IdentityExport {
  static template() {
    const req = new _IdentityExport();
    req.title = "Mr";
    req.firstName = "John";
    req.middleName = "William";
    req.lastName = "Doe";
    req.address1 = "123 Any St";
    req.address2 = "Apt #123";
    req.address3 = null;
    req.city = "New York";
    req.state = "NY";
    req.postalCode = "10001";
    req.country = "US";
    req.company = "Acme Inc.";
    req.email = "john@company.com";
    req.phone = "5555551234";
    req.ssn = "000-123-4567";
    req.username = "jdoe";
    req.passportNumber = "US-123456789";
    req.licenseNumber = "D123-12-123-12333";
    return req;
  }
  static toView(req, view = new IdentityView()) {
    view.title = req.title;
    view.firstName = req.firstName;
    view.middleName = req.middleName;
    view.lastName = req.lastName;
    view.address1 = req.address1;
    view.address2 = req.address2;
    view.address3 = req.address3;
    view.city = req.city;
    view.state = req.state;
    view.postalCode = req.postalCode;
    view.country = req.country;
    view.company = req.company;
    view.email = req.email;
    view.phone = req.phone;
    view.ssn = req.ssn;
    view.username = req.username;
    view.passportNumber = req.passportNumber;
    view.licenseNumber = req.licenseNumber;
    return view;
  }
  static toDomain(req, domain = new Identity()) {
    domain.title = req.title != null ? new EncString(req.title) : null;
    domain.firstName = req.firstName != null ? new EncString(req.firstName) : null;
    domain.middleName = req.middleName != null ? new EncString(req.middleName) : null;
    domain.lastName = req.lastName != null ? new EncString(req.lastName) : null;
    domain.address1 = req.address1 != null ? new EncString(req.address1) : null;
    domain.address2 = req.address2 != null ? new EncString(req.address2) : null;
    domain.address3 = req.address3 != null ? new EncString(req.address3) : null;
    domain.city = req.city != null ? new EncString(req.city) : null;
    domain.state = req.state != null ? new EncString(req.state) : null;
    domain.postalCode = req.postalCode != null ? new EncString(req.postalCode) : null;
    domain.country = req.country != null ? new EncString(req.country) : null;
    domain.company = req.company != null ? new EncString(req.company) : null;
    domain.email = req.email != null ? new EncString(req.email) : null;
    domain.phone = req.phone != null ? new EncString(req.phone) : null;
    domain.ssn = req.ssn != null ? new EncString(req.ssn) : null;
    domain.username = req.username != null ? new EncString(req.username) : null;
    domain.passportNumber = req.passportNumber != null ? new EncString(req.passportNumber) : null;
    domain.licenseNumber = req.licenseNumber != null ? new EncString(req.licenseNumber) : null;
    return domain;
  }
  constructor(o) {
    if (o == null) {
      return;
    }
    this.title = safeGetString(o.title);
    this.firstName = safeGetString(o.firstName);
    this.middleName = safeGetString(o.middleName);
    this.lastName = safeGetString(o.lastName);
    this.address1 = safeGetString(o.address1);
    this.address2 = safeGetString(o.address2);
    this.address3 = safeGetString(o.address3);
    this.city = safeGetString(o.city);
    this.state = safeGetString(o.state);
    this.postalCode = safeGetString(o.postalCode);
    this.country = safeGetString(o.country);
    this.company = safeGetString(o.company);
    this.email = safeGetString(o.email);
    this.phone = safeGetString(o.phone);
    this.ssn = safeGetString(o.ssn);
    this.username = safeGetString(o.username);
    this.passportNumber = safeGetString(o.passportNumber);
    this.licenseNumber = safeGetString(o.licenseNumber);
  }
};

// libs/common/src/models/export/fido2-credential.export.ts
var Fido2CredentialExport = class _Fido2CredentialExport {
  /**
   * Generates a template for Fido2CredentialExport
   * @returns Instance of Fido2CredentialExport with predefined values.
   */
  static template() {
    const req = new _Fido2CredentialExport();
    req.credentialId = "keyId";
    req.keyType = "keyType";
    req.keyAlgorithm = "keyAlgorithm";
    req.keyCurve = "keyCurve";
    req.keyValue = "keyValue";
    req.rpId = "rpId";
    req.userHandle = "userHandle";
    req.userName = "userName";
    req.counter = "counter";
    req.rpName = "rpName";
    req.userDisplayName = "userDisplayName";
    req.discoverable = "false";
    req.creationDate = null;
    return req;
  }
  /**
   * Converts a Fido2CredentialExport object to its view representation.
   * @param req - The Fido2CredentialExport object to be converted.
   * @param view - (Optional) The Fido2CredentialView object to popualte with Fido2CredentialExport data
   * @returns Fido2CredentialView - The populated view, or a new instance if none was provided.
   */
  static toView(req, view = new Fido2CredentialView()) {
    view.credentialId = req.credentialId;
    view.keyType = req.keyType;
    view.keyAlgorithm = req.keyAlgorithm;
    view.keyCurve = req.keyCurve;
    view.keyValue = req.keyValue;
    view.rpId = req.rpId;
    view.userHandle = req.userHandle;
    view.userName = req.userName;
    view.counter = parseInt(req.counter);
    view.rpName = req.rpName;
    view.userDisplayName = req.userDisplayName;
    view.discoverable = req.discoverable === "true";
    view.creationDate = new Date(req.creationDate);
    return view;
  }
  /**
   * Converts a Fido2CredentialExport object to its domain representation.
   * @param req - The Fido2CredentialExport object to be converted.
   * @param domain - (Optional) The Fido2Credential object to popualte with Fido2CredentialExport data
   * @returns Fido2Credential - The populated domain, or a new instance if none was provided.
   */
  static toDomain(req, domain = new Fido2Credential()) {
    domain.credentialId = req.credentialId != null ? new EncString(req.credentialId) : null;
    domain.keyType = req.keyType != null ? new EncString(req.keyType) : null;
    domain.keyAlgorithm = req.keyAlgorithm != null ? new EncString(req.keyAlgorithm) : null;
    domain.keyCurve = req.keyCurve != null ? new EncString(req.keyCurve) : null;
    domain.keyValue = req.keyValue != null ? new EncString(req.keyValue) : null;
    domain.rpId = req.rpId != null ? new EncString(req.rpId) : null;
    domain.userHandle = req.userHandle != null ? new EncString(req.userHandle) : null;
    domain.userName = req.userName != null ? new EncString(req.userName) : null;
    domain.counter = req.counter != null ? new EncString(req.counter) : null;
    domain.rpName = req.rpName != null ? new EncString(req.rpName) : null;
    domain.userDisplayName = req.userDisplayName != null ? new EncString(req.userDisplayName) : null;
    domain.discoverable = req.discoverable != null ? new EncString(req.discoverable) : null;
    domain.creationDate = req.creationDate != null ? new Date(req.creationDate) : null;
    return domain;
  }
  /**
   * Constructs a new Fid2CredentialExport instance.
   *
   * @param o - The credential storing the data being exported. When not provided, an empty export is created instead.
   */
  constructor(o) {
    if (o == null) {
      return;
    }
    this.credentialId = safeGetString(o.credentialId);
    this.keyType = safeGetString(o.keyType);
    this.keyAlgorithm = safeGetString(o.keyAlgorithm);
    this.keyCurve = safeGetString(o.keyCurve);
    this.keyValue = safeGetString(o.keyValue);
    this.rpId = safeGetString(o.rpId);
    this.userHandle = safeGetString(o.userHandle);
    this.userName = safeGetString(o.userName);
    this.counter = safeGetString(o instanceof Fido2CredentialView ? String(o.counter) : o.counter);
    this.rpName = safeGetString(o.rpName);
    this.userDisplayName = safeGetString(o.userDisplayName);
    this.discoverable = safeGetString(
      o instanceof Fido2CredentialView ? String(o.discoverable) : o.discoverable
    );
    this.creationDate = o.creationDate;
  }
};

// libs/common/src/models/export/login-uri.export.ts
var LoginUriExport = class _LoginUriExport {
  constructor(o) {
    this.match = null;
    if (o == null) {
      return;
    }
    this.uri = safeGetString(o.uri);
    if ("uriChecksum" in o) {
      this.uriChecksum = o.uriChecksum?.encryptedString;
    }
    this.match = o.match;
  }
  static template() {
    const req = new _LoginUriExport();
    req.uri = "https://google.com";
    req.match = null;
    return req;
  }
  static toView(req, view = new LoginUriView()) {
    view.uri = req.uri;
    view.match = req.match;
    return view;
  }
  static toDomain(req, domain = new LoginUri()) {
    domain.uri = req.uri != null ? new EncString(req.uri) : null;
    domain.uriChecksum = req.uriChecksum != null ? new EncString(req.uriChecksum) : null;
    domain.match = req.match;
    return domain;
  }
};

// libs/common/src/models/export/login.export.ts
var LoginExport = class _LoginExport {
  static template() {
    const req = new _LoginExport();
    req.uris = [];
    req.username = "jdoe";
    req.password = "myp@ssword123";
    req.totp = "JBSWY3DPEHPK3PXP";
    req.fido2Credentials = [];
    return req;
  }
  static toView(req, view = new LoginView()) {
    if (req.uris != null) {
      view.uris = req.uris.map((u) => LoginUriExport.toView(u));
    }
    view.username = req.username;
    view.password = req.password;
    view.totp = req.totp;
    if (req.fido2Credentials != null) {
      view.fido2Credentials = req.fido2Credentials.map((key) => Fido2CredentialExport.toView(key));
    }
    return view;
  }
  static toDomain(req, domain = new Login()) {
    if (req.uris != null) {
      domain.uris = req.uris.map((u) => LoginUriExport.toDomain(u));
    }
    domain.username = req.username != null ? new EncString(req.username) : null;
    domain.password = req.password != null ? new EncString(req.password) : null;
    domain.totp = req.totp != null ? new EncString(req.totp) : null;
    if (req.fido2Credentials != null) {
      domain.fido2Credentials = req.fido2Credentials.map(
        (f2) => Fido2CredentialExport.toDomain(f2)
      );
    }
    return domain;
  }
  constructor(o) {
    if (o == null) {
      return;
    }
    if (o.uris != null) {
      this.uris = o.uris.map((u) => new LoginUriExport(u));
    }
    if (o.fido2Credentials != null) {
      this.fido2Credentials = o.fido2Credentials.map((key) => new Fido2CredentialExport(key));
    }
    this.username = safeGetString(o.username);
    this.password = safeGetString(o.password);
    this.totp = safeGetString(o.totp);
  }
};

// libs/common/src/models/export/password-history.export.ts
var PasswordHistoryExport = class _PasswordHistoryExport {
  constructor(o) {
    this.lastUsedDate = null;
    if (o == null) {
      return;
    }
    this.password = safeGetString(o.password);
    this.lastUsedDate = o.lastUsedDate;
  }
  static template() {
    const req = new _PasswordHistoryExport();
    req.password = null;
    req.lastUsedDate = null;
    return req;
  }
  static toView(req, view = new PasswordHistoryView()) {
    view.password = req.password;
    view.lastUsedDate = req.lastUsedDate ? new Date(req.lastUsedDate) : null;
    return view;
  }
  static toDomain(req, domain = new Password()) {
    domain.password = req.password != null ? new EncString(req.password) : null;
    domain.lastUsedDate = req.lastUsedDate ? new Date(req.lastUsedDate) : null;
    return domain;
  }
};

// libs/common/src/models/export/secure-note.export.ts
var SecureNoteExport = class _SecureNoteExport {
  static template() {
    const req = new _SecureNoteExport();
    req.type = SecureNoteType.Generic;
    return req;
  }
  static toView(req, view = new SecureNoteView()) {
    view.type = req.type;
    return view;
  }
  static toDomain(req, view = new SecureNote()) {
    view.type = req.type;
    return view;
  }
  constructor(o) {
    if (o == null) {
      return;
    }
    this.type = o.type;
  }
};

// libs/common/src/models/export/ssh-key.export.ts
var SshKeyExport = class _SshKeyExport {
  static template() {
    const req = new _SshKeyExport();
    req.privateKey = "";
    req.publicKey = "";
    req.keyFingerprint = "";
    return req;
  }
  static toView(req, view = new SshKeyView()) {
    if (req == null) {
      return void 0;
    }
    if (!req.privateKey || req.privateKey.trim() === "") {
      throw new Error("SSH key private key is required.");
    }
    if (!req.publicKey || req.publicKey.trim() === "") {
      throw new Error("SSH key public key is required.");
    }
    if (!req.keyFingerprint || req.keyFingerprint.trim() === "") {
      throw new Error("SSH key fingerprint is required.");
    }
    view.privateKey = req.privateKey;
    view.publicKey = req.publicKey;
    view.keyFingerprint = req.keyFingerprint;
    return view;
  }
  static toDomain(req, domain = new SshKey()) {
    domain.privateKey = new EncString(req.privateKey);
    domain.publicKey = new EncString(req.publicKey);
    domain.keyFingerprint = new EncString(req.keyFingerprint);
    return domain;
  }
  constructor(o) {
    if (o == null) {
      return;
    }
    this.privateKey = safeGetString(o.privateKey);
    this.publicKey = safeGetString(o.publicKey);
    this.keyFingerprint = safeGetString(o.keyFingerprint);
  }
};

// libs/common/src/models/export/cipher.export.ts
var CipherExport = class _CipherExport {
  constructor() {
    this.passwordHistory = null;
    this.revisionDate = null;
    this.creationDate = null;
    this.deletedDate = null;
    this.archivedDate = null;
  }
  static template() {
    const req = new _CipherExport();
    req.organizationId = null;
    req.collectionIds = null;
    req.folderId = null;
    req.type = CipherType.Login;
    req.name = "Item name";
    req.notes = "Some notes about this item.";
    req.favorite = false;
    req.fields = [];
    req.login = null;
    req.secureNote = null;
    req.card = null;
    req.identity = null;
    req.sshKey = null;
    req.reprompt = CipherRepromptType.None;
    req.passwordHistory = [];
    req.creationDate = null;
    req.revisionDate = null;
    req.deletedDate = null;
    req.archivedDate = null;
    return req;
  }
  static toView(req, view = new CipherView()) {
    view.type = req.type;
    view.folderId = req.folderId;
    if (view.organizationId == null) {
      view.organizationId = req.organizationId;
    }
    if (view.collectionIds || req.collectionIds) {
      const set = new Set((view.collectionIds ?? []).concat(req.collectionIds ?? []));
      view.collectionIds = Array.from(set.values());
    }
    view.name = req.name;
    view.notes = req.notes;
    view.favorite = req.favorite;
    view.reprompt = req.reprompt ?? CipherRepromptType.None;
    view.key = req.key != null ? new EncString(req.key) : null;
    if (req.fields != null) {
      view.fields = req.fields.map((f) => FieldExport.toView(f));
    }
    switch (req.type) {
      case CipherType.Login:
        view.login = LoginExport.toView(req.login);
        break;
      case CipherType.SecureNote:
        view.secureNote = SecureNoteExport.toView(req.secureNote);
        break;
      case CipherType.Card:
        view.card = CardExport.toView(req.card);
        break;
      case CipherType.Identity:
        view.identity = IdentityExport.toView(req.identity);
        break;
      case CipherType.SshKey:
        view.sshKey = SshKeyExport.toView(req.sshKey);
        break;
    }
    if (req.passwordHistory != null) {
      view.passwordHistory = req.passwordHistory.map((ph) => PasswordHistoryExport.toView(ph));
    }
    view.creationDate = req.creationDate ? new Date(req.creationDate) : view.creationDate;
    view.revisionDate = req.revisionDate ? new Date(req.revisionDate) : view.revisionDate;
    view.deletedDate = req.deletedDate ? new Date(req.deletedDate) : view.deletedDate;
    view.archivedDate = req.archivedDate ? new Date(req.archivedDate) : view.archivedDate;
    return view;
  }
  static toDomain(req, domain = new Cipher()) {
    domain.type = req.type;
    domain.folderId = req.folderId;
    if (domain.organizationId == null) {
      domain.organizationId = req.organizationId;
    }
    domain.name = req.name != null ? new EncString(req.name) : null;
    domain.notes = req.notes != null ? new EncString(req.notes) : null;
    domain.favorite = req.favorite;
    domain.reprompt = req.reprompt ?? CipherRepromptType.None;
    domain.key = req.key != null ? new EncString(req.key) : null;
    if (req.fields != null) {
      domain.fields = req.fields.map((f) => FieldExport.toDomain(f));
    }
    switch (req.type) {
      case CipherType.Login:
        domain.login = LoginExport.toDomain(req.login);
        break;
      case CipherType.SecureNote:
        domain.secureNote = SecureNoteExport.toDomain(req.secureNote);
        break;
      case CipherType.Card:
        domain.card = CardExport.toDomain(req.card);
        break;
      case CipherType.Identity:
        domain.identity = IdentityExport.toDomain(req.identity);
        break;
      case CipherType.SshKey:
        domain.sshKey = SshKeyExport.toDomain(req.sshKey);
        break;
    }
    if (req.passwordHistory != null) {
      domain.passwordHistory = req.passwordHistory.map((ph) => PasswordHistoryExport.toDomain(ph));
    }
    domain.creationDate = req.creationDate ? new Date(req.creationDate) : null;
    domain.revisionDate = req.revisionDate ? new Date(req.revisionDate) : null;
    domain.deletedDate = req.deletedDate ? new Date(req.deletedDate) : null;
    domain.archivedDate = req.archivedDate ? new Date(req.archivedDate) : null;
    return domain;
  }
  // Use build method instead of ctor so that we can control order of JSON stringify for pretty print
  build(o) {
    this.organizationId = o.organizationId;
    this.folderId = o.folderId;
    this.type = o.type;
    this.reprompt = o.reprompt;
    this.name = safeGetString(o.name);
    this.notes = safeGetString(o.notes);
    if ("key" in o) {
      this.key = o.key?.encryptedString;
    }
    this.favorite = o.favorite;
    if (o.fields != null) {
      this.fields = o.fields.map((f) => new FieldExport(f));
    }
    switch (o.type) {
      case CipherType.Login:
        this.login = new LoginExport(o.login);
        break;
      case CipherType.SecureNote:
        this.secureNote = new SecureNoteExport(o.secureNote);
        break;
      case CipherType.Card:
        this.card = new CardExport(o.card);
        break;
      case CipherType.Identity:
        this.identity = new IdentityExport(o.identity);
        break;
      case CipherType.SshKey:
        this.sshKey = new SshKeyExport(o.sshKey);
        break;
    }
    if (o.passwordHistory != null) {
      this.passwordHistory = o.passwordHistory.map((ph) => new PasswordHistoryExport(ph));
    }
    this.creationDate = o.creationDate;
    this.revisionDate = o.revisionDate;
    this.deletedDate = o.deletedDate;
    this.archivedDate = o.archivedDate;
  }
};

// libs/common/src/models/export/cipher-with-ids.export.ts
var CipherWithIdExport = class extends CipherExport {
  // Use build method instead of ctor so that we can control order of JSON stringify for pretty print
  build(o) {
    this.id = o.id;
    super.build(o);
    this.collectionIds = o.collectionIds;
  }
};

// libs/common/src/admin-console/models/collections/collection.ts
var CollectionTypes = {
  SharedCollection: 0,
  DefaultUserCollection: 1
};

// libs/common/src/admin-console/models/collections/collection.response.ts
var CollectionResponse = class extends BaseResponse {
  constructor(response) {
    super(response);
    this.type = CollectionTypes.SharedCollection;
    this.id = this.getResponseProperty("Id");
    this.organizationId = this.getResponseProperty("OrganizationId");
    this.name = this.getResponseProperty("Name");
    this.externalId = this.getResponseProperty("ExternalId");
    this.defaultUserCollectionEmail = this.getResponseProperty("DefaultUserCollectionEmail");
    this.type = this.getResponseProperty("Type") ?? CollectionTypes.SharedCollection;
  }
};
var CollectionDetailsResponse = class extends CollectionResponse {
  constructor(response) {
    super(response);
    this.readOnly = this.getResponseProperty("ReadOnly") || false;
    this.manage = this.getResponseProperty("Manage") || false;
    this.hidePasswords = this.getResponseProperty("HidePasswords") || false;
    this.assigned = this.getResponseProperty("object") == "collectionDetails";
  }
};

// libs/common/src/admin-console/models/response/policy.response.ts
var PolicyResponse = class extends BaseResponse {
  constructor(response) {
    super(response);
    this.id = this.getResponseProperty("Id");
    this.organizationId = this.getResponseProperty("OrganizationId");
    this.type = this.getResponseProperty("Type");
    this.data = this.getResponseProperty("Data");
    this.enabled = this.getResponseProperty("Enabled");
    this.canToggleState = this.getResponseProperty("CanToggleState") ?? true;
    this.revisionDate = this.getResponseProperty("RevisionDate");
  }
};

// libs/common/src/auth/models/response/user-decryption-options/webauthn-prf-decryption-option.response.ts
var WebAuthnPrfDecryptionOptionResponse = class extends BaseResponse {
  constructor(response) {
    super(response);
    const encPrivateKey = this.getResponseProperty("EncryptedPrivateKey");
    if (encPrivateKey) {
      this.encryptedPrivateKey = new EncString(encPrivateKey);
    }
    const encUserKey = this.getResponseProperty("EncryptedUserKey");
    if (encUserKey) {
      this.encryptedUserKey = new EncString(encUserKey);
    }
    this.credentialId = this.getResponseProperty("CredentialId");
    this.transports = this.getResponseProperty("Transports") || [];
  }
};

// libs/key-management/src/biometrics/biometric-state.service.ts
var import_rxjs13 = require("rxjs");

// libs/state/src/core/user-state.ts
var activeMarker = Symbol("active");

// libs/serialization/src/deserialization-helpers.ts
function array(elementDeserializer) {
  return (array2) => {
    if (array2 == null) {
      return null;
    }
    return array2.map((element) => elementDeserializer(element));
  };
}
function record(valueDeserializer) {
  return (jsonValue) => {
    if (jsonValue == null) {
      return null;
    }
    const output = {};
    Object.entries(jsonValue).forEach(([key, value]) => {
      output[key] = valueDeserializer(value);
    });
    return output;
  };
}

// libs/state/src/core/key-definition.ts
var KeyDefinition = class _KeyDefinition {
  /**
   * Creates a new instance of a KeyDefinition
   * @param stateDefinition The state definition for which this key belongs to.
   * @param key The name of the key, this should be unique per domain.
   * @param options A set of options to customize the behavior of {@link KeyDefinition}. All options are required.
   * @param options.deserializer A function to use to safely convert your type from json to your expected type.
   *   Your data may be serialized/deserialized at any time and this needs callback needs to be able to faithfully re-initialize
   *   from the JSON object representation of your type.
   */
  constructor(stateDefinition, key, options) {
    this.stateDefinition = stateDefinition;
    this.key = key;
    this.options = options;
    if (options.deserializer == null) {
      throw new Error(`'deserializer' is a required property on key ${this.errorKeyName}`);
    }
    if (options.cleanupDelayMs < 0) {
      throw new Error(
        `'cleanupDelayMs' must be greater than or equal to 0. Value of ${options.cleanupDelayMs} passed to key ${this.errorKeyName} `
      );
    }
    const { enableUpdateLogging = false, enableRetrievalLogging = false } = options.debug ?? {};
    this.debug = {
      enableUpdateLogging,
      enableRetrievalLogging
    };
  }
  /**
   * Gets the deserializer configured for this {@link KeyDefinition}
   */
  get deserializer() {
    return this.options.deserializer;
  }
  /**
   * Gets the number of milliseconds to wait before cleaning up the state after the last subscriber has unsubscribed.
   */
  get cleanupDelayMs() {
    return this.options.cleanupDelayMs < 0 ? 0 : this.options.cleanupDelayMs ?? 1e3;
  }
  /**
   * Creates a {@link KeyDefinition} for state that is an array.
   * @param stateDefinition The state definition to be added to the KeyDefinition
   * @param key The key to be added to the KeyDefinition
   * @param options The options to customize the final {@link KeyDefinition}.
   * @returns A {@link KeyDefinition} initialized for arrays, the options run
   * the deserializer on the provided options for each element of an array.
   *
   * @example
   * ```typescript
   * const MY_KEY = KeyDefinition.array<MyArrayElement>(MY_STATE, "key", {
   *   deserializer: (myJsonElement) => convertToElement(myJsonElement),
   * });
   * ```
   */
  static array(stateDefinition, key, options) {
    return new _KeyDefinition(stateDefinition, key, {
      ...options,
      deserializer: array((e) => options.deserializer(e))
    });
  }
  /**
   * Creates a {@link KeyDefinition} for state that is a record.
   * @param stateDefinition The state definition to be added to the KeyDefinition
   * @param key The key to be added to the KeyDefinition
   * @param options The options to customize the final {@link KeyDefinition}.
   * @returns A {@link KeyDefinition} that contains a serializer that will run the provided deserializer for each
   * value in a record and returns every key as a string.
   *
   * @example
   * ```typescript
   * const MY_KEY = KeyDefinition.record<MyRecordValue>(MY_STATE, "key", {
   *   deserializer: (myJsonValue) => convertToValue(myJsonValue),
   * });
   * ```
   */
  static record(stateDefinition, key, options) {
    return new _KeyDefinition(stateDefinition, key, {
      ...options,
      deserializer: record((v) => options.deserializer(v))
    });
  }
  get fullName() {
    return `${this.stateDefinition.name}_${this.key}`;
  }
  get errorKeyName() {
    return `${this.stateDefinition.name} > ${this.key}`;
  }
};

// libs/guid/src/index.ts
var guidRegex = /^[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/i;
function isGuid(id) {
  return guidRegex.test(id);
}

// libs/state/src/core/user-key-definition.ts
var USER_KEY_DEFINITION_MARKER = Symbol("UserKeyDefinition");
var _a;
_a = USER_KEY_DEFINITION_MARKER;
var _UserKeyDefinition = class _UserKeyDefinition {
  constructor(stateDefinition, key, options) {
    this.stateDefinition = stateDefinition;
    this.key = key;
    this.options = options;
    this[_a] = true;
    if (options.deserializer == null) {
      throw new Error(`'deserializer' is a required property on key ${this.errorKeyName}`);
    }
    if (options.cleanupDelayMs < 0) {
      throw new Error(
        `'cleanupDelayMs' must be greater than or equal to 0. Value of ${options.cleanupDelayMs} passed to key ${this.errorKeyName} `
      );
    }
    this.clearOn = Array.from(new Set(options.clearOn));
    const { enableUpdateLogging = false, enableRetrievalLogging = false } = options.debug ?? {};
    this.debug = {
      enableUpdateLogging,
      enableRetrievalLogging
    };
  }
  /**
   * Gets the deserializer configured for this {@link KeyDefinition}
   */
  get deserializer() {
    return this.options.deserializer;
  }
  /**
   * Gets the number of milliseconds to wait before cleaning up the state after the last subscriber has unsubscribed.
   */
  get cleanupDelayMs() {
    return this.options.cleanupDelayMs < 0 ? 0 : this.options.cleanupDelayMs ?? 1e3;
  }
  /**
   * Creates a {@link UserKeyDefinition} for state that is an array.
   * @param stateDefinition The state definition to be added to the UserKeyDefinition
   * @param key The key to be added to the KeyDefinition
   * @param options The options to customize the final {@link UserKeyDefinition}.
   * @returns A {@link UserKeyDefinition} initialized for arrays, the options run
   * the deserializer on the provided options for each element of an array
   * **unless that array is null, in which case it will return an empty list.**
   *
   * @example
   * ```typescript
   * const MY_KEY = UserKeyDefinition.array<MyArrayElement>(MY_STATE, "key", {
   *   deserializer: (myJsonElement) => convertToElement(myJsonElement),
   * });
   * ```
   */
  static array(stateDefinition, key, options) {
    return new _UserKeyDefinition(stateDefinition, key, {
      ...options,
      deserializer: array((e) => options.deserializer(e))
    });
  }
  /**
   * Creates a {@link UserKeyDefinition} for state that is a record.
   * @param stateDefinition The state definition to be added to the UserKeyDefinition
   * @param key The key to be added to the KeyDefinition
   * @param options The options to customize the final {@link UserKeyDefinition}.
   * @returns A {@link UserKeyDefinition} that contains a serializer that will run the provided deserializer for each
   * value in a record and returns every key as a string **unless that record is null, in which case it will return an record.**
   *
   * @example
   * ```typescript
   * const MY_KEY = UserKeyDefinition.record<MyRecordValue>(MY_STATE, "key", {
   *   deserializer: (myJsonValue) => convertToValue(myJsonValue),
   * });
   * ```
   */
  static record(stateDefinition, key, options) {
    return new _UserKeyDefinition(stateDefinition, key, {
      ...options,
      deserializer: record((v) => options.deserializer(v))
    });
  }
  get fullName() {
    return `${this.stateDefinition.name}_${this.key}`;
  }
  buildKey(userId) {
    if (!isGuid(userId)) {
      throw new Error(
        `You cannot build a user key without a valid UserId, building for key ${this.fullName}`
      );
    }
    return `user_${userId}_${this.stateDefinition.name}_${this.key}`;
  }
  get errorKeyName() {
    return `${this.stateDefinition.name} > ${this.key}`;
  }
};
var UserKeyDefinition = _UserKeyDefinition;

// libs/state/src/core/state-definition.ts
var StateDefinition = class {
  /**
   * Creates a new instance of {@link StateDefinition}, the creation of which is owned by the platform team.
   * @param name The name of the state, this needs to be unique from all other {@link StateDefinition}'s.
   * @param defaultStorageLocation The location of where this state should be stored.
   */
  constructor(name, defaultStorageLocation, storageLocationOverrides) {
    this.name = name;
    this.defaultStorageLocation = defaultStorageLocation;
    this.storageLocationOverrides = storageLocationOverrides ?? {};
  }
};

// libs/state/src/core/state-definitions.ts
var ORGANIZATIONS_DISK = new StateDefinition("organizations", "disk");
var POLICIES_DISK = new StateDefinition("policies", "disk");
var PROVIDERS_DISK = new StateDefinition("providers", "disk");
var ORGANIZATION_MANAGEMENT_PREFERENCES_DISK = new StateDefinition(
  "organizationManagementPreferences",
  "disk",
  {
    web: "disk-local"
  }
);
var DELETE_MANAGED_USER_WARNING = new StateDefinition(
  "showDeleteManagedUserWarning",
  "disk",
  {
    web: "disk-local"
  }
);
var AUTO_CONFIRM = new StateDefinition("autoConfirm", "disk", { web: "disk-local" });
var BILLING_DISK = new StateDefinition("billing", "disk");
var BILLING_MEMORY = new StateDefinition("billing", "memory");
var ACCOUNT_DISK = new StateDefinition("account", "disk");
var ACCOUNT_MEMORY = new StateDefinition("account", "memory");
var AUTH_REQUEST_DISK_LOCAL = new StateDefinition("authRequestLocal", "disk", {
  web: "disk-local"
});
var AVATAR_DISK = new StateDefinition("avatar", "disk", { web: "disk-local" });
var DEVICE_TRUST_DISK_LOCAL = new StateDefinition("deviceTrust", "disk", {
  web: "disk-local",
  browser: "disk-backup-local-storage"
});
var LOGIN_EMAIL_DISK = new StateDefinition("loginEmail", "disk", {
  web: "disk-local"
});
var LOGIN_EMAIL_MEMORY = new StateDefinition("loginEmail", "memory");
var LOGIN_STRATEGY_MEMORY = new StateDefinition("loginStrategy", "memory");
var MASTER_PASSWORD_DISK = new StateDefinition("masterPassword", "disk");
var MASTER_PASSWORD_MEMORY = new StateDefinition("masterPassword", "memory");
var MASTER_PASSWORD_UNLOCK_DISK = new StateDefinition("masterPasswordUnlock", "disk");
var ROUTER_DISK = new StateDefinition("router", "disk");
var SSO_DISK = new StateDefinition("ssoLogin", "disk");
var SSO_DISK_LOCAL = new StateDefinition("ssoLoginLocal", "disk", { web: "disk-local" });
var TOKEN_DISK = new StateDefinition("token", "disk");
var TOKEN_DISK_LOCAL = new StateDefinition("tokenDiskLocal", "disk", {
  web: "disk-local"
});
var TOKEN_MEMORY = new StateDefinition("token", "memory");
var SEND_ACCESS_DISK = new StateDefinition("sendAccess", "disk");
var TWO_FACTOR_MEMORY = new StateDefinition("twoFactor", "memory");
var USER_DECRYPTION_OPTIONS_DISK = new StateDefinition("userDecryptionOptions", "disk");
var ORGANIZATION_INVITE_DISK = new StateDefinition("organizationInvite", "disk");
var VAULT_TIMEOUT_SETTINGS_DISK_LOCAL = new StateDefinition(
  "vaultTimeoutSettings",
  "disk",
  {
    web: "disk-local"
  }
);
var BADGE_SETTINGS_DISK = new StateDefinition("badgeSettings", "disk");
var USER_NOTIFICATION_SETTINGS_DISK = new StateDefinition(
  "userNotificationSettings",
  "disk"
);
var DOMAIN_SETTINGS_DISK = new StateDefinition("domainSettings", "disk");
var AUTOFILL_SETTINGS_DISK = new StateDefinition("autofillSettings", "disk");
var AUTOFILL_SETTINGS_DISK_LOCAL = new StateDefinition("autofillSettingsLocal", "disk", {
  web: "disk-local"
});
var AUTOTYPE_SETTINGS_DISK = new StateDefinition("autotypeSettings", "disk");
var NEW_WEB_LAYOUT_BANNER_DISK = new StateDefinition("newWebLayoutBanner", "disk", {
  web: "disk-local"
});
var BIT_SIDE_NAV_DISK = new StateDefinition("bitSideNav", "disk");
var PHISHING_DETECTION_DISK = new StateDefinition("phishingDetection", "disk");
var APPLICATION_ID_DISK = new StateDefinition("applicationId", "disk", {
  web: "disk-local"
});
var CLEAR_EVENT_DISK = new StateDefinition("clearEvent", "disk");
var CONFIG_DISK = new StateDefinition("config", "disk", {
  web: "disk-local"
});
var DESKTOP_SETTINGS_DISK = new StateDefinition("desktopSettings", "disk");
var ENVIRONMENT_DISK = new StateDefinition("environment", "disk");
var ENVIRONMENT_MEMORY = new StateDefinition("environment", "memory");
var IPC_MEMORY = new StateDefinition("interProcessCommunication", "memory");
var POPUP_VIEW_MEMORY = new StateDefinition("popupView", "memory", {
  browser: "memory-large-object"
});
var SYNC_DISK = new StateDefinition("sync", "disk", { web: "memory" });
var THEMING_DISK = new StateDefinition("theming", "disk", { web: "disk-local" });
var TRANSLATION_DISK = new StateDefinition("translation", "disk", { web: "disk-local" });
var ANIMATION_DISK = new StateDefinition("animation", "disk");
var TASK_SCHEDULER_DISK = new StateDefinition("taskScheduler", "disk");
var EXTENSION_INITIAL_INSTALL_DISK = new StateDefinition(
  "extensionInitialInstall",
  "disk"
);
var WEB_PUSH_SUBSCRIPTION = new StateDefinition("webPushSubscription", "disk", {
  web: "disk-local"
});
var POPUP_STYLE_DISK = new StateDefinition("popupStyle", "disk");
var SM_ONBOARDING_DISK = new StateDefinition("smOnboarding", "disk", {
  web: "disk-local"
});
var EXTENSION_DISK = new StateDefinition("extension", "disk");
var GENERATOR_DISK = new StateDefinition("generator", "disk");
var GENERATOR_MEMORY = new StateDefinition("generator", "memory");
var BROWSER_SEND_MEMORY = new StateDefinition("sendBrowser", "memory");
var EVENT_COLLECTION_DISK = new StateDefinition("eventCollection", "disk");
var SEND_DISK = new StateDefinition("encryptedSend", "disk", {
  web: "memory"
});
var SEND_MEMORY = new StateDefinition("decryptedSend", "memory", {
  browser: "memory-large-object"
});
var SEND_ACCESS_AUTH_MEMORY = new StateDefinition("sendAccessAuth", "memory");
var COLLECTION_DISK = new StateDefinition("collection", "disk", {
  web: "memory"
});
var COLLECTION_MEMORY = new StateDefinition("decryptedCollections", "memory", {
  browser: "memory-large-object"
});
var FOLDER_DISK = new StateDefinition("folder", "disk", { web: "memory" });
var FOLDER_MEMORY = new StateDefinition("decryptedFolders", "memory", {
  browser: "memory-large-object"
});
var VAULT_FILTER_DISK = new StateDefinition("vaultFilter", "disk", {
  web: "disk-local"
});
var VAULT_ONBOARDING = new StateDefinition("vaultOnboarding", "disk", {
  web: "disk-local"
});
var VAULT_SETTINGS_DISK = new StateDefinition("vaultSettings", "disk", {
  web: "disk-local"
});
var VAULT_BROWSER_MEMORY = new StateDefinition("vaultBrowser", "memory", {
  browser: "memory-large-object"
});
var VAULT_SEARCH_MEMORY = new StateDefinition("vaultSearch", "memory", {
  browser: "memory-large-object"
});
var CIPHERS_DISK = new StateDefinition("ciphers", "disk", { web: "memory" });
var CIPHERS_DISK_LOCAL = new StateDefinition("ciphersLocal", "disk", {
  web: "disk-local"
});
var CIPHERS_MEMORY = new StateDefinition("ciphersMemory", "memory", {
  browser: "memory-large-object"
});
var BANNERS_DISMISSED_DISK = new StateDefinition("bannersDismissed", "disk");
var VAULT_APPEARANCE = new StateDefinition("vaultAppearance", "disk");
var SECURITY_TASKS_DISK = new StateDefinition("securityTasks", "disk");
var AT_RISK_PASSWORDS_PAGE_DISK = new StateDefinition("atRiskPasswordsPage", "disk");
var NOTIFICATION_DISK = new StateDefinition("notifications", "disk");
var NUDGES_DISK = new StateDefinition("nudges", "disk", { web: "disk-local" });
var SETUP_EXTENSION_DISMISSED_DISK = new StateDefinition(
  "setupExtensionDismissed",
  "disk",
  {
    web: "disk-local"
  }
);
var VAULT_BROWSER_INTRO_CAROUSEL = new StateDefinition(
  "vaultBrowserIntroCarousel",
  "disk"
);
var VAULT_AT_RISK_PASSWORDS_MEMORY = new StateDefinition("vaultAtRiskPasswords", "memory");
var BIOMETRIC_SETTINGS_DISK = new StateDefinition("biometricSettings", "disk");
var ENCRYPTED_MIGRATION_DISK = new StateDefinition("encryptedMigration", "disk");
var PIN_DISK = new StateDefinition("pinUnlock", "disk");
var PIN_MEMORY = new StateDefinition("pinUnlock", "memory");
var CRYPTO_DISK = new StateDefinition("crypto", "disk");
var CRYPTO_MEMORY = new StateDefinition("crypto", "memory");
var KDF_CONFIG_DISK = new StateDefinition("kdfConfig", "disk");
var KEY_CONNECTOR_DISK = new StateDefinition("keyConnector", "disk");

// libs/state/src/state-migrations/migrator.ts
var IRREVERSIBLE = new Error("Irreversible migration");

// libs/state-internal/src/default-active-user-state.provider.ts
var import_rxjs5 = require("rxjs");

// libs/state-internal/src/default-active-user-state.ts
var import_rxjs4 = require("rxjs");

// libs/state-internal/src/default-derived-state.ts
var import_rxjs6 = require("rxjs");

// libs/state-internal/src/state-base.ts
var import_rxjs7 = require("rxjs");

// libs/state-internal/src/default-single-user-state.ts
var import_rxjs8 = require("rxjs");

// libs/state-internal/src/default-state.provider.ts
var import_rxjs9 = require("rxjs");

// libs/state-internal/src/inline-derived-state.ts
var import_rxjs10 = require("rxjs");

// libs/state-internal/src/legacy/default-state.service.ts
var import_rxjs11 = require("rxjs");

// libs/state-internal/src/default-state-event-registrar.service.ts
var STATE_LOCK_EVENT = KeyDefinition.array(CLEAR_EVENT_DISK, "lock", {
  deserializer: (e) => e
});
var STATE_LOGOUT_EVENT = KeyDefinition.array(CLEAR_EVENT_DISK, "logout", {
  deserializer: (e) => e
});

// libs/state-internal/src/default-state-event-runner.service.ts
var import_rxjs12 = require("rxjs");

// libs/key-management/src/biometrics/biometric.state.ts
var BIOMETRIC_UNLOCK_ENABLED = new UserKeyDefinition(
  BIOMETRIC_SETTINGS_DISK,
  "biometricUnlockEnabled",
  {
    deserializer: (obj) => obj,
    clearOn: []
  }
);
var ENCRYPTED_CLIENT_KEY_HALF = new UserKeyDefinition(
  BIOMETRIC_SETTINGS_DISK,
  "clientKeyHalf",
  {
    deserializer: (obj) => obj,
    clearOn: ["logout"]
  }
);
var PROMPT_CANCELLED = KeyDefinition.record(
  BIOMETRIC_SETTINGS_DISK,
  "promptCancelled",
  {
    deserializer: (obj) => obj
  }
);
var PROMPT_AUTOMATICALLY = new UserKeyDefinition(
  BIOMETRIC_SETTINGS_DISK,
  "promptAutomatically",
  {
    deserializer: (obj) => obj,
    clearOn: []
  }
);
var FINGERPRINT_VALIDATED = new KeyDefinition(
  BIOMETRIC_SETTINGS_DISK,
  "fingerprintValidated",
  {
    deserializer: (obj) => obj
  }
);
var LAST_PROCESS_RELOAD = new KeyDefinition(
  BIOMETRIC_SETTINGS_DISK,
  "lastProcessReload",
  {
    deserializer: (obj) => new Date(obj)
  }
);

// libs/key-management/src/key.service.ts
var bigInt = __toESM(require("big-integer"));
var import_rxjs21 = require("rxjs");

// libs/common/src/key-management/vault-timeout/services/vault-timeout-settings.service.ts
var import_rxjs16 = require("rxjs");

// libs/common/src/admin-console/services/policy/default-policy.service.ts
var import_rxjs15 = require("rxjs");

// libs/common/src/auth/services/account.service.ts
var import_rxjs14 = require("rxjs");
var ACCOUNT_ACCOUNTS = KeyDefinition.record(
  ACCOUNT_DISK,
  "accounts",
  {
    deserializer: (accountInfo) => ({
      ...accountInfo,
      creationDate: accountInfo.creationDate ? new Date(accountInfo.creationDate) : void 0
    })
  }
);
var ACCOUNT_ACTIVE_ACCOUNT_ID = new KeyDefinition(ACCOUNT_DISK, "activeAccountId", {
  deserializer: (id) => id
});
var ACCOUNT_ACTIVITY = KeyDefinition.record(ACCOUNT_DISK, "activity", {
  deserializer: (activity) => new Date(activity)
});
var ACCOUNT_VERIFY_NEW_DEVICE_LOGIN = new UserKeyDefinition(
  ACCOUNT_DISK,
  "verifyNewDeviceLogin",
  {
    deserializer: (verifyDevices) => verifyDevices,
    clearOn: ["logout"]
  }
);
var getUserId = (0, import_rxjs14.map)((account) => {
  if (account == null) {
    throw new Error("Null or undefined account");
  }
  return account.id;
});
var getOptionalUserId = (0, import_rxjs14.map)(
  (account) => account?.id ?? null
);

// libs/common/src/admin-console/services/policy/policy-state.ts
var POLICIES = UserKeyDefinition.record(POLICIES_DISK, "policies", {
  deserializer: (policyData) => policyData,
  clearOn: ["logout"]
});

// libs/common/src/admin-console/services/policy/default-policy.service.ts
var getFirstPolicy = (0, import_rxjs15.map)((policies) => {
  return policies.at(0) ?? void 0;
});

// libs/common/src/key-management/vault-timeout/services/vault-timeout-settings.state.ts
var VAULT_TIMEOUT_ACTION = new UserKeyDefinition(
  VAULT_TIMEOUT_SETTINGS_DISK_LOCAL,
  "vaultTimeoutAction",
  {
    deserializer: (vaultTimeoutAction) => vaultTimeoutAction,
    clearOn: []
    // persisted on logout
  }
);
var VAULT_TIMEOUT = new UserKeyDefinition(
  VAULT_TIMEOUT_SETTINGS_DISK_LOCAL,
  "vaultTimeout",
  {
    deserializer: (vaultTimeout) => vaultTimeout,
    clearOn: []
    // persisted on logout
  }
);

// libs/common/src/key-management/vault-timeout/services/vault-timeout.service.ts
var import_rxjs19 = require("rxjs");

// libs/common/src/platform/scheduling/task-scheduler.service.ts
var import_rxjs17 = require("rxjs");

// libs/common/src/platform/scheduling/default-task-scheduler.service.ts
var import_rxjs18 = require("rxjs");

// libs/common/src/platform/misc/convert-values.ts
var import_rxjs20 = require("rxjs");

// libs/common/src/platform/services/key-state/org-keys.state.ts
var USER_ENCRYPTED_ORGANIZATION_KEYS = UserKeyDefinition.record(CRYPTO_DISK, "organizationKeys", {
  deserializer: (obj) => obj,
  clearOn: ["logout"]
});

// libs/common/src/platform/services/key-state/provider-keys.state.ts
var USER_ENCRYPTED_PROVIDER_KEYS = UserKeyDefinition.record(
  CRYPTO_DISK,
  "providerKeys",
  {
    deserializer: (obj) => obj,
    clearOn: ["logout"]
  }
);

// libs/common/src/platform/services/key-state/user-key.state.ts
var USER_EVER_HAD_USER_KEY = new UserKeyDefinition(
  CRYPTO_DISK,
  "everHadUserKey",
  {
    deserializer: (obj) => obj,
    clearOn: ["logout"]
  }
);
var USER_KEY = new UserKeyDefinition(CRYPTO_MEMORY, "userKey", {
  deserializer: (obj) => SymmetricCryptoKey.fromJSON(obj),
  clearOn: ["logout", "lock"]
});

// libs/common/src/platform/misc/range-with-default.ts
var RangeWithDefault = class {
  constructor(min, max, defaultValue) {
    this.min = min;
    this.max = max;
    this.defaultValue = defaultValue;
    if (min > max) {
      throw new Error(`${min} is greater than ${max}.`);
    }
    if (this.inRange(defaultValue) === false) {
      throw new Error("Default value is not in range.");
    }
  }
  inRange(value) {
    return value >= this.min && value <= this.max;
  }
};

// libs/key-management/src/models/kdf-config.ts
var PBKDF2KdfConfig = class _PBKDF2KdfConfig {
  constructor(iterations) {
    this.kdfType = 0 /* PBKDF2_SHA256 */;
    this.iterations = iterations ?? _PBKDF2KdfConfig.ITERATIONS.defaultValue;
  }
  static {
    this.ITERATIONS = new RangeWithDefault(6e5, 2e6, 6e5);
  }
  static {
    this.PRELOGIN_ITERATIONS_MIN = 5e3;
  }
  /**
   * Validates the PBKDF2 KDF configuration for updating the KDF config.
   * A Valid PBKDF2 KDF configuration has KDF iterations between the 600_000 and 2_000_000.
   */
  validateKdfConfigForSetting() {
    if (!_PBKDF2KdfConfig.ITERATIONS.inRange(this.iterations)) {
      throw new Error(
        `PBKDF2 iterations must be between ${_PBKDF2KdfConfig.ITERATIONS.min} and ${_PBKDF2KdfConfig.ITERATIONS.max}`
      );
    }
  }
  /**
   * Validates the PBKDF2 KDF configuration for pre-login.
   * A Valid PBKDF2 KDF configuration has KDF iterations between the 5000 and 2_000_000.
   */
  validateKdfConfigForPrelogin() {
    if (_PBKDF2KdfConfig.PRELOGIN_ITERATIONS_MIN > this.iterations) {
      throw new Error(
        `PBKDF2 iterations must be at least ${_PBKDF2KdfConfig.PRELOGIN_ITERATIONS_MIN}, but was ${this.iterations}; possible pre-login downgrade attack detected.`
      );
    }
  }
  static fromJSON(json) {
    return new _PBKDF2KdfConfig(json.iterations);
  }
  toSdkConfig() {
    return {
      pBKDF2: {
        iterations: this.iterations
      }
    };
  }
};
var Argon2KdfConfig = class _Argon2KdfConfig {
  constructor(iterations, memory, parallelism) {
    this.kdfType = 1 /* Argon2id */;
    this.iterations = iterations ?? _Argon2KdfConfig.ITERATIONS.defaultValue;
    this.memory = memory ?? _Argon2KdfConfig.MEMORY.defaultValue;
    this.parallelism = parallelism ?? _Argon2KdfConfig.PARALLELISM.defaultValue;
  }
  static {
    this.MEMORY = new RangeWithDefault(16, 1024, 64);
  }
  static {
    this.PARALLELISM = new RangeWithDefault(1, 16, 4);
  }
  static {
    this.ITERATIONS = new RangeWithDefault(2, 10, 3);
  }
  static {
    this.PRELOGIN_MEMORY_MIN = 16;
  }
  static {
    this.PRELOGIN_PARALLELISM_MIN = 1;
  }
  static {
    this.PRELOGIN_ITERATIONS_MIN = 2;
  }
  /**
   * Validates the Argon2 KDF configuration for updating the KDF config.
   * A Valid Argon2 KDF configuration has iterations between 2 and 10, memory between 16mb and 1024mb, and parallelism between 1 and 16.
   */
  validateKdfConfigForSetting() {
    if (!_Argon2KdfConfig.ITERATIONS.inRange(this.iterations)) {
      throw new Error(
        `Argon2 iterations must be between ${_Argon2KdfConfig.ITERATIONS.min} and ${_Argon2KdfConfig.ITERATIONS.max}`
      );
    }
    if (!_Argon2KdfConfig.MEMORY.inRange(this.memory)) {
      throw new Error(
        `Argon2 memory must be between ${_Argon2KdfConfig.MEMORY.min} MiB and ${_Argon2KdfConfig.MEMORY.max} MiB`
      );
    }
    if (!_Argon2KdfConfig.PARALLELISM.inRange(this.parallelism)) {
      throw new Error(
        `Argon2 parallelism must be between ${_Argon2KdfConfig.PARALLELISM.min} and ${_Argon2KdfConfig.PARALLELISM.max}.`
      );
    }
  }
  /**
   * Validates the Argon2 KDF configuration for pre-login.
   */
  validateKdfConfigForPrelogin() {
    if (_Argon2KdfConfig.PRELOGIN_ITERATIONS_MIN > this.iterations) {
      throw new Error(
        `Argon2 iterations must be at least ${_Argon2KdfConfig.PRELOGIN_ITERATIONS_MIN}, but was ${this.iterations}; possible pre-login downgrade attack detected.`
      );
    }
    if (_Argon2KdfConfig.PRELOGIN_MEMORY_MIN > this.memory) {
      throw new Error(
        `Argon2 memory must be at least ${_Argon2KdfConfig.PRELOGIN_MEMORY_MIN} MiB, but was ${this.memory} MiB; possible pre-login downgrade attack detected.`
      );
    }
    if (_Argon2KdfConfig.PRELOGIN_PARALLELISM_MIN > this.parallelism) {
      throw new Error(
        `Argon2 parallelism must be at least ${_Argon2KdfConfig.PRELOGIN_PARALLELISM_MIN}, but was ${this.parallelism}; possible pre-login downgrade attack detected.`
      );
    }
  }
  static fromJSON(json) {
    return new _Argon2KdfConfig(json.iterations, json.memory, json.parallelism);
  }
  toSdkConfig() {
    return {
      argon2id: {
        iterations: this.iterations,
        memory: this.memory,
        parallelism: this.parallelism
      }
    };
  }
};
function fromSdkKdfConfig(sdkKdf) {
  if ("pBKDF2" in sdkKdf) {
    return new PBKDF2KdfConfig(sdkKdf.pBKDF2.iterations);
  } else if ("argon2id" in sdkKdf) {
    return new Argon2KdfConfig(
      sdkKdf.argon2id.iterations,
      sdkKdf.argon2id.memory,
      sdkKdf.argon2id.parallelism
    );
  } else {
    throw new Error("Unsupported KDF type");
  }
}
var DEFAULT_KDF_CONFIG = new PBKDF2KdfConfig(PBKDF2KdfConfig.ITERATIONS.defaultValue);

// libs/key-management/src/kdf-config.service.ts
var import_rxjs22 = require("rxjs");
var KDF_CONFIG = new UserKeyDefinition(KDF_CONFIG_DISK, "kdfConfig", {
  deserializer: (kdfConfig) => {
    if (kdfConfig == null) {
      return null;
    }
    return kdfConfig.kdfType === 0 /* PBKDF2_SHA256 */ ? PBKDF2KdfConfig.fromJSON(kdfConfig) : Argon2KdfConfig.fromJSON(kdfConfig);
  },
  clearOn: ["logout"]
});

// libs/key-management/src/user-asymmetric-key-regeneration/services/default-user-asymmetric-key-regeneration.service.ts
var import_rxjs23 = require("rxjs");

// libs/common/src/key-management/models/response/kdf-config.response.ts
var KdfConfigResponse = class extends BaseResponse {
  constructor(response) {
    super(response);
    const kdfType = this.getResponseProperty("KdfType");
    if (kdfType == null || typeof kdfType !== "number") {
      throw new Error("KDF config response does not contain a valid KDF type");
    }
    this.kdfType = kdfType;
    const iterations = this.getResponseProperty("Iterations");
    if (iterations == null || typeof iterations !== "number") {
      throw new Error("KDF config response does not contain a valid number of iterations");
    }
    this.iterations = iterations;
    if (this.kdfType === 1 /* Argon2id */) {
      const memory = this.getResponseProperty("Memory");
      if (memory == null || typeof memory !== "number") {
        throw new Error("KDF config response does not contain a valid memory size for Argon2id");
      }
      const parallelism = this.getResponseProperty("Parallelism");
      if (parallelism == null || typeof parallelism !== "number") {
        throw new Error("KDF config response does not contain a valid parallelism for Argon2id");
      }
      this.memory = memory;
      this.parallelism = parallelism;
    }
  }
  toKdfConfig() {
    switch (this.kdfType) {
      case 1 /* Argon2id */:
        return new Argon2KdfConfig(this.iterations, this.memory, this.parallelism);
      case 0 /* PBKDF2_SHA256 */:
        return new PBKDF2KdfConfig(this.iterations);
    }
  }
};

// libs/common/src/key-management/master-password/types/master-password.types.ts
var MasterPasswordUnlockData = class _MasterPasswordUnlockData {
  constructor(salt, kdf, masterKeyWrappedUserKey) {
    this.salt = salt;
    this.kdf = kdf;
    this.masterKeyWrappedUserKey = masterKeyWrappedUserKey;
  }
  static fromSdk(sdkData) {
    return new _MasterPasswordUnlockData(
      sdkData.salt,
      fromSdkKdfConfig(sdkData.kdf),
      sdkData.masterKeyWrappedUserKey
    );
  }
  toJSON() {
    return {
      salt: this.salt,
      kdf: this.kdf,
      masterKeyWrappedUserKey: this.masterKeyWrappedUserKey
    };
  }
  static fromJSON(obj) {
    if (obj == null) {
      return null;
    }
    return new _MasterPasswordUnlockData(
      obj.salt,
      obj.kdf.kdfType === 0 /* PBKDF2_SHA256 */ ? PBKDF2KdfConfig.fromJSON(obj.kdf) : Argon2KdfConfig.fromJSON(obj.kdf),
      obj.masterKeyWrappedUserKey
    );
  }
};

// libs/common/src/key-management/master-password/models/response/master-password-unlock.response.ts
var MasterPasswordUnlockResponse = class extends BaseResponse {
  constructor(response) {
    super(response);
    const salt = this.getResponseProperty("Salt");
    if (salt == null || typeof salt !== "string") {
      throw new Error("MasterPasswordUnlockResponse does not contain a valid salt");
    }
    this.salt = salt;
    this.kdf = new KdfConfigResponse(this.getResponseProperty("Kdf"));
    const masterKeyWrappedUserKey = this.getResponseProperty("MasterKeyEncryptedUserKey");
    if (masterKeyWrappedUserKey == null || typeof masterKeyWrappedUserKey !== "string") {
      throw new Error(
        "MasterPasswordUnlockResponse does not contain a valid master key encrypted user key"
      );
    }
    this.masterKeyWrappedUserKey = masterKeyWrappedUserKey;
  }
  toMasterPasswordUnlockData() {
    return new MasterPasswordUnlockData(
      this.salt,
      this.kdf.toKdfConfig(),
      this.masterKeyWrappedUserKey
    );
  }
};

// libs/common/src/key-management/models/response/user-decryption.response.ts
var UserDecryptionResponse = class extends BaseResponse {
  constructor(response) {
    super(response);
    const masterPasswordUnlock = this.getResponseProperty("MasterPasswordUnlock");
    if (masterPasswordUnlock != null && typeof masterPasswordUnlock === "object") {
      this.masterPasswordUnlock = new MasterPasswordUnlockResponse(masterPasswordUnlock);
    }
    const webAuthnPrfOptions = this.getResponseProperty("WebAuthnPrfOptions");
    if (webAuthnPrfOptions != null && Array.isArray(webAuthnPrfOptions)) {
      this.webAuthnPrfOptions = webAuthnPrfOptions.map(
        (option) => new WebAuthnPrfDecryptionOptionResponse(option)
      );
    }
  }
};

// libs/common/src/models/response/global-domain.response.ts
var GlobalDomainResponse = class extends BaseResponse {
  constructor(response) {
    super(response);
    this.type = this.getResponseProperty("Type");
    this.domains = this.getResponseProperty("Domains");
    this.excluded = this.getResponseProperty("Excluded");
  }
};

// libs/common/src/models/response/domains.response.ts
var DomainsResponse = class extends BaseResponse {
  constructor(response) {
    super(response);
    this.globalEquivalentDomains = [];
    this.equivalentDomains = this.getResponseProperty("EquivalentDomains");
    const globalEquivalentDomains = this.getResponseProperty("GlobalEquivalentDomains");
    if (globalEquivalentDomains != null) {
      this.globalEquivalentDomains = globalEquivalentDomains.map(
        (d) => new GlobalDomainResponse(d)
      );
    } else {
      this.globalEquivalentDomains = [];
    }
  }
};

// libs/common/src/key-management/security-state/response/security-state.response.ts
var SecurityStateResponse = class {
  constructor(response) {
    this.securityState = null;
    if (typeof response !== "object" || response == null) {
      throw new TypeError("Response must be an object");
    }
    if (!("securityState" in response) || !(typeof response.securityState === "string")) {
      throw new TypeError("Response must contain a valid securityState");
    }
    this.securityState = response.securityState;
  }
};

// libs/common/src/key-management/keys/response/public-key-encryption-key-pair.response.ts
var PublicKeyEncryptionKeyPairResponse = class {
  constructor(response) {
    this.signedPublicKey = null;
    if (typeof response !== "object" || response == null) {
      throw new TypeError("Response must be an object");
    }
    if (!("publicKey" in response) || typeof response.publicKey !== "string") {
      throw new TypeError("Response must contain a valid publicKey");
    }
    this.publicKey = Utils.fromB64ToArray(response.publicKey);
    if (!("wrappedPrivateKey" in response) || typeof response.wrappedPrivateKey !== "string") {
      throw new TypeError("Response must contain a valid wrappedPrivateKey");
    }
    this.wrappedPrivateKey = response.wrappedPrivateKey;
    if ("signedPublicKey" in response && typeof response.signedPublicKey === "string") {
      this.signedPublicKey = response.signedPublicKey;
    } else {
      this.signedPublicKey = null;
    }
  }
};

// libs/common/src/key-management/keys/response/signature-key-pair.response.ts
var SignatureKeyPairResponse = class {
  constructor(response) {
    if (typeof response !== "object" || response == null) {
      throw new TypeError("Response must be an object");
    }
    if (!("wrappedSigningKey" in response) || typeof response.wrappedSigningKey !== "string") {
      throw new TypeError("Response must contain a valid wrappedSigningKey");
    }
    this.wrappedSigningKey = response.wrappedSigningKey;
    if (!("verifyingKey" in response) || typeof response.verifyingKey !== "string") {
      throw new TypeError("Response must contain a valid verifyingKey");
    }
    this.verifyingKey = response.verifyingKey;
  }
};

// libs/common/src/key-management/keys/response/private-keys.response.ts
var PrivateKeysResponseModel = class {
  constructor(response) {
    this.signatureKeyPair = null;
    this.securityState = null;
    if (typeof response !== "object" || response == null) {
      throw new TypeError("Response must be an object");
    }
    if (!("publicKeyEncryptionKeyPair" in response) || typeof response.publicKeyEncryptionKeyPair !== "object") {
      throw new TypeError("Response must contain a valid publicKeyEncryptionKeyPair");
    }
    this.publicKeyEncryptionKeyPair = new PublicKeyEncryptionKeyPairResponse(
      response.publicKeyEncryptionKeyPair
    );
    if ("signatureKeyPair" in response && typeof response.signatureKeyPair === "object" && response.signatureKeyPair != null) {
      this.signatureKeyPair = new SignatureKeyPairResponse(response.signatureKeyPair);
    }
    if ("securityState" in response && typeof response.securityState === "object" && response.securityState != null) {
      this.securityState = new SecurityStateResponse(response.securityState);
    }
    if (this.signatureKeyPair !== null && this.securityState === null || this.signatureKeyPair === null && this.securityState !== null) {
      throw new TypeError(
        "Both signatureKeyPair and securityState must be present or absent together"
      );
    }
  }
  toWrappedAccountCryptographicState() {
    if (this.signatureKeyPair === null && this.securityState === null) {
      return {
        V1: {
          private_key: this.publicKeyEncryptionKeyPair.wrappedPrivateKey
        }
      };
    } else if (this.signatureKeyPair !== null && this.securityState !== null) {
      return {
        V2: {
          private_key: this.publicKeyEncryptionKeyPair.wrappedPrivateKey,
          signing_key: this.signatureKeyPair.wrappedSigningKey,
          signed_public_key: this.publicKeyEncryptionKeyPair.signedPublicKey,
          security_state: this.securityState.securityState
        }
      };
    } else {
      throw new Error("Both signatureKeyPair and securityState must be present or absent together");
    }
  }
  isV2Encryption() {
    return this.signatureKeyPair !== null && this.securityState !== null;
  }
};

// libs/common/src/admin-console/models/api/permissions.api.ts
var PermissionsApi = class extends BaseResponse {
  constructor(data = null) {
    super(data);
    if (data == null) {
      return this;
    }
    this.accessEventLogs = this.getResponseProperty("AccessEventLogs");
    this.accessImportExport = this.getResponseProperty("AccessImportExport");
    this.accessReports = this.getResponseProperty("AccessReports");
    this.createNewCollections = this.getResponseProperty("CreateNewCollections");
    this.editAnyCollection = this.getResponseProperty("EditAnyCollection");
    this.deleteAnyCollection = this.getResponseProperty("DeleteAnyCollection");
    this.manageCiphers = this.getResponseProperty("ManageCiphers");
    this.manageGroups = this.getResponseProperty("ManageGroups");
    this.manageSso = this.getResponseProperty("ManageSso");
    this.managePolicies = this.getResponseProperty("ManagePolicies");
    this.manageUsers = this.getResponseProperty("ManageUsers");
    this.manageResetPassword = this.getResponseProperty("ManageResetPassword");
    this.manageScim = this.getResponseProperty("ManageScim");
  }
};

// libs/common/src/admin-console/models/response/profile-organization.response.ts
var ProfileOrganizationResponse = class extends BaseResponse {
  constructor(response) {
    super(response);
    this.id = this.getResponseProperty("Id");
    this.name = this.getResponseProperty("Name");
    this.usePolicies = this.getResponseProperty("UsePolicies");
    this.useGroups = this.getResponseProperty("UseGroups");
    this.useDirectory = this.getResponseProperty("UseDirectory");
    this.useEvents = this.getResponseProperty("UseEvents");
    this.useTotp = this.getResponseProperty("UseTotp");
    this.use2fa = this.getResponseProperty("Use2fa");
    this.useApi = this.getResponseProperty("UseApi");
    this.useSso = this.getResponseProperty("UseSso");
    this.useOrganizationDomains = this.getResponseProperty("UseOrganizationDomains");
    this.useKeyConnector = this.getResponseProperty("UseKeyConnector") ?? false;
    this.useScim = this.getResponseProperty("UseScim") ?? false;
    this.useCustomPermissions = this.getResponseProperty("UseCustomPermissions") ?? false;
    this.useResetPassword = this.getResponseProperty("UseResetPassword");
    this.useSecretsManager = this.getResponseProperty("UseSecretsManager");
    this.usePasswordManager = this.getResponseProperty("UsePasswordManager");
    this.useActivateAutofillPolicy = this.getResponseProperty("UseActivateAutofillPolicy");
    this.useAutomaticUserConfirmation = this.getResponseProperty("UseAutomaticUserConfirmation");
    this.selfHost = this.getResponseProperty("SelfHost");
    this.usersGetPremium = this.getResponseProperty("UsersGetPremium");
    this.seats = this.getResponseProperty("Seats");
    this.maxCollections = this.getResponseProperty("MaxCollections");
    this.maxStorageGb = this.getResponseProperty("MaxStorageGb");
    this.key = this.getResponseProperty("Key");
    this.hasPublicAndPrivateKeys = this.getResponseProperty("HasPublicAndPrivateKeys");
    this.status = this.getResponseProperty("Status");
    this.type = this.getResponseProperty("Type");
    this.enabled = this.getResponseProperty("Enabled");
    this.ssoBound = this.getResponseProperty("SsoBound");
    this.identifier = this.getResponseProperty("Identifier");
    this.permissions = new PermissionsApi(this.getResponseProperty("permissions"));
    this.resetPasswordEnrolled = this.getResponseProperty("ResetPasswordEnrolled");
    this.userId = this.getResponseProperty("UserId");
    this.organizationUserId = this.getResponseProperty("OrganizationUserId");
    this.providerId = this.getResponseProperty("ProviderId");
    this.providerName = this.getResponseProperty("ProviderName");
    this.providerType = this.getResponseProperty("ProviderType");
    this.familySponsorshipFriendlyName = this.getResponseProperty("FamilySponsorshipFriendlyName");
    this.familySponsorshipAvailable = this.getResponseProperty("FamilySponsorshipAvailable");
    this.productTierType = this.getResponseProperty("ProductTierType");
    this.keyConnectorEnabled = this.getResponseProperty("KeyConnectorEnabled") ?? false;
    this.keyConnectorUrl = this.getResponseProperty("KeyConnectorUrl");
    const familySponsorshipLastSyncDateString = this.getResponseProperty(
      "FamilySponsorshipLastSyncDate"
    );
    if (familySponsorshipLastSyncDateString) {
      this.familySponsorshipLastSyncDate = new Date(familySponsorshipLastSyncDateString);
    }
    const familySponsorshipValidUntilString = this.getResponseProperty(
      "FamilySponsorshipValidUntil"
    );
    if (familySponsorshipValidUntilString) {
      this.familySponsorshipValidUntil = new Date(familySponsorshipValidUntilString);
    }
    this.familySponsorshipToDelete = this.getResponseProperty("FamilySponsorshipToDelete");
    this.accessSecretsManager = this.getResponseProperty("AccessSecretsManager");
    this.limitCollectionCreation = this.getResponseProperty("LimitCollectionCreation");
    this.limitCollectionDeletion = this.getResponseProperty("LimitCollectionDeletion");
    this.limitItemDeletion = this.getResponseProperty("LimitItemDeletion");
    this.allowAdminAccessToAllCollectionItems = this.getResponseProperty(
      "AllowAdminAccessToAllCollectionItems"
    );
    this.userIsManagedByOrganization = this.getResponseProperty("UserIsManagedByOrganization");
    this.useAccessIntelligence = this.getResponseProperty("UseRiskInsights");
    this.useAdminSponsoredFamilies = this.getResponseProperty("UseAdminSponsoredFamilies");
    this.useDisableSMAdsForUsers = this.getResponseProperty("UseDisableSMAdsForUsers") ?? false;
    this.isAdminInitiated = this.getResponseProperty("IsAdminInitiated");
    this.ssoEnabled = this.getResponseProperty("SsoEnabled") ?? false;
    this.ssoMemberDecryptionType = this.getResponseProperty("SsoMemberDecryptionType");
    this.usePhishingBlocker = this.getResponseProperty("UsePhishingBlocker") ?? false;
  }
};

// libs/common/src/admin-console/models/response/profile-provider-organization.response.ts
var ProfileProviderOrganizationResponse = class extends ProfileOrganizationResponse {
  constructor(response) {
    super(response);
    this.keyConnectorEnabled = false;
  }
};

// libs/common/src/admin-console/models/response/profile-provider.response.ts
var ProfileProviderResponse = class extends BaseResponse {
  constructor(response) {
    super(response);
    this.id = this.getResponseProperty("Id");
    this.name = this.getResponseProperty("Name");
    this.key = this.getResponseProperty("Key");
    this.status = this.getResponseProperty("Status");
    this.type = this.getResponseProperty("Type");
    this.enabled = this.getResponseProperty("Enabled");
    this.permissions = new PermissionsApi(this.getResponseProperty("permissions"));
    this.userId = this.getResponseProperty("UserId");
    this.useEvents = this.getResponseProperty("UseEvents");
    this.providerStatus = this.getResponseProperty("ProviderStatus");
    this.providerType = this.getResponseProperty("ProviderType");
  }
};

// libs/common/src/models/response/profile.response.ts
var ProfileResponse = class extends BaseResponse {
  constructor(response) {
    super(response);
    // Cleanup: This should be non-optional after the server has been released for a while https://bitwarden.atlassian.net/browse/PM-21768
    this.accountKeys = null;
    this.organizations = [];
    this.providers = [];
    this.providerOrganizations = [];
    this.id = this.getResponseProperty("Id");
    this.name = this.getResponseProperty("Name");
    this.email = this.getResponseProperty("Email");
    this.emailVerified = this.getResponseProperty("EmailVerified");
    this.premiumPersonally = this.getResponseProperty("Premium");
    this.premiumFromOrganization = this.getResponseProperty("PremiumFromOrganization");
    this.culture = this.getResponseProperty("Culture");
    this.twoFactorEnabled = this.getResponseProperty("TwoFactorEnabled");
    const key = this.getResponseProperty("Key");
    if (key) {
      this.key = new EncString(key);
    }
    if (this.getResponseProperty("AccountKeys") != null) {
      this.accountKeys = new PrivateKeysResponseModel(this.getResponseProperty("AccountKeys"));
    }
    this.avatarColor = this.getResponseProperty("AvatarColor");
    this.creationDate = this.getResponseProperty("CreationDate");
    this.privateKey = this.getResponseProperty("PrivateKey");
    this.securityStamp = this.getResponseProperty("SecurityStamp");
    this.forcePasswordReset = this.getResponseProperty("ForcePasswordReset") ?? false;
    this.usesKeyConnector = this.getResponseProperty("UsesKeyConnector") ?? false;
    this.verifyDevices = this.getResponseProperty("VerifyDevices") ?? true;
    const organizations = this.getResponseProperty("Organizations");
    if (organizations != null) {
      this.organizations = organizations.map((o) => new ProfileOrganizationResponse(o));
    }
    const providers = this.getResponseProperty("Providers");
    if (providers != null) {
      this.providers = providers.map((o) => new ProfileProviderResponse(o));
    }
    const providerOrganizations = this.getResponseProperty("ProviderOrganizations");
    if (providerOrganizations != null) {
      this.providerOrganizations = providerOrganizations.map(
        (o) => new ProfileProviderOrganizationResponse(o)
      );
    }
  }
};

// libs/common/src/tools/send/models/api/send-file.api.ts
var SendFileApi = class extends BaseResponse {
  constructor(data = null) {
    super(data);
    if (data == null) {
      return;
    }
    this.id = this.getResponseProperty("Id");
    this.fileName = this.getResponseProperty("FileName");
    this.size = this.getResponseProperty("Size");
    this.sizeName = this.getResponseProperty("SizeName");
  }
};

// libs/common/src/tools/send/models/api/send-text.api.ts
var SendTextApi = class extends BaseResponse {
  constructor(data = null) {
    super(data);
    if (data == null) {
      return;
    }
    this.text = this.getResponseProperty("Text");
    this.hidden = this.getResponseProperty("Hidden") || false;
  }
};

// libs/common/src/tools/send/models/response/send.response.ts
var SendResponse = class extends BaseResponse {
  constructor(response) {
    super(response);
    this.id = this.getResponseProperty("Id");
    this.accessId = this.getResponseProperty("AccessId");
    this.type = this.getResponseProperty("Type");
    this.authType = this.getResponseProperty("AuthType");
    this.name = this.getResponseProperty("Name");
    this.notes = this.getResponseProperty("Notes");
    this.key = this.getResponseProperty("Key");
    this.maxAccessCount = this.getResponseProperty("MaxAccessCount");
    this.accessCount = this.getResponseProperty("AccessCount");
    this.revisionDate = this.getResponseProperty("RevisionDate");
    this.expirationDate = this.getResponseProperty("ExpirationDate");
    this.deletionDate = this.getResponseProperty("DeletionDate");
    this.password = this.getResponseProperty("Password");
    this.emails = this.getResponseProperty("Emails");
    this.disable = this.getResponseProperty("Disabled") || false;
    this.hideEmail = this.getResponseProperty("HideEmail") || false;
    this.authType = this.getResponseProperty("AuthType");
    const text = this.getResponseProperty("Text");
    if (text != null) {
      this.text = new SendTextApi(text);
    }
    const file = this.getResponseProperty("File");
    if (file != null) {
      this.file = new SendFileApi(file);
    }
  }
};

// libs/common/src/vault/models/api/card.api.ts
var CardApi = class extends BaseResponse {
  constructor(data = null) {
    super(data);
    if (data == null) {
      return;
    }
    this.cardholderName = this.getResponseProperty("CardholderName");
    this.brand = this.getResponseProperty("Brand");
    this.number = this.getResponseProperty("Number");
    this.expMonth = this.getResponseProperty("ExpMonth");
    this.expYear = this.getResponseProperty("ExpYear");
    this.code = this.getResponseProperty("Code");
  }
};

// libs/common/src/vault/models/api/field.api.ts
var FieldApi = class extends BaseResponse {
  constructor(data = null) {
    super(data);
    if (data == null) {
      return;
    }
    this.type = this.getResponseProperty("Type");
    this.name = this.getResponseProperty("Name");
    this.value = this.getResponseProperty("Value");
    this.linkedId = this.getResponseProperty("linkedId");
  }
};

// libs/common/src/vault/models/api/identity.api.ts
var IdentityApi = class extends BaseResponse {
  constructor(data = null) {
    super(data);
    if (data == null) {
      return;
    }
    this.title = this.getResponseProperty("Title");
    this.firstName = this.getResponseProperty("FirstName");
    this.middleName = this.getResponseProperty("MiddleName");
    this.lastName = this.getResponseProperty("LastName");
    this.address1 = this.getResponseProperty("Address1");
    this.address2 = this.getResponseProperty("Address2");
    this.address3 = this.getResponseProperty("Address3");
    this.city = this.getResponseProperty("City");
    this.state = this.getResponseProperty("State");
    this.postalCode = this.getResponseProperty("PostalCode");
    this.country = this.getResponseProperty("Country");
    this.company = this.getResponseProperty("Company");
    this.email = this.getResponseProperty("Email");
    this.phone = this.getResponseProperty("Phone");
    this.ssn = this.getResponseProperty("SSN");
    this.username = this.getResponseProperty("Username");
    this.passportNumber = this.getResponseProperty("PassportNumber");
    this.licenseNumber = this.getResponseProperty("LicenseNumber");
  }
};

// libs/common/src/vault/models/api/fido2-credential.api.ts
var Fido2CredentialApi = class extends BaseResponse {
  constructor(data = null) {
    super(data);
    if (data == null) {
      return;
    }
    this.credentialId = this.getResponseProperty("CredentialId");
    this.keyType = this.getResponseProperty("KeyType");
    this.keyAlgorithm = this.getResponseProperty("KeyAlgorithm");
    this.keyCurve = this.getResponseProperty("KeyCurve");
    this.keyValue = this.getResponseProperty("keyValue");
    this.rpId = this.getResponseProperty("RpId");
    this.userHandle = this.getResponseProperty("UserHandle");
    this.userName = this.getResponseProperty("UserName");
    this.counter = this.getResponseProperty("Counter");
    this.rpName = this.getResponseProperty("RpName");
    this.userDisplayName = this.getResponseProperty("UserDisplayName");
    this.discoverable = this.getResponseProperty("Discoverable");
    this.creationDate = this.getResponseProperty("CreationDate");
  }
};

// libs/common/src/vault/models/api/login-uri.api.ts
var LoginUriApi = class extends BaseResponse {
  constructor(data = null) {
    super(data);
    this.match = null;
    if (data == null) {
      return;
    }
    this.uri = this.getResponseProperty("Uri");
    this.uriChecksum = this.getResponseProperty("UriChecksum");
    const match = this.getResponseProperty("Match");
    this.match = match != null ? match : null;
  }
};

// libs/common/src/vault/models/api/login.api.ts
var LoginApi = class extends BaseResponse {
  constructor(data = null) {
    super(data);
    if (data == null) {
      return;
    }
    this.username = this.getResponseProperty("Username");
    this.password = this.getResponseProperty("Password");
    this.passwordRevisionDate = this.getResponseProperty("PasswordRevisionDate");
    this.totp = this.getResponseProperty("Totp");
    this.autofillOnPageLoad = this.getResponseProperty("AutofillOnPageLoad");
    const uris = this.getResponseProperty("Uris");
    if (uris != null) {
      this.uris = uris.map((u) => new LoginUriApi(u));
    }
    const fido2Credentials = this.getResponseProperty("Fido2Credentials");
    if (fido2Credentials != null) {
      this.fido2Credentials = fido2Credentials.map(
        (key) => new Fido2CredentialApi(key)
      );
    }
  }
};

// libs/common/src/vault/models/api/secure-note.api.ts
var SecureNoteApi = class extends BaseResponse {
  constructor(data = null) {
    super(data);
    if (data == null) {
      return;
    }
    this.type = this.getResponseProperty("Type");
  }
};

// libs/common/src/vault/models/api/ssh-key.api.ts
var SshKeyApi = class extends BaseResponse {
  constructor(data = null) {
    super(data);
    if (data == null) {
      return;
    }
    this.privateKey = this.getResponseProperty("PrivateKey");
    this.publicKey = this.getResponseProperty("PublicKey");
    this.keyFingerprint = this.getResponseProperty("KeyFingerprint");
  }
};

// libs/common/src/vault/models/response/attachment.response.ts
var AttachmentResponse = class extends BaseResponse {
  constructor(response) {
    super(response);
    this.id = this.getResponseProperty("Id");
    this.url = this.getResponseProperty("Url");
    this.fileName = this.getResponseProperty("FileName");
    this.key = this.getResponseProperty("Key");
    this.size = this.getResponseProperty("Size");
    this.sizeName = this.getResponseProperty("SizeName");
  }
};

// libs/common/src/vault/models/response/password-history.response.ts
var PasswordHistoryResponse = class extends BaseResponse {
  constructor(response) {
    super(response);
    this.password = this.getResponseProperty("Password");
    this.lastUsedDate = this.getResponseProperty("LastUsedDate");
  }
};

// libs/common/src/vault/models/response/cipher.response.ts
var CipherResponse = class extends BaseResponse {
  constructor(response) {
    super(response);
    this.id = this.getResponseProperty("Id");
    this.organizationId = this.getResponseProperty("OrganizationId");
    this.folderId = this.getResponseProperty("FolderId") || null;
    this.type = this.getResponseProperty("Type");
    this.name = this.getResponseProperty("Name");
    this.notes = this.getResponseProperty("Notes");
    this.favorite = this.getResponseProperty("Favorite") || false;
    this.edit = !!this.getResponseProperty("Edit");
    if (this.getResponseProperty("ViewPassword") == null) {
      this.viewPassword = true;
    } else {
      this.viewPassword = this.getResponseProperty("ViewPassword");
    }
    this.permissions = new CipherPermissionsApi(this.getResponseProperty("Permissions"));
    this.organizationUseTotp = this.getResponseProperty("OrganizationUseTotp");
    this.revisionDate = this.getResponseProperty("RevisionDate");
    this.collectionIds = this.getResponseProperty("CollectionIds");
    this.creationDate = this.getResponseProperty("CreationDate");
    this.deletedDate = this.getResponseProperty("DeletedDate");
    this.archivedDate = this.getResponseProperty("ArchivedDate");
    const login = this.getResponseProperty("Login");
    if (login != null) {
      this.login = new LoginApi(login);
    }
    const card = this.getResponseProperty("Card");
    if (card != null) {
      this.card = new CardApi(card);
    }
    const identity = this.getResponseProperty("Identity");
    if (identity != null) {
      this.identity = new IdentityApi(identity);
    }
    const secureNote = this.getResponseProperty("SecureNote");
    if (secureNote != null) {
      this.secureNote = new SecureNoteApi(secureNote);
    }
    const sshKey = this.getResponseProperty("sshKey");
    if (sshKey != null) {
      this.sshKey = new SshKeyApi(sshKey);
    }
    const fields = this.getResponseProperty("Fields");
    if (fields != null) {
      this.fields = fields.map((f) => new FieldApi(f));
    }
    const attachments = this.getResponseProperty("Attachments");
    if (attachments != null) {
      this.attachments = attachments.map((a) => new AttachmentResponse(a));
    }
    const passwordHistory = this.getResponseProperty("PasswordHistory");
    if (passwordHistory != null) {
      this.passwordHistory = passwordHistory.map((h) => new PasswordHistoryResponse(h));
    }
    this.reprompt = this.getResponseProperty("Reprompt") || CipherRepromptType.None;
    this.key = this.getResponseProperty("Key") || null;
  }
};

// libs/common/src/vault/models/response/folder.response.ts
var FolderResponse = class extends BaseResponse {
  constructor(response) {
    super(response);
    this.id = this.getResponseProperty("Id");
    this.name = this.getResponseProperty("Name");
    this.revisionDate = this.getResponseProperty("RevisionDate");
  }
};

// libs/common/src/platform/sync/sync.response.ts
var SyncResponse = class extends BaseResponse {
  constructor(response) {
    super(response);
    this.folders = [];
    this.collections = [];
    this.ciphers = [];
    this.policies = [];
    this.sends = [];
    const profile = this.getResponseProperty("Profile");
    if (profile != null) {
      this.profile = new ProfileResponse(profile);
    }
    const folders = this.getResponseProperty("Folders");
    if (folders != null) {
      this.folders = folders.map((f) => new FolderResponse(f));
    }
    const collections = this.getResponseProperty("Collections");
    if (collections != null) {
      this.collections = collections.map((c) => new CollectionDetailsResponse(c));
    }
    const ciphers = this.getResponseProperty("Ciphers");
    if (ciphers != null) {
      this.ciphers = ciphers.map((c) => new CipherResponse(c));
    }
    const domains = this.getResponseProperty("Domains");
    if (domains != null) {
      this.domains = new DomainsResponse(domains);
    }
    const policies = this.getResponseProperty("Policies");
    if (policies != null) {
      this.policies = policies.map((p) => new PolicyResponse(p));
    }
    const sends = this.getResponseProperty("Sends");
    if (sends != null) {
      this.sends = sends.map((s) => new SendResponse(s));
    }
    const userDecryption = this.getResponseProperty("UserDecryption");
    if (userDecryption != null && typeof userDecryption === "object") {
      this.userDecryption = new UserDecryptionResponse(userDecryption);
    }
  }
};

// libs/common/src/auth/models/response/master-password-policy.response.ts
var MasterPasswordPolicyResponse = class extends BaseResponse {
  constructor(response) {
    super(response);
    this.minComplexity = this.getResponseProperty("MinComplexity");
    this.minLength = this.getResponseProperty("MinLength");
    this.requireUpper = this.getResponseProperty("RequireUpper");
    this.requireLower = this.getResponseProperty("RequireLower");
    this.requireNumbers = this.getResponseProperty("RequireNumbers");
    this.requireSpecial = this.getResponseProperty("RequireSpecial");
    this.enforceOnLogin = this.getResponseProperty("EnforceOnLogin");
  }
};

// libs/common/src/auth/models/response/user-decryption-options/key-connector-user-decryption-option.response.ts
var KeyConnectorUserDecryptionOptionResponse = class extends BaseResponse {
  constructor(response) {
    super(response);
    this.keyConnectorUrl = this.getResponseProperty("KeyConnectorUrl");
  }
};

// libs/common/src/auth/models/response/user-decryption-options/trusted-device-user-decryption-option.response.ts
var TrustedDeviceUserDecryptionOptionResponse = class extends BaseResponse {
  constructor(response) {
    super(response);
    this.hasAdminApproval = this.getResponseProperty("HasAdminApproval");
    this.hasLoginApprovingDevice = this.getResponseProperty("HasLoginApprovingDevice");
    this.hasManageResetPasswordPermission = this.getResponseProperty(
      "HasManageResetPasswordPermission"
    );
    this.isTdeOffboarding = this.getResponseProperty("IsTdeOffboarding");
    if (response.EncryptedPrivateKey) {
      this.encryptedPrivateKey = new EncString(this.getResponseProperty("EncryptedPrivateKey"));
    }
    if (response.EncryptedUserKey) {
      this.encryptedUserKey = new EncString(this.getResponseProperty("EncryptedUserKey"));
    }
  }
};

// libs/common/src/auth/models/response/user-decryption-options/user-decryption-options.response.ts
var UserDecryptionOptionsResponse = class extends BaseResponse {
  constructor(response) {
    super(response);
    this.hasMasterPassword = this.getResponseProperty("HasMasterPassword");
    const masterPasswordUnlock = this.getResponseProperty("MasterPasswordUnlock");
    if (masterPasswordUnlock != null && typeof masterPasswordUnlock === "object") {
      this.masterPasswordUnlock = new MasterPasswordUnlockResponse(masterPasswordUnlock);
    }
    if (response.TrustedDeviceOption) {
      this.trustedDeviceOption = new TrustedDeviceUserDecryptionOptionResponse(
        this.getResponseProperty("TrustedDeviceOption")
      );
    }
    if (response.KeyConnectorOption) {
      this.keyConnectorOption = new KeyConnectorUserDecryptionOptionResponse(
        this.getResponseProperty("KeyConnectorOption")
      );
    }
    if (response.WebAuthnPrfOption) {
      this.webAuthnPrfOption = new WebAuthnPrfDecryptionOptionResponse(
        this.getResponseProperty("WebAuthnPrfOption")
      );
    }
  }
};

// libs/common/src/auth/models/response/identity-token.response.ts
var IdentityTokenResponse = class extends BaseResponse {
  constructor(response) {
    super(response);
    // TODO: https://bitwarden.atlassian.net/browse/PM-30124 - Rename to just accountKeys
    this.accountKeysResponseModel = null;
    const accessToken = this.getResponseProperty("access_token");
    if (accessToken == null || typeof accessToken !== "string") {
      throw new Error("Identity response does not contain a valid access token");
    }
    const tokenType = this.getResponseProperty("token_type");
    if (tokenType == null || typeof tokenType !== "string") {
      throw new Error("Identity response does not contain a valid token type");
    }
    this.accessToken = accessToken;
    this.tokenType = tokenType;
    const expiresIn = this.getResponseProperty("expires_in");
    if (expiresIn != null && typeof expiresIn === "number") {
      this.expiresIn = expiresIn;
    }
    const refreshToken = this.getResponseProperty("refresh_token");
    if (refreshToken != null && typeof refreshToken === "string") {
      this.refreshToken = refreshToken;
    }
    this.privateKey = this.getResponseProperty("PrivateKey");
    if (this.getResponseProperty("AccountKeys") != null) {
      this.accountKeysResponseModel = new PrivateKeysResponseModel(
        this.getResponseProperty("AccountKeys")
      );
    }
    const key = this.getResponseProperty("Key");
    if (key) {
      this.key = new EncString(key);
    }
    this.twoFactorToken = this.getResponseProperty("TwoFactorToken");
    const kdf = this.getResponseProperty("Kdf");
    const kdfIterations = this.getResponseProperty("KdfIterations");
    const kdfMemory = this.getResponseProperty("KdfMemory");
    const kdfParallelism = this.getResponseProperty("KdfParallelism");
    this.kdfConfig = kdf == 0 /* PBKDF2_SHA256 */ ? new PBKDF2KdfConfig(kdfIterations) : new Argon2KdfConfig(kdfIterations, kdfMemory, kdfParallelism);
    this.forcePasswordReset = this.getResponseProperty("ForcePasswordReset");
    this.apiUseKeyConnector = this.getResponseProperty("ApiUseKeyConnector");
    this.masterPasswordPolicy = new MasterPasswordPolicyResponse(
      this.getResponseProperty("MasterPasswordPolicy")
    );
    const userDecryptionOptions = this.getResponseProperty("UserDecryptionOptions");
    if (userDecryptionOptions != null && typeof userDecryptionOptions === "object") {
      this.userDecryptionOptions = new UserDecryptionOptionsResponse(userDecryptionOptions);
    }
  }
  hasMasterKeyEncryptedUserKey() {
    return Boolean(this.key);
  }
};

// libs/common/src/auth/models/response/prelogin.response.ts
var PreloginResponse = class extends BaseResponse {
  constructor(response) {
    super(response);
    this.kdf = this.getResponseProperty("Kdf");
    this.kdfIterations = this.getResponseProperty("KdfIterations");
    this.kdfMemory = this.getResponseProperty("KdfMemory");
    this.kdfParallelism = this.getResponseProperty("KdfParallelism");
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Cipher,
  CipherData,
  CipherWithIdExport,
  EncString,
  Folder,
  FolderData,
  FolderWithIdExport,
  IdentityTokenResponse,
  PreloginResponse,
  SymmetricCryptoKey,
  SyncResponse
});
