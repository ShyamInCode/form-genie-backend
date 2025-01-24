"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ApiError extends Error {
    constructor(statusCode, message, params = {}) {
        super(message);
        const { error, meta, isOperational = true, stack = '' } = params;
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        if (error) {
            this.error = error;
        }
        if (meta) {
            this.meta = meta;
        }
        if (stack) {
            this.stack = stack;
        }
        else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}
exports.default = ApiError;
//# sourceMappingURL=ApiError.js.map