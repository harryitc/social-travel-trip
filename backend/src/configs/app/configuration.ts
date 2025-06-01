import { registerAs } from '@nestjs/config';
import Joi from 'joi';

/**
 * Docs: https://docs.nestjs.com/techniques/configuration#configuration-namespaces
 * Configuration namespaces: Khai báo tập trung các config từ .env
 * Usage: Configservice.get<string>('appConfig.nodeEnv')
 */
export const ENV_CONFIG_APPLICATION = registerAs('appConfig', () => ({
  nodeEnv: process.env.NODE_ENV ?? 'local',
  serverRuningAtPort: process.env.SERVER_RUNING_AT_PORT ?? 3000,
  enableLogs: process.env.ENABLE_LOGGER ?? false,
  enableCentralizedLogs: process.env.ENABLE_CENTRALIZED_LOGGER ?? false,
  timeZone: process.env.TIME_ZONE ?? 'Asia/Jakarta',
  enableSwaggerDocs: process.env.ENABLE_SWAGGER_DOCS ?? false,
  swaggerDocsPath: process.env.SWAGGER_DOCUMENT_PATH ?? '',
  httpRequestResponseTimeOut: process.env.HTTP_RES_REP_GATEWAY_TIMEOUT ?? 30000, //ms
  apiVersionHeader: process.env.API_VERSION_HEADER,
  enableCentralizedAuthen: process.env.ENABLE_CENTRALIZED_AUTHENTICATION,
  mainAppKey: process.env.MAIN_APP_KEY,
}));

/**
 * Docs: https://docs.nestjs.com/techniques/configuration#schema-validation
 * Joi sẽ kiểm tra các khóa trong env có bị thiếu hoặc sai định dạng không.
 * Nếu sai định dạng sẽ cảnh báo cho developer biết và điều chỉnh.
 * Example error Error: Config validation error: "NODE_ENV" must be one of [prod, local, server-test]
 */
export const ENV_CONFIG_VALIDATION_SCHEMA_APPLICATION = {
  NODE_ENV: Joi?.string()
    .valid('prod', 'local', 'server-test')
    .default('local'),
  TIME_ZONE: Joi?.string().default('Asia/Jakarta'),
  API_VERSION_HEADER: Joi?.string().default('2.0.0'),
  MAIN_APP_KEY: Joi?.string(),
};
