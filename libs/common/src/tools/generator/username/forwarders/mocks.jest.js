"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mockApiService = mockApiService;
exports.mockI18nService = mockI18nService;
/** a mock {@link ApiService} that returns a fetch-like response with a given status and body */
function mockApiService(status, body, statusText) {
    return {
        nativeFetch: jest.fn().mockImplementation((r) => {
            return {
                status,
                statusText,
                json: jest.fn().mockImplementation(() => Promise.resolve(body)),
            };
        }),
    };
}
/**  a mock {@link I18nService} that returns the translation key */
function mockI18nService() {
    return {
        t: jest.fn().mockImplementation((key) => key),
    };
}
//# sourceMappingURL=mocks.jest.js.map