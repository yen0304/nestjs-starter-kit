import type { AppConfig } from '../core/config/app-config.type';
import type { DatabaseConfig } from '../core/database/config/database.config.type';

export type AllConfig = Readonly<{
  app: AppConfig;
  database: DatabaseConfig;
}>;
