"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validator = void 0;
const error_handler_1 = require("./error-handler");
function validator(schema) {
    return (_target, _key, descriptor) => {
        const originalMethod = descriptor.value;
        descriptor.value = async function (...args) {
            const req = args[0];
            const { error } = await Promise.resolve(schema.validate(req.body));
            if (error?.details) {
                throw new error_handler_1.JoiValidationError(error.details[0].message);
            }
            return originalMethod.apply(this, args);
        };
        return descriptor;
    };
}
exports.validator = validator;
