"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
router.get('/', (req, res) => {
    res.send('Ok');
});
router.get('/health', (req, res) => {
    res.send('I am fine. Thanks!');
});
exports.default = router;
//# sourceMappingURL=root.route.js.map