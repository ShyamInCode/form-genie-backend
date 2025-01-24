"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const validate_1 = __importDefault(require("../../middlewares/validate"));
const form_controller_1 = require("./form.controller");
const form_validation_1 = __importDefault(require("./form.validation"));
const router = express_1.default.Router();
router.post('/', (0, validate_1.default)(form_validation_1.default.postJSONForm), form_controller_1.addFormJson);
router.post('/de', (0, validate_1.default)(form_validation_1.default.findDE), form_controller_1.findDE);
router.post('/record/:deId', (0, validate_1.default)(form_validation_1.default.postFormRecord), form_controller_1.addFormRecord);
router.get('/:id', form_controller_1.getFormJson);
router.post('/token', (0, validate_1.default)(form_validation_1.default.getAccessToken), form_controller_1.getAccessToken);
router.get('/', form_controller_1.getAllFormAllDocuments);
exports.default = router;
//# sourceMappingURL=form.route.js.map