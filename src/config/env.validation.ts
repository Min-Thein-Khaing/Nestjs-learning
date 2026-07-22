import Joi from 'joi';

const validationSchema = Joi.object({
  AUTH_KEY: Joi.string().required(),
  DATABASE_PORT: Joi.number().port().default(5432),
  DATABASE_USERNAME: Joi.string().required(),
  DATABASE_PASSWORD: Joi.string().required(),
  DATABASE_DBNAME: Joi.string().required(),
  DATABASE_HOST: Joi.string().default('localhost'),
  DATABASE_AUTOLOAD: Joi.boolean().optional(),
  DATABASE_SYNC: Joi.boolean().optional(),
  AUTH_FALLBACK_URL: Joi.string(),

  JWT_SECRET: Joi.string().required(),

  JWT_TOKEN_AUDIENCE: Joi.string().required(),
  JWT_TOKEN_ISSUER: Joi.string().required(),
  JWT_ACCESS_TOKEN_TTL: Joi.number().required(),

  JWT_REFRESH_TOKEN_TTL: Joi.number().required(),

  GOOGLE_CLIENT_ID: Joi.string().required(),
  GOOGLE_CLIENT_SECRET: Joi.string().required(),

  API_VERSION: Joi.string().required(),

  // AWS is only needed when an upload endpoint is used. Keeping these optional
  // lets the API and local email testing start without an AWS account.
  AWS_REGION: Joi.string().optional(),
  AWS_ACCESS_KEY: Joi.string().optional(),
  AWS_SECRET_KEY: Joi.string().optional(),
  AWS_SECRET_ACCESS_KEY: Joi.string().optional(),
  AWS_CLOUDFRONT_URL: Joi.string().optional(),
  AWS_CLOUD_FRONT_URL: Joi.string().optional(),
  AWS_BUCKET_NAME: Joi.string().optional(),
  AWS_BUCKETNAME: Joi.string().optional(),

  SMTP_USERNAME: Joi.string().required(),
  SMTP_PASSWORD: Joi.string().required(),
  MAIL_HOST: Joi.string().required(),
  MAIL_PORT: Joi.number().required(),
});

export default validationSchema;
