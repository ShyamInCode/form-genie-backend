"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPaginated = void 0;
const getPaginated = (data, page, limit) => {
    return {
        PageIndex: page,
        PageSize: limit,
        ThisCount: data.length,
        PageResult: data,
    };
};
exports.getPaginated = getPaginated;
//# sourceMappingURL=utilities.js.map