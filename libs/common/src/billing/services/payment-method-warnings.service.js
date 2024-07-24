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
exports.PaymentMethodWarningsService = void 0;
const rxjs_1 = require("rxjs");
const billing_keys_state_1 = require("../models/billing-keys.state");
class PaymentMethodWarningsService {
    constructor(billingApiService, stateProvider) {
        this.billingApiService = billingApiService;
        this.stateProvider = stateProvider;
        this.getOneWeekAgo = () => {
            const date = new Date();
            date.setDate(date.getDate() - 7);
            return date;
        };
        this.paymentMethodWarningsState = this.stateProvider.getActive(billing_keys_state_1.PAYMENT_METHOD_WARNINGS_KEY);
        this.paymentMethodWarnings$ = this.paymentMethodWarningsState.state$;
    }
    acknowledge(organizationId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.paymentMethodWarningsState.update((state) => {
                const current = state[organizationId];
                state[organizationId] = Object.assign(Object.assign({}, current), { acknowledged: true });
                return state;
            });
        });
    }
    removeSubscriptionRisk(organizationId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.paymentMethodWarningsState.update((state) => {
                const current = state[organizationId];
                state[organizationId] = Object.assign(Object.assign({}, current), { risksSubscriptionFailure: false });
                return state;
            });
        });
    }
    clear() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.paymentMethodWarningsState.update(() => ({}));
        });
    }
    update(organizationId) {
        return __awaiter(this, void 0, void 0, function* () {
            const warning = yield (0, rxjs_1.firstValueFrom)(this.paymentMethodWarningsState.state$.pipe((0, rxjs_1.map)((state) => (!state ? null : state[organizationId]))));
            if (!warning || warning.savedAt < this.getOneWeekAgo()) {
                const { organizationName, risksSubscriptionFailure } = yield this.billingApiService.getBillingStatus(organizationId);
                yield this.paymentMethodWarningsState.update((state) => {
                    state !== null && state !== void 0 ? state : (state = {});
                    state[organizationId] = {
                        organizationName,
                        risksSubscriptionFailure,
                        acknowledged: false,
                        savedAt: new Date(),
                    };
                    return state;
                });
            }
        });
    }
}
exports.PaymentMethodWarningsService = PaymentMethodWarningsService;
//# sourceMappingURL=payment-method-warnings.service.js.map