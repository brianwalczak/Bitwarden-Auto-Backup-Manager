"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidationService = void 0;
class ValidationService {
    constructor(i18nService, platformUtilsService) {
        this.i18nService = i18nService;
        this.platformUtilsService = platformUtilsService;
    }
    showError(data) {
        const defaultErrorMessage = this.i18nService.t("unexpectedError");
        let errors = [];
        if (data != null && typeof data === "string") {
            errors.push(data);
        }
        else if (data == null || typeof data !== "object") {
            errors.push(defaultErrorMessage);
        }
        else if (data.validationErrors != null) {
            errors = errors.concat(data.getAllMessages());
        }
        else {
            errors.push(data.message ? data.message : defaultErrorMessage);
        }
        if (errors.length === 1) {
            this.platformUtilsService.showToast("error", this.i18nService.t("errorOccurred"), errors[0]);
        }
        else if (errors.length > 1) {
            this.platformUtilsService.showToast("error", this.i18nService.t("errorOccurred"), errors, {
                timeout: 5000 * errors.length,
            });
        }
        return errors;
    }
}
exports.ValidationService = ValidationService;
//# sourceMappingURL=validation.service.js.map