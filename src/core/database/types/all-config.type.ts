import { AppConfig } from '../../config/app-config.type';
import { DatabaseConfig } from '../config/database.config.type';

export type AllConfig = Readonly<{
  app: AppConfig;
  database: DatabaseConfig;
}>;
