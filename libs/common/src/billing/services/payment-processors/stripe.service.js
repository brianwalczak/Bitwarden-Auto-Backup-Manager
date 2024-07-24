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
exports.StripeService = void 0;
class StripeService {
    constructor(logService) {
        this.logService = logService;
    }
    loadStripe(elementIds, autoMount) {
        this.elementIds = elementIds;
        const script = window.document.createElement("script");
        script.id = "stripe-script";
        script.src = "https://js.stripe.com/v3?advancedFraudSignals=false";
        script.onload = () => {
            const window$ = window;
            this.stripe = window$.Stripe(process.env.STRIPE_KEY);
            this.elements = this.stripe.elements();
            const options = this.getElementOptions();
            setTimeout(() => {
                this.elements.create("cardNumber", options);
                this.elements.create("cardExpiry", options);
                this.elements.create("cardCvc", options);
                if (autoMount) {
                    this.mountElements();
                }
            }, 50);
        };
        window.document.head.appendChild(script);
    }
    mountElements() {
        setTimeout(() => {
            const cardNumber = this.elements.getElement("cardNumber");
            const cardExpiry = this.elements.getElement("cardExpiry");
            const cardCvc = this.elements.getElement("cardCvc");
            cardNumber.mount(this.elementIds.cardNumber);
            cardExpiry.mount(this.elementIds.cardExpiry);
            cardCvc.mount(this.elementIds.cardCvc);
        });
    }
    setupBankAccountPaymentMethod(clientSecret_1, _a) {
        return __awaiter(this, arguments, void 0, function* (clientSecret, { accountHolderName, routingNumber, accountNumber, accountHolderType }) {
            const result = yield this.stripe.confirmUsBankAccountSetup(clientSecret, {
                payment_method: {
                    us_bank_account: {
                        routing_number: routingNumber,
                        account_number: accountNumber,
                        account_holder_type: accountHolderType,
                    },
                    billing_details: {
                        name: accountHolderName,
                    },
                },
            });
            if (result.error || (result.setupIntent && result.setupIntent.status !== "requires_action")) {
                this.logService.error(result.error);
                throw result.error;
            }
            return result.setupIntent.payment_method;
        });
    }
    setupCardPaymentMethod(clientSecret) {
        return __awaiter(this, void 0, void 0, function* () {
            const cardNumber = this.elements.getElement("cardNumber");
            const result = yield this.stripe.confirmCardSetup(clientSecret, {
                payment_method: {
                    card: cardNumber,
                },
            });
            if (result.error || (result.setupIntent && result.setupIntent.status !== "succeeded")) {
                this.logService.error(result.error);
                throw result.error;
            }
            return result.setupIntent.payment_method;
        });
    }
    unloadStripe() {
        const script = window.document.getElementById("stripe-script");
        window.document.head.removeChild(script);
        window.setTimeout(() => {
            const iFrames = Array.from(window.document.querySelectorAll("iframe")).filter((element) => element.src != null && element.src.indexOf("stripe") > -1);
            iFrames.forEach((iFrame) => {
                try {
                    window.document.body.removeChild(iFrame);
                }
                catch (error) {
                    this.logService.error(error);
                }
            });
        }, 500);
    }
    getElementOptions() {
        const options = {
            style: {
                base: {
                    color: null,
                    fontFamily: '"Open Sans", "Helvetica Neue", Helvetica, Arial, sans-serif, ' +
                        '"Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
                    fontSize: "14px",
                    fontSmoothing: "antialiased",
                    "::placeholder": {
                        color: null,
                    },
                },
                invalid: {
                    color: null,
                },
            },
            classes: {
                focus: "is-focused",
                empty: "is-empty",
                invalid: "is-invalid",
            },
        };
        const style = getComputedStyle(document.documentElement);
        options.style.base.color = `rgb(${style.getPropertyValue("--color-text-main")})`;
        options.style.base["::placeholder"].color = `rgb(${style.getPropertyValue("--color-text-muted")})`;
        options.style.invalid.color = `rgb(${style.getPropertyValue("--color-text-main")})`;
        options.style.invalid.borderColor = `rgb(${style.getPropertyValue("--color-danger-600")})`;
        return options;
    }
}
exports.StripeService = StripeService;
//# sourceMappingURL=stripe.service.js.map