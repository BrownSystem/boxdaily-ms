import 'dotenv/config';
import * as Joi from 'joi';

interface EnvVars {
  PORT: number;
  NATS_SERVERS: string[];
}

const envsSchema = Joi.object<EnvVars>({
  PORT: Joi.number().required(),
  NATS_SERVERS: Joi.array().items(Joi.string()).required(),
}).unknown(true);

const { error, value } = envsSchema.validate({
  ...process.env,
  NATS_SERVERS: process.env.NATS_SERVERS?.split(','),
});

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const envVars = value as EnvVars;

export const envs = {
  port: envVars.PORT,
  natsServers: envVars.NATS_SERVERS,
};
