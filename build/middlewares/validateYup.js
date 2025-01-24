"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_1 = __importDefault(require("http-status"));
const lodash_1 = require("lodash");
const ApiError_1 = __importDefault(require("../utils/ApiError"));
// Only supports body at the moment
const validateYup = (schema) => async (req, res, next) => {
    var _a;
    const validSchema = (0, lodash_1.pick)(schema, ['params', 'query', 'body']);
    const object = (0, lodash_1.pick)(req, Object.keys(validSchema));
    try {
        const value = await ((_a = validSchema.body) === null || _a === void 0 ? void 0 : _a.validate(object.body, {
            abortEarly: false,
            context: { userRole: '' },
            stripUnknown: true,
        }));
        Object.assign(req.body, value);
        return next();
    }
    catch (error) {
        return next(new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Please fix the form errors', {}));
    }
};
exports.default = validateYup;
//# sourceMappingURL=validateYup.js.map