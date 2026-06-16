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
});

export default validationSchema;
