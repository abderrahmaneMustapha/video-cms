import { IsNumber, IsString, validateSync, IsEnum } from 'class-validator';
import { plainToClass } from 'class-transformer';

export enum AppEnvironment {
  local = 'local',
  DEV = 'dev',
  STAGING = 'staging',
  QA = 'qa',
  PRODUCTION = 'production',
}

class EnvironmentVariables {
  @IsEnum(AppEnvironment)
  NODE_ENV: AppEnvironment;

  @IsNumber()
  PORT: number;

  @IsString()
  DATABASE_URL: string;

  @IsString()
  STORAGE_DOMAIN: string;

  @IsString()
  REDIS_HOST: string;

  @IsNumber()
  REDIS_PORT: number;
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToClass(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return validatedConfig;
}

export default () => ({
  nodeEnv: process.env.NODE_ENV,
  port: parseInt(process.env.PORT as string),
  database: {
    url: process.env.DATABASE_URL,
  },
  storage: {
    domain: process.env.STORAGE_DOMAIN,
  },
  redis: {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT as string),
  },
});
