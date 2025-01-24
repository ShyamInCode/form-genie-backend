"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_1 = __importDefault(require("http-status"));
const joi_1 = __importDefault(require("joi"));
const lodash_1 = require("lodash");
const ApiError_1 = __importDefault(require("../utils/ApiError"));
const validate = (schema) => (req, res, next) => {
    const validSchema = (0, lodash_1.pick)(schema, ['params', 'query', 'body']);
    const object = (0, lodash_1.pick)(req, Object.keys(validSchema));
    const { value, error } = joi_1.default.compile(validSchema)
        .prefs({ errors: { label: 'key' }, abortEarly: false })
        .validate(object);
    if (error) {
        const errorMessage = error.details.map(details => details.message).join(', ');
        const errorObj = {};
        error.details.forEach(details => {
            if (!details.context) {
                return;
            }
            errorObj[details.context.key] = details.message;
        });
        return next(new ApiError_1.default(http_status_1.default.BAD_REQUEST, errorMessage, { error: errorObj }));
    }
    Object.assign(req, value);
    return next();
};
exports.default = validate;
//# sourceMappingURL=validate.js.map