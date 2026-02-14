import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from './prisma.service';

// Mock PrismaClient so we don't need a real DB
jest.mock('@prisma/client', () => {
  const actualPrisma = jest.requireActual('@prisma/client');

  return {
    ...actualPrisma,
    PrismaClient: class MockPrismaClient {
      $connect = jest.fn();
      $disconnect = jest.fn();
    },
  };
});

describe('PrismaService', () => {
  let service: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PrismaService,
        {
          provide: ConfigService,
          useValue: { get: jest.fn() },
        },
      ],
    }).compile();

    service = module.get<PrismaService>(PrismaService);
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('onModuleInit', () => {
    it('should connect successfully', async () => {
      (service.$connect as jest.Mock).mockResolvedValue(undefined);

      await service.onModuleInit();
      expect(service.$connect).toHaveBeenCalled();
    });

    it('should handle connection failure and schedule retry', async () => {
      jest.useFakeTimers();
      (service.$connect as jest.Mock)
        .mockRejectedValueOnce(new Error('Connection failed'))
        .mockResolvedValueOnce(undefined);

      await service.onModuleInit();
      expect(service.$connect).toHaveBeenCalledTimes(1);

      // Fast-forward the 3-second retry timer
      jest.advanceTimersByTime(3000);
      // Allow the async setTimeout callback to resolve
      await Promise.resolve();
      await Promise.resolve();

      expect(service.$connect).toHaveBeenCalledTimes(2);
      jest.useRealTimers();
    });

    it('should handle connection failure with non-Error object', async () => {
      jest.useFakeTimers();
      (service.$connect as jest.Mock).mockRejectedValueOnce('string error');

      await service.onModuleInit();
      expect(service.$connect).toHaveBeenCalled();
      jest.useRealTimers();
    });

    it('should handle retry failure', async () => {
      jest.useFakeTimers();
      (service.$connect as jest.Mock)
        .mockRejectedValueOnce(new Error('Connection failed'))
        .mockRejectedValueOnce(new Error('Retry failed'));

      await service.onModuleInit();

      jest.advanceTimersByTime(3000);
      await Promise.resolve();
      await Promise.resolve();

      expect(service.$connect).toHaveBeenCalledTimes(2);
      jest.useRealTimers();
    });

    it('should handle retry failure with non-Error object', async () => {
      jest.useFakeTimers();
      (service.$connect as jest.Mock)
        .mockRejectedValueOnce(new Error('Connection failed'))
        .mockRejectedValueOnce('string retry error');

      await service.onModuleInit();

      jest.advanceTimersByTime(3000);
      await Promise.resolve();
      await Promise.resolve();

      expect(service.$connect).toHaveBeenCalledTimes(2);
      jest.useRealTimers();
    });
  });

  describe('onModuleDestroy', () => {
    it('should disconnect when connected', async () => {
      // First connect
      (service.$connect as jest.Mock).mockResolvedValue(undefined);
      await service.onModuleInit();

      (service.$disconnect as jest.Mock).mockResolvedValue(undefined);
      await service.onModuleDestroy();

      expect(service.$disconnect).toHaveBeenCalled();
    });

    it('should not disconnect when not connected', async () => {
      // Never connected
      await service.onModuleDestroy();
      expect(service.$disconnect).not.toHaveBeenCalled();
    });
  });
});
