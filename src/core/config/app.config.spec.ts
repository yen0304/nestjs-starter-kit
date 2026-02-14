import 'reflect-metadata';
import { AppConfigSchema } from './app.config';

describe('AppConfigSchema', () => {
  it('should be a valid class', () => {
    const schema = new AppConfigSchema();
    schema.NODE_ENV = 'development';
    schema.APP_PORT = '3000';

    expect(schema.NODE_ENV).toBe('development');
    expect(schema.APP_PORT).toBe('3000');
  });
});

describe('appConfig registerAs', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = {
      ...originalEnv,
      NODE_ENV: 'test',
      APP_PORT: '3000',
    };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('should return app config when env is valid', async () => {
    const mod = await import('./app.config');
    const result = mod.default();
    expect(result).toEqual({
      NODE_ENV: 'test',
      APP_PORT: '3000',
    });
  });

  it('should throw when env is invalid', async () => {
    const env = { ...originalEnv } as Record<string, string | undefined>;
    delete env.NODE_ENV;
    delete env.APP_PORT;
    process.env = env as NodeJS.ProcessEnv;

    jest.resetModules();
    const mod = await import('./app.config');
    expect(() => mod.default()).toThrow();
  });
});
