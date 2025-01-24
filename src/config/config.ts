import dotenv from 'dotenv';
import path from 'path';
import Joi from 'joi';
import { ENVIRONMENTS } from '../constants';

dotenv.config({ path: path.join(__dirname, '../../.env') });

const envVarsSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string().valid(ENVIRONMENTS.PRODUCTION, ENVIRONMENTS.DEVELOPMENT, 'test').required(),
    PORT: Joi.number().default(3000),
    CORS_ORIGIN: Joi.string().required().description('CORS Origin'),
   
  })
  .unknown();

const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

export default {
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
