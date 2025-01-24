"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const joi_1 = __importDefault(require("joi"));
const constants_1 = require("../constants");
dotenv_1.default.config({ path: path_1.default.join(__dirname, '../../.env') });
const envVarsSchema = joi_1.default.object()
    .keys({
    NODE_ENV: joi_1.default.string().valid(constants_1.ENVIRONMENTS.PRODUCTION, constants_1.ENVIRONMENTS.DEVELOPMENT, 'test').required(),
    PORT: joi_1.default.number().default(3000),
    CORS_ORIGIN: joi_1.default.string().required().description('CORS Origin'),
})
    .unknown();
const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env);
if (error) {
    throw new Error(`Config validation error: ${error.message}`);
}
exports.default = {
    env: envVars.NODE_ENV,
    isStage: Boolean(envVars.IS_STAGE),
    port: envVars.PORT,
    mongoose: {
        url: envVars.MONGODB_URL + (envVars.NODE_ENV === 'test' ? '-test' : ''),
        options: {
            useCreateIndex: true,
            useNewUrlParser: true,
            useUnifiedTopology: true,
        },
    },
    jwt: {
        secret: envVars.JWT_SECRET,
        accessExpirationMinutes: envVars.JWT_ACCESS_EXPIRATION_MINUTES,
        refreshExpirationDays: envVars.JWT_REFRESH_EXPIRATION_DAYS,
        resetPasswordExpirationMinutes: envVars.JWT_RESET_PASSWORD_EXPIRATION_MINUTES,
        verifyEmailExpirationMinutes: envVars.JWT_VERIFY_EMAIL_EXPIRATION_MINUTES,
    },
    email: {
        smtp: {
            host: envVars.SMTP_HOST,
            port: envVars.SMTP_PORT,
            auth: {
                user: envVars.SMTP_USERNAME,
                pass: envVars.SMTP_PASSWORD,
            },
        },
        from: envVars.EMAIL_FROM,
        RATE: 5,
        ADMIN: envVars.EMAIL_ADMIN,
    },
    BCRYPT: {
        ROUNDS: 12,
    },
    DATABASE: {
        URL: envVars.DATABASE_URL,
    },
    FCM: {
        URL: envVars.FCM_BASE_URL,
        SERVER_TOKEN: envVars.FCM_SERVER_TOKEN,
    },
    REDIS: {
        URL: envVars.REDIS_URL,
    },
    CORS_ORIGIN: envVars.CORS_ORIGIN,
    MEDPRAX: {
        API_URL: envVars.MEDPRAX_API_URL,
        USER: envVars.MEDPRAX_API_USER,
        PASS: envVars.MEDPRAX_API_PASS,
        PRACTICE_CODE: envVars.MEDPRAX_API_PRACTICE_CODE,
    },
    COOKIE: {
        SECRET: envVars.COOKIE_SECRET,
    },
    API_SECRET_KEY: envVars.API_SECRET_KEY,
    AWS: {
        API_VERSION: '2010-12-01',
        REGION: envVars.AWS_REGION,
        ACCESS_KEY: envVars.AWS_ACCESS_KEY_ID,
        SECRET_KEY: envVars.AWS_SECRET_ACCESS_KEY,
        S3: {
            BUCKET_NAME: envVars.AWS_BUCKET_NAME,
        },
    },
    TIMEZONE_OFFSET: 2,
};
//# sourceMappingURL=config.js.map