"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const form_route_1 = __importDefault(require("./form/form.route"));
const router = express_1.default.Router();
const defaultRoutes = [
    {
        path: '/form',
        route: form_route_1.default,
    },
];
defaultRoutes.forEach(route => {
    router.use(route.path, route.route);
});
exports.default = router;
//# sourceMappingURL=routes.js.map