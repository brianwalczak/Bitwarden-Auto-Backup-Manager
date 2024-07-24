"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BraintreeService = void 0;
class BraintreeService {
    constructor(logService) {
        this.logService = logService;
    }
    createDropin() {
        window.setTimeout(() => {
            const window$ = window;
            window$.braintree.dropin.create({
                authorization: process.env.BRAINTREE_KEY,
                container: this.containerId,
                paymentOptionPriority: ["paypal"],
                paypal: {
                    flow: "vault",
                    buttonStyle: {
                        label: "pay",
                        size: "medium",
                        shape: "pill",
                        color: "blue",
                        tagline: "false",
                    },
                },
            }, (error, instance) => {
                if (error != null) {
                    this.logService.error(error);
                    return;
                }
                this.braintree = instance;
            });
        }, 250);
    }
    loadBraintree(containerId, autoCreateDropin) {
        const script = window.document.createElement("script");
        script.id = "dropin-script";
        script.src = `scripts/dropin.js?cache=${process.env.CACHE_TAG}`;
        script.async = true;
        if (autoCreateDropin) {
            script.onload = () => this.createDropin();
        }
        this.containerId = containerId;
        window.document.head.appendChild(script);
    }
    requestPaymentMethod() {
        return new Promise((resolve, reject) => {
            this.braintree.requestPaymentMethod((error, payload) => {
                if (error) {
                    this.logService.error(error);
                    reject(error.message);
                }
                else {
                    resolve(payload.nonce);
                }
            });
        });
    }
    unloadBraintree() {
        const script = window.document.getElementById("dropin-script");
        window.document.head.removeChild(script);
        window.setTimeout(() => {
            const scripts = Array.from(window.document.head.querySelectorAll("script")).filter((script) => script.src != null && script.src.indexOf("paypal") > -1);
            scripts.forEach((script) => {
                try {
                    window.document.head.removeChild(script);
                }
                catch (error) {
                    this.logService.error(error);
                }
            });
            const stylesheet = window.document.head.querySelector("#braintree-dropin-stylesheet");
            if (stylesheet != null) {
                try {
                    window.document.head.removeChild(stylesheet);
                }
                catch (error) {
                    this.logService.error(error);
                }
            }
        }, 500);
    }
}
exports.BraintreeService = BraintreeService;
//# sourceMappingURL=braintree.service.js.map