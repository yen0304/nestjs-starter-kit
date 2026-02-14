import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from './app.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './core/database/prisma.service';

describe('AppModule', () => {
  const originalEnv = process.env;

  beforeAll(() => {
    process.env = {
      ...originalEnv,
      NODE_ENV: 'test',
      APP_PORT: '3000',
      dbConnectionString: 'postgresql://localhost:5432/test',
    };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('should compile the module', async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue({})
      .compile();

    expect(module).toBeDefined();
    expect(module.get(AppController)).toBeDefined();
    expect(module.get(AppService)).toBeDefined();
  });
});
