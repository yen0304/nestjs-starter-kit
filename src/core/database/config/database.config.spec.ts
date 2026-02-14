import 'reflect-metadata';
import { DatabaseConfigSchema } from './database.config';

describe('DatabaseConfigSchema', () => {
  it('should be a valid class', () => {
    const schema = new DatabaseConfigSchema();
    schema.dbConnectionString = 'postgresql://localhost:5432/test';
    expect(schema.dbConnectionString).toBe('postgresql://localhost:5432/test');
  });
});

describe('databaseConfig registerAs', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = {
      ...originalEnv,
      dbConnectionString: 'postgresql://localhost:5432/test',
    } as NodeJS.ProcessEnv;
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('should return database config when env is valid', async () => {
    const mod = await import('./database.config');
    const result = mod.default();
    expect(result).toEqual({
      dbConnectionString: 'postgresql://localhost:5432/test',
    });
  });

  it('should throw when env is invalid', async () => {
    const env = { ...originalEnv } as Record<string, string | undefined>;
    delete env.dbConnectionString;
    process.env = env as NodeJS.ProcessEnv;

    jest.resetModules();
    const mod = await import('./database.config');
    expect(() => mod.default()).toThrow();
  });
});
