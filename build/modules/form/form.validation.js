"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAccessToken = exports.findDE = exports.postFormRecord = exports.postJSONForm = void 0;
const joi_1 = __importDefault(require("joi"));
const form_constants_1 = require("./form.constants");
const reqBody = joi_1.default.object().keys({
    client_id: joi_1.default.string().required(),
    grant_type: joi_1.default.string().required(),
    redirect_uri: joi_1.default.string().required(),
    code: joi_1.default.string().required(),
    client_secret: joi_1.default.string().required(),
});
exports.postJSONForm = {
    body: joi_1.default.object().keys({
        clientId: joi_1.default.string().required(),
        subdomain: joi_1.default.string().required(),
        fields: joi_1.default.array().required(),
        metaData: joi_1.default.object().required(),
        reqBody,
        clientSecret: joi_1.default.string().required(),
    }),
};
exports.postFormRecord = {
    params: joi_1.default.object().keys({
        deId: joi_1.default.string().uuid().required()
    }),
    body: joi_1.default.object().keys({
        fields: joi_1.default.array().required(),
    }),
};
const customFilterValidation = (value, helper) => {
    if (value.name === 'Automation' && value.filter.filter !== 'equals') {
        return helper.error('any.invalid', 'Automation filter should be "equal" ');
    }
    return value;
};
const filter = joi_1.default.object().keys({
    key: joi_1.default.string().required(),
    value: joi_1.default.string().required(),
    filter: joi_1.default.string().valid('like', 'equals').required(),
});
exports.findDE = {
    body: joi_1.default.object().keys({
        authType: joi_1.default.string().valid(...Object.values(form_constants_1.AUTH_TYPE)),
        token: joi_1.default.alternatives().conditional('authType', { is: form_constants_1.AUTH_TYPE.CLIENT, then: joi_1.default.string().required() }),
        username: joi_1.default.alternatives().conditional('authType', { is: form_constants_1.AUTH_TYPE.USERNAME, then: joi_1.default.string().required() }),
        password: joi_1.default.alternatives().conditional('authType', { is: form_constants_1.AUTH_TYPE.USERNAME, then: joi_1.default.string().required() }),
        filter,
        subDomain: joi_1.default.string().required(),
        name: joi_1.default.string().valid(...form_constants_1.RETRIEVE_REQUEST_TYPE.map(type => type.name), "all").required(),
    }).custom(customFilterValidation),
};
exports.getAccessToken = {
    body: joi_1.default.object().keys({
        client_id: joi_1.default.string().required(),
        client_secret: joi_1.default.string().required(),
        // account_id: Joi.string().required(),
        subdomain: joi_1.default.string().required(),
        grant_type: joi_1.default.string().optional(),
    }),
};
exports.default = {
    postJSONForm: exports.postJSONForm,
    postFormRecord: exports.postFormRecord,
    getAccessToken: exports.getAccessToken,
    findDE: exports.findDE
};
//# sourceMappingURL=form.validation.js.map