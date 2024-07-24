"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CaptchaIFrame = void 0;
const iframe_component_1 = require("./iframe-component");
class CaptchaIFrame extends iframe_component_1.IFrameComponent {
    constructor(win, webVaultUrl, i18nService, successCallback, errorCallback, infoCallback) {
        super(win, webVaultUrl, "captcha-connector.html", "hcaptcha_iframe", successCallback, errorCallback, (message) => {
            const parsedMessage = JSON.parse(message);
            if (typeof parsedMessage !== "string") {
                this.iframe.height = parsedMessage.height.toString();
                this.iframe.width = parsedMessage.width.toString();
            }
            else {
                infoCallback(parsedMessage);
            }
        });
        this.i18nService = i18nService;
    }
    init(siteKey) {
        super.initComponent(this.createParams({ siteKey: siteKey, locale: this.i18nService.translationLocale }, 1));
    }
}
exports.CaptchaIFrame = CaptchaIFrame;
//# sourceMappingURL=captcha-iframe.js.map