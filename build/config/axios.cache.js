"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCacheAdapter = void 0;
const axios_cache_adapter_1 = require("axios-cache-adapter");
const redis_1 = __importDefault(require("redis"));
const config_1 = __importDefault(require("./config"));
const client = redis_1.default.createClient({
    url: config_1.default.REDIS.URL,
});
const store = new axios_cache_adapter_1.RedisStore(client);
const getCacheAdapter = (adapterConfig) => {
    const { maxAge = 60 * 1000, excludeQuery = false, excludeMethods } = adapterConfig;
    const cache = (0, axios_cache_adapter_1.setupCache)({
        maxAge,
        exclude: { query: excludeQuery, methods: excludeMethods },
        store,
    });
    return cache;
};
exports.getCacheAdapter = getCacheAdapter;
//# sourceMappingURL=axios.cache.js.map