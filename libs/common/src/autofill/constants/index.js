"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AutofillOverlayVisibility = exports.AUTOFILL_OVERLAY_HANDLE_REPOSITION = exports.NOTIFICATION_BAR_LIFESPAN_MS = exports.SEPARATOR_ID = exports.ROOT_ID = exports.NOOP_COMMAND_SUFFIX = exports.GENERATE_PASSWORD_ID = exports.CREATE_LOGIN_ID = exports.CREATE_IDENTITY_ID = exports.CREATE_CARD_ID = exports.COPY_VERIFICATION_CODE_ID = exports.COPY_USERNAME_ID = exports.COPY_PASSWORD_ID = exports.COPY_IDENTIFIER_ID = exports.AUTOFILL_IDENTITY_ID = exports.SHOW_AUTOFILL_BUTTON = exports.AUTOFILL_ID = exports.AUTOFILL_CARD_ID = exports.ClearClipboardDelay = exports.EVENTS = exports.TYPE_CHECK = void 0;
exports.TYPE_CHECK = {
    FUNCTION: "function",
    NUMBER: "number",
    STRING: "string",
};
exports.EVENTS = {
    CHANGE: "change",
    INPUT: "input",
    KEYDOWN: "keydown",
    KEYPRESS: "keypress",
    KEYUP: "keyup",
    BLUR: "blur",
    CLICK: "click",
    FOCUS: "focus",
    FOCUSIN: "focusin",
    FOCUSOUT: "focusout",
    SCROLL: "scroll",
    RESIZE: "resize",
    DOMCONTENTLOADED: "DOMContentLoaded",
    LOAD: "load",
    MESSAGE: "message",
    VISIBILITYCHANGE: "visibilitychange",
    MOUSEENTER: "mouseenter",
    MOUSELEAVE: "mouseleave",
};
exports.ClearClipboardDelay = {
    Never: null,
    TenSeconds: 10,
    TwentySeconds: 20,
    ThirtySeconds: 30,
    OneMinute: 60,
    TwoMinutes: 120,
    FiveMinutes: 300,
};
/* Context Menu item Ids */
exports.AUTOFILL_CARD_ID = "autofill-card";
exports.AUTOFILL_ID = "autofill";
exports.SHOW_AUTOFILL_BUTTON = "show-autofill-button";
exports.AUTOFILL_IDENTITY_ID = "autofill-identity";
exports.COPY_IDENTIFIER_ID = "copy-identifier";
exports.COPY_PASSWORD_ID = "copy-password";
exports.COPY_USERNAME_ID = "copy-username";
exports.COPY_VERIFICATION_CODE_ID = "copy-totp";
exports.CREATE_CARD_ID = "create-card";
exports.CREATE_IDENTITY_ID = "create-identity";
exports.CREATE_LOGIN_ID = "create-login";
exports.GENERATE_PASSWORD_ID = "generate-password";
exports.NOOP_COMMAND_SUFFIX = "noop";
exports.ROOT_ID = "root";
exports.SEPARATOR_ID = "separator";
exports.NOTIFICATION_BAR_LIFESPAN_MS = 150000; // 150 seconds
exports.AUTOFILL_OVERLAY_HANDLE_REPOSITION = "autofill-overlay-handle-reposition-event";
exports.AutofillOverlayVisibility = {
    Off: 0,
    OnButtonClick: 1,
    OnFieldFocus: 2,
};
//# sourceMappingURL=index.js.map