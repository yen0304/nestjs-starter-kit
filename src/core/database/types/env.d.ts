declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'test' | 'development' | 'qa' | 'production';
    APP_PORT: string | number;

    dbConnectionString: string;

    JWT_SECRET?: string;

    [key]: string;
  }
}
