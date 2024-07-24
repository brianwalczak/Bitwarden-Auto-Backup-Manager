"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultPasswordGenerationOptions = void 0;
const password_generator_options_evaluator_1 = require("./password-generator-options-evaluator");
/** The default options for password generation. */
exports.DefaultPasswordGenerationOptions = Object.freeze({
    length: 14,
    minLength: password_generator_options_evaluator_1.DefaultBoundaries.length.min,
    ambiguous: true,
    uppercase: true,
    lowercase: true,
    number: true,
    minNumber: 1,
    special: false,
    minSpecial: 0,
});
//# sourceMappingURL=password-generation-options.js.map