"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findDE = exports.getAllFormAllDocuments = exports.getFormJson = exports.getAccessToken = exports.addFormRecord = exports.addFormJson = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const form_constants_1 = require("./form.constants");
const form_service_1 = __importDefault(require("./form.service"));
exports.addFormJson = (0, catchAsync_1.default)(async (req, res) => {
    const respnse = await form_service_1.default.addFormJson(req.body);
    res.json({ data: respnse });
});
exports.addFormRecord = (0, catchAsync_1.default)(async (req, res) => {
    const respnse = await form_service_1.default.addFormRecord(req.body, req.params.deId);
    res.json({ data: respnse });
});
exports.getAccessToken = (0, catchAsync_1.default)(async (req, res) => {
    const respnse = await form_service_1.default.getAccessToken(req.body, req.body.subdomain);
    res.json({ data: respnse });
});
exports.getFormJson = (0, catchAsync_1.default)(async (req, res) => {
    const respnse = await form_service_1.default.getFormJsonById(req.params.id);
    res.json({ data: respnse });
});
exports.getAllFormAllDocuments = (0, catchAsync_1.default)(async (req, res) => {
    const respnse = await form_service_1.default.getAllFormAllDocuments(req.query);
    res.json({ data: respnse });
});
exports.findDE = (0, catchAsync_1.default)(async (req, res) => {
    if (req.body.name == 'all') {
        const promises = form_constants_1.RETRIEVE_REQUEST_TYPE.map(type => form_service_1.default.findDE(Object.assign(Object.assign({}, req.body), { name: type.name })));
        const respnse = await Promise.all(promises);
        res.json({ data: respnse.flat() });
    }
    else {
        const respnse = await form_service_1.default.findDE(req.body);
        res.json({ data: respnse });
    }
});
//# sourceMappingURL=form.controller.js.map